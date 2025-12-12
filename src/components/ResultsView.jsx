import { useState } from 'react'
import { useUser, USERS } from '../context/UserContext'
import { useAllUsersData } from '../hooks/useFirestore'
import { categories } from '../data/categories'

export default function ResultsView() {
  const { currentUser } = useUser()
  const { allData, loading } = useAllUsersData(USERS)
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewMode, setViewMode] = useState('votos') // 'votos' | 'bingo'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-purple-400">Cargando datos...</div>
      </div>
    )
  }

  const userData = selectedUser ? allData[selectedUser] : null

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">Predicciones de Todos</h1>
      </div>

      {/* Selector de usuario */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {USERS.map((user) => {
          const hasData = allData[user]?.votos || allData[user]?.bingo
          return (
            <button
              key={user}
              onClick={() => setSelectedUser(selectedUser === user ? null : user)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedUser === user
                  ? 'bg-purple-600 text-white'
                  : hasData
                    ? 'bg-purple-600/30 text-purple-300 hover:bg-purple-600/50'
                    : 'bg-gray-700/30 text-gray-500'
              } ${user === currentUser ? 'ring-2 ring-amber-400' : ''}`}
            >
              {user}
              {user === currentUser && <span className="ml-1 text-amber-400">*</span>}
            </button>
          )
        })}
      </div>

      {selectedUser && (
        <>
          {/* Toggle votos/bingo */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setViewMode('votos')}
              className={`px-6 py-2 rounded-lg transition-all ${
                viewMode === 'votos' ? 'bg-purple-600 text-white' : 'bg-purple-600/20 text-purple-300'
              }`}
            >
              Votos
            </button>
            <button
              onClick={() => setViewMode('bingo')}
              className={`px-6 py-2 rounded-lg transition-all ${
                viewMode === 'bingo' ? 'bg-purple-600 text-white' : 'bg-purple-600/20 text-purple-300'
              }`}
            >
              Bingo
            </button>
          </div>

          {viewMode === 'votos' ? (
            <VotosView votos={userData?.votos || {}} />
          ) : (
            <BingoView bingo={userData?.bingo || { cells: Array(25).fill(''), marked: Array(25).fill(false) }} />
          )}
        </>
      )}

      {!selectedUser && (
        <div className="text-center text-gray-400 py-12">
          Selecciona un usuario para ver sus predicciones
        </div>
      )}
    </div>
  )
}

function VotosView({ votos }) {
  const votedCount = Object.keys(votos).length

  if (votedCount === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        Este usuario aun no ha votado
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-center text-purple-300 mb-4">{votedCount} / {categories.length} categorias</p>
      {categories.map((category) => {
        const vote = votos[category.id]
        return (
          <div
            key={category.id}
            className={`px-4 py-3 rounded-lg ${
              vote ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-800/30 border border-gray-700/30'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">{category.nombre}</span>
              <span className={`text-sm font-medium ${vote ? 'text-green-400' : 'text-gray-500'}`}>
                {vote || 'Sin votar'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BingoView({ bingo }) {
  const filledCells = bingo.cells.filter((c) => c && c.trim() !== '').length
  const markedCells = bingo.marked.filter(Boolean).length

  return (
    <div>
      <p className="text-center text-purple-300 mb-4">
        {filledCells}/25 casillas | {markedCells} marcadas
      </p>
      <div className="grid grid-cols-5 gap-1 bg-purple-900/30 p-2 rounded-lg border border-purple-500/30 max-w-md mx-auto">
        {bingo.cells.map((cell, index) => {
          const isFreeCell = index === 12
          const isMarked = bingo.marked[index] || isFreeCell

          return (
            <div
              key={index}
              className={`bingo-cell cursor-default ${isMarked ? 'marked' : ''} ${isFreeCell ? 'free' : ''} ${!cell && !isFreeCell ? 'bg-purple-600/10' : 'bg-purple-600/30'}`}
            >
              {isFreeCell ? (
                <span className="text-amber-400 font-bold text-xs">GRATIS</span>
              ) : cell ? (
                <span className="line-clamp-3 text-[10px]">{cell}</span>
              ) : (
                <span className="text-gray-600">-</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
