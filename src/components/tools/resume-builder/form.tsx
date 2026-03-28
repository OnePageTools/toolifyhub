
"use client";

import { useForm, useFieldArray, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeFormSchema, type ResumeData } from '@/lib/schema/resume-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, Plus, Printer, Mail, Phone, Linkedin, Globe, MapPin } from 'lucide-react';

// The main component that orchestrates the form and preview
export function ResumeBuilderForm() {
  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: 'Your Name',
      jobTitle: 'Your Job Title',
      email: 'youremail@example.com',
      phone: '(123) 456-7890',
      location: 'Your City, Your State',
      portfolio: 'your-portfolio.com',
      linkedin: 'linkedin.com/in/yourprofile',
      summary: 'A brief professional summary highlighting your key skills, experiences, and career ambitions. Tailor this to the job you are applying for.',
      experience: [{ company: 'Awesome Company', jobTitle: 'Software Engineer', date: 'Jan 2020 - Present', description: '- Developed cool things.\n- Collaborated with great people.' }],
      education: [{ school: 'University of Knowledge', degree: 'B.S. in Computer Science', date: 'Graduated May 2020' }],
      skills: [{ name: 'React' }, { name: 'Node.js' }, { name: 'Problem Solving' }],
    },
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <FormProvider {...methods}>
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Form Section is hidden on print */}
        <div className="lg:col-span-1 print:hidden">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Resume Builder</CardTitle>
              <CardDescription>Fill out the sections below. The preview will update in real-time.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="personal-info" className="w-full">
                <AccordionItem value="personal-info">
                  <AccordionTrigger>Personal Information</AccordionTrigger>
                  <AccordionContent><PersonalForm /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="summary">
                  <AccordionTrigger>Professional Summary</AccordionTrigger>
                  <AccordionContent><SummaryForm /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="experience">
                  <AccordionTrigger>Experience</AccordionTrigger>
                  <AccordionContent><ExperienceForm /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="education">
                  <AccordionTrigger>Education</AccordionTrigger>
                  <AccordionContent><EducationForm /></AccordionContent>
                </AccordionItem>
                <AccordionItem value="skills">
                  <AccordionTrigger>Skills</AccordionTrigger>
                  <AccordionContent><SkillsForm /></AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Action and Preview Section */}
        <div className="sticky top-10 lg:col-span-1">
          <Card className="shadow-lg print:shadow-none">
            <CardHeader className="print:hidden">
              <CardTitle>Preview & Download</CardTitle>
               <Button onClick={handlePrint} className="w-full">
                <Printer className="mr-2" /> Download as PDF
              </Button>
            </CardHeader>
            <CardContent className="h-[75vh] overflow-y-auto bg-secondary/50 p-2 print:h-auto print:overflow-visible">
                <ResumePreview />
            </CardContent>
          </Card>
        </div>
      </div>
      {/* This div is only for printing */}
      <div className="hidden print-container">
        <ResumePreview />
      </div>
    </FormProvider>
  );
}

// Sub-components for form sections
const PersonalForm = () => {
  const { register, formState: { errors } } = useFormContext<ResumeData>();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
      <div className="space-y-1"><Label>Full Name*</Label><Input {...register('fullName')} /><p className="text-destructive text-xs">{errors.fullName?.message}</p></div>
      <div className="space-y-1"><Label>Job Title</Label><Input {...register('jobTitle')} placeholder="e.g. Senior Software Engineer"/></div>
      <div className="space-y-1"><Label>Email*</Label><Input {...register('email')} type="email" /><p className="text-destructive text-xs">{errors.email?.message}</p></div>
      <div className="space-y-1"><Label>Phone</Label><Input {...register('phone')} /></div>
      <div className="space-y-1"><Label>Location</Label><Input {...register('location')} placeholder="e.g. San Francisco, CA"/></div>
      <div className="space-y-1"><Label>Portfolio URL</Label><Input {...register('portfolio')} /></div>
      <div className="col-span-1 md:col-span-2 space-y-1"><Label>LinkedIn URL</Label><Input {...register('linkedin')} /></div>
    </div>
  );
};

const SummaryForm = () => {
    const { register } = useFormContext<ResumeData>();
    return (
        <div className="space-y-1 p-1">
            <Label>Summary</Label>
            <Textarea {...register('summary')} rows={5} placeholder="Write a couple of sentences about yourself." />
        </div>
    );
};

