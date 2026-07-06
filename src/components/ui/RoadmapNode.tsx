import { ReactNode } from 'react';

interface RoadmapNodeProps {
  step: string;
  title: string;
  location: string;
  description: string;
  status?: 'current' | 'upcoming' | 'future' | 'completed';
}

export default function RoadmapNode({
  step,
  title,
  location,
  description,
  status = 'upcoming'
}: RoadmapNodeProps) {

  const statusConfig = {
    current: {
      dotColor: 'bg-emerald-400 border-emerald-400',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-400/30',
      label: 'CURRENT',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]'
    },
    upcoming: {
      dotColor: 'bg-blue-500 border-blue-500',
      accentColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      label: 'UPCOMING',
      glow: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]'
    },
    future: {
      dotColor: 'bg-gray-600 border-gray-600',
      accentColor: 'text-gray-500',
      borderColor: 'border-gray-600/30',
      label: 'FUTURE',
      glow: ''
    },
    completed: {
      dotColor: 'bg-emerald-500 border-emerald-500',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-400/30',
      label: 'COMPLETED',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="relative pl-8 group">
      {/* Timeline Dot */}
      <div className={`absolute -left-[9px] top-2.5 w-4 h-4 rounded-full bg-[#030407] border-2 ${config.dotColor}
                      group-hover:scale-110 transition-all duration-300 ${config.glow}`} />

      {/* Content Card */}
      <div className={`bg-[#080a10] border ${config.borderColor} p-6 rounded-xl group-hover:border-gray-700 transition-all duration-300 shadow-2xl max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-4`}>

        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs text-gray-500 font-bold">{step}.</span>

            <h4 className={`text-lg font-bold transition-colors duration-200 ${config.accentColor === 'text-emerald-400' ? 'group-hover:text-emerald-400' : 'group-hover:text-blue-400'}`}>
              {title}
            </h4>

            <span className={`ml-2 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded ${config.accentColor} bg-black/40`}>
              {config.label}
            </span>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Location Badge */}
        <span className="self-start md:self-center font-mono text-[10px] text-blue-400 font-semibold bg-blue-950/20 border border-blue-500/20 px-3 py-1 rounded-md tracking-wider uppercase whitespace-nowrap">
          {location}
        </span>
      </div>
    </div>
  );
}
