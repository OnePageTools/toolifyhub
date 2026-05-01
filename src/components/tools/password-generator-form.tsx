"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Lock, 
  Copy, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  ClipboardCheck,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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

    // Length contribution (max 40)
    score += Math.min(pass.length * 2, 40);

    // Variety contribution
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
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Result Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-2xl p-4 md:p-6 shadow-2xl">
            <Input
              readOnly
              type={showPassword ? 'text' : 'password'}
              value={password}
              className="bg-transparent border-0 text-xl md:text-3xl font-mono font-bold focus-visible:ring-0 h-auto text-slate-100 placeholder:text-slate-600 select-all"
              placeholder="Generating..."
            />
            <div className="flex gap-1 md:gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-100 rounded-xl">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleGenerate} className="text-slate-400 hover:text-blue-400 rounded-xl">
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button onClick={() => handleCopy(password)} className="bg-blue-600 hover:bg-blue-500 rounded-xl px-4 md:px-6">
                {isCopied ? <ClipboardCheck className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Strength Indicator */}
        <div className="space-y-2 px-1">
          <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider">
            <span className="text-slate-400">Security Strength</span>
            <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${strength.score}%` }}
              className={cn("h-full transition-colors duration-500", strength.color)}
            />
          </div>
        </div>
      </motion.div>

      {/* Configuration Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Length & Quantity */}
        <Card className="bg-slate-800/50 border-slate-700 rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-slate-200 font-bold">Password Length</Label>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-lg font-mono font-bold border border-blue-500/20">
                  {length}
                </span>
              </div>
              <Slider
                value={[length]}
                onValueChange={(v) => setLength(v[0])}
                min={8}
                max={64}
                step={1}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200 font-bold">Generate Multiple</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={generateCount}
                  onChange={(e) => setGenerateCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="bg-slate-900 border-slate-700 text-center font-bold text-lg rounded-xl focus:ring-blue-500/50"
                />
                <span className="text-xs text-slate-400 italic">Max 10 per click</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Character Options */}
        <Card className="bg-slate-800/50 border-slate-700 rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <Label className="text-slate-200 font-bold mb-2 block">Include Characters</Label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { key: 'uppercase', label: 'Uppercase (A-Z)' },
                { key: 'lowercase', label: 'Lowercase (a-z)' },
                { key: 'numbers', label: 'Numbers (0-9)' },
                { key: 'symbols', label: 'Symbols (!@#$%^*)' },
                { key: 'excludeSimilar', label: 'Exclude Similar (0,O,l,1)', icon: AlertTriangle },
              ].map((opt) => (
                <div key={opt.key} className="flex items-center justify-between group cursor-pointer" onClick={() => setOptions({...options, [opt.key]: !options[opt.key as keyof typeof options]})}>
                  <div className="flex items-center gap-2">
                    {opt.icon && <opt.icon className="h-3 w-3 text-amber-400" />}
                    <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">{opt.label}</span>
                  </div>
                  <Switch 
                    checked={options[opt.key as keyof typeof options]}
                    onCheckedChange={() => {}} // Controlled by div click
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extra Passwords Section */}
      <AnimatePresence>
        {extraPasswords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <Label className="text-slate-200 font-bold ml-1 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-400" /> Additional Secure Passwords
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {extraPasswords.map((pass, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700 rounded-xl hover:bg-slate-800/50 transition-colors">
                  <span className="font-mono text-slate-300 truncate mr-4">{pass}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(pass)} className="h-8 rounded-lg hover:bg-blue-500/20 text-blue-400">
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        onClick={handleGenerate} 
        size="lg" 
        className="w-full h-[56px] rounded-xl text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-blue-600/20"
      >
        <Lock className="mr-2 h-5 w-5" /> Generate Secure Password
      </Button>
    </div>
  );
}
