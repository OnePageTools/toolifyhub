import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Tool } from '@/lib/tools';

type ToolCardProps = {
  tool: Tool;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={tool.href}
      className="group block"
      aria-disabled={!tool.implemented}
      tabIndex={tool.implemented ? 0 : -1}
    >
      <Card className="h-full transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-ring bg-card">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <tool.icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{tool.name}</h3>
            <p className="text-xs text-muted-foreground">{tool.description}</p>
          </div>
           {!tool.implemented && (
              <Badge variant="secondary" className="text-xs">
                Soon
              </Badge>
            )}
        </CardContent>
      </Card>
    </Link>
  );
}
