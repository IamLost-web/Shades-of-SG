/*
import { Link } from 'react-router-dom'

/*
TODO - Lia

Implement registration fields.
Connect account creation API.
Add role and consent handling.

export default function Register() {
  return (
    <div className="auth-form">
      <p className="eyebrow">Join Shades of SG</p>
      <h1>Register</h1>
      <label className="field-stack"><span>Name</span><input placeholder="Your name" /></label>
      <label className="field-stack"><span>Email</span><input placeholder="name@example.com" type="email" /></label>
      <label className="field-stack"><span>Password</span><input placeholder="Password" type="password" /></label>
      <button className="primary-button" type="button">Register</button>
      <p><Link to="/login">Already have an account?</Link></p>
    </div>
  )
}
*/


import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
//import { registerWithEmail } from '../services/authApi'   //Commented out since there is another one below including the otp
import * as Yup from 'yup'
//lia.otp.start
import { sendEmailOtp, verifyEmailOtp, registerWithEmail, checkNameAvailability, checkEmailAvailability } from '../services/authApi'
//lia.otp.end
import InterestTagsAccordion from "../components/InterestTagsAccordion";

// Define Yup schema
const registerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  bio: Yup.string()
    .max(200, "Bio must be at most 200 characters")
    .test("no-forbidden-words", "Bio contains forbidden words", (value) => {
      if (!value) return true;
      const forbidden = ["fuck", "ass"];
      return !forbidden.some((w) => value.toLowerCase().includes(w));
    })
})

