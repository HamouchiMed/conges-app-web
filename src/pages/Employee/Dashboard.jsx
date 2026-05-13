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
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  },
  approved: {
    label: 'Approuvé',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
  },
  rejected: {
    label: 'Refusé',
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/20',
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
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Bonjour, {user?.name?.split(' ')[0]} 👋
        </h2>
        <div className="flex items-center gap-2 mt-1.5">
          <StatusBadge
            available={!hasActiveLeave}
            label={hasActiveLeave ? 'En congé' : 'Disponible'}
            size="sm"
          />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total, gradient: 'from-primary-500 to-violet-500' },
          { label: 'Approuvés', value: stats.approved, gradient: 'from-emerald-500 to-teal-400' },
          { label: 'En attente', value: stats.pending, gradient: 'from-amber-500 to-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <button
        onClick={() => navigate('/employee/leave')}
        className="w-full gradient-btn flex items-center justify-center gap-2 mb-8"
      >
        <PlusCircle size={18} />
        Nouvelle demande de congé
      </button>

      {/* History */}
      <h3 className="section-title flex items-center gap-2">
        <Clock size={20} />
        Historique
      </h3>

      {myLeaves.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <CalendarDays size={40} className="mx-auto text-slate-500 mb-3" />
          <p className="text-slate-400 text-sm">Aucune demande de congé</p>
          <p className="text-slate-500 text-xs mt-1">
            Vos demandes apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {myLeaves.map((leave) => {
            const cfg = statusConfig[leave.status];
            const StatusIcon = cfg.icon;
            const typeLabel =
              LEAVE_TYPES.find((t) => t.value === leave.type)?.label ||
              leave.type;

            return (
              <div
                key={leave.id}
                className="glass-card p-4 animate-slide-up"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {typeLabel}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.bg} ${cfg.color}`}
                  >
                    <StatusIcon size={12} />
                    {cfg.label}
                  </span>
                </div>
                {leave.motif && (
                  <p className="text-xs text-slate-400 mt-2 bg-surface-800/50 rounded-lg px-3 py-2">
                    💬 {leave.motif}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
