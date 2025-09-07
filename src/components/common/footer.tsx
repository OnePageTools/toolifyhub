import React from 'react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Toolbox AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
