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
  title: "Free CGPA Calculator Online — Calculate GPA & CGPA Instantly | ToolifyHub",
  description: "Calculate your semester GPA and cumulative CGPA free online. Supports 4.0 and 10.0 grading scales for Pakistan, USA, and India. No signup needed.",
  openGraph: {
    title: "Free CGPA Calculator — GPA & CGPA Online | ToolifyHub",
    description: "Instant GPA and CGPA calculation with credit hours. Supports multiple grading systems. Free and private.",
    url: tool.url,
  },
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function CgpaCalculatorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-4 tool-page-fade">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "CGPA Calculator",
          "url": tool.url,
          "applicationCategory": "EducationApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://onepagetools.vercel.app" },
            { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://onepagetools.vercel.app" },
            { "@type": "ListItem", "position": 3, "name": tool.name, "item": tool.url }
          ]
        })}}
      />

      <div className="max-w-[1000px] mx-auto space-y-12">
        <ToolHeader 
          title="CGPA Calculator"
          description="A professional academic tool to track your GPA and cumulative CGPA across multiple semesters and grading systems."
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
               "Select your grading scale (4.0 for PK/USA or 10.0 for India).",
               "Enter subject names, credit hours, and your achieved grades.",
               "Add previous semesters if you want to calculate your cumulative CGPA.",
               "Review your instant academic report and status classification."
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
                    How is CGPA actually calculated?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    CGPA is calculated by multiplying the grade points of each subject by its credit hours, summing those products (total quality points), and then dividing the total by the sum of all credit hours across all semesters.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    What is a "Good" CGPA in Pakistan?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    In the Pakistani university system (HEC standard), a CGPA above 3.5 is considered excellent (Distinction level), while a CGPA between 3.0 and 3.49 is considered good (First Division). Most competitive jobs require at least a 3.0.
                  </AccordionContent>
                </AccordionItem>
                 <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="q3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-200 hover:no-underline">
                    Does failing a course affect my CGPA?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-4">
                    Yes. An 'F' grade carries 0 points, but the credit hours for that course are still added to the total credits. This significantly pulls down your average unless you repeat the course and improve the grade.
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
