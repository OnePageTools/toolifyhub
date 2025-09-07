import { ToolGrid } from '@/components/tools/tool-grid';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mb-4">
          Your All-in-One Free Toolkit
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover a suite of powerful, free tools designed to boost your
          productivity. From AI-powered content creation to essential utilities,
          we've got you covered.
        </p>
      </section>

      <ToolGrid />
    </div>
  );
}
