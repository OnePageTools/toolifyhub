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
  ArrowRight,
  Book,
  Award,
  Languages,
  Download,
  Palette,
  Eye,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { buildResume } from '@/ai/flows/ai-resume-builder-flow';
import type { ResumeData } from '@/lib/schema/resume-schema';
import { resumeFormSchema } from '@/lib/schema/resume-schema';
import { cn } from '@/lib/utils';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { DefaultTemplate } from './templates/default-template';
import { MinimalistTemplate } from './templates/minimalist-template';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const steps = [
  { id: 'personal', name: 'Personal', icon: User, fields: ['fullName', 'email', 'phone', 'address', 'linkedin', 'portfolio', 'profilePicture'] },
  { id: 'summary', name: 'Summary', icon: FileText, fields: ['summary'] },
  { id: 'experience', name: 'Experience', icon: Briefcase, fields: ['experience'] },
  { id: 'education', name: 'Education', icon: GraduationCap, fields: ['education'] },
  { id: 'skills', name: 'Skills', icon: Wrench, fields: ['skills'] },
  { id: 'optional', name: 'Optional', icon: Plus, fields: ['projects', 'certifications', 'languages'] },
  { id: 'review', name: 'Review', icon: Eye, fields: [] },
];

type TemplateName = 'default' | 'minimalist';
type ColorTheme = {
  primary: string;
  secondary: string;
  text: string;
};

const colorThemes: Record<string, ColorTheme> = {
  'Blue/White': { primary: '#2563eb', secondary: '#f1f5f9', text: '#1e293b' },
  'Black/Gold': { primary: '#ca8a04', secondary: '#fefce8', text: '#1c1917' },
  'Grey/Teal': { primary: '#0d9488', secondary: '#f0fdfa', text: '#1f2937' },
};


