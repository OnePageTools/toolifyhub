
import type { TemplateProps } from '.';
import { cn } from '@/lib/utils';

export const MinimalTemplate = ({ data, theme }: TemplateProps) => {
  const renderTextWithBreaks = (text?: string) => {
    return text?.split('\n').map((line, index) => (
      <p key={index}>{line}</p>
    ));
  };
  
  return (
    <div className="bg-white text-black p-10 font-body" style={{ color: theme.text }}>
      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-row items-center gap-8">
            {data.photo && (
                <img src={data.photo} alt={data.fullName || 'Profile Photo'} className="w-24 h-24 rounded-full object-cover" />
            )}
            <div className="flex-1">
                {data.fullName && <h1 className={cn("text-4xl font-bold font-serif mb-2", theme.primary)}>{data.fullName}</h1>}
                {data.jobTitle && <p className="text-lg text-gray-600">{data.jobTitle}</p>}
            </div>
        </div>
        <div className="text-xs text-gray-500 mt-4 border-t pt-2 flex flex-wrap gap-x-4 gap-y-1">
            {data.email && <a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
            {data.portfolio && <a href={`https://${data.portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.portfolio}</a>}
            {data.linkedin && <a href={`https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.linkedin}</a>}
        </div>
      </header>

      {/* Body */}
      <main className="text-sm">
        {data.summary && (
          <section className="mb-6">
            <p className="text-gray-700">{data.summary}</p>
          </section>
        )}

        {data.experience?.some(e => e.company || e.jobTitle) && (
          <section className="mb-6">
            <h2 className={cn("text-sm font-bold uppercase tracking-widest pb-1 mb-3 border-b", theme.primary)} style={{ borderColor: theme.primary.replace('text-', 'border-') }}>Experience</h2>
            {data.experience?.map((exp, index) => (
              <div key={index} className="mb-4 grid grid-cols-4 gap-4">
                <div className="col-span-1 text-xs text-gray-500">
                    <p>{exp.date}</p>
                </div>
                <div className="col-span-3">
                  <h3 className="font-bold">{exp.jobTitle || 'Job Title'}</h3>
                  <p className="text-sm italic text-gray-600">{exp.company || 'Company'}</p>
                  <div className="text-gray-700 mt-1 text-xs prose prose-sm max-w-none">
                    {renderTextWithBreaks(exp.description)}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
        
        {data.projects?.some(p => p.name) && (
          <section className="mb-6">
             <h2 className={cn("text-sm font-bold uppercase tracking-widest pb-1 mb-3 border-b", theme.primary)} style={{ borderColor: theme.primary.replace('text-', 'border-') }}>Projects</h2>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-3 grid grid-cols-4 gap-4">
                 <div className="col-span-1"></div>
                 <div className="col-span-3">
                    <h3 className="font-bold">{project.name || 'Project Name'}</h3>
                    {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className={cn("text-xs hover:underline", theme.primary)}>{project.url}</a>}
                    <div className="text-gray-700 text-xs prose prose-sm max-w-none">{renderTextWithBreaks(project.description)}</div>
                </div>
              </div>
            ))}
          </section>
        )}

        {data.education?.some(e => e.school || e.degree) && (
          <section className="mb-6">
            <h2 className={cn("text-sm font-bold uppercase tracking-widest pb-1 mb-3 border-b", theme.primary)} style={{ borderColor: theme.primary.replace('text-', 'border-') }}>Education</h2>
            {data.education?.map((edu, index) => (
              <div key={index} className="mb-2 grid grid-cols-4 gap-4">
                 <div className="col-span-1 text-xs text-gray-500">
                    <p>{edu.date}</p>
                 </div>
                 <div className="col-span-3">
                    <h3 className="font-bold">{edu.school || 'School'}</h3>
                    <p className="text-sm italic text-gray-600">{edu.degree || 'Degree'}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {data.skills?.some(s => s.name) && (() => {
            const displayedSkills = data.skills?.map(s => s.name).filter(Boolean).slice(0, 5) || [];
            const hiddenSkillsCount = (data.skills?.map(s => s.name).filter(Boolean).length || 0) - displayedSkills.length;
            return (
                <section className="mb-6">
                    <h2 className={cn("text-sm font-bold uppercase tracking-widest pb-1 mb-3 border-b", theme.primary)} style={{ borderColor: theme.primary.replace('text-', 'border-') }}>Skills</h2>
                    <p className="text-gray-700">
                        {displayedSkills.join(', ')}
                        {hiddenSkillsCount > 0 && (
                            <span className="text-xs italic">, +{hiddenSkillsCount} more</span>
                        )}
                    </p>
                </section>
            );
        })()}

        {data.languages?.some(l => l.name) && (
          <section>
            <h2 className={cn("text-sm font-bold uppercase tracking-widest pb-1 mb-3 border-b", theme.primary)} style={{ borderColor: theme.primary.replace('text-', 'border-') }}>Languages</h2>
            <p className="text-gray-700">
              {data.languages?.map(lang => lang.name).filter(Boolean).join(', ')}
            </p>
          </section>
        )}
      </main>
    </div>
  );
};
