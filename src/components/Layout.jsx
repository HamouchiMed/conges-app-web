import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useApp } from '../context/AuthContext';
import logo from '../assets/image.png';

export default function Layout() {
  const { user } = useApp();

  return (
    <div className="relative min-h-screen">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-amber-600/8 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-20 left-1/4 w-60 h-60 bg-emerald-500/8 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      {user && (
        <header className="sticky top-0 z-40 glass-card mx-0 rounded-none border-x-0 border-t-0 px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                  CongeApp
                </h1>
                <p className="text-[10px] text-slate-600">
                  {user.role === 'employee' ? '👤 Employé' : '🛡️ Directeur'} — {user.name}
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/20">
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
