import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  CalendarDays,
  LogOut,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useApp();
  const location = useLocation();

  if (!user) return null;

  const employeeLinks = [
    { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Accueil' },
    { to: '/employee/leave', icon: FileText, label: 'Demande' },
  ];

  const directorLinks = [
    { to: '/director/panel', icon: Users, label: 'Congés' },
    { to: '/director/meetings', icon: CalendarDays, label: 'Réunions' },
  ];

  const links = user.role === 'employee' ? employeeLinks : directorLinks;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      <div className="mx-3 mb-3 glass-card px-2 py-2 flex items-center justify-around shadow-glass">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className="flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-all duration-300"
            >
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-400 shadow-glow scale-110'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <link.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className={`text-[10px] font-medium transition-all ${
                  isActive ? 'text-primary-300' : 'text-slate-500'
                }`}
              >
                {link.label}
              </span>
            </NavLink>
          );
        })}

        <button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-all duration-300"
        >
          <div className="p-2 rounded-xl text-slate-400 hover:text-red-400 transition-all duration-300">
            <LogOut size={22} strokeWidth={1.8} />
          </div>
          <span className="text-[10px] font-medium text-slate-500">Quitter</span>
        </button>
      </div>
    </nav>
  );
}