export default function Register() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  // Form states
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // OTP states
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Availability checks
  const [nameAvailable, setNameAvailable] = useState(true)
  const [emailAvailable, setEmailAvailable] = useState(true)

  // Handlers
  const [checkingName, setCheckingName] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  //Error message below the relevant fields
  const [fieldErrors, setFieldErrors] = useState({})

  // Debounce timers
  let nameTimer;
  let emailTimer;

  async function handleNameChange(e) {
    const newName = e.target.value;
    setFormValues({ ...formValues, name: newName });

    clearTimeout(nameTimer);
    if (newName.trim().length > 2) {
      setCheckingName(true);
      nameTimer = setTimeout(async () => {
        const res = await checkNameAvailability(newName);
        setNameAvailable(res.available);
        setError(res.available ? '' : res.message);
        setCheckingName(false);
      }, 300);
    } else {
      setCheckingName(false);
    }
  }

  async function handleEmailChange(e) {
    const newEmail = e.target.value;
    setFormValues({ ...formValues, email: newEmail });

    clearTimeout(emailTimer);
    if (newEmail.includes("@")) {
      setCheckingEmail(true);
      emailTimer = setTimeout(async () => {
        const res = await checkEmailAvailability(newEmail);
        setEmailAvailable(res.available);
        setError(res.available ? '' : res.message);
        setCheckingEmail(false);
      }, 400); //lia increased the debounce from 300 to 400
    } else {
      setCheckingEmail(false);
    }
  }


  async function handleSendOtp() {
    setError('')
    setFieldErrors({})

    try {
      // Run full validation (name, email, password, confirmPassword)
      await registerSchema.validate(formValues, { abortEarly: false })

      // Check availability of name and email
      const nameRes = await checkNameAvailability(formValues.name)
      if (!nameRes.available) {
        setFieldErrors(prev => ({ ...prev, name: 'Name already taken' }))
        return
      }

      const emailRes = await checkEmailAvailability(formValues.email)
      if (!emailRes.available) {
        setFieldErrors(prev => ({ ...prev, email: 'Email already registered' }))
        return
      }

      // If everything passes, send OTP
      const res = await sendEmailOtp(formValues.email)
      if (res.success) {
        setOtpSent(true)
        alert("OTP sent to your email")
      } else {
        setError(res.message)
      }
    } catch (validationError) {
      if (validationError.name === 'ValidationError') {
        //Map Yup errors to fields
        const errors = {}
        validationError.inner.forEach(err => {
          errors[err.path] = err.message
        })
        setFieldErrors(errors)
      } else {
        setError(validationError.message || "Validation failed")
      }
    }
  }


  async function handleVerifyOtp() {
    const res = await verifyEmailOtp(formValues.email, otpCode)
    if (res.success) {
      setOtpVerified(true)
      alert("✅ OTP verified")
    } else {
      setError(res.message)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!otpVerified) {
      setError("Please verify your email with OTP before registering.")
      return
    }

    try {
      await registerSchema.validate(formValues, { abortEarly: false })

      setIsSubmitting(true)
      const data = await registerWithEmail(
        formValues.name,
        formValues.email,
        formValues.password,
        formValues.bio,
        selectedTags
      );


      // ✅ Store token + user in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // ✅ Update context
      signIn(data.user, data.token)

      const fallbackPath = data.user.role === 'CREATOR' ? '/creator/dashboard' : '/'
      navigate(fallbackPath, { replace: true })
    } catch (validationError) {
      if (validationError.name === 'ValidationError') {
        const errors = {}
        validationError.inner.forEach(err => {
          errors[err.path] = err.message
        })
        setFieldErrors(errors)
      } else {
        setError(validationError.message || "Registration failed. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }




  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <p className="eyebrow">Join Shades of SG</p>
      <h1>Register</h1>

      <label className="field-stack">
        <span>Name</span>
        <input
          value={formValues.name}
          onChange={handleNameChange}
          placeholder="Your name"
          required
        />
        {checkingName && (
          <span style={{ color: "blue", fontSize: "12px" }}>Checking name...</span>
        )}
        {!nameAvailable && !checkingName && (
          <span style={{ color: "red", fontSize: "12px" }}>
            Name already taken. Please choose another.
          </span>
        )}
        {nameAvailable && !checkingName && formValues.name.trim().length > 2 && (
          <span style={{ color: "green", fontSize: "12px" }}>✅ Name available</span>
        )}
        {fieldErrors.name && (
          <span style={{ color: "red", fontSize: "12px" }}>{fieldErrors.name}</span>
        )}
      </label>

      <label className="field-stack">
        <span>Email</span>
        <input
          type="email"
          value={formValues.email}
          onChange={handleEmailChange}
          placeholder="name@example.com"
          required
        />
        {checkingEmail && (
          <span style={{ color: "blue", fontSize: "12px" }}>Checking email...</span>
        )}
        {!emailAvailable && !checkingEmail && (
          <span style={{ color: "red", fontSize: "12px" }}>
            Email already registered. Please use another.
          </span>
        )}
        {emailAvailable && !checkingEmail && formValues.email.includes("@") && (
          <span style={{ color: "green", fontSize: "12px" }}>✅ Email available</span>
        )}
        {fieldErrors.email && (
          <span style={{ color: "red", fontSize: "12px" }}>{fieldErrors.email}</span>
        )}
      </label>


      {/*Update password to allow show/hide*/}
      <label className="field-stack">
        <span>Password</span>
        <span style={{ fontSize: "11px", color: "grey" }}>
          Password must contain at least 8 characters, an uppercase letter and a number.
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={formValues.password}
            onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
            placeholder="Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ marginLeft: "8px" }}
          >
            {showPassword ? "🙈 Hide" : "👁 Show"}
          </button>
        </div>
        {fieldErrors.password && (
          <span style={{ color: "red", fontSize: "12px" }}>{fieldErrors.password}</span>
        )}
      </label>


      <label className="field-stack">
        <span>Confirm Password</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formValues.confirmPassword}
            onChange={(e) => setFormValues({ ...formValues, confirmPassword: e.target.value })}
            placeholder="Confirm Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ marginLeft: "8px" }}
          >
            {showConfirmPassword ? "🙈 Hide" : "👁 Show"}
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <span style={{ color: "red", fontSize: "12px" }}>{fieldErrors.confirmPassword}</span>
        )}
      </label>

      <label className="field-stack">
        <span>Bio</span>
        <textarea
          value={formValues.bio}
          onChange={(e) => setFormValues({ ...formValues, bio: e.target.value })}
          placeholder="Tell us about yourself"
          rows={4}
          style={{ resize: "none" }}
        />
        {fieldErrors.bio && (
          <span style={{ color: "red", fontSize: "12px" }}>{fieldErrors.bio}</span>
        )}
      </label>

      <InterestTagsAccordion selectedTags={selectedTags} setSelectedTags={setSelectedTags} />




      {/*otp.start*/}
      <span style={{ fontSize: "12px", color: "grey" }}>Please wait for the relevant prompts as the neccesary materials load.</span>
      <button type="button" onClick={handleSendOtp} disabled={otpSent}>
        {otpSent ? "OTP Sent" : "Send OTP"}
      </button>

      {otpSent && (
        <div>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="Enter 6-digit OTP"
          />
          <button type="button" onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}

      {/*otp.end*/}



      {error && <p className="form-error" role="alert">{error}</p>}

      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>

      <p><Link to="/login">Already have an account?</Link></p>
    </form>
  )
}
