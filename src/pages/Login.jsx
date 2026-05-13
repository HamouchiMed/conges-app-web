import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AuthContext';
import { User, Shield, ChevronRight, Sparkles } from 'lucide-react';

export default function Login() {
  const { login, employees } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [step, setStep] = useState(1);

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    if (role === 'director') {
      await login('Admin Directeur', 'director');
      navigate('/director/panel');
    } else {
      setStep(2);
    }
  };

  const handleEmployeeLogin = async () => {
    if (!selectedName) return;
    await login(selectedName, 'employee');
    navigate('/employee/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-glow">
            <Sparkles size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            CongeApp
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Gestion de congés & réunions
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-4 animate-slide-up">
            <p className="text-center text-sm text-slate-300 mb-6">
              Sélectionnez votre rôle pour continuer
            </p>

            <button
              onClick={() => handleRoleSelect('employee')}
              className="w-full glass-card p-5 flex items-center gap-4 hover:border-primary-400/40 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                <User size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-semibold text-base">Employé</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Demander un congé, voir l'historique
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
              />
            </button>

            <button
              onClick={() => handleRoleSelect('director')}
              className="w-full glass-card p-5 flex items-center gap-4 hover:border-primary-400/40 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg">
                <Shield size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-semibold text-base">
                  Directeur / Admin
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Gérer les congés, planifier les réunions
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
              />
            </button>
          </div>
        ) : (
          <div className="space-y-5 animate-slide-up">
            <button
              onClick={() => { setStep(1); setSelectedName(''); }}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 mb-2"
            >
              ← Retour
            </button>

            <p className="text-sm text-slate-300 mb-2">
              Choisissez votre nom
            </p>

            <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-hide pr-1">
              {employees.map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedName(name)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer ${
                    selectedName === name
                      ? 'bg-primary-500/20 border border-primary-400/40 text-primary-200 shadow-glow'
                      : 'glass-card-light text-slate-300 hover:border-slate-500/30'
                  }`}
                >
                  <span className="mr-2">
                    {selectedName === name ? '✓' : '○'}
                  </span>
                  {name}
                </button>
              ))}
            </div>

            <button
              onClick={handleEmployeeLogin}
              disabled={!selectedName}
              className={`w-full gradient-btn mt-4 ${
                !selectedName ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              Connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
