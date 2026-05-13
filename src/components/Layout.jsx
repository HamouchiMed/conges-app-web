import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useApp } from '../context/AuthContext';

export default function Layout() {
  const { user } = useApp();

  return (
    <div className="relative min-h-screen">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-20 left-1/4 w-60 h-60 bg-indigo-500/8 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      {user && (
        <header className="sticky top-0 z-40 glass-card mx-0 rounded-none border-x-0 border-t-0 px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">
                Gestion de Congés
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {user.role === 'employee' ? '👤 Employé' : '🛡️ Directeur'} — {user.name}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-glow">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
      )}

      {/* Page content */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <Navbar />
    </div>
  );
}
