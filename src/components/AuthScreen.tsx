import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthScreen() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!supabase) {
        setError('Supabase is not configured')
        return
      }
      if (mode === 'sign-in') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) throw signUpError
      }
    } catch (err: any) {
      setError(err.message || 'Unable to authenticate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="auth-card">
        <h2>{mode === 'sign-in' ? 'Welcome back' : 'Create your cozy space'}</h2>
        <p>Sign in to sync your notece.me planner.</p>
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && <p>{error}</p>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Loading...' : mode === 'sign-in' ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        <div style={{ marginTop: 12 }}>
          {mode === 'sign-in' ? (
            <button className="button ghost" onClick={() => setMode('sign-up')}>
              Need an account?
            </button>
          ) : (
            <button className="button ghost" onClick={() => setMode('sign-in')}>
              Already have an account?
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
