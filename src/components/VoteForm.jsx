import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { useUserVotes } from '../hooks/useFirestore'
import { categories } from '../data/categories'

export default function VoteForm() {
  const { currentUser } = useUser()
  const { votes, saveVote, loading } = useUserVotes(currentUser)
  const [expandedCategory, setExpandedCategory] = useState(null)

  const votedCount = Object.keys(votes).length
  const totalCategories = categories.length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-purple-400">Cargando votos...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">Tus Predicciones</h1>
        <p className="text-purple-300">
          {votedCount} / {totalCategories} categorias votadas
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-amber-400 h-2 rounded-full transition-all"
            style={{ width: `${(votedCount / totalCategories) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          const isExpanded = expandedCategory === category.id
          const hasVote = votes[category.id]

          return (
            <div
              key={category.id}
              className={`bg-black/40 backdrop-blur-sm rounded-lg border transition-all ${
                hasVote ? 'border-green-500/50' : 'border-purple-500/30'
              }`}
            >
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${hasVote ? 'bg-green-400' : 'bg-gray-500'}`} />
                  <span className="font-medium text-white">{category.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasVote && (
                    <span className="text-sm text-green-400 truncate max-w-[150px]">
                      {votes[category.id]}
                    </span>
                  )}
                  <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {category.nominados.map((nominado) => (
                    <button
                      key={nominado}
                      onClick={() => {
                        saveVote(category.id, nominado)
                        setExpandedCategory(null)
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        votes[category.id] === nominado
                          ? 'bg-purple-600 text-white border-2 border-purple-400'
                          : 'bg-purple-600/20 hover:bg-purple-600/40 text-gray-200 border border-transparent'
                      }`}
                    >
                      {nominado}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
