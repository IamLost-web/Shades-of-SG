import { useState } from 'react'
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext'
import { changePassword, updateTwoFA } from '../services/authApi'

const schema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/[0-9]/, 'Must contain number')
    .required('New password required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password required'),
})


export default function AccountSecurity() {
  // ✅ Hooks must be inside component
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [twoFAError, setTwoFAError] = useState('');
  const [twoFASuccess, setTwoFASuccess] = useState('');


  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { user, signIn } = useAuth()
  const [twoFA, setTwoFA] = useState(user?.enable2fa || false)

  async function handleChangePassword(e) {
    e.preventDefault()
    setPasswordError('');
    setPasswordSuccess('');

    try {
      await schema.validate({ oldPassword, newPassword, confirmPassword }, { abortEarly: false })
      const res = await changePassword({ oldPassword, newPassword })
      if (res.success) {
        setPasswordSuccess('Password changed successfully');
      } else {
        setPasswordError(res.message);
      }

    } catch (err) {
      if (err.name === 'ValidationError') {
        setPasswordError(err.errors.join(', '));
      } else {
        setPasswordError(err.message || 'Something went wrong');
      }

    }

  }

  return (
    <div className="auth-form">
      <h1>Account & Security</h1>

      <form onSubmit={handleChangePassword}>
        <label className="field-stack">
          <span>Old Password</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} style={{ marginLeft: "8px" }}>
              {showOldPassword ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>
        </label>


        <label className="field-stack">
          <span>New Password</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={{ marginLeft: "8px" }}>
              {showNewPassword ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>
        </label>

        <label className="field-stack">
          <span>Confirm New Password</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ marginLeft: "8px" }}>
              {showConfirmPassword ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>
        </label>


        {passwordError && <p className="form-error">{passwordError}</p>}
        {passwordSuccess && <p className="form-success">{passwordSuccess}</p>}


        <button className="primary-button" type="submit">Change Password</button>
      </form>

      <div className="field-stack" style={{ marginTop: '2rem' }}>
        <span>Enable 2FA</span>
        <label>
          <input
            type="checkbox"
            checked={twoFA}
            onChange={async () => {
              const newValue = !twoFA;
              setTwoFA(newValue);
              try {
                const res = await updateTwoFA(newValue);
                if (res.success) {
                  signIn(res.user, localStorage.getItem("token"));
                  setTwoFASuccess("2FA setting updated");
                  setTwoFAError("");

                }
              } catch (err) {
                setTwoFASuccess("2FA setting updated");
                setTwoFAError("");

              }
            }}
          />
          {twoFA ? 'On' : 'Off'}
        </label>

        {/* ✅ Messages now appear directly beneath the checkbox */}
        {twoFAError && <p className="form-error">{twoFAError}</p>}
        {twoFASuccess && <p className="form-success">{twoFASuccess}</p>}

      </div>


    </div>
  )
}
