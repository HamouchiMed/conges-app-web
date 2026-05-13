export default function InputField({ label, icon: Icon, error, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        {props.type === 'select' ? (
          <select
            {...props}
            type={undefined}
            className={`w-full bg-surface-800/80 border border-surface-600/50 rounded-xl py-3 
              ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-slate-100 text-sm
              focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/30
              transition-all duration-200 appearance-none
              ${error ? 'border-red-400' : ''} ${props.className || ''}`}
          >
            {props.children}
          </select>
        ) : props.type === 'textarea' ? (
          <textarea
            {...props}
            type={undefined}
            rows={3}
            className={`w-full bg-surface-800/80 border border-surface-600/50 rounded-xl py-3 
              ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-slate-100 text-sm
              focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/30
              transition-all duration-200 resize-none
              ${error ? 'border-red-400' : ''} ${props.className || ''}`}
          />
        ) : (
          <input
            {...props}
            className={`w-full bg-surface-800/80 border border-surface-600/50 rounded-xl py-3 
              ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-slate-100 text-sm
              focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/30
              transition-all duration-200
              ${error ? 'border-red-400' : ''} ${props.className || ''}`}
          />
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
