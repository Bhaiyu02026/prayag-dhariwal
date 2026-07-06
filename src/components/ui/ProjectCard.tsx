import { Project } from '@/types';

export default function ProjectCard({ project }: { project: Project }) {
  // A project is downloadable only if it is completed and has a valid cloud storage URL
  const isDownloadable = project.status === 'Completed' && project.file_url;

  return (
    <div className="bg-[#141824] border border-gray-800 hover:border-gray-700 p-6 rounded-xl flex flex-col justify-between transition-all duration-300 group hover:shadow-xl hover:shadow-blue-500/5">
      <div>
        {/* Header Area: Title & Status Badge */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors">
            {project.title}
          </h3>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
            project.status === 'Completed'
              ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/30'
              : project.status === 'In Progress'
              ? 'bg-amber-950/50 text-amber-400 border-amber-800/30'
              : 'bg-blue-950/50 text-blue-400 border-blue-800/30'
          }`}>
            {project.status}
          </span>
        </div>

        {/* Project Description */}
        <p className="text-sm text-gray-400 line-clamp-3 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Technologies Used (Tags) */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="text-[11px] bg-[#1c2333] text-gray-300 font-medium px-2.5 py-0.5 rounded-md border border-gray-800/60"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Dynamic Action Button */}
      {isDownloadable ? (
        <a
          href={project.file_url}
          download
          className="w-full text-center bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          📥 Download Build Assets
        </a>
      ) : (
        <button
          disabled
          className="w-full text-center bg-gray-800/30 text-gray-500 font-medium text-sm py-2.5 px-4 rounded-lg cursor-not-allowed border border-gray-800/20 flex items-center justify-center gap-1"
        >
          🔒 Deployment Pending
        </button>
      )}
    </div>
  );
}
