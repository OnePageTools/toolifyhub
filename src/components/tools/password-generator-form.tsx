"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Lock, 
  Copy, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ClipboardCheck,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Strength = {
  score: number; // 0 to 100
  label: string;
  color: string;
};

export function PasswordGeneratorForm() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [generateCount, setGenerateCount] = useState(1);
  const [extraPasswords, setExtraPasswords] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = useCallback((passLength: number) => {
    let charset = '';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (options.excludeSimilar) {
      charset = charset.replace(/[0Ol1I]/g, '');
    }

    if (charset === '') return '';

    let generated = '';
    const array = new Uint32Array(passLength);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < passLength; i++) {
      generated += charset[array[i] % charset.length];
    }
    return generated;
  }, [options]);

  const handleGenerate = useCallback(() => {
    const mainPass = generatePassword(length);
    setPassword(mainPass);
    
    if (generateCount > 1) {
      const others = Array.from({ length: generateCount - 1 }, () => generatePassword(length));
      setExtraPasswords(others);
    } else {
      setExtraPasswords([]);
    }
  }, [generatePassword, length, generateCount]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const calculateStrength = (pass: string): Strength => {
    let score = 0;
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
    score += Math.min(pass.length * 2, 40);
    if (/[A-Z]/.test(pass)) score += 15;
    if (/[a-z]/.test(pass)) score += 15;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;
    if (score < 30) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score < 50) return { score, label: 'Medium', color: 'bg-orange-500' };
    if (score < 75) return { score, label: 'Strong', color: 'bg-blue-500' };
    return { score, label: 'Very Strong', color: 'bg-green-500' };
  };

  const strength = calculateStrength(password);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Password copied to clipboard.' });
    });
  };

  return (
    <div className="space-y-8">
      {/* Result Section */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-sm" />
          <div className="relative flex items-center gap-2 bg-secondary/30 dark:bg-slate-900 border rounded-2xl p-4 shadow-sm group-focus-within:border-primary/50 transition-all">
            <Input
              readOnly
              type={showPassword ? 'text' : 'password'}
              value={password}
              className="bg-transparent border-0 text-xl md:text-2xl font-mono font-bold focus-visible:ring-0 h-auto text-foreground placeholder:text-muted-foreground select-all px-2"
              placeholder="Generating..."
            />
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleGenerate} className="text-muted-foreground hover:text-primary">
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button onClick={() => handleCopy(password)} className="h-11 px-4">
                {isCopied ? <ClipboardCheck className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2 px-1">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-muted-foreground">Security Strength</span>
            <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden border border-border/50">
            <motion.div animate={{ width: `${strength.score}%` }} className={cn("h-full transition-all duration-500", strength.color)} />
          </div>
        </div>
      </motion.div>

      {/* Configuration Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="font-bold text-foreground">Length</Label>
                <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 font-mono">
                  {length}
                </span>
              </div>
              <Slider value={[length]} onValueChange={(v) => setLength(v[0])} min={8} max={64} step={1} />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-foreground">Generate Count</Label>
              <Input
                type="number"
                min={1} max={10}
                value={generateCount}
                onChange={(e) => setGenerateCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="h-10 text-center font-bold"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6 space-y-4">
            <Label className="font-bold text-foreground mb-2 block">Characters</Label>
            <div className="space-y-3">
              {[
                { key: 'uppercase', label: 'A-Z' },
                { key: 'lowercase', label: 'a-z' },
                { key: 'numbers', label: '0-9' },
                { key: 'symbols', label: '!@#' },
                { key: 'excludeSimilar', label: 'No Similar (i,l,1)', icon: AlertTriangle },
              ].map((opt) => (
                <div key={opt.key} className="flex items-center justify-between cursor-pointer" onClick={() => setOptions({...options, [opt.key]: !options[opt.key as keyof typeof options]})}>
                  <span className="text-sm text-foreground flex items-center gap-2">
                    {opt.icon && <opt.icon className="h-3 w-3 text-amber-500" />}
                    {opt.label}
                  </span>
                  <Switch checked={options[opt.key as keyof typeof options]} onCheckedChange={() => {}} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {extraPasswords.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-6 border-t">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Additional Passwords
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {extraPasswords.map((pass, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border group hover:border-primary/40 transition-all">
                  <span className="font-mono text-sm text-foreground truncate mr-4">{pass}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(pass)} className="h-8 text-primary hover:bg-primary/10">
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button onClick={handleGenerate} className="w-full h-12">
        <Lock className="mr-2 h-4 w-4" /> Refresh Password
      </Button>
    </div>
  );
}
