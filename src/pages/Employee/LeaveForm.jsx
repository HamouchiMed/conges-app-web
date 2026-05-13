import { useState } from 'react';
import { useApp } from '../../context/AuthContext';
import { LEAVE_TYPES } from '../../utils/helpers';
import InputField from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import {
  User,
  CalendarDays,
  FileText,
  MessageSquare,
  Send,
  CheckCircle,
} from 'lucide-react';

export default function LeaveForm() {
  const { user, addLeaveRequest } = useApp();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    employeeName: user?.name || '',
    startDate: '',
    endDate: '',
    type: '',
    motif: '',
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.type) return;
    addLeaveRequest(form);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/employee/dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-slide-up text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Demande envoyée !
          </h2>
          <p className="text-sm text-slate-400">
            Votre demande de congé a été soumise avec succès.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Redirection automatique...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="section-title flex items-center gap-2">
        <FileText size={22} />
        Demande de Congé
      </h2>

      <form onSubmit={handleSubmit} className="glass-card p-5 animate-slide-up">
        <InputField
          label="Nom de l'employé"
          icon={User}
          type="text"
          value={form.employeeName}
          onChange={handleChange('employeeName')}
          placeholder="Votre nom complet"
          readOnly
        />

        <InputField
          label="Date de début"
          icon={CalendarDays}
          type="date"
          value={form.startDate}
          onChange={handleChange('startDate')}
        />

        <InputField
          label="Date de fin"
          icon={CalendarDays}
          type="date"
          value={form.endDate}
          onChange={handleChange('endDate')}
          min={form.startDate}
        />

        <InputField
          label="Type de congé"
          icon={FileText}
          type="select"
          value={form.type}
          onChange={handleChange('type')}
        >
          <option value="">-- Sélectionnez --</option>
          {LEAVE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </InputField>

        <InputField
          label="Motif"
          icon={MessageSquare}
          type="textarea"
          value={form.motif}
          onChange={handleChange('motif')}
          placeholder="Décrivez la raison de votre demande..."
        />

        <button
          type="submit"
          disabled={!form.startDate || !form.endDate || !form.type}
          className={`w-full gradient-btn flex items-center justify-center gap-2 mt-2 ${
            !form.startDate || !form.endDate || !form.type
              ? 'opacity-40 cursor-not-allowed'
              : ''
          }`}
        >
          <Send size={16} />
          Soumettre la demande
        </button>
      </form>
    </div>
  );
}
