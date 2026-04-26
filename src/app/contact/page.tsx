import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with ToolifyHub. We\'d love to hear from you!',
};


export default function ContactPage() {
  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Contact Us</CardTitle>
          <CardDescription>We'd love to hear from you! Send us a message.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="mailto:goherkhan12131415@gmail.com" method="post" encType="text/plain" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your Name" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Your Email" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Your message..." required rows={5} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
