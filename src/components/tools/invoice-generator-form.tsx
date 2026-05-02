"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Building2, 
  User, 
  Calendar as CalendarIcon,
  Receipt,
  ImagePlus,
  Loader2
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Image from 'next/image';

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

type InvoiceData = {
  logo: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  items: InvoiceItem[];
  taxPercent: number;
  discountPercent: number;
  notes: string;
};

const currencies = [
  { label: 'USD - US Dollar', value: '$' },
  { label: 'EUR - Euro', value: '€' },
  { label: 'GBP - British Pound', value: '£' },
  { label: 'PKR - Pakistani Rupee', value: 'Rs' },
  { label: 'SAR - Saudi Riyal', value: 'SR' },
  { label: 'AED - UAE Dirham', value: 'AED' },
];

export function InvoiceGeneratorForm() {
  const [data, setData] = useState<InvoiceData>({
    logo: '',
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    invoiceNumber: '', // Initialized empty to prevent hydration mismatch
    invoiceDate: '',   // Initialized empty to prevent hydration mismatch
    dueDate: '',
    currency: '$',
    items: [{ id: '1', description: '', quantity: 1, rate: 0 }],
    taxPercent: 0,
    discountPercent: 0,
    notes: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set dynamic/random values only on the client after mount
    setData(prev => ({
      ...prev,
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
    }));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: 'destructive', title: 'File too large', description: 'Please upload an image smaller than 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: Math.random().toString(36).substr(2, 9), description: '', quantity: 1, rate: 0 }]
    }));
  };

  const removeItem = (id: string) => {
    if (data.items.length === 1) return;
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const taxAmount = (subtotal * (data.taxPercent / 100));
  const discountAmount = (subtotal * (data.discountPercent / 100));
  const total = subtotal + taxAmount - discountAmount;

  const handleExport = async (type: 'pdf' | 'print') => {
    if (!previewRef.current) return;
    
    if (type === 'print') {
      window.print();
      return;
    }

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.invoiceNumber || 'invoice'}.pdf`);
      toast({ title: 'Success!', description: 'Invoice PDF has been downloaded.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not generate PDF.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Form Section */}
      <div className="space-y-6 print:hidden">
        {/* Business Details */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-400" /> Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input placeholder="Your Business" value={data.businessName} onChange={e => setData({...data, businessName: e.target.value})} className="bg-slate-900 border-slate-700" />
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-3">
                  <Input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                  <label htmlFor="logo-upload" className="flex items-center justify-center w-full h-10 px-3 border border-dashed border-slate-700 rounded-md cursor-pointer hover:bg-slate-800 transition-colors">
                    <ImagePlus className="w-4 h-4 mr-2" /> {data.logo ? 'Change Logo' : 'Upload Logo'}
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" value={data.businessEmail} onChange={e => setData({...data, businessEmail: e.target.value})} className="bg-slate-900 border-slate-700" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+1 234 567 890" value={data.businessPhone} onChange={e => setData({...data, businessPhone: e.target.value})} className="bg-slate-900 border-slate-700" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea placeholder="123 Business St, City, Country" value={data.businessAddress} onChange={e => setData({...data, businessAddress: e.target.value})} className="bg-slate-900 border-slate-700 h-20" />
            </div>
          </CardContent>
        </Card>

        {/* Client Details */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-purple-400" /> Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input placeholder="Client Name" value={data.clientName} onChange={e => setData({...data, clientName: e.target.value})} className="bg-slate-900 border-slate-700" />
              </div>
              <div className="space-y-2">
                <Label>Client Email</Label>
                <Input type="email" placeholder="client@example.com" value={data.clientEmail} onChange={e => setData({...data, clientEmail: e.target.value})} className="bg-slate-900 border-slate-700" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea placeholder="Client's billing address" value={data.clientAddress} onChange={e => setData({...data, clientAddress: e.target.value})} className="bg-slate-900 border-slate-700 h-20" />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Info */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Receipt className="w-5 h-5 text-emerald-400" /> Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice #</Label>
                <Input value={data.invoiceNumber} onChange={e => setData({...data, invoiceNumber: e.target.value})} className="bg-slate-900 border-slate-700" />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={data.currency} onValueChange={v => setData({...data, currency: v})}>
                  <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currencies.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={data.invoiceDate} onChange={e => setData({...data, invoiceDate: e.target.value})} className="bg-slate-900 border-slate-700" />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" value={data.dueDate} onChange={e => setData({...data, dueDate: e.target.value})} className="bg-slate-900 border-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">Items</span>
              <Button size="sm" variant="outline" onClick={addItem} className="h-8"><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.items.map((item, index) => (
              <div key={item.id} className="p-4 bg-slate-900 border border-slate-700 rounded-lg space-y-3 relative">
                {data.items.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="absolute top-1 right-1 h-7 w-7 text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Service or product description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Qty</Label>
                    <Input type="number" min="1" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} className="bg-slate-950 border-slate-800" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Rate</Label>
                    <Input type="number" min="0" value={item.rate} onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} className="bg-slate-950 border-slate-800" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Amount</Label>
                    <div className="h-10 flex items-center font-mono text-sm px-3 bg-slate-950/50 border border-slate-800 rounded-md">
                      {data.currency}{(item.quantity * item.rate).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Totals & Notes */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax %</Label>
                <Input type="number" min="0" value={data.taxPercent} onChange={e => setData({...data, taxPercent: parseFloat(e.target.value) || 0})} className="bg-slate-900 border-slate-700" />
              </div>
              <div className="space-y-2">
                <Label>Discount %</Label>
                <Input type="number" min="0" value={data.discountPercent} onChange={e => setData({...data, discountPercent: parseFloat(e.target.value) || 0})} className="bg-slate-900 border-slate-700" />
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-700">
               <Label>Notes / Terms</Label>
               <Textarea placeholder="Thank you for your business!" value={data.notes} onChange={e => setData({...data, notes: e.target.value})} className="bg-slate-900 border-slate-700 h-24" />
            </div>
            <div className="pt-4 space-y-3">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{data.currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax ({data.taxPercent}%)</span>
                <span>{data.currency}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Discount ({data.discountPercent}%)</span>
                <span>-{data.currency}{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-slate-700">
                <span>Total</span>
                <span className="text-blue-400">{data.currency}{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Buttons (Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
            <Button onClick={() => handleExport('pdf')} disabled={isGenerating} size="lg" className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 font-bold">
               {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : <Download className="mr-2" />} Download PDF
            </Button>
            <Button onClick={() => handleExport('print')} variant="outline" size="lg" className="h-12 border-slate-700">
               <Printer className="mr-2" /> Print
            </Button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="sticky top-10 space-y-6 h-fit">
        <div className="flex items-center justify-between print:hidden">
            <h3 className="font-bold text-slate-300">Invoice Preview</h3>
            <div className="hidden lg:flex gap-2">
                <Button onClick={() => handleExport('pdf')} disabled={isGenerating} size="sm" className="bg-blue-600 hover:bg-blue-500">
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Download className="w-4 h-4 mr-1" />} PDF
                </Button>
                <Button onClick={() => handleExport('print')} variant="outline" size="sm" className="border-slate-700">
                    <Printer className="w-4 h-4 mr-1" /> Print
                </Button>
            </div>
        </div>

        <div className="bg-secondary/30 rounded-xl p-4 lg:p-8 overflow-auto max-h-[85vh] shadow-inner flex justify-center">
            {/* Real Invoice Render Area */}
            <div 
              ref={previewRef}
              className="bg-white text-slate-900 w-[794px] min-h-[1123px] shadow-2xl p-10 flex flex-col shrink-0 origin-top"
              style={{ transform: 'scale(var(--invoice-scale, 1))' }}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                   <div>
                        {data.logo && (
                           <div className="relative w-32 h-16 mb-4">
                              <Image src={data.logo} alt="Logo" fill className="object-contain object-left" unoptimized />
                           </div>
                        )}
                        <h1 className="text-4xl font-bold tracking-tight text-slate-800 uppercase">Invoice</h1>
                        <p className="text-slate-500 font-medium mt-1">#{data.invoiceNumber}</p>
                   </div>
                   <div className="text-right">
                        <h2 className="text-xl font-bold text-slate-800">{data.businessName || 'Your Business'}</h2>
                        <p className="text-sm text-slate-500 whitespace-pre-wrap">{data.businessAddress}</p>
                        <p className="text-sm text-slate-500 mt-1">{data.businessEmail}</p>
                        <p className="text-sm text-slate-500">{data.businessPhone}</p>
                   </div>
                </div>

                {/* Details Bar */}
                <div className="grid grid-cols-2 gap-10 mb-12 py-8 border-y border-slate-100">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bill To</h3>
                        <p className="font-bold text-slate-800 text-lg">{data.clientName || 'Client Name'}</p>
                        <p className="text-sm text-slate-500 whitespace-pre-wrap mt-1">{data.clientAddress}</p>
                        <p className="text-sm text-slate-500">{data.clientEmail}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-right">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Date</h3>
                            <p className="text-slate-800 font-medium">{data.invoiceDate}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</h3>
                            <p className="text-slate-800 font-medium">{data.dueDate || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="flex-grow">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-slate-900">
                                <th className="py-4 font-bold text-sm uppercase tracking-wider">Description</th>
                                <th className="py-4 font-bold text-sm uppercase tracking-wider text-right w-20">Qty</th>
                                <th className="py-4 font-bold text-sm uppercase tracking-wider text-right w-28">Rate</th>
                                <th className="py-4 font-bold text-sm uppercase tracking-wider text-right w-32">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-5">
                                        <p className="font-bold text-slate-800">{item.description || 'Description'}</p>
                                    </td>
                                    <td className="py-5 text-right text-slate-600">{item.quantity}</td>
                                    <td className="py-5 text-right text-slate-600">{data.currency}{item.rate.toFixed(2)}</td>
                                    <td className="py-5 text-right font-bold text-slate-800">{data.currency}{(item.quantity * item.rate).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="mt-12 flex justify-end">
                    <div className="w-72 space-y-4">
                        <div className="flex justify-between text-slate-500">
                            <span>Subtotal</span>
                            <span>{data.currency}{subtotal.toFixed(2)}</span>
                        </div>
                        {data.taxPercent > 0 && (
                            <div className="flex justify-between text-slate-500">
                                <span>Tax ({data.taxPercent}%)</span>
                                <span>{data.currency}{taxAmount.toFixed(2)}</span>
                            </div>
                        )}
                         {data.discountPercent > 0 && (
                            <div className="flex justify-between text-slate-500">
                                <span>Discount ({data.discountPercent}%)</span>
                                <span>-{data.currency}{discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-2xl font-black text-slate-900 border-t-4 border-slate-900 pt-4">
                            <span>TOTAL</span>
                            <span>{data.currency}{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-auto pt-20">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Notes & Terms</h3>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{data.notes || 'Thank you for your business!'}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <style jsx global>{`
        :root {
          --invoice-scale: 1;
        }
        @media (max-width: 1024px) {
          :root {
            --invoice-scale: 0.8;
          }
        }
        @media (max-width: 640px) {
          :root {
            --invoice-scale: 0.45;
          }
        }
        @media print {
          .print\:hidden { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          main { margin: 0 !important; padding: 0 !important; }
          .container { max-width: none !important; width: 100% !important; margin: 0 !important; }
          .lg\:grid-cols-2 { display: block !important; }
          .sticky { position: static !important; }
          .bg-secondary\/30 { background: transparent !important; padding: 0 !important; box-shadow: none !important; }
          #preview-area { box-shadow: none !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}
