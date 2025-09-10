
"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FileText,
  Wand2,
  Lightbulb,
  Book,
  Award,
  Languages,
  ArrowRight,
  ChevronLeft,
  Image as ImageIcon,
  Palette,
  FileDown,
} from 'lucide-react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import { buildResume } from '@/ai/flows/ai-resume-builder-flow';
import type { ResumeData, ResumeOutput } from '@/lib/schema/resume-schema';
import { resumeFormSchema } from '@/lib/schema/resume-schema';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DefaultTemplate } from './templates/default-template';
import { MinimalistTemplate } from './templates/minimalist-template';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const steps = [
  { id: 'personal', name: 'Personal', icon: User, fields: ['fullName', 'email', 'phone', 'address', 'linkedin', 'portfolio', 'profilePicture'] },
  { id: 'summary', name: 'Summary', icon: FileText, fields: ['summary'] },
  { id: 'experience', name: 'Experience', icon: Briefcase, fields: ['experience'] },
  { id: 'education', name: 'Education', icon: GraduationCap, fields: ['education'] },
  { id: 'skills', name: 'Skills', icon: Wrench, fields: ['skills'] },
  { id: 'optional', name: 'Optional', icon: Plus, fields: ['projects', 'certifications', 'languages'] },
];

const templates = [
    { id: 'default', name: 'Default', component: DefaultTemplate },
    { id: 'minimalist', name: 'Minimalist', component: MinimalistTemplate },
];

const colorThemes = {
    default: { primary: '#0057e7', secondary: '#f4f4f4', text: '#333333' },
    charcoal: { primary: '#333333', secondary: '#f0f0f0', text: '#1a1a1a' },
    navy: { primary: '#0d3b66', secondary: '#f0f5f9', text: '#2a2a2a' },
    forest: { primary: '#1a472a', secondary: '#f2f7f2', text: '#222222' },
};

export function ResumeBuilderForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeOutput | null>(null);

  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: '', email: '', phone: '', address: '', linkedin: '', portfolio: '', summary: '',
      profilePicture: null,
      experience: [{ jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] }],
      education: [{ degree: '', school: '', location: '', gradDate: '' }],
      skills: [''],
      projects: [], certifications: [], languages: [],
    },
  });

  const { handleSubmit, trigger } = methods;

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as any, { shouldFocus: true });
    if (!output) return;
    if (currentStep < steps.length - 1) {
       setCurrentStep(currentStep + 1);
    } else {
       await handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  
  const onSubmit = async (data: ResumeData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await buildResume(data);
      setResult(response);
    } catch (error: any) {
       console.error("Error building resume:", error);
       // Add toast notification for the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">AI Resume Builder</CardTitle>
            <CardDescription>Create a professional resume in minutes with AI assistance.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Stepper */}
            <div className="flex justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-col gap-2 w-full relative">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300', currentStep === index ? 'bg-primary border-primary text-primary-foreground scale-110' : currentStep > index ? 'bg-green-500 border-green-500 text-white' : 'bg-secondary')}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <p className={cn('text-xs md:text-sm font-medium', currentStep === index && 'text-primary')}>{step.name}</p>
                  {index < steps.length - 1 && <div className="absolute top-5 left-1/2 w-full h-0.5 bg-border -z-10" />}
                </div>
              ))}
            </div>

            <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}>
                  {currentStep === 0 && <PersonalDetailsForm />}
                  {currentStep === 1 && <SummaryForm />}
                  {currentStep === 2 && <ExperienceForm />}
                  {currentStep === 3 && <EducationForm />}
                  {currentStep === 4 && <SkillsForm />}
                  {currentStep === 5 && <OptionalSectionsForm />}
                </motion.div>
              </AnimatePresence>
            </form>

            <div className="mt-8 pt-5 border-t">
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}><ChevronLeft /> Back</Button>
                <Button type="button" onClick={nextStep} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : (currentStep === steps.length - 1 ? 'Generate with AI' : 'Next Step')} 
                    { !isLoading && currentStep < steps.length - 1 && <ArrowRight />}
                </Button>
              </div>
            </div>
             {result && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb /> AI Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 list-disc pl-5 text-sm">
                            {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                         <Button onClick={() => handleSubmit(onSubmit)()} disabled={isLoading} className="mt-4">
                            {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} Regenerate
                        </Button>
                    </CardContent>
                </Card>
            )}
          </CardContent>
        </Card>
        
        {/* Live Preview */}
        <ResumePreview />

      </div>
    </FormProvider>
  );
}

