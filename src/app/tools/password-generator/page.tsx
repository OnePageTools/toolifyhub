import { PasswordGeneratorForm } from '@/components/tools/password-generator-form';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Metadata } from 'next';

const tool = {
  name: 'Password Generator',
  url: 'https://onepagetools.vercel.app/tools/password-generator',
};

export const metadata: Metadata = {
  title: "Strong Password Generator Free — Create Secure Password Online | ToolifyHub",
  description: "Generate strong secure passwords free online instantly. Custom length, uppercase, symbols, numbers. No signup. Password never stored or shared.",
  alternates: {
    canonical: "https://onepagetools.vercel.app/tools/password-generator",
  },
  openGraph: {
    title: "Strong Password Generator Free — Secure Password Online | ToolifyHub",
    description: "Generate strong secure passwords free online. Custom settings, instant results. Your password stays 100% private.",
    url: "https://onepagetools.vercel.app/tools/password-generator",
  },
  twitter: {
    title: "Strong Password Generator Free — Secure Password Online | ToolifyHub",
    description: "Generate strong secure passwords free online. Custom settings, instant results. Your password stays 100% private.",
  }
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Strong Password Generator Free",
      "url": "https://onepagetools.vercel.app/tools/password-generator",
      "description": "Generate strong secure passwords free online instantly.",
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Strong password generator free",
        "No signup required",
        "Password never stored",
        "Custom length and characters",
        "Generate multiple passwords",
        "100% private and secure"
      ]
    })}}
  />
);

export default function PasswordGeneratorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
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
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Password Generator"
          description="Generate strong, secure passwords free online instantly. Customize length, include uppercase, lowercase, numbers, and symbols. Your password is never stored or shared — 100% private."
          icon={<ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />}
          category="Security"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <PasswordGeneratorForm />
          </CardContent>
        </Card>

        {/* How to Use */}
        <section className="space-y-6 px-4 md:px-0">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">How to Use Password Generator</h2>
          </div>
          <Card className="bg-white dark:bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                {[
                  "Set your password length — 8 to 64 characters",
                  "Choose character types — uppercase, lowercase, numbers, symbols",
                  "Click Generate Password to create your secure password instantly",
                  "Copy your strong password — never stored, 100% private and free"
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
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    How to create a strong password online free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Set your preferred length and character types above, then click Generate. Our free strong password generator creates secure random passwords instantly — no signup needed.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Is my generated password stored anywhere?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    No — your password is never stored, logged, or shared. Our free secure password generator works entirely in your browser. Complete privacy guaranteed.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    What makes a password strong and secure?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    A strong password has 12+ characters, includes uppercase and lowercase letters, numbers, and symbols. Our free password maker online generates these automatically.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Can I generate multiple passwords at once?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes — generate up to 10 strong passwords at once free. Each one is unique, random, and cryptographically secure. No signup needed.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    What is password strength — weak vs strong?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Weak passwords have less than 8 characters or use common words. Strong passwords have 12+ characters with mixed types. Our free random password generator always creates strong passwords.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <RelatedTools currentToolHref="/tools/password-generator" />
      </div>
    </div>
  );
}
