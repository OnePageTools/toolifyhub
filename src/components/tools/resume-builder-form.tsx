
"use client";

import { useState } from 'react';
import { useForm, useFieldArray, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';
import { buildResume } from '@/ai/flows/ai-resume-builder-flow';
import type { ResumeData, ResumeOutput } from '@/lib/schema/resume-schema';
import { resumeFormSchema } from '@/lib/schema/resume-schema';
import { cn } from '@/lib/utils';


const steps = [
  { id: 'personal', name: 'Personal Details', icon: User, fields: ['fullName', 'email', 'phone', 'address', 'linkedin', 'portfolio'] },
  { id: 'summary', name: 'Summary', icon: FileText, fields: ['summary'] },
  { id: 'experience', name: 'Experience', icon: Briefcase, fields: ['experience'] },
  { id: 'education', name: 'Education', icon: GraduationCap, fields: ['education'] },
  { id: 'skills', name: 'Skills', icon: Wrench, fields: ['skills'] },
  { id: 'optional', name: 'Optional', icon: Plus, fields: ['projects', 'certifications', 'languages'] },
];

export function ResumeBuilderForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeOutput | null>(null);

  const { toast } = useToast();

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
      experience: [{ jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] }],
      education: [{ degree: '', school: '', location: '', gradDate: '' }],
      skills: [''],
      projects: [],
      certifications: [],
      languages: [],
    },
  });

  const {
    handleSubmit,
    trigger,
  } = methods;

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
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleEnhanceWithAI = async (section: 'summary' | `experience.${number}.responsibilities`) => {
      // Dummy function for now. In a real scenario, this would call the AI.
      toast({title: "AI Enhancement", description: "This feature will be implemented soon!"})
  }

  const onSubmit = async (data: ResumeData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await buildResume(data);
      setResult(response);
      toast({ title: 'Success!', description: 'Your AI-enhanced resume has been generated.' });
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to generate resume. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">AI is building your resume...</p>
        <p className="text-sm text-muted-foreground">This may take a moment.</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-headline text-3xl">AI Resume Builder</CardTitle>
              <p className="text-muted-foreground">Create a professional resume in minutes with AI assistance.</p>
            </div>
             {result && (
              <Button onClick={() => setResult(null)}>
                <Wand2 /> Back to Editor
              </Button>
            )}
           </div>
        </CardHeader>
        <CardContent>
            {result ? (
               <ResumePreview result={result} />
            ) : (
             <div className="space-y-8">
                {/* Stepper */}
                <div className="flex justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-col gap-2 w-full relative">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                          currentStep === index ? 'bg-primary border-primary text-primary-foreground scale-110' : 
                          currentStep > index ? 'bg-green-500 border-green-500 text-white' : 'bg-secondary'
                        )}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <p className={cn('text-sm font-medium', currentStep === index && 'text-primary')}>{step.name}</p>
                      {index < steps.length - 1 && <div className="absolute top-5 left-1/2 w-full h-0.5 bg-border -z-10" />}
                    </div>
                  ))}
                </div>

                <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentStep === 0 && <PersonalDetailsForm />}
                      {currentStep === 1 && <SummaryForm onEnhance={() => handleEnhanceWithAI('summary')} />}
                      {currentStep === 2 && <ExperienceForm onEnhance={handleEnhanceWithAI} />}
                      {currentStep === 3 && <EducationForm />}
                      {currentStep === 4 && <SkillsForm />}
                      {currentStep === 5 && <OptionalSectionsForm />}
                    </motion.div>
                  </AnimatePresence>
                </form>

                {/* Navigation */}
                <div className="mt-8 pt-5 border-t">
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      {currentStep === steps.length - 1 ? 'Generate Resume' : 'Next Step'}
                      <ArrowRight />
                    </Button>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </FormProvider>
  );
}

const ResumePreview = ({result}: {result: ResumeOutput}) => {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Generated Resume (Markdown)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-secondary/30 h-[600px] overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 m-0">{result.resumeMarkdown}</pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb /> AI Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 list-disc pl-5 text-sm">
                            {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </CardContent>
                </Card>
             </div>
         </div>
    )
}

// Sub-components for each step

const PersonalDetailsForm = () => {
    const { register, formState: { errors } } = useFormContext<ResumeData>();
    return (
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full Name</Label><Input {...register('fullName')} /><p className="text-destructive text-xs">{errors.fullName?.message}</p></div>
            <div className="space-y-2"><Label>Email</Label><Input {...register('email')} /><p className="text-destructive text-xs">{errors.email?.message}</p></div>
            <div className="space-y-2"><Label>Phone</Label><Input {...register('phone')} /><p className="text-destructive text-xs">{errors.phone?.message}</p></div>
            <div className="space-y-2"><Label>Address</Label><Input {...register('address')} /><p className="text-destructive text-xs">{errors.address?.message}</p></div>
            <div className="space-y-2"><Label>LinkedIn Profile URL</Label><Input {...register('linkedin')} /><p className="text-destructive text-xs">{errors.linkedin?.message}</p></div>
            <div className="space-y-2"><Label>Portfolio/Website URL</Label><Input {...register('portfolio')} /><p className="text-destructive text-xs">{errors.portfolio?.message}</p></div>
        </div>
    );
};

const SummaryForm = ({onEnhance}: {onEnhance: () => void}) => {
    const { register, formState: { errors } } = useFormContext<ResumeData>();
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Professional Summary</Label>
               <Button type="button" size="sm" variant="outline" onClick={onEnhance}><Wand2/> Enhance with AI</Button>
            </div>
            <Textarea {...register('summary')} rows={8} placeholder="Write a brief summary about your professional background and career goals." />
            <p className="text-destructive text-xs">{errors.summary?.message}</p>
        </div>
    );
}

const ExperienceForm = ({onEnhance}: {onEnhance: (section: `experience.${number}.responsibilities`) => void}) => {
    const { control, register, formState: { errors } } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'experience' });

    return (
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
                     <ResponsibilitiesArray index={index} onEnhance={() => onEnhance(`experience.${index}.responsibilities`)} />
                    {fields.length > 1 && <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>}
                </div>
            ))}
             <Button type="button" variant="outline" onClick={() => append({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] })}><Plus /> Add Experience</Button>
        </div>
    );
};

const ResponsibilitiesArray = ({ index, onEnhance }: { index: number, onEnhance: () => void }) => {
    const { control, register, formState: { errors } } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: `experience.${index}.responsibilities` });
    
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Key Responsibilities</Label>
               <Button type="button" size="sm" variant="outline" onClick={onEnhance}><Wand2/> Enhance with AI</Button>
            </div>
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
    );
};

const SkillsForm = () => {
    const { control, register, formState: { errors } } = useFormContext<ResumeData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'skills' });
    return (
        <div className="space-y-4">
            <Label>Skills</Label>
             <p className="text-sm text-muted-foreground">List your top technical and soft skills. Add each skill individually.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
