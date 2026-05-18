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
    invoiceNumber: '',
    invoiceDate: '',
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
        toast({ variant: 'destructive', title: 'File too large', description: 'Maximum size is 2MB.' });
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
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.invoiceNumber || 'invoice'}.pdf`);
      toast({ title: 'Success!', description: 'Invoice exported.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start px-4 md:px-0 max-w-full overflow-x-hidden">
      {/* LEFT: FORM SECTION */}
      <div className="space-y-6 print:hidden w-full">
        {/* Business Details */}
        <Card className="bg-white dark:bg-card border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> 
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Business Name</Label>
                <Input 
                  placeholder="Your Company" 
                  value={data.businessName} 
                  onChange={e => setData({...data, businessName: e.target.value})} 
                  className="bg-secondary/20 border-border h-12 text-base" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Logo</Label>
                <Input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                <label htmlFor="logo-upload" className="flex items-center justify-center w-full h-12 px-3 border-2 border-dashed border-border rounded-[10px] cursor-pointer hover:bg-secondary/50 transition-colors text-sm">
                  <ImagePlus className="w-4 h-4 mr-2" /> 
                  {data.logo ? 'Change Logo' : 'Upload Logo'}
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Address</Label>
              <Textarea 
                placeholder="Business Address" 
                value={data.businessAddress} 
                onChange={e => setData({...data, businessAddress: e.target.value})} 
                className="bg-secondary/20 border-border h-24 text-base" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Client Details */}
        <Card className="bg-white dark:bg-card border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> 
              Client Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Client Name</Label>
                <Input 
                  placeholder="Client Name" 
                  value={data.clientName} 
                  onChange={e => setData({...data, clientName: e.target.value})} 
                  className="bg-secondary/20 border-border h-12 text-base" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Invoice #</Label>
                <Input 
                  value={data.invoiceNumber} 
                  onChange={e => setData({...data, invoiceNumber: e.target.value})} 
                  className="bg-secondary/20 border-border h-12 text-base" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Billing Address</Label>
              <Textarea 
                placeholder="Client Address" 
                value={data.clientAddress} 
                onChange={e => setData({...data, clientAddress: e.target.value})} 
                className="bg-secondary/20 border-border h-24 text-base" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card className="bg-white dark:bg-card border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Line Items</span>
              <Button size="sm" variant="outline" onClick={addItem} className="h-9 px-4">
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-4">
            {data.items.map((item) => (
              <div key={item.id} className="p-4 bg-white/5 border border-border rounded-xl space-y-3 relative group">
                {data.items.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(item.id)} 
                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive md:opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Description</Label>
                  <Input 
                    placeholder="Work description..." 
                    value={item.description} 
                    onChange={e => updateItem(item.id, 'description', e.target.value)} 
                    className="bg-white dark:bg-card border-border h-12 text-base" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Quantity</Label>
                    <Input 
                      type="number" 
                      placeholder="Qty" 
                      value={item.quantity} 
                      onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} 
                      className="bg-white dark:bg-card border-border h-12 text-base text-center" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Rate</Label>
                    <Input 
                      type="number" 
                      placeholder="Rate" 
                      value={item.rate} 
                      onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} 
                      className="bg-white dark:bg-card border-border h-12 text-base text-center" 
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                   <span className="text-xs text-muted-foreground font-bold uppercase">Item Total:</span>
                   <span className="text-base font-black text-foreground">{data.currency}{(item.quantity * item.rate).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Totals & Tax */}
        <Card className="bg-white dark:bg-card border-border shadow-sm">
          <CardContent className="p-4 md:p-6 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Tax %</Label>
                  <Input 
                    type="number" 
                    value={data.taxPercent} 
                    onChange={e => setData({...data, taxPercent: parseFloat(e.target.value) || 0})} 
                    className="bg-secondary/20 border-border h-12 text-base text-center" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Discount %</Label>
                  <Input 
                    type="number" 
                    value={data.discountPercent} 
                    onChange={e => setData({...data, discountPercent: parseFloat(e.target.value) || 0})} 
                    className="bg-secondary/20 border-border h-12 text-base text-center" 
                  />
                </div>
             </div>
             <div className="pt-4 border-t border-border space-y-3">
                <div className="flex justify-between text-muted-foreground text-sm font-medium">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{data.currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground font-black text-xl">
                  <span>Total Due</span>
                  <span className="text-primary tabular-nums">{data.currency}{total.toFixed(2)}</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: PREVIEW SECTION */}
      <div className="lg:sticky lg:top-10 space-y-6 w-full overflow-hidden">
        {/* Mobile Action Buttons (Full width) */}
        <div className="flex flex-col gap-3 lg:hidden w-full">
            <Button 
                onClick={() => handleExport('pdf')} 
                disabled={isGenerating} 
                className="w-full h-14 text-base font-bold shadow-xl shadow-blue-500/20"
            >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Download className="w-5 h-5 mr-2" />} 
                Download PDF Invoice
            </Button>
            <Button 
                onClick={() => handleExport('print')} 
                variant="outline" 
                className="w-full h-11 border-border bg-secondary/50"
            >
                <Printer className="w-4 h-4 mr-2" /> Print Invoice
            </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between">
            <h3 className="font-bold text-muted-foreground text-sm uppercase tracking-widest">Live Document Preview</h3>
            <div className="flex gap-2">
                <Button onClick={() => handleExport('pdf')} disabled={isGenerating} size="sm" className="h-9">
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Download className="w-4 h-4 mr-1" />} PDF
                </Button>
                <Button onClick={() => handleExport('print')} variant="outline" size="sm" className="h-9">
                    <Printer className="w-4 h-4 mr-1" /> Print
                </Button>
            </div>
        </div>

        {/* The Actual Canvas Document */}
        <div className="bg-secondary/30 rounded-[24px] p-4 overflow-x-hidden md:overflow-auto max-h-[85vh] shadow-inner flex justify-center border border-border/50">
            <div className="w-full flex justify-center">
                <div 
                    ref={previewRef} 
                    className="bg-white text-slate-900 w-[794px] min-h-[1123px] shadow-2xl p-6 md:p-12 flex flex-col shrink-0 origin-top scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-[1]"
                >
                    <div className="flex justify-between items-start mb-12">
                       <div>
                            {data.logo && <div className="relative w-32 h-16 mb-4"><Image src={data.logo} alt="Logo" fill className="object-contain object-left" unoptimized /></div>}
                            <h1 className="text-5xl font-black tracking-tighter text-slate-800 uppercase leading-none">Invoice</h1>
                            <p className="text-slate-500 font-bold mt-2">#{data.invoiceNumber}</p>
                       </div>
                       <div className="text-right">
                            <h2 className="text-xl font-bold text-slate-800">{data.businessName || 'Your Company'}</h2>
                            <p className="text-sm text-slate-500 whitespace-pre-wrap mt-1 leading-relaxed">{data.businessAddress}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 mb-12 py-8 border-y border-slate-100">
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Bill To</h3>
                            <p className="font-bold text-slate-800 text-lg">{data.clientName || 'Client Name'}</p>
                            <p className="text-sm text-slate-500 whitespace-pre-wrap mt-1 leading-relaxed">{data.clientAddress}</p>
                        </div>
                        <div className="text-right">
                             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Date</h3>
                             <p className="text-slate-800 font-bold">{data.invoiceDate}</p>
                        </div>
                    </div>

                    <div className="flex-grow">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-slate-900">
                                    <th className="py-4 font-black text-[10px] uppercase tracking-widest">Description</th>
                                    <th className="py-4 font-black text-[10px] uppercase tracking-widest text-right">Qty</th>
                                    <th className="py-4 font-black text-[10px] uppercase tracking-widest text-right">Rate</th>
                                    <th className="py-4 font-black text-[10px] uppercase tracking-widest text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-5 font-bold text-slate-800">{item.description || 'Service/Item Description'}</td>
                                        <td className="py-5 text-right text-slate-600 tabular-nums">{item.quantity}</td>
                                        <td className="py-5 text-right text-slate-600 tabular-nums">{data.currency}{item.rate.toFixed(2)}</td>
                                        <td className="py-5 text-right font-black text-slate-800 tabular-nums">{data.currency}{(item.quantity * item.rate).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-12 flex justify-end">
                        <div className="w-72 space-y-4">
                            <div className="flex justify-between text-slate-500 text-sm font-bold">
                                <span>Subtotal</span>
                                <span className="tabular-nums">{data.currency}{subtotal.toFixed(2)}</span>
                            </div>
                            {data.taxPercent > 0 && (
                                <div className="flex justify-between text-slate-500 text-xs">
                                    <span>Tax ({data.taxPercent}%)</span>
                                    <span className="tabular-nums">+{data.currency}{taxAmount.toFixed(2)}</span>
                                </div>
                            )}
                            {data.discountPercent > 0 && (
                                <div className="flex justify-between text-emerald-600 text-xs">
                                    <span>Discount ({data.discountPercent}%)</span>
                                    <span className="tabular-nums">-{data.currency}{discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-4xl font-black text-slate-900 border-t-4 border-slate-900 pt-4 leading-none">
                                <span>TOTAL</span>
                                <span className="tabular-nums">{data.currency}{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile footer instructions */}
        <p className="text-center text-xs text-slate-500 lg:hidden">
            Note: Preview is scaled down for mobile. Download PDF for full resolution.
        </p>
      </div>
    </div>
  );
}
