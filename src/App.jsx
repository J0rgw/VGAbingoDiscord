import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './context/UserContext'
import UserSelector from './components/UserSelector'
import Navigation from './components/Navigation'
import VoteForm from './components/VoteForm'
import BingoBoard from './components/BingoBoard'
import ResultsView from './components/ResultsView'

function ProtectedRoute({ children }) {
  const { currentUser } = useUser()
  if (!currentUser) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  const { currentUser } = useUser()

  return (
    <div className="min-h-screen text-white">
      {currentUser && <Navigation />}
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to="/votos" replace /> : <UserSelector />} />
          <Route path="/votos" element={<ProtectedRoute><VoteForm /></ProtectedRoute>} />
          <Route path="/bingo" element={<ProtectedRoute><BingoBoard /></ProtectedRoute>} />
          <Route path="/resultados" element={<ProtectedRoute><ResultsView /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