const ExperienceForm = () => {
  const { control, register } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'experience' });
  return (
    <div className="space-y-4 p-1">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-lg space-y-3 relative bg-background">
          <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Job Title</Label><Input {...register(`experience.${index}.jobTitle`)} placeholder="Software Engineer" /></div>
            <div className="space-y-1"><Label>Company</Label><Input {...register(`experience.${index}.company`)} placeholder="Tech Corp" /></div>
          </div>
          <div className="space-y-1"><Label>Date</Label><Input {...register(`experience.${index}.date`)} placeholder="e.g. Jan 2020 - Present" /></div>
          <div className="space-y-1"><Label>Description</Label><Textarea {...register(`experience.${index}.description`)} placeholder="Describe your role and achievements. Use hyphens for bullet points." rows={3} /></div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => append({ company: '', jobTitle: '', date: '', description: '' })}><Plus className="mr-2" /> Add Experience</Button>
    </div>
  );
};

const EducationForm = () => {
  const { control, register } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'education' });
  return (
    <div className="space-y-4 p-1">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-lg space-y-3 relative bg-background">
          <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><Label>School</Label><Input {...register(`education.${index}.school`)} placeholder="State University" /></div>
            <div className="space-y-1"><Label>Degree</Label><Input {...register(`education.${index}.degree`)} placeholder="B.S. in Computer Science" /></div>
          </div>
          <div className="space-y-1"><Label>Date</Label><Input {...register(`education.${index}.date`)} placeholder="e.g. Graduated May 2020" /></div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => append({ school: '', degree: '', date: '' })}><Plus className="mr-2" /> Add Education</Button>
    </div>
  );
};

const SkillsForm = () => {
  const { control, register } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });
  return (
    <div className="space-y-4 p-1">
      <Label>Skills</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-1">
            <Input {...register(`skills.${index}.name`)} placeholder="e.g., React" />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={() => append({ name: '' })}><Plus className="mr-2" /> Add Skill</Button>
    </div>
  );
};


// The real-time preview component
const ResumePreview = () => {
    const { watch } = useFormContext<ResumeData>();
    const data = watch();

    const renderTextWithBreaks = (text?: string) => {
        return text?.split('\n').map((line, index) => (
            <p key={index} className="mb-1">{line}</p>
        ));
    };

    return (
        <div className="bg-white text-black shadow-lg aspect-[8.5/11] p-8 w-full h-full transform origin-top print:shadow-none print:transform-none">
            <header className="text-center mb-6">
                {data.fullName && <h1 className="text-4xl font-bold tracking-tight text-primary">{data.fullName}</h1>}
                {data.jobTitle && <p className="text-xl text-gray-600">{data.jobTitle}</p>}
                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    {data.email && <div className="flex items-center gap-1"><Mail size={12}/> {data.email}</div>}
                    {data.phone && <div className="flex items-center gap-1"><Phone size={12}/> {data.phone}</div>}
                    {data.location && <div className="flex items-center gap-1"><MapPin size={12}/> {data.location}</div>}
                    {data.portfolio && <div className="flex items-center gap-1"><Globe size={12}/> {data.portfolio}</div>}
                    {data.linkedin && <div className="flex items-center gap-1"><Linkedin size={12}/> {data.linkedin}</div>}
                </div>
            </header>
            
            <main className="text-sm">
                {data.summary && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-primary border-b-2 border-primary pb-1 mb-2">Summary</h2>
                        <p className="text-gray-700">{data.summary}</p>
                    </section>
                )}

                {data.skills?.some(s => s.name) && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-primary border-b-2 border-primary pb-1 mb-2">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills?.map((skill, index) => skill.name && <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">{skill.name}</span>)}
                        </div>
                    </section>
                )}

                {data.experience?.some(e => e.company || e.jobTitle) && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-primary border-b-2 border-primary pb-1 mb-2">Experience</h2>
                        {data.experience?.map((exp, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold">{exp.jobTitle || 'Job Title'}</h3>
                                    <p className="text-xs text-gray-500">{exp.date}</p>
                                </div>
                                <p className="text-sm italic">{exp.company || 'Company'}</p>
                                <div className="text-gray-700 mt-1 text-xs prose prose-sm max-w-none">
                                    {renderTextWithBreaks(exp.description)}
                                </div>
                            </div>
                        ))}
                    </section>
                )}
                
                {data.education?.some(e => e.school || e.degree) && (
                     <section>
                        <h2 className="text-lg font-bold text-primary border-b-2 border-primary pb-1 mb-2">Education</h2>
                         {data.education?.map((edu, index) => (
                            <div key={index} className="mb-2">
                                 <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold">{edu.school || 'School'}</h3>
                                    <p className="text-xs text-gray-500">{edu.date}</p>
                                </div>
                                <p className="text-sm italic">{edu.degree || 'Degree'}</p>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};