const ResumePreview = () => {
    const [isClient, setIsClient] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [selectedColor, setSelectedColor] = useState('default');
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const { control } = useFormContext<ResumeData>();
    const formData = useWatch({ control });
    
    const isFormDataReady =
      formData &&
      formData.experience &&
      formData.experience.length > 0 &&
      formData.education &&
      formData.education.length > 0;

    const ResumeTemplate = selectedTemplate.component;
    const colorTheme = colorThemes[selectedColor as keyof typeof colorThemes];

    return (
        <Card className="shadow-lg h-[80vh] flex flex-col">
            <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <div className="flex flex-wrap gap-4 pt-2">
                    <Select value={selectedTemplate.id} onValueChange={id => setSelectedTemplate(templates.find(t => t.id === id) || templates[0])}>
                        <SelectTrigger className="w-full md:w-auto"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={selectedColor} onValueChange={setSelectedColor}>
                        <SelectTrigger className="w-full md:w-auto"><Palette/> Color</SelectTrigger>
                        <SelectContent>
                            {Object.keys(colorThemes).map(key => <SelectItem key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {isClient && isFormDataReady && (
                        <PDFDownloadLink
                            document={<ResumeTemplate data={formData} theme={colorTheme} />}
                            fileName="resume.pdf"
                        >
                            {({ loading }) => (
                                <Button disabled={loading} className="w-full md:w-auto">
                                    {loading ? <Loader2 className="animate-spin"/> : <FileDown />} Download PDF
                                </Button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
             {isClient && isFormDataReady ? (
                <PDFViewer width="100%" height="100%" showToolbar={false}>
                  <ResumeTemplate data={formData} theme={colorTheme} />
                </PDFViewer>
              ) : (
                <div className="h-full flex items-center justify-center bg-secondary rounded-md">
                    <p className="text-muted-foreground text-center p-4">Fill out the form to see your resume preview.</p>
                </div>
              )}
            </CardContent>
        </Card>
    );
};

// Sub-components for each step
const PersonalDetailsForm = () => {
    const { register, formState: { errors }, setValue, watch } = useFormContext<ResumeData>();
    const profilePicture = watch('profilePicture');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue('profilePicture', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <ScrollArea className="h-[50vh] pr-4">
        <div className="space-y-4">
            <div className="col-span-2 flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border">
                    {profilePicture ? <img src={profilePicture} alt="Profile" className="w-full h-full object-cover"/> : <ImageIcon className="text-muted-foreground w-10 h-10" />}
                </div>
                <div>
                    <Label htmlFor="profile-picture">Profile Picture</Label>
                    <Input id="profile-picture" type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
            </div>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input {...register('fullName')} /><p className="text-destructive text-xs">{errors.fullName?.message}</p></div>
                <div className="space-y-2"><Label>Email</Label><Input {...register('email')} /><p className="text-destructive text-xs">{errors.email?.message}</p></div>
                <div className="space-y-2"><Label>Phone</Label><Input {...register('phone')} /><p className="text-destructive text-xs">{errors.phone?.message}</p></div>
                <div className="space-y-2"><Label>Address</Label><Input {...register('address')} /><p className="text-destructive text-xs">{errors.address?.message}</p></div>
                <div className="space-y-2"><Label>LinkedIn Profile URL</Label><Input {...register('linkedin')} /><p className="text-destructive text-xs">{errors.linkedin?.message}</p></div>
                <div className="space-y-2"><Label>Portfolio/Website URL</Label><Input {...register('portfolio')} /><p className="text-destructive text-xs">{errors.portfolio?.message}</p></div>
            </div>
        </div>
        </ScrollArea>
    );
};

const SummaryForm = () => {
    const { register, formState: { errors } } = useFormContext<ResumeData>();
    return (
        <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-2">
                <Label>Professional Summary</Label>
                <Textarea {...register('summary')} rows={12} placeholder="Write a brief summary about your professional background and career goals." />
                <p className="text-destructive text-xs">{errors.summary?.message}</p>
            </div>
        </ScrollArea>
    );
}

const ExperienceForm = () => {
    const { control, register, formState: { errors } } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'experience' });

    return (
        <ScrollArea className="h-[50vh] pr-4">
        <div className="space-y-6">
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-secondary/30">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Job Title</Label><Input {...register(`experience.${index}.jobTitle`)} /><p className="text-destructive text-xs">{errors.experience?.[index]?.jobTitle?.message}</p></div>
                        <div className="space-y-2"><Label>Company</Label><Input {...register(`experience.${index}.company`)} /><p className="text-destructive text-xs">{errors.experience?.[index]?.company?.message}</p></div>
                        <div className="space-y-2"><Label>Location</Label><Input {...register(`experience.${index}.location`)} /><p className="text-destructive text-xs">{errors.experience?.[index]?.location?.message}</p></div>
                        <div className="space-y-2"><Label>Start & End Date</Label>
                            <div className="flex gap-2"><Input placeholder="e.g. Jan 2020" {...register(`experience.${index}.startDate`)} /><Input placeholder="e.g. Present" {...register(`experience.${index}.endDate`)} /></div>
                            <p className="text-destructive text-xs">{errors.experience?.[index]?.startDate?.message || errors.experience?.[index]?.endDate?.message}</p>
                        </div>
                    </div>
                     <ResponsibilitiesArray index={index} />
                    {fields.length > 1 && <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>}
                </div>
            ))}
             <Button type="button" variant="outline" onClick={() => append({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] })}><Plus /> Add Experience</Button>
        </div>
        </ScrollArea>
    );
};