export function ResumeBuilderForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [template, setTemplate] = useState<TemplateName>('default');
  const [colorTheme, setColorTheme] = useState<ColorTheme>(colorThemes['Blue/White']);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: '',
      summary: '',
      profilePicture: null,
      experience: [{ jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] }],
      education: [{ degree: '', school: '', location: '', gradDate: '' }],
      skills: [''],
      projects: [],
      certifications: [],
      languages: [],
    },
  });

  const { control, handleSubmit, trigger, getValues } = methods;
  const formData = useWatch({ control });

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as any, { shouldFocus: true });
    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEnhanceWithAI = async () => {
    setIsLoadingAI(true);
    try {
      const response = await buildResume(getValues());
      methods.setValue('summary', response.resumeMarkdown);
      toast({ title: "AI Enhancement Successful", description: "Your summary has been enhanced by AI." });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'AI Enhancement Failed', description: error.message });
    } finally {
      setIsLoadingAI(false);
    }
  };
  
  const ResumeTemplate = template === 'default' ? DefaultTemplate : MinimalistTemplate;


  return (
    <FormProvider {...methods}>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">AI Resume Builder</CardTitle>
            <CardDescription>Follow the steps to create a professional resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Stepper */}
              <div className="flex justify-between overflow-x-auto pb-2">
                {steps.map((step, index) => (
                  <button key={step.id} onClick={() => setCurrentStep(index)} disabled={index > currentStep} className="flex items-center flex-col gap-2 w-full relative group">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                         currentStep === index ? 'bg-primary border-primary text-primary-foreground scale-110' :
                         currentStep > index ? 'bg-green-500 border-green-500 text-white' : 'bg-secondary group-hover:bg-secondary/80'
                      )}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <p className={cn('text-xs sm:text-sm font-medium whitespace-nowrap', currentStep === index && 'text-primary')}>{step.name}</p>
                    {index < steps.length - 1 && <div className="absolute top-5 left-1/2 w-full h-0.5 bg-border -z-10" />}
                  </button>
                ))}
              </div>

              <form className="mt-8" onSubmit={handleSubmit(() => {})}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep === 0 && <PersonalDetailsForm />}
                    {currentStep === 1 && <SummaryForm onEnhance={handleEnhanceWithAI} isLoading={isLoadingAI} />}
                    {currentStep === 2 && <ExperienceForm />}
                    {currentStep === 3 && <EducationForm />}
                    {currentStep === 4 && <SkillsForm />}
                    {currentStep === 5 && <OptionalSectionsForm />}
                    {currentStep === 6 && <ReviewAndExportTemplate />}
                  </motion.div>
                </AnimatePresence>
              </form>

              {/* Navigation */}
              <div className="mt-8 pt-5 border-t">
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                    Back
                  </Button>
                  {currentStep < steps.length - 1 && (
                    <Button type="button" onClick={nextStep}>
                      Next Step <ArrowRight />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Live Preview */}
        <div className="hidden lg:block sticky top-10 h-[90vh]">
          <Card className="h-full shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Live Preview</CardTitle>
              <div className="flex gap-2 items-center">
                  <Select value={template} onValueChange={(v: TemplateName) => setTemplate(v)}>
                      <SelectTrigger className="w-[140px]"><SelectValue/></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                      </SelectContent>
                  </Select>
                   <Select onValueChange={(key) => setColorTheme(colorThemes[key])}>
                      <SelectTrigger className="w-[140px]"><SelectValue placeholder="Theme" /></SelectTrigger>
                      <SelectContent>
                          {Object.keys(colorThemes).map(themeName => (
                              <SelectItem key={themeName} value={themeName}>{themeName}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
             {isClient ? (
                <PDFViewer width="100%" height="100%" showToolbar={false}>
                  <ResumeTemplate data={formData} theme={colorTheme} />
                </PDFViewer>
              ) : (
                <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </FormProvider>
  );
}


// Sub-components for each step
const PersonalDetailsForm = () => {
    const { register, formState: { errors }, setValue, watch } = useFormContext<ResumeData>();
    const profilePicture = watch('profilePicture');
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue('profilePicture', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }
    return (
        <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {profilePicture ? <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-muted-foreground" />}
                </div>
                <div>
                    <Label htmlFor="profile-picture-upload">Profile Picture</Label>
                    <Input id="profile-picture-upload" type="file" accept="image/*" onChange={handleFileChange} className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Optional. A professional headshot is recommended.</p>
                </div>
             </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input {...register('fullName')} /><p className="text-destructive text-xs">{errors.fullName?.message}</p></div>
                <div><Label>Email</Label><Input {...register('email')} /><p className="text-destructive text-xs">{errors.email?.message}</p></div>
                <div><Label>Phone</Label><Input {...register('phone')} /><p className="text-destructive text-xs">{errors.phone?.message}</p></div>
                <div><Label>Address</Label><Input {...register('address')} /><p className="text-destructive text-xs">{errors.address?.message}</p></div>
                <div><Label>LinkedIn Profile URL</Label><Input {...register('linkedin')} /><p className="text-destructive text-xs">{errors.linkedin?.message}</p></div>
                <div><Label>Portfolio/Website URL</Label><Input {...register('portfolio')} /><p className="text-destructive text-xs">{errors.portfolio?.message}</p></div>
            </div>
        </div>
    );
};

const SummaryForm = ({ onEnhance, isLoading }: { onEnhance: () => void, isLoading: boolean }) => {
    const { register, formState: { errors } } = useFormContext<ResumeData>();
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Professional Summary</Label>
               <Button type="button" size="sm" variant="outline" onClick={onEnhance} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2/>} Enhance with AI
               </Button>
            </div>
            <Textarea {...register('summary')} rows={8} placeholder="Write a brief summary about your professional background and career goals. Or, write a draft and let AI enhance it!" />
            <p className="text-destructive text-xs">{errors.summary?.message}</p>
        </div>
    );
}

const ExperienceForm = () => {
    const { control, register, formState: { errors } } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'experience' });

    return (
        <div className="space-y-6">
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-secondary/30">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label>Job Title</Label><Input {...register(`experience.${index}.jobTitle`)} /><p className="text-destructive text-xs">{errors.experience?.[index]?.jobTitle?.message}</p></div>
                        <div><Label>Company</Label><Input {...register(`experience.${index}.company`)} /><p className="text-destructive text-xs">{errors.experience?.[index]?.company?.message}</p></div>
                        <div><Label>Location</Label><Input {...register(`experience.${index}.location`)} /><p className="text-destructive text-xs">{errors.experience?.[index]?.location?.message}</p></div>
                        <div><Label>Start & End Date</Label>
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
    );
};

const ResponsibilitiesArray = ({ index }: { index: number }) => {
    const { control, register, formState: { errors } } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: `experience.${index}.responsibilities` });
    
    return (
        <div className="space-y-2">
            <Label>Key Responsibilities & Achievements</Label>
            {fields.map((field, rIndex) => (
                 <div key={field.id} className="flex gap-2 items-center">
                    <Input {...register(`experience.${index}.responsibilities.${rIndex}`)} placeholder="e.g., Increased sales by 20% in Q3" />
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
        <div className="space-y-6">
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-secondary/30">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label>Degree/Certificate</Label><Input {...register(`education.${index}.degree`)} /><p className="text-destructive text-xs">{errors.education?.[index]?.degree?.message}</p></div>
                        <div><Label>School/University</Label><Input {...register(`education.${index}.school`)} /><p className="text-destructive text-xs">{errors.education?.[index]?.school?.message}</p></div>
                        <div><Label>Location</Label><Input {...register(`education.${index}.location`)} /><p className="text-destructive text-xs">{errors.education?.[index]?.location?.message}</p></div>
                        <div><Label>Graduation Date</Label><Input {...register(`education.${index}.gradDate`)} /><p className="text-destructive text-xs">{errors.education?.[index]?.gradDate?.message}</p></div>
                    </div>
                     {fields.length > 1 && <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>}
                </div>
            ))}
             <Button type="button" variant="outline" onClick={() => append({ degree: '', school: '', location: '', gradDate: '' })}><Plus /> Add Education</Button>
        </div>
    );
};

const SkillsForm = () => {
    const { control, register, formState: { errors } } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'skills' });
    return (
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
    );
};


const OptionalSectionsForm = () => {
    return (
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

  const ReviewAndExportTemplate = () => {
    const { getValues } = useFormContext<ResumeData>();
    const [isClient, setIsClient] = useState(false);
    const [template, setTemplate] = useState<TemplateName>('default');
    const [colorTheme, setColorTheme] = useState<ColorTheme>(colorThemes['Blue/White']);
  
    useEffect(() => setIsClient(true), []);

    const ResumeTemplate = template === 'default' ? DefaultTemplate : MinimalistTemplate;
  
    return (
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Your Resume is Ready!</h3>
        <p className="text-muted-foreground">Download your professionally crafted resume below.</p>
        
        {isClient ? (
          <PDFDownloadLink
            document={<ResumeTemplate data={getValues()} theme={colorTheme} />}
            fileName="resume.pdf"
          >
            {({ loading }) => (
              <Button size="lg" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Download />} Download PDF
              </Button>
            )}
          </PDFDownloadLink>
        ) : (
          <Button size="lg" disabled>
            <Loader2 className="animate-spin" /> Loading...
          </Button>
        )}
      </div>
    );
  };
