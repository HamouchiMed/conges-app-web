import { useState } from 'react';
import { useApp } from '../../context/AuthContext';
import { isOnLeave, formatDate } from '../../utils/helpers';
import InputField from '../../components/InputField';
import StatusBadge from '../../components/StatusBadge';
import {
  CalendarDays,
  Users,
  FileText,
  Clock,
  Send,
  CheckCircle,
  UserCheck,
  UserX,
} from 'lucide-react';

export default function Meetings() {
  const { employees, leaveRequests, meetings, addMeeting } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    attendees: [],
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleAttendee = (name) => {
    setForm((prev) => ({
      ...prev,
      attendees: prev.attendees.includes(name)
        ? prev.attendees.filter((n) => n !== name)
        : [...prev.attendees, name],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || form.attendees.length === 0) return;
    addMeeting(form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setForm({ title: '', date: '', time: '', attendees: [] });
    }, 2000);
  };

  const getAvailabilityForDate = (employeeName, dateStr) => {
    if (!dateStr) return true;
    try {
      const date = new Date(dateStr);
      return !isOnLeave(employeeName, leaveRequests, date);
    } catch {
      return true;
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0 flex items-center gap-2">
          <CalendarDays size={22} />
          Réunions
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
            showForm
              ? 'bg-red-500/20 text-red-300 border border-red-400/30'
              : 'bg-primary-500/20 text-primary-300 border border-primary-400/30'
          }`}
        >
          {showForm ? '✕ Fermer' : '+ Nouvelle'}
        </button>
      </div>

      {/* New Meeting Form */}
      {showForm && !submitted && (
        <form
          onSubmit={handleSubmit}
          className="glass-card p-5 mb-6 animate-slide-up"
        >
          <h3 className="text-sm font-semibold text-white mb-4">
            Planifier une réunion
          </h3>

          <InputField
            label="Nom de la réunion"
            icon={FileText}
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            placeholder="Ex: Réunion de projet Q2"
          />

          <InputField
            label="Date"
            icon={CalendarDays}
            type="date"
            value={form.date}
            onChange={handleChange('date')}
          />

          <InputField
            label="Heure"
            icon={Clock}
            type="time"
            value={form.time}
            onChange={handleChange('time')}
          />

          {/* Employee selection with availability */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sélectionner les participants
            </label>
            {form.date && (
              <p className="text-[11px] text-slate-500 mb-2">
                📅 Disponibilité pour le {formatDate(form.date)}
              </p>
            )}
            <div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-hide">
              {employees.map((name) => {
                const available = getAvailabilityForDate(name, form.date);
                const isSelected = form.attendees.includes(name);

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleAttendee(name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm cursor-pointer ${
                      isSelected
                        ? 'bg-primary-500/15 border border-primary-400/30'
                        : 'glass-card-light'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                          available
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-br from-red-500 to-orange-400'
                        }`}
                      >
                        {name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p
                          className={`font-medium ${
                            available ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {name}
                        </p>
                        <StatusBadge
                          available={available}
                          label={available ? 'Disponible' : 'En congé'}
                          size="sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!available && (
                        <UserX size={14} className="text-red-400" />
                      )}
                      <span
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-primary-500 border-primary-400'
                            : 'border-slate-600'
                        }`}
                      >
                        {isSelected && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {form.attendees.length > 0 && (
              <p className="text-xs text-primary-300 mt-2">
                {form.attendees.length} participant(s) sélectionné(s)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              !form.title ||
              !form.date ||
              !form.time ||
              form.attendees.length === 0
            }
            className={`w-full gradient-btn flex items-center justify-center gap-2 ${
              !form.title || !form.date || !form.time || form.attendees.length === 0
                ? 'opacity-40 cursor-not-allowed'
                : ''
            }`}
          >
            <Send size={16} />
            Créer la réunion
          </button>
        </form>
      )}

      {/* Success message */}
      {submitted && (
        <div className="glass-card p-8 text-center mb-6 animate-slide-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <p className="text-white font-semibold">Réunion créée !</p>
          <p className="text-xs text-slate-400 mt-1">
            Les participants ont été notifiés
          </p>
        </div>
      )}

      {/* Existing meetings */}
      <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <Clock size={16} />
        Réunions planifiées
      </h3>

      {meetings.length === 0 ? (
        <div className="glass-card p-8 text-center animate-fade-in">
          <CalendarDays size={40} className="mx-auto text-slate-500 mb-3" />
          <p className="text-slate-400 text-sm">Aucune réunion planifiée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="glass-card p-4 animate-slide-up">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {meeting.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">
                      📅 {formatDate(meeting.date)}
                    </span>
                    <span className="text-xs text-slate-400">
                      🕐 {meeting.time}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-primary-500/15 border border-primary-400/20 text-primary-300 text-xs font-medium">
                  {meeting.attendees.length} invités
                </span>
              </div>

              {/* Attendees with availability */}
              <div className="space-y-1.5">
                {meeting.attendees.map((name) => {
                  const available = getAvailabilityForDate(name, meeting.date);
                  return (
                    <div
                      key={name}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-800/40"
                    >
                      <div className="flex items-center gap-2">
                        {available ? (
                          <UserCheck size={14} className="text-emerald-400" />
                        ) : (
                          <UserX size={14} className="text-red-400" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            available ? 'text-slate-200' : 'text-slate-400 line-through'
                          }`}
                        >
                          {name}
                        </span>
                      </div>
                      <StatusBadge
                        available={available}
                        label={available ? 'Présent' : 'En congé'}
                        size="sm"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
