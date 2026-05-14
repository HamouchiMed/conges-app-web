import { useApp } from '../../context/AuthContext';
import { formatDate, LEAVE_TYPES } from '../../utils/helpers';
import StatusBadge from '../../components/StatusBadge';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  PlusCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  pending: {
    label: 'En attente',
    icon: Hourglass,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
  },
  approved: {
    label: 'Approuvé',
    icon: CheckCircle2,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  rejected: {
    label: 'Refusé',
    icon: XCircle,
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
  },
};

export default function Dashboard() {
  const { user, leaveRequests } = useApp();
  const navigate = useNavigate();

  const myLeaves = leaveRequests.filter(
    (req) => req.employeeName === user?.name
  );

  const stats = {
    total: myLeaves.length,
    approved: myLeaves.filter((r) => r.status === 'approved').length,
    pending: myLeaves.filter((r) => r.status === 'pending').length,
    rejected: myLeaves.filter((r) => r.status === 'rejected').length,
  };

  const hasActiveLeave = myLeaves.some((r) => {
    if (r.status !== 'approved') return false;
    const today = new Date();
    return new Date(r.startDate) <= today && today <= new Date(r.endDate);
  });

  return (
    <div className="page-container">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Bonjour, {user?.name?.split(' ')[0]} 👋
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <StatusBadge
            available={!hasActiveLeave}
            label={hasActiveLeave ? 'En congé' : 'Disponible pour le travail'}
            size="sm"
          />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'text-primary-600' },
          { label: 'Approuvés', value: stats.approved, color: 'text-emerald-600' },
          { label: 'Attente', value: stats.pending, color: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center border-slate-100 shadow-sm">
            <p className={`text-2xl font-black ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <button
        onClick={() => navigate('/employee/leave')}
        className="w-full gradient-btn flex items-center justify-center gap-2 mb-10 shadow-lg"
      >
        <PlusCircle size={18} />
        Nouvelle demande de congé
      </button>

      {/* History */}
      <h3 className="section-title flex items-center gap-2">
        <Clock size={22} className="text-primary-600" />
        Mon Historique
      </h3>

      {myLeaves.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-2">
          <CalendarDays size={40} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500 font-medium text-sm">Aucune demande de congé</p>
          <p className="text-slate-400 text-xs mt-1">
            Vos demandes apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myLeaves.map((leave) => {
            const cfg = statusConfig[leave.status];
            const StatusIcon = cfg.icon;
            const typeLabel =
              LEAVE_TYPES.find((t) => t.value === leave.type)?.label ||
              leave.type;

            return (
              <div
                key={leave.id}
                className="glass-card p-5 animate-slide-up border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[11px] font-bold text-primary-700 uppercase tracking-tight mb-1">
                      {typeLabel}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                      <span>📅 {formatDate(leave.startDate)}</span>
                      <span className="text-slate-300">→</span>
                      <span>📅 {formatDate(leave.endDate)}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm ${cfg.bg} ${cfg.color}`}
                  >
                    <StatusIcon size={12} />
                    {cfg.label}
                  </span>
                </div>
                {leave.motif && (
                  <div className="relative group mt-3">
                    <div className="absolute inset-0 bg-accent-gold/5 rounded-xl blur-sm"></div>
                    <p className="relative text-[12px] text-slate-700 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-xl px-4 py-3 leading-relaxed font-medium">
                      <span className="text-primary-600 mr-1.5 font-bold">💬</span>
                      {leave.motif}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
