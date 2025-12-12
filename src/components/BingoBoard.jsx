import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { useUserBingo } from '../hooks/useFirestore'
import { bingoSuggestions } from '../data/categories'

export default function BingoBoard() {
  const { currentUser } = useUser()
  const { bingo, updateCell, toggleMark, loading } = useUserBingo(currentUser)
  const [editingCell, setEditingCell] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSuggestions = bingoSuggestions.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filledCells = bingo.cells.filter((c) => c && c.trim() !== '').length
  const markedCells = bingo.marked.filter(Boolean).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-purple-400">Cargando bingo...</div>
      </div>
    )
  }

  const handleCellClick = (index) => {
    if (index === 12) return // Casilla central GRATIS
    if (bingo.cells[index]) {
      toggleMark(index)
    } else {
      setEditingCell(index)
      setShowSuggestions(true)
      setSearchTerm('')
    }
  }

  const selectSuggestion = (suggestion) => {
    if (editingCell !== null) {
      updateCell(editingCell, suggestion)
      setEditingCell(null)
      setShowSuggestions(false)
    }
  }

  const clearCell = (index, e) => {
    e.stopPropagation()
    updateCell(index, '')
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">Tu Bingo</h1>
        <p className="text-purple-300 text-sm">
          {filledCells}/25 casillas | {markedCells} marcadas
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Toca una casilla vacia para agregar prediccion. Toca una llena para marcarla.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-1 bg-purple-900/30 p-2 rounded-lg border border-purple-500/30">
        {bingo.cells.map((cell, index) => {
          const isFreeCell = index === 12
          const isMarked = bingo.marked[index] || isFreeCell
          const isEmpty = !cell && !isFreeCell

          return (
            <div
              key={index}
              onClick={() => handleCellClick(index)}
              className={`bingo-cell relative ${isMarked ? 'marked' : ''} ${isFreeCell ? 'free' : ''} ${isEmpty ? 'bg-purple-600/10' : 'bg-purple-600/30'}`}
            >
              {isFreeCell ? (
                <span className="text-amber-400 font-bold">GRATIS</span>
              ) : cell ? (
                <>
                  <span className="line-clamp-3 text-[10px] sm:text-xs">{cell}</span>
                  <button
                    onClick={(e) => clearCell(index, e)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] opacity-0 hover:opacity-100 transition-opacity"
                  >
                    x
                  </button>
                </>
              ) : (
                <span className="text-gray-500 text-lg">+</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal de sugerencias */}
      {showSuggestions && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-purple-500/50 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-purple-500/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-white">Agregar prediccion</h3>
                <button
                  onClick={() => {
                    setShowSuggestions(false)
                    setEditingCell(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  X
                </button>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar o escribir prediccion..."
                className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                autoFocus
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {searchTerm && !filteredSuggestions.some((s) => s.toLowerCase() === searchTerm.toLowerCase()) && (
                <button
                  onClick={() => selectSuggestion(searchTerm)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 mb-2"
                >
                  Usar: "{searchTerm}"
                </button>
              )}

              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-600/30 text-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
