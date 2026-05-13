import { useApp } from '../../context/AuthContext';
import { formatDate, LEAVE_TYPES } from '../../utils/helpers';
import StatusBadge from '../../components/StatusBadge';
import {
  CheckCircle2,
  XCircle,
  Hourglass,
  Users,
  Filter,
} from 'lucide-react';
import { useState } from 'react';

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

export default function AdminPanel() {
  const { leaveRequests, updateLeaveStatus } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all'
      ? leaveRequests
      : leaveRequests.filter((r) => r.status === filter);

  const counts = {
    all: leaveRequests.length,
    pending: leaveRequests.filter((r) => r.status === 'pending').length,
    approved: leaveRequests.filter((r) => r.status === 'approved').length,
    rejected: leaveRequests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="page-container">
      <h2 className="section-title flex items-center gap-2">
        <Users size={22} />
        Demandes de Congés
      </h2>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {[
          { key: 'all', label: 'Tout' },
          { key: 'pending', label: 'En attente' },
          { key: 'approved', label: 'Approuvés' },
          { key: 'rejected', label: 'Refusés' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
              filter === tab.key
                ? 'bg-primary-500/20 text-primary-300 border border-primary-400/30'
                : 'glass-card-light text-slate-400 hover:text-slate-200'
            }`}
          >
            <Filter size={12} />
            {tab.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              filter === tab.key ? 'bg-primary-500/30' : 'bg-surface-700'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Requests list */}
      {filtered.length === 0 ? (
        <div className="glass-card p-8 text-center animate-fade-in">
          <Users size={40} className="mx-auto text-slate-500 mb-3" />
          <p className="text-slate-400 text-sm">Aucune demande trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((leave) => {
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
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                      {leave.employeeName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {leave.employeeName}
                      </p>
                      <p className="text-[11px] text-slate-400">{typeLabel}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.bg} ${cfg.color}`}
                  >
                    <StatusIcon size={12} />
                    {cfg.label}
                  </span>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                  <span className="bg-surface-800/50 px-2.5 py-1 rounded-lg">
                    📅 {formatDate(leave.startDate)}
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="bg-surface-800/50 px-2.5 py-1 rounded-lg">
                    📅 {formatDate(leave.endDate)}
                  </span>
                </div>

                {/* Motif */}
                {leave.motif && (
                  <p className="text-xs text-slate-400 bg-surface-800/50 rounded-lg px-3 py-2 mb-3">
                    💬 {leave.motif}
                  </p>
                )}

                {/* Actions for pending */}
                {leave.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateLeaveStatus(leave.id, 'approved')}
                      className="flex-1 gradient-btn gradient-btn-success py-2.5 text-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      Approuver
                    </button>
                    <button
                      onClick={() => updateLeaveStatus(leave.id, 'rejected')}
                      className="flex-1 gradient-btn gradient-btn-danger py-2.5 text-xs flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={14} />
                      Refuser
                    </button>
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
