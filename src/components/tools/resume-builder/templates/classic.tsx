
import type { TemplateProps } from '.';
import { Mail, Phone, Linkedin, Globe, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ClassicTemplate = ({ data, theme }: TemplateProps) => {
  const renderTextWithBreaks = (text?: string) => {
    return text?.split('\n').map((line, index) => (
      <p key={index} className="mb-1">{line}</p>
    ));
  };
  
  return (
    <div className="bg-white text-black p-8 font-serif" style={{ color: theme.text }}>
      {/* Header */}
      <header className="text-center mb-8">
        {data.fullName && <h1 className={cn("text-5xl font-bold tracking-tight mb-1", theme.primary)}>{data.fullName}</h1>}
        {data.jobTitle && <p className="text-xl text-gray-600 font-body">{data.jobTitle}</p>}
        <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500 font-body">
          {data.email && <div className="flex items-center gap-1.5"><Mail size={12}/> {data.email}</div>}
          {data.phone && <div className="flex items-center gap-1.5"><Phone size={12}/> {data.phone}</div>}
          {data.location && <div className="flex items-center gap-1.5"><MapPin size={12}/> {data.location}</div>}
          {data.portfolio && <div className="flex items-center gap-1.5"><Globe size={12}/> {data.portfolio}</div>}
          {data.linkedin && <div className="flex items-center gap-1.5"><Linkedin size={12}/> {data.linkedin}</div>}
        </div>
      </header>

      {/* Body */}
      <main className="text-sm font-body">
        {data.summary && (
          <section className="mb-6">
            <h2 className={cn("text-xl font-bold border-b-2 pb-1 mb-2 font-serif", theme.primary)} style={{ borderColor: theme.primary.replace('text-', 'border-') }}>Summary</h2>
            <p className="text-gray-700">{data.summary}</p>
          </section>
        )}

        {data.experience?.some(e => e.company || e.jobTitle) && (
          <section className="mb-6">
            <h2 className={cn("text-xl font-bold border-b-2 pb-1 mb-2 font-serif", theme.primary)} style={{ borderColor: theme.primary.replace('text-', 'border-') }}>Experience</h2>
            {data.experience?.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-base">{exp.jobTitle || 'Job Title'}</h3>
                  <p className="text-xs text-gray-500">{exp.date}</p>
                </div>
                <p className="text-sm italic text-gray-600">{exp.company || 'Company'}</p>
                <div className="text-gray-700 mt-1 text-xs prose prose-sm max-w-none">
                  {renderTextWithBreaks(exp.description)}
                </div>
              </div>
            ))}
          </section>
        )}
        
        {data.projects?.some(p => p.name) && (
          <section className="mb-6">
            <h2 className={cn("text-xl font-bold border-b-2 pb-1 mb-2 font-serif", theme.primary)} style={{ borderColor: theme.primary.replace('text-', 'border-') }}>Projects</h2>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-base">{project.name || 'Project Name'}</h3>
                  {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className={cn("text-xs text-gray-500 hover:underline", theme.primary)}>{project.url}</a>}
                </div>
                <div className="text-gray-700 text-xs prose prose-sm max-w-none">{renderTextWithBreaks(project.description)}</div>
              </div>
            ))}
          </section>
        )}

        {data.education?.some(e => e.school || e.degree) && (
          <section className="mb-6">
            <h2 className={cn("text-xl font-bold border-b-2 pb-1 mb-2 font-serif", theme.primary)} style={{ borderColor: theme.primary.replace('text-', 'border-') }}>Education</h2>
            {data.education?.map((edu, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-base">{edu.school || 'School'}</h3>
                  <p className="text-xs text-gray-500">{edu.date}</p>
                </div>
                <p className="text-sm italic text-gray-600">{edu.degree || 'Degree'}</p>
              </div>
            ))}
          </section>
        )}

        {data.skills?.some(s => s.name) && (
          <section>
            <h2 className={cn("text-xl font-bold border-b-2 pb-1 mb-2 font-serif", theme.primary)} style={{ borderColor: theme.primary.replace('text-', 'border-') }}>Skills</h2>
            <p className="text-gray-700">
              {data.skills?.map(skill => skill.name).filter(Boolean).join(' • ')}
            </p>
          </section>
        )}
      </main>
    </div>
  );
};
