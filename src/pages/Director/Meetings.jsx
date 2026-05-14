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
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title mb-0 flex items-center gap-2">
          <CalendarDays size={22} className="text-primary-600" />
          Réunions
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${
            showForm
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-primary-50 text-primary-600 border border-primary-200'
          }`}
        >
          {showForm ? '✕ Fermer' : '+ Nouvelle'}
        </button>
      </div>

      {/* New Meeting Form */}
      {showForm && !submitted && (
        <form
          onSubmit={handleSubmit}
          className="glass-card p-6 mb-8 animate-slide-up border border-slate-100 shadow-lg"
        >
          <h3 className="text-sm font-bold text-slate-900 mb-5">
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
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Participants
            </label>
            {form.date && (
              <p className="text-[11px] text-primary-600 font-medium mb-3">
                📅 Disponibilité pour le {formatDate(form.date)}
              </p>
            )}
            <div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-hide pr-1">
              {employees.map((name) => {
                const available = getAvailabilityForDate(name, form.date);
                const isSelected = form.attendees.includes(name);

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleAttendee(name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm cursor-pointer border ${
                      isSelected
                        ? 'bg-primary-50 border-primary-300'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm ${
                          available
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                            : 'bg-gradient-to-br from-red-500 to-red-600'
                        }`}
                      >
                        {name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p
                          className={`font-bold ${
                            available ? 'text-slate-900' : 'text-slate-400'
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
                        <UserX size={14} className="text-red-500" />
                      )}
                      <span
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <span className="text-white text-[10px] font-bold">✓</span>
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {form.attendees.length > 0 && (
              <p className="text-xs font-bold text-primary-600 mt-3 text-right">
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
            className={`w-full gradient-btn shadow-md flex items-center justify-center gap-2 ${
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
        <div className="glass-card p-10 text-center mb-8 animate-slide-up border-emerald-100 bg-emerald-50/30 shadow-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center shadow-inner">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <p className="text-emerald-900 font-bold text-lg">Réunion créée !</p>
          <p className="text-sm text-emerald-700 mt-1">
            Les participants ont été notifiés
          </p>
        </div>
      )}

      {/* Existing meetings */}
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Clock size={16} />
        Réunions planifiées
      </h3>

      {meetings.length === 0 ? (
        <div className="glass-card p-12 text-center animate-fade-in border-dashed border-2">
          <CalendarDays size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">Aucune réunion planifiée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="glass-card p-5 animate-slide-up border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-50">
                <div>
                  <p className="text-base font-bold text-slate-900">
                    {meeting.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      📅 {formatDate(meeting.date)}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      🕐 {meeting.time}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-primary-50 border border-primary-100 text-primary-700 text-[10px] font-bold uppercase tracking-wider">
                  {meeting.attendees.length} invités
                </span>
              </div>

              {/* Attendees with availability */}
              <div className="space-y-2">
                {meeting.attendees.map((name) => {
                  const available = getAvailabilityForDate(name, meeting.date);
                  return (
                    <div
                      key={name}
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-100/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`} />
                        <span
                          className={`text-xs font-bold ${
                            available ? 'text-slate-800' : 'text-slate-400 line-through'
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
