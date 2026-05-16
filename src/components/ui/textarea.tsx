import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        style={{
            backgroundColor: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            color: 'var(--input-text)'
        }}
        className={cn(
          'flex min-h-[160px] w-full rounded-[10px] px-4 py-3 text-base md:text-[15px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all text-foreground resize-y',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};