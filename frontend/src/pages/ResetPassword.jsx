import PlaceholderPage from './PlaceholderPage'

export default function ResetPassword() {
  return <PlaceholderPage title="Reset Password" description="Password reset will be connected here." actionTo="/login" actionLabel="Back to Login" />
import { Link } from 'react-router-dom'

/*
TODO - Lia

Implement reset token handling.
Connect password update API.
Add validation and expired-link state.
*/
export default function ResetPassword() {
  return (
    <div className="auth-form">
      <p className="eyebrow">Secure Reset</p>
      <h1>Reset Password</h1>
      <label className="field-stack"><span>New Password</span><input placeholder="New password" type="password" /></label>
      <label className="field-stack"><span>Confirm Password</span><input placeholder="Confirm password" type="password" /></label>
      <button className="primary-button" type="button">Reset Password</button>
      <p><Link to="/login">Return to login</Link></p>
    </div>
  )
}
