import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Tool } from '@/lib/tools';

type ToolCardProps = {
  tool: Tool;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={tool.href}
      className="group block h-full"
      aria-disabled={!tool.implemented}
      tabIndex={tool.implemented ? 0 : -1}
    >
      <Card className="h-full glass-card bg-transparent border-0 shadow-none flex flex-col">
        <CardHeader className="flex-row items-center gap-4 pb-4">
           <div className="p-3 bg-primary/10 text-primary rounded-lg transition-transform duration-300 group-hover:scale-110">
            <tool.icon className="w-6 h-6" />
          </div>
          <CardTitle className="text-base font-semibold text-card-foreground">{tool.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-xs text-muted-foreground">{tool.description}</CardDescription>
        </CardContent>
         {!tool.implemented && (
              <div className="p-4 pt-0">
                 <Badge variant="secondary" className="text-xs">
                    Soon
                </Badge>
              </div>
            )}
      </Card>
    </Link>
  );
}
