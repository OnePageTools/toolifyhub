
import type { TemplateProps } from '.';
import { Mail, Phone, Linkedin, Globe, MapPin } from 'lucide-react';

export const ModernTemplate = ({ data, theme }: TemplateProps) => {
  const renderTextWithBreaks = (text?: string) => {
    return text?.split('\n').map((line, index) => (
      <p key={index}>{line}</p>
    ));
  };
  
  return (
    <div className="bg-white text-black font-body text-sm flex">
      {/* Left Column (Sidebar) */}
      <aside className="w-[280px] shrink-0 p-8" style={{ backgroundColor: theme.background }}>
        <div className="text-center" style={{ color: theme.text }}>
            {data.photo && <img src={data.photo} alt={data.fullName || 'Profile Photo'} className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-white shadow-md" />}
        </div>

        <section className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{color: theme.primary}}>Contact</h2>
            <div className="space-y-2 text-xs" style={{ color: theme.text }}>
                {data.email && <div className="flex items-center gap-2"><Mail size={14}/> {data.email}</div>}
                {data.phone && <div className="flex items-center gap-2"><Phone size={14}/> {data.phone}</div>}
                {data.location && <div className="flex items-center gap-2"><MapPin size={14}/> {data.location}</div>}
                {data.portfolio && <div className="flex items-center gap-2"><Globe size={14}/> {data.portfolio}</div>}
                {data.linkedin && <div className="flex items-center gap-2"><Linkedin size={14}/> {data.linkedin}</div>}
            </div>
        </section>

        {data.skills?.some(s => s.name) && (
            <section className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{color: theme.primary}}>Skills</h2>
                <ul className="space-y-1 text-sm list-disc list-inside" style={{ color: theme.text }}>
                    {data.skills.map((skill, index) => skill.name && (
                        <li key={index}>{skill.name}</li>
                    ))}
                </ul>
            </section>
        )}

        {data.languages?.some(l => l.name) && (
            <section className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{color: theme.primary}}>Languages</h2>
                <ul className="space-y-1 text-sm list-disc list-inside" style={{ color: theme.text }}>
                    {data.languages.map((lang, index) => lang.name && (
                        <li key={index}>{lang.name}</li>
                    ))}
                </ul>
            </section>
        )}

        {data.education?.some(e => e.school || e.degree) && (
            <section className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{color: theme.primary}}>Education</h2>
                {data.education?.map((edu, index) => (
                    <div key={index} className="mb-3 text-sm" style={{ color: theme.text }}>
                        <h3 className="font-bold">{edu.degree || 'Degree'}</h3>
                        <p className="text-xs">{edu.school || 'School'}</p>
                        <p className="text-xs text-gray-500" style={{color: theme.text, opacity: 0.7}}>{edu.date}</p>
                    </div>
                ))}
            </section>
        )}
      </aside>

      {/* Right Column (Main Content) */}
      <main className="flex-1 p-8">
        <header className="text-left mb-8">
            {data.fullName && <h1 className="text-5xl font-bold tracking-tight font-serif" style={{color: theme.primary}}>{data.fullName}</h1>}
            {data.jobTitle && <p className="text-2xl mt-1">{data.jobTitle}</p>}
        </header>

        {data.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 font-serif" style={{color: theme.primary}}>Profile</h2>
            <p className="text-gray-700 text-sm">{data.summary}</p>
          </section>
        )}

        {data.experience?.some(e => e.company || e.jobTitle) && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 font-serif" style={{color: theme.primary}}>Experience</h2>
            {data.experience?.map((exp, index) => (
              <div key={index} className="mb-5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-base">{exp.jobTitle || 'Job Title'}</h3>
                  <p className="text-xs text-gray-500">{exp.date}</p>
                </div>
                <p className="text-sm italic text-gray-600">{exp.company || 'Company'}</p>
                <div className="mt-1 text-xs prose prose-sm max-w-none text-gray-700">
                  {renderTextWithBreaks(exp.description)}
                </div>
              </div>
            ))}
          </section>
        )}

        {data.projects?.some(p => p.name) && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 font-serif" style={{color: theme.primary}}>Projects</h2>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-base">{project.name || 'Project Name'}</h3>
                  {project.url && <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline" style={{color: theme.primary}}>{project.url}</a>}
                </div>
                <div className="text-xs prose prose-sm max-w-none text-gray-700">{renderTextWithBreaks(project.description)}</div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};
