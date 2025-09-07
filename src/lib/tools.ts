import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  FileArchive,
  Minimize,
  ScanText,
  Eraser,
  QrCode,
  CopyCheck,
  SpellCheck,
  WrapText,
  UserSquare,
  Bot,
  Calculator,
  Recycle,
  Landmark,
  Braces,
  Code,
  MonitorSmartphone,
  Tags,
  Mail,
} from 'lucide-react';

export type Tool = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  implemented: boolean;
};

export const tools: Tool[] = [
  {
    name: 'PDF to Word',
    description: 'Convert your PDF files to editable Word documents with ease.',
    href: '/tools/pdf-to-word',
    icon: FileText,
    implemented: false,
  },
  {
    name: 'Word to PDF',
    description: 'Transform Word documents into professional PDF files quickly.',
    href: '/tools/word-to-pdf',
    icon: FileText,
    implemented: false,
  },
  {
    name: 'PDF Compressor',
    description: 'Reduce the file size of your PDFs without losing quality.',
    href: '/tools/pdf-compressor',
    icon: FileArchive,
    implemented: false,
  },
  {
    name: 'Image Compressor',
    description: 'Optimize your images by reducing their file size.',
    href: '/tools/image-compressor',
    icon: Minimize,
    implemented: false,
  },
  {
    name: 'Image to Text (OCR)',
    description: 'Extract text from images accurately using OCR technology.',
    href: '/tools/image-to-text',
    icon: ScanText,
    implemented: false,
  },
  {
    name: 'Background Remover',
    description: 'Automatically remove the background from your images.',
    href: '/tools/background-remover',
    icon: Eraser,
    implemented: false,
  },
  {
    name: 'QR Code Generator',
    description: 'Create custom QR codes for URLs, text, and more.',
    href: '/tools/qr-code-generator',
    icon: QrCode,
    implemented: true,
  },
  {
    name: 'Plagiarism Checker',
    description: 'Check for plagiarism in your text with our AI-powered tool.',
    href: '/tools/plagiarism-checker',
    icon: CopyCheck,
    implemented: true,
  },
  {
    name: 'Grammar Checker',
    description: 'Correct grammar and spelling mistakes in your writing.',
    href: '/tools/grammar-checker',
    icon: SpellCheck,
    implemented: true,
  },
  {
    name: 'Text Summarizer',
    description: 'Summarize long articles and texts into concise summaries.',
    href: '/tools/text-summarizer',
    icon: WrapText,
    implemented: true,
  },
  {
    name: 'Resume Builder',
    description: 'Build a professional resume in minutes with our easy-to-use tool.',
    href: '/tools/resume-builder',
    icon: UserSquare,
    implemented: false,
  },
  {
    name: 'AI Essay Writer',
    description: 'Generate high-quality essays on any topic with AI assistance.',
    href: '/tools/ai-essay-writer',
    icon: Bot,
    implemented: true,
  },
  {
    name: 'Age Calculator',
    description: 'Calculate your age accurately down to the day.',
    href: '/tools/age-calculator',
    icon: Calculator,
    implemented: true,
  },
  {
    name: 'Unit Converter',
    description: 'Convert between various units of measurement.',
    href: '/tools/unit-converter',
    icon: Recycle,
    implemented: false,
  },
  {
    name: 'Currency Converter',
    description: 'Get the latest exchange rates and convert currencies.',
    href: '/tools/currency-converter',
    icon: Landmark,
    implemented: false,
  },
  {
    name: 'JSON Formatter',
    description: 'Format and validate your JSON data effortlessly.',
    href: '/tools/json-formatter',
    icon: Braces,
    implemented: false,
  },
  {
    name: 'Code Minifier',
    description: 'Minify your CSS, JavaScript, and HTML code for better performance.',
    href: '/tools/code-minifier',
    icon: Code,
    implemented: false,
  },
  {
    name: 'Website Screenshot',
    description: 'Capture a full-page screenshot of any website.',
    href: '/tools/website-screenshot',
    icon: MonitorSmartphone,
    implemented: false,
  },
  {
    name: 'Meta Tag Generator',
    description: 'Generate SEO-friendly meta tags for your website.',
    href: '/tools/meta-tag-generator',
    icon: Tags,
    implemented: false,
  },
  {
    name: 'Temp Email Generator',
    description: 'Create a temporary email address to protect your privacy.',
    href: '/tools/temp-email-generator',
    icon: Mail,
    implemented: false,
  },
];
