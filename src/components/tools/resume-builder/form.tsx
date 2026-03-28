
"use client";

import { useForm, useFieldArray, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeFormSchema, type ResumeData } from '@/lib/schema/resume-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, Plus, Printer, Palette, CaseSensitive, User } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { templates, type TemplateKey, type TemplateProps } from './templates';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Theme definitions
const colorThemes = {
    sky: { primary: 'text-sky-600', background: '#f0f9ff', text: '#0c4a6e' },
    slate: { primary: 'text-slate-800', background: '#f1f5f9', text: '#334155' },
    rose: { primary: 'text-rose-600', background: '#fff1f2', text: '#881337' },
    emerald: { primary: 'text-emerald-700', background: '#ecfdf5', text: '#064e3b' },
};
type ColorThemeKey = keyof typeof colorThemes;

// The main component that orchestrates the form and preview
export function ResumeBuilderForm() {
  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      photo: '',
      fullName: 'Your Name',
      jobTitle: 'Your Job Title',
      email: 'youremail@example.com',
      phone: '(123) 456-7890',
      location: 'Your City, Your State',
      portfolio: 'your-portfolio.com',
      linkedin: 'linkedin.com/in/yourprofile',
      summary: 'A brief professional summary highlighting your key skills, experiences, and career ambitions. Tailor this to the job you are applying for.',
      experience: [{ company: 'Awesome Company', jobTitle: 'Software Engineer', date: 'Jan 2020 - Present', description: '- Developed cool things.\n- Collaborated with great people.' }],
      projects: [{ name: 'My Side Project', description: '- Built an amazing app that does X, Y, and Z.', url: 'github.com/my-project'}],
      education: [{ school: 'University of Knowledge', degree: 'B.S. in Computer Science', date: 'Graduated May 2020' }],
      skills: [{ name: 'React' }, { name: 'Node.js' }, { name: 'Problem Solving' }],
    },
  });
  
  const [template, setTemplate] = useState<TemplateKey>('modern');
  const [colorTheme, setColorTheme] = useState<ColorThemeKey>('sky');

  const handlePrint = () => {
    window.print();
  };
  
  const data = methods.watch();

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
              <Accordion type="multiple" defaultValue={['style', 'personal-info']} className="w-full">
                <AccordionItem value="style">
                  <AccordionTrigger>Style & Template</AccordionTrigger>
                  <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 p-1">
                          <div className="space-y-1">
                              <Label className="flex items-center gap-2"><CaseSensitive/> Template</Label>
                              <Select value={template} onValueChange={(v: TemplateKey) => setTemplate(v)}>
                                  <SelectTrigger><SelectValue/></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="modern">Modern</SelectItem>
                                      <SelectItem value="classic">Classic</SelectItem>
                                      <SelectItem value="minimal">Minimal</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                           <div className="space-y-1">
                              <Label className="flex items-center gap-2"><Palette/> Color Theme</Label>
                              <Select value={colorTheme} onValueChange={(v: ColorThemeKey) => setColorTheme(v)}>
                                  <SelectTrigger><SelectValue/></SelectTrigger>
                                  <SelectContent>
                                      {Object.entries(colorThemes).map(([key, theme]) => (
                                          <SelectItem key={key} value={key}>
                                              <div className="flex items-center gap-2">
                                                  <div className={cn("w-4 h-4 rounded-full", theme.primary.replace('text-', 'bg-'))} />
                                                  <span className="capitalize">{key}</span>
                                              </div>
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                  </AccordionContent>
                </AccordionItem>
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
                 <AccordionItem value="projects">
                  <AccordionTrigger>Projects</AccordionTrigger>
                  <AccordionContent><ProjectsForm /></AccordionContent>
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
               <Button onClick={handlePrint} size="lg" className="w-full mt-2">
                <Printer className="mr-2" /> Download as PDF
              </Button>
            </CardHeader>
            <CardContent className="h-[75vh] overflow-y-auto bg-secondary/50 p-2 print:h-auto print:overflow-visible">
                <ResumePreview data={data} template={template} theme={colorThemes[colorTheme]} />
            </CardContent>
          </Card>
        </div>
      </div>
      {/* This div is only for printing */}
      <div className="hidden print-container">
         <ResumePreview data={data} template={template} theme={colorThemes[colorTheme]} />
      </div>
    </FormProvider>
  );
}

// Sub-components for form sections
const PersonalForm = () => {
  const { register, formState: { errors }, setValue, watch } = useFormContext<ResumeData>();
  const photoUrl = watch('photo');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('File size must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('photo', reader.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
       <div className="md:col-span-2 space-y-2">
        <Label>Profile Photo</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={photoUrl || undefined} alt="Profile Photo" />
            <AvatarFallback>
              <User className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline" size="sm">
              <label htmlFor="photo-upload" className="cursor-pointer">Upload Photo</label>
            </Button>
            <Input id="photo-upload" type="file" accept="image/png, image/jpeg, image/webp" onChange={handlePhotoUpload} className="hidden" />
            {photoUrl && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setValue('photo', '', { shouldDirty: true })} className="text-destructive hover:text-destructive flex items-center justify-start">
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            )}
             <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 2MB.</p>
          </div>
        </div>
      </div>
      <div className="space-y-1"><Label>Full Name*</Label><Input {...register('fullName')} /><p className="text-destructive text-xs">{errors.fullName?.message}</p></div>
      <div className="space-y-1"><Label>Job Title</Label><Input {...register('jobTitle')} placeholder="e.g. Senior Software Engineer"/></div>
      <div className="space-y-1"><Label>Email*</Label><Input {...register('email')} type="email" /><p className="text-destructive text-xs">{errors.email?.message}</p></div>
      <div className="space-y-1"><Label>Phone</Label><Input {...register('phone')} /></div>
      <div className="space-y-1"><Label>Location</Label><Input {...register('location')} placeholder="e.g. San Francisco, CA"/></div>
      <div className="space-y-1"><Label>Portfolio URL</Label><Input {...register('portfolio')} placeholder="your-portfolio.com" /></div>
      <div className="col-span-1 md:col-span-2 space-y-1"><Label>LinkedIn Profile</Label><Input {...register('linkedin')} placeholder="linkedin.com/in/yourprofile" /></div>
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

const ProjectsForm = () => {
  const { control, register } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'projects' });
  return (
    <div className="space-y-4 p-1">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-lg space-y-3 relative bg-background">
          <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          <div className="space-y-1"><Label>Project Name</Label><Input {...register(`projects.${index}.name`)} placeholder="e.g., My Awesome App" /></div>
          <div className="space-y-1"><Label>Project URL (Optional)</Label><Input {...register(`projects.${index}.url`)} placeholder="e.g., github.com/user/repo" /></div>
          <div className="space-y-1"><Label>Description</Label><Textarea {...register(`projects.${index}.description`)} placeholder="Describe your project. Use hyphens for bullet points." rows={3} /></div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => append({ name: '', description: '', url: '' })}><Plus className="mr-2" /> Add Project</Button>
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
interface ResumePreviewProps extends TemplateProps {
    template: TemplateKey;
}

const ResumePreview = ({ data, template, theme }: ResumePreviewProps) => {
    const TemplateComponent = templates[template] || templates.modern;
    // Deep clone and sanitize data before passing to template
    const sanitizedData = JSON.parse(JSON.stringify(data || {}));
    
    // Ensure all array fields are present
    const arrayFields: (keyof ResumeData)[] = ['experience', 'education', 'skills', 'projects'];
    arrayFields.forEach(field => {
        if (!Array.isArray(sanitizedData[field])) {
            sanitizedData[field] = [];
        }
    });

    return (
        <div className="bg-white shadow-lg aspect-[8.5/11] w-full h-full transform origin-top scale-[0.9] lg:scale-100 print:shadow-none print:transform-none print:scale-100">
            <TemplateComponent data={sanitizedData} theme={theme} />
        </div>
    );
};

    