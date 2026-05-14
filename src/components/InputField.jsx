export default function InputField({ label, icon: Icon, error, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
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
            className={`w-full bg-white border border-slate-200 rounded-xl py-3.5 
              ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-slate-900 text-sm font-medium
              focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5
              transition-all duration-200 appearance-none shadow-sm
              ${error ? 'border-red-500' : ''} ${props.className || ''}`}
          >
            {props.children}
          </select>
        ) : props.type === 'textarea' ? (
          <textarea
            {...props}
            type={undefined}
            rows={3}
            className={`w-full bg-white border border-slate-200 rounded-xl py-3.5 
              ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-slate-900 text-sm font-medium
              focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5
              transition-all duration-200 resize-none shadow-sm
              ${error ? 'border-red-500' : ''} ${props.className || ''}`}
          />
        ) : (
          <input
            {...props}
            className={`w-full bg-white border border-slate-200 rounded-xl py-3.5 
              ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-slate-900 text-sm font-medium
              focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5
              transition-all duration-200 shadow-sm
              ${error ? 'border-red-500' : ''} ${props.className || ''}`}
          />
        )}
      </div>
      {error && <p className="text-red-600 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