const ResponsibilitiesArray = ({ index }: { index: number }) => {
    const { control, register, formState: { errors } } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: `experience.${index}.responsibilities` });
    
    return (
        <div className="space-y-2">
            <Label>Key Responsibilities</Label>
            {fields.map((field, rIndex) => (
                 <div key={field.id} className="flex gap-2 items-center">
                    <Input {...register(`experience.${index}.responsibilities.${rIndex}`)} placeholder="e.g., Managed a team of 5 engineers" />
                    {fields.length > 1 && <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => remove(rIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                </div>
            ))}
            <p className="text-destructive text-xs">{errors.experience?.[index]?.responsibilities?.message}</p>
            <Button type="button" size="sm" variant="outline" onClick={() => append('')}><Plus /> Add Responsibility</Button>
        </div>
    )
}

const EducationForm = () => {
    const { control, register, formState: { errors } } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'education' });
    return (
         <ScrollArea className="h-[50vh] pr-4">
        <div className="space-y-6">
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-secondary/30">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Degree/Certificate</Label><Input {...register(`education.${index}.degree`)} /><p className="text-destructive text-xs">{errors.education?.[index]?.degree?.message}</p></div>
                        <div className="space-y-2"><Label>School/University</Label><Input {...register(`education.${index}.school`)} /><p className="text-destructive text-xs">{errors.education?.[index]?.school?.message}</p></div>
                        <div className="space-y-2"><Label>Location</Label><Input {...register(`education.${index}.location`)} /><p className="text-destructive text-xs">{errors.education?.[index]?.location?.message}</p></div>
                        <div className="space-y-2"><Label>Graduation Date</Label><Input {...register(`education.${index}.gradDate`)} /><p className="text-destructive text-xs">{errors.education?.[index]?.gradDate?.message}</p></div>
                    </div>
                     {fields.length > 1 && <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>}
                </div>
            ))}
             <Button type="button" variant="outline" onClick={() => append({ degree: '', school: '', location: '', gradDate: '' })}><Plus /> Add Education</Button>
        </div>
        </ScrollArea>
    );
};

const SkillsForm = () => {
    const { control, register, formState: { errors } } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'skills' });
    return (
        <ScrollArea className="h-[50vh] pr-4">
        <div className="space-y-4">
            <Label>Skills</Label>
             <p className="text-sm text-muted-foreground">List your top technical and soft skills. Add each skill individually.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <Input {...register(`skills.${index}`)} placeholder="e.g., JavaScript" />
                         <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                ))}
            </div>
             <p className="text-destructive text-xs">{errors.skills?.message}</p>
             <Button type="button" variant="outline" onClick={() => append('')}><Plus /> Add Skill</Button>
        </div>
        </ScrollArea>
    );
};


const OptionalSectionsForm = () => {
    return (
      <ScrollArea className="h-[50vh] pr-4">
      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Book/> Projects</h3>
          <ProjectsForm />
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Award/> Certifications</h3>
          <CertificationsForm />
        </section>
         <section>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Languages/> Languages</h3>
          <LanguagesForm />
        </section>
      </div>
      </ScrollArea>
    );
  };
  
  const ProjectsForm = () => {
    const { control, register } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'projects' });
    return (
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-2 relative bg-secondary/30">
            <Input {...register(`projects.${index}.name`)} placeholder="Project Name" />
            <Textarea {...register(`projects.${index}.description`)} placeholder="Project description and your role..." />
            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => append({ name: '', description: '' })}><Plus /> Add Project</Button>
      </div>
    );
  };
  
  const CertificationsForm = () => {
    const { control, register } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'certifications' });
    return (
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input {...register(`certifications.${index}`)} placeholder="e.g., Google Certified Cloud Architect" />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => append('')}><Plus /> Add Certification</Button>
      </div>
    );
  };
  
  const LanguagesForm = () => {
    const { control, register } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'languages' });
    return (
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input {...register(`languages.${index}`)} placeholder="e.g., Spanish (Fluent)" />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => append('')}><Plus /> Add Language</Button>
      </div>
    );
  };

    