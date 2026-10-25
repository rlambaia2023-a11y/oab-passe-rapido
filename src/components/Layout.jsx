import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Home, ListChecks, BarChart3, Menu, X, Cloud, LogOut, Target, Filter } from 'lucide-react'
import { getCloudEmail, isCloud, logoutCloud } from '@/lib/nuvem'

const LINKS = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/simulado', label: 'Simulado', icon: ListChecks },
  { to: '/revisao', label: 'Revisão', icon: Target },
  { to: '/questoes', label: 'Questões', icon: BookOpen },
  { to: '/progresso', label: 'Progresso', icon: BarChart3 },
  { to: '/analise', label: 'Análise de Provas', icon: Filter },
]

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [aberto, setAberto] = useState(false)
  const cloud = isCloud()
  const email = getCloudEmail()

  function sair() {
    logoutCloud()
    navigate('/')
  }

  const navClass = (to) => `px-3 py-2.5 rounded-lg text-sm flex items-center gap-1.5 min-h-[44px] ${
    location.pathname === to ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
  }`

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="font-bold text-lg tracking-tight whitespace-nowrap">
            OAB <span className="text-emerald-700">Passe Rápido</span>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            <nav className="flex gap-1 flex-wrap">
              {LINKS.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className={navClass(to)}>
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
            </nav>
            {cloud ? (
              <span className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-2">
                <Cloud className="w-4 h-4" /> <span className="max-w-[140px] truncate">{email}</span>
                <button onClick={sair} title="Sair da nuvem" className="text-slate-500 hover:text-slate-800"><LogOut className="w-4 h-4" /></button>
              </span>
            ) : (
              <Link to="/login" className="text-sm text-slate-600 hover:underline whitespace-nowrap">Entrar na nuvem</Link>
            )}
          </div>
          <button
            className="md:hidden p-2.5 rounded-lg border min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setAberto(!aberto)}
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          >
            {aberto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {aberto && (
          <nav className="md:hidden border-t px-4 py-3 flex flex-col gap-1">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setAberto(false)} className={navClass(to)}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
            {cloud ? (
              <div className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="flex items-center gap-1.5 text-emerald-800"><Cloud className="w-4 h-4" /> {email}</span>
                <button onClick={() => { setAberto(false); sair() }} className="text-slate-600 underline">Sair da nuvem</button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setAberto(false)} className="px-3 py-2.5 text-sm text-slate-600 underline">Entrar na nuvem</Link>
            )}
          </nav>
        )}
      </header>
      <main className="max-w-5xl mx-auto px-4 py-5 md:py-6">{children}</main>
      <footer className="max-w-5xl mx-auto px-4 pb-8 text-center text-xs text-slate-500 leading-relaxed">
        Banco de estudo. Não são provas oficiais da OAB/FGV.
        {cloud ? ' Progresso sincronizado na nuvem com a sua conta.' : ' Sem conta, o progresso fica só neste navegador. Entre para salvar na nuvem.'}
      </footer>
    </div>
  )
}
