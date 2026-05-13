export default function StatusBadge({ available, label, size = 'md' }) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex">
        <span
          className={`${sizes[size]} rounded-full ${
            available
              ? 'bg-emerald-400'
              : 'bg-red-400'
          }`}
        />
        {available && (
          <span
            className={`absolute inset-0 ${sizes[size]} rounded-full bg-emerald-400 animate-ping opacity-50`}
          />
        )}
      </span>
      {label && (
        <span
          className={`${labelSizes[size]} font-medium ${
            available ? 'text-emerald-300' : 'text-red-300'
          }`}
        >
          {label}
        </span>
      )}
    </span>
  );
}
