
import type { Metadata } from 'next';
import { ResumeBuilderForm } from '@/components/tools/resume-builder/form';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { FileUser, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Free Resume Builder Online — Create Professional CV Download PDF | ToolifyHub",
  description: "Build a professional resume free online in 5 minutes. Download as PDF instantly. No signup, no watermark. Used by job seekers worldwide.",
  alternates: {
    canonical: "https://onepagetools.vercel.app/tools/resume-builder",
  },
  openGraph: {
    title: "Free Resume Builder Online — Create CV Download PDF | ToolifyHub",
    description: "Build professional resume free online. Download PDF instantly. No signup, no watermark required.",
    url: "https://onepagetools.vercel.app/tools/resume-builder",
  },
  twitter: {
    title: "Free Resume Builder Online — Create Professional CV Download PDF | ToolifyHub",
    description: "Build a professional resume free online in 5 minutes. Download as PDF instantly. No signup, no watermark. Used by job seekers worldwide.",
  },
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Free Resume Builder Online",
      "url": "https://onepagetools.vercel.app/tools/resume-builder",
      "description": "Build professional resume free online. Download PDF instantly.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Free resume builder online",
        "Download PDF free",
        "No watermark",
        "No signup required",
        "Professional templates",
        "Works for freshers"
      ]
    })}}
  />
);

export default function ResumeBuilderPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
        <div className="max-w-[1200px] mx-auto space-y-6 md:space-y-8">
          {/* Internal Linking Header */}
          <div className="flex flex-wrap gap-3 items-center text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-4 md:px-0">
            <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-primary" /> You might also need:</span>
            <Link href="/tools/grammar-checker" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Grammar Checker</Link>
            <span className="opacity-30">|</span>
            <Link href="/tools/passport-photo-maker" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Passport Photo Maker</Link>
            <span className="opacity-30">|</span>
            <Link href="/tools/background-remover" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Background Remover</Link>
          </div>

          <ToolHeader 
            title="Resume Builder"
            description="Create a professional resume free online in minutes. Fill in your details, choose your template, and download as PDF instantly. No signup, no watermark, no payment ever."
            icon={<FileUser />}
            category="Utilities"
          />

          <ResumeBuilderForm />

          {/* How to Use Section */}
          <section className="space-y-6 px-4 md:px-0">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">How to Use Resume Builder</h2>
            </div>
            <Card className="bg-white dark:bg-card border-border">
              <CardContent className="p-6 md:p-8">
                <ol className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                  {[
                    "Fill in your personal details — name, contact info, and location",
                    "Add your work experience, education, and skills",
                    "Preview your professional resume in real time",
                    "Download your resume as PDF free — no watermark, no signup needed"
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </span>
                      <p className="text-slate-600 dark:text-muted-foreground pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* FAQ Section */}
          <section className="space-y-6 px-4 md:px-0">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">Frequently Asked Questions</h2>
            </div>
            <Card className="bg-white dark:bg-card border-border">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="px-6 border-b-0">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                      How to create a free resume online?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                      Fill in your details above and download your professional resume as PDF instantly. Our free resume builder online needs no signup, no payment, and adds no watermark.
                    </AccordionContent>
                  </AccordionItem>
                  <div className="mx-6 h-px bg-border" />
                  <AccordionItem value="item-2" className="px-6 border-b-0">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                      Can I download resume as PDF free?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                      Yes — download your resume as PDF completely free. No watermark, no signup, no hidden charges. Download unlimited times.
                    </AccordionContent>
                  </AccordionItem>
                  <div className="mx-6 h-px bg-border" />
                  <AccordionItem value="item-3" className="px-6 border-b-0">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                      Is this resume builder really free?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                      100% free resume maker online. No subscription, no premium plan needed. Build and download professional CV free as many times as you want.
                    </AccordionContent>
                  </AccordionItem>
                  <div className="mx-6 h-px bg-border" />
                  <AccordionItem value="item-4" className="px-6 border-b-0">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                      What makes a good resume in 2026?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                      A good resume in 2026 is clean, one page, has clear sections for experience and skills, uses simple fonts, and is saved as PDF. Our free CV builder online handles all of this automatically.
                    </AccordionContent>
                  </AccordionItem>
                  <div className="mx-6 h-px bg-border" />
                  <AccordionItem value="item-5" className="px-6 border-b-0">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                      Can freshers use this resume builder?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                      Yes — our free resume builder works for freshers, students, and experienced professionals. Add internships, projects, and skills to build a strong first resume.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          <RelatedTools currentToolHref="/tools/resume-builder" />
        </div>
      </div>
    </>
  );
}
