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
  Copy,
  ClipboardCheck,
  Download,
  Lightbulb,
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
];

export function ResumeBuilderForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeOutput | null>(null);
  const [isCopied, setIsCopied] = useState(false);
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
  
  const handleCopy = () => {
    if (!result?.resumeMarkdown) return;
    navigator.clipboard.writeText(result.resumeMarkdown).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({ title: 'Copied!', description: 'Resume content copied to clipboard.' });
    });
  };

  const handleDownload = () => {
    if (!result?.resumeMarkdown) return;
    const blob = new Blob([result.resumeMarkdown], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.md';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">AI is building your resume...</p>
      </div>
    );
  }

  if (result) {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 justify-end">
                <Button variant="outline" onClick={handleCopy}>
                    {isCopied ? <ClipboardCheck /> : <Copy />} Copy Markdown
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                    <Download /> Download .MD
                </Button>
                 <Button onClick={() => setResult(null)}>
                    <Wand2 /> Edit & Regenerate
                </Button>
            </div>
             <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Generated Resume</CardTitle>
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
        </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-8">
        {/* Stepper */}
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-col gap-2 w-full relative">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2',
                  currentStep === index ? 'bg-primary border-primary text-primary-foreground' : 'bg-secondary'
                )}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <p className={cn('text-sm', currentStep === index && 'font-bold text-primary')}>{step.name}</p>
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
              {currentStep === 1 && <SummaryForm />}
              {currentStep === 2 && <ExperienceForm />}
              {currentStep === 3 && <EducationForm />}
              {currentStep === 4 && <SkillsForm />}
            </motion.div>
          </AnimatePresence>
        </form>

        {/* Navigation */}
        <div className="mt-8 pt-5">
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Back
            </Button>
            <Button type="button" onClick={nextStep}>
              {currentStep === steps.length - 1 ? 'Generate Resume' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
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

const SummaryForm = () => {
    const { register, formState: { errors } } = useFormContext<ResumeData>();
    return (
        <div className="space-y-2">
            <Label>Professional Summary</Label>
            <Textarea {...register('summary')} rows={8} placeholder="Write a brief summary about your professional background and career goals." />
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
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Job Title</Label><Input {...register(`experience.${index}.jobTitle`)} /><p className="text-destructive text-xs">{errors.experience?.[index]?.jobTitle?.message}</p></div>
                        <div className="space-y-2"><Label>Company</Label><Input {...register(`experience.${index}.company`)} /><p className="text-destructive text-xs">{errors.experience?.[index]?.company?.message}</p></div>
                        <div className="space-y-2"><Label>Location</Label><Input {...register(`experience.${index}.location`)} /><p className="text-destructive text-xs">{errors.experience?.[index]?.location?.message}</p></div>
                        <div className="space-y-2"><Label>Start & End Date</Label>
                            <div className="flex gap-2"><Input placeholder="Start Date" {...register(`experience.${index}.startDate`)} /><Input placeholder="End Date" {...register(`experience.${index}.endDate`)} /></div>
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
            <Label>Responsibilities</Label>
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
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
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
