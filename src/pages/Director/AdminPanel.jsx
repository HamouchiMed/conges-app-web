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
        <Users size={22} className="text-primary-600" />
        Demandes de Congés
      </h2>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {[
          { key: 'all', label: 'Tout' },
          { key: 'pending', label: 'En attente' },
          { key: 'approved', label: 'Approuvés' },
          { key: 'rejected', label: 'Refusés' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              filter === tab.key
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm'
            }`}
          >
            <Filter size={12} />
            {tab.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Requests list */}
      {filtered.length === 0 ? (
        <div className="glass-card p-10 text-center animate-fade-in border-dashed border-2">
          <Users size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">Aucune demande trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((leave) => {
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
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {leave.employeeName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {leave.employeeName}
                      </p>
                      <p className="text-[11px] font-bold text-primary-700 uppercase tracking-tight">{typeLabel}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm ${cfg.bg} ${cfg.color}`}
                  >
                    <StatusIcon size={12} />
                    {cfg.label}
                  </span>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-xs text-slate-900 mb-4">
                  <span className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl font-bold shadow-sm">
                    📅 {formatDate(leave.startDate)}
                  </span>
                  <span className="text-slate-400 font-bold">→</span>
                  <span className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl font-bold shadow-sm">
                    📅 {formatDate(leave.endDate)}
                  </span>
                </div>

                {/* Motif */}
                {leave.motif && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-accent-gold/5 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                    <p className="relative text-[13px] text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl px-4 py-3.5 mb-4 leading-relaxed font-medium">
                      <span className="text-primary-600 mr-1.5 font-bold">💬</span>
                      {leave.motif}
                    </p>
                  </div>
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
