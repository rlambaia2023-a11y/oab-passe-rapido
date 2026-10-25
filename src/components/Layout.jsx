import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Home, ListChecks, BarChart3 } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/simulado', label: 'Simulado', icon: ListChecks },
  { to: '/questoes', label: 'Questões', icon: BookOpen },
  { to: '/progresso', label: 'Progresso', icon: BarChart3 },
]

export default function Layout({ children }) {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="font-bold text-lg tracking-tight">
            OAB <span className="text-emerald-700">Passe Rápido</span>
          </Link>
          <nav className="flex gap-1 flex-wrap">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 ${
                  location.pathname === to ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      <footer className="max-w-5xl mx-auto px-4 pb-8 text-center text-xs text-slate-500">
        Banco inicial de estudo. Não são provas oficiais da OAB/FGV. Progresso salvo apenas neste navegador.
      </footer>
    </div>
  )
}
