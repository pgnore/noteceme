import { useEffect } from 'react'
import { supabase, isDemoMode } from './lib/supabase'
import { useBoardStore } from './store/boardStore'
import { applyTheme } from './lib/theme'
import AuthScreen from './components/AuthScreen'
import Planner from './components/Planner'

export default function App() {
  const { session, setSession, loadBoard, board, status, demoMode } = useBoardStore()

  useEffect(() => {
    if (isDemoMode) {
      loadBoard('demo-user')
      return
    }

    supabase?.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase!.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [loadBoard, setSession])

  useEffect(() => {
    if (!isDemoMode && session?.user?.id) {
      loadBoard(session.user.id)
    }
  }, [session?.user?.id, loadBoard])

  useEffect(() => {
    if (board) {
      applyTheme(board.theme)
    }
  }, [board])

  if (!demoMode && !session) {
    return <AuthScreen />
  }

  if (status === 'error') {
    return (
      <div className="app">
        <div className="auth-card">
          <h2>Something went wrong</h2>
          <p>We could not load your planner. Check your Supabase settings.</p>
        </div>
      </div>
    )
  }

  if (status === 'loading' || !board) {
    return (
      <div className="app">
        <div className="auth-card">
          <h2>Loading your cozy space...</h2>
          <p>Sprinkling strawberry sparkle...</p>
        </div>
      </div>
    )
  }

  return <Planner />
}
