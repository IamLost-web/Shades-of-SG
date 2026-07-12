import { useState } from 'react'
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext'
import { updateProfile, checkNameAvailability, checkEmailAvailability } from '../services/authApi'
import InterestTagsAccordion from "../components/InterestTagsAccordion";

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  bio: Yup.string()
    .max(200, "Bio must be at most 200 characters")
    .test("no-forbidden-words", "Bio contains forbidden words", (value) => {
      if (!value) return true;
      const forbidden = ["fuck", "ass"];
      return !forbidden.some((w) => value.toLowerCase().includes(w));
    }),
})

export default function ProfileSettings() {
  const { user, signIn } = useAuth()
  // ✅ Use optional chaining and fallback values
  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [bio, setBio] = useState(user?.bio || "This is my bio");
  const [selectedTags, setSelectedTags] = useState(user?.interestTags || []);


  if (!user) {
    // ✅ Show a loading state or redirect if no user //Please add an actual loading screen for both this and DataPrivacy because the pages keep jumping
    return <p>Loading profile...</p>
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await schema.validate({ name, email, bio }, { abortEarly: false })

      const nameRes = await checkNameAvailability(name) //Try to make into real time checking same as login/register with debounce
      if (!nameRes.available && name !== user.name) {
        setError('Name already taken')
        return
      }

      const emailRes = await checkEmailAvailability(email)
      if (!emailRes.available && email !== user.email) {
        setError('Email already in use')
        return
      }

      const res = await updateProfile({ name, email, bio, interestTags: selectedTags });
      if (res.success) {
        signIn(res.user, res.token); // update context
        setSuccess('Changes saved successfully');
      } else {
        setError(res.message);
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        setError(err.errors.join(', '));
      } else {
        setError(err.message || 'Something went wrong');
      }
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSave}>
      <h1>Profile Settings</h1>

      <label className="field-stack">
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label className="field-stack">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label className="field-stack">
        <span>Bio</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          style={{ resize: "none" }}
        />
      </label>

      <InterestTagsAccordion selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      <button className="primary-button" type="submit">Save Changes</button>
    </form>
  )
}
