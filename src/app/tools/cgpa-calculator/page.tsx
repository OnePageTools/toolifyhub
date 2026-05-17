import { CgpaCalculatorForm } from '@/components/tools/cgpa-calculator-form';
import { GraduationCap, CheckCircle2, HelpCircle } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';

const tool = {
  name: 'CGPA Calculator',
  slug: 'cgpa-calculator',
  url: 'https://onepagetools.vercel.app/tools/cgpa-calculator',
};

export const metadata: Metadata = {
  title: "CGPA Calculator Online Free — Calculate GPA for Pakistan University | ToolifyHub",
  description: "Calculate CGPA and GPA free online. Add subjects, credit hours and grades. Instant results for Pakistan, India university students. No signup needed.",
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: "CGPA Calculator Free — Calculate GPA Pakistan University | ToolifyHub",
    description: "Calculate CGPA and GPA free online for Pakistan and India universities. Add subjects and grades. Instant results.",
    url: tool.url,
  },
  other: {
    'last-modified': '2026-05-16'
  }
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "CGPA Calculator Online Free",
      "url": "https://onepagetools.vercel.app/tools/cgpa-calculator",
      "description": "Calculate CGPA and GPA free online for university students.",
      "applicationCategory": "EducationApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "CGPA calculator free online",
        "GPA calculator Pakistan university",
        "4.0 and 10.0 scale support",
        "Semester GPA calculator",
        "No signup required",
        "Instant results"
      ]
    })}}
  />
);

export default function CgpaCalculatorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-4 tool-page-fade">
      <WebAppSchema />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://onepagetools.vercel.app"
              },
              {
                "@type": "ListItem", 
                "position": 2,
                "name": "Tools",
                "item": "https://onepagetools.vercel.app"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": tool.name,
                "item": tool.url
              }
            ]
          })
        }}
      />

      <div className="max-w-[1000px] mx-auto space-y-12">
        <ToolHeader 
          title="CGPA Calculator"
          description="Calculate your CGPA and GPA free online instantly. Add subjects, credit hours and grades for any semester. Supports Pakistan 4.0 scale and India 10.0 scale universities."
          icon={<GraduationCap className="w-6 h-6 md:w-8 md:h-8" />}
          category="Education"
        />

        <CgpaCalculatorForm />

        {/* Instructions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-100">How to Use the Calculator</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               "Select your grading system — 4.0 scale Pakistan/USA or 10.0 scale India",
               "Add your subjects with credit hours and grade for each",
               "Add previous semesters to calculate cumulative CGPA",
               "See your GPA and CGPA instantly — free, no signup needed"
             ].map((step, i) => (
               <div key={i} className="flex gap-4 p-5 bg-slate-800/40 border border-slate-700 rounded-2xl">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-sm">{i + 1}</span>
                  <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
               </div>
             ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-100">Academic FAQs</h2>
          </div>
          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to calculate CGPA online free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Select your grading system, add subjects with credit hours and grades, and our free CGPA calculator online shows your result instantly. No signup, no payment needed.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to calculate CGPA in Pakistan university?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Select 4.0 scale, add your subjects with credit hours and letter grades A, B, C. Our free CGPA calculator for Pakistan university computes results automatically.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is a good CGPA in Pakistan?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    3.5 to 4.0 CGPA is excellent — Distinction. 3.0 to 3.49 is First Division. 2.5 to 2.99 is Second Division. Below 2.0 means academic risk in most universities.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    How to convert CGPA to percentage?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Multiply your CGPA by 25 for 4.0 scale. Example: 3.5 CGPA equals 87.5 percent. Our free CGPA to percentage calculator shows this conversion automatically.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    Can I calculate semester GPA separately?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Yes — our free semester GPA calculator online shows current semester GPA and overall CGPA separately. Add multiple semesters to track your academic progress.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
