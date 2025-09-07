import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { tools } from '@/lib/tools';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter mb-4">
          Your All-in-One Free Toolkit
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover a suite of powerful, free tools designed to boost your
          productivity. From AI-powered content creation to essential utilities,
          we've got you covered.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <Link
            href={tool.href}
            key={tool.name}
            className="group block"
            aria-disabled={!tool.implemented}
            tabIndex={tool.implemented ? 0 : -1}
          >
            <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1 group-focus-visible:-translate-y-1 group-focus-visible:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring">
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="p-3 bg-secondary rounded-lg">
                  <tool.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  {!tool.implemented && (
                    <Badge variant="secondary" className="mt-1">
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{tool.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0">
                 <div className="text-sm font-medium text-primary flex items-center gap-1">
                    Use Tool
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                 </div>
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
