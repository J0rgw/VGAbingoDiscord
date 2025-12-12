import { useUser } from '../context/UserContext'

export default function UserSelector() {
  const { setCurrentUser, USERS } = useUser()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-amber-400 mb-2">VGA 2025</h1>
        <p className="text-purple-300 text-lg">Predicciones & Bingo</p>
      </div>

      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-purple-500/30 w-full max-w-md">
        <h2 className="text-xl text-center text-gray-300 mb-6">Quien eres?</h2>

        <div className="grid grid-cols-2 gap-3">
          {USERS.map((user) => (
            <button
              key={user}
              onClick={() => setCurrentUser(user)}
              className="py-4 px-4 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 hover:border-purple-400 rounded-lg text-white font-medium transition-all hover:scale-105 active:scale-95"
            >
              {user}
            </button>
          ))}
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-8">The Game Awards - Diciembre 2025</p>
    </div>
  )
}
