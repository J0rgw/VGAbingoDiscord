import { NavLink } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function Navigation() {
  const { currentUser, logout } = useUser()

  return (
    <nav className="bg-black/50 backdrop-blur-sm border-b border-purple-500/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">VGA 2025</span>
            <span className="text-purple-400 text-sm">| {currentUser}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <NavLink
              to="/votos"
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm transition-colors ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white hover:bg-purple-600/30'}`
              }
            >
              Votos
            </NavLink>
            <NavLink
              to="/bingo"
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm transition-colors ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white hover:bg-purple-600/30'}`
              }
            >
              Bingo
            </NavLink>
            <NavLink
              to="/resultados"
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm transition-colors ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white hover:bg-purple-600/30'}`
              }
            >
              Todos
            </NavLink>
            <button
              onClick={logout}
              className="px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
