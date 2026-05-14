import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AuthContext';
import { User, Shield, ChevronRight } from 'lucide-react';
import logo from '../assets/image.png';

export default function Login() {
  const { login, employees } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    if (role === 'director') {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleDirectorLogin = async () => {
    if (password === '0000') {
      await login('Admin Directeur', 'director');
      navigate('/director/panel');
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto mb-5 rounded-3xl bg-white p-1 border border-slate-200 flex items-center justify-center shadow-lg overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            CongeApp
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Gestion de congés & réunions
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-4 animate-slide-up">
            <p className="text-center text-sm text-slate-600 mb-6">
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
                <h3 className="text-slate-900 font-semibold text-base">Employé</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Demander un congé, voir l'historique
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
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
                <h3 className="text-slate-900 font-semibold text-base">
                  Directeur / Admin
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Gérer les congés, planifier les réunions
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
              />
            </button>
          </div>
        ) : step === 2 ? (
          <div className="space-y-5 animate-slide-up">
            <button
              onClick={() => { setStep(1); setSelectedName(''); }}
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 mb-2"
            >
              ← Retour
            </button>

            <p className="text-sm text-slate-600 mb-2 font-medium">
              Choisissez votre nom
            </p>

            <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-hide pr-1">
              {employees.map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedName(name)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer ${
                    selectedName === name
                      ? 'bg-primary-50 border border-primary-200 text-primary-700 shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
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
              className={`w-full gradient-btn mt-4 shadow-md ${
                !selectedName ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              Connexion
            </button>
          </div>
        ) : (
          <div className="space-y-5 animate-slide-up">
            <button
              onClick={() => { setStep(1); setPassword(''); setError(''); }}
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 mb-2"
            >
              ← Retour
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Accès Administrateur</h2>
              <p className="text-sm text-slate-500">Veuillez entrer le mot de passe</p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Mot de passe"
                className={`w-full bg-white border border-slate-200 rounded-xl p-4 text-center text-xl tracking-[0.5em] text-slate-900 focus:outline-none focus:border-primary-500 transition-all ${
                  error ? 'border-red-500/50 shake' : ''
                }`}
                onKeyDown={(e) => e.key === 'Enter' && handleDirectorLogin()}
                autoFocus
              />
              
              {error && (
                <p className="text-red-500 text-xs text-center animate-pulse">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleDirectorLogin}
              disabled={!password}
              className={`w-full gradient-btn mt-4 shadow-md ${
                !password ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              Accéder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
