"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  GraduationCap, 
  Calculator, 
  Trophy, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  History,
  TrendingUp,
  Settings2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type GradingSystem = '4.0' | '10.0';

type Grade = {
    label: string;
    points: number;
};

const GRADES_4_0: Grade[] = [
    { label: 'A+ (4.0)', points: 4.0 },
    { label: 'A (4.0)', points: 4.0 },
    { label: 'A- (3.7)', points: 3.7 },
    { label: 'B+ (3.3)', points: 3.3 },
    { label: 'B (3.0)', points: 3.0 },
    { label: 'B- (2.7)', points: 2.7 },
    { label: 'C+ (2.3)', points: 2.3 },
    { label: 'C (2.0)', points: 2.0 },
    { label: 'D (1.0)', points: 1.0 },
    { label: 'F (0.0)', points: 0.0 },
];

const GRADES_10_0: Grade[] = [
    { label: 'O (10)', points: 10 },
    { label: 'A+ (9)', points: 9 },
    { label: 'A (8)', points: 8 },
    { label: 'B+ (7)', points: 7 },
    { label: 'B (6)', points: 6 },
    { label: 'C (5)', points: 5 },
    { label: 'F (0)', points: 0 },
];

type SubjectRow = {
    id: string;
    name: string;
    credits: number;
    points: number;
};

type SemesterRow = {
    id: string;
    gpa: number;
    credits: number;
};

export function CgpaCalculatorForm() {
    const [system, setSystem] = useState<GradingSystem>('4.0');
    const [subjects, setSubjects] = useState<SubjectRow[]>([
        { id: '1', name: '', credits: 3, points: 4.0 }
    ]);
    const [semesters, setSemesters] = useState<SemesterRow[]>([]);
    const { toast } = useToast();

    const currentGrades = useMemo(() => system === '4.0' ? GRADES_4_0 : GRADES_10_0, [system]);

    // Derived: Current Semester Stats
    const semesterStats = useMemo(() => {
        let totalCredits = 0;
        let totalWeightedPoints = 0;
        subjects.forEach(s => {
            totalCredits += s.credits;
            totalWeightedPoints += (s.credits * s.points);
        });
        const gpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
        return { gpa, totalCredits, totalWeightedPoints };
    }, [subjects]);

    // Derived: Overall CGPA
    const overallStats = useMemo(() => {
        let totalCredits = semesterStats.totalCredits;
        let totalPoints = semesterStats.totalWeightedPoints;

        semesters.forEach(sem => {
            totalCredits += sem.credits;
            totalPoints += (sem.gpa * sem.credits);
        });

        const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
        return { cgpa, totalCredits };
    }, [semesterStats, semesters]);

    const addSubject = () => {
        setSubjects([...subjects, { id: Math.random().toString(36).substr(2, 9), name: '', credits: 3, points: currentGrades[0].points }]);
    };

    const removeSubject = (id: string) => {
        if (subjects.length === 1) return;
        setSubjects(subjects.filter(s => s.id !== id));
    };

    const updateSubject = (id: string, field: keyof SubjectRow, value: any) => {
        setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const addSemester = () => {
        setSemesters([...semesters, { id: Math.random().toString(36).substr(2, 9), gpa: 0, credits: 0 }]);
    };

    const removeSemester = (id: string) => {
        setSemesters(semesters.filter(s => s.id !== id));
    };

    const updateSemester = (id: string, field: keyof SemesterRow, value: any) => {
        setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const getClassification = (score: number) => {
        const threshold = system === '4.0' ? 1.0 : 2.5;
        if (score >= (system === '4.0' ? 3.7 : 9.0)) return { label: "Distinction 🏆", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
        if (score >= (system === '4.0' ? 3.3 : 8.0)) return { label: "First Division ⭐", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
        if (score >= (system === '4.0' ? 2.7 : 7.0)) return { label: "Second Division ✅", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" };
        if (score >= (system === '4.0' ? 2.0 : 5.0)) return { label: "Pass 📚", color: "text-slate-400 bg-slate-500/10 border-slate-500/30" };
        return { label: "At Risk ⚠️", color: "text-red-400 bg-red-500/10 border-red-500/30" };
    };

    return (
        <div className="space-y-10">
            {/* 1. System Selector */}
            <div className="flex justify-center">
                <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-full border border-slate-700">
                    {[
                        { id: '4.0', label: '4.0 Scale (Pakistan/USA)' },
                        { id: '10.0', label: '10.0 Scale (India)' }
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSystem(s.id as GradingSystem)}
                            className={cn(
                                "px-6 py-2 rounded-full text-xs font-bold transition-all",
                                system === s.id 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 2. MAIN CALCULATOR (Left) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Current Semester */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="border-b border-slate-800 bg-slate-800/30 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-500" /> Current Semester GPA
                                </CardTitle>
                                <Button onClick={addSubject} variant="ghost" size="sm" className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                                    <Plus className="w-4 h-4 mr-1" /> Add Subject
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {subjects.map((sub, index) => (
                                    <motion.div 
                                        key={sub.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="grid grid-cols-12 gap-3 items-center"
                                    >
                                        <div className="col-span-12 md:col-span-5">
                                            <Input 
                                                placeholder={`Subject ${index + 1}`} 
                                                value={sub.name}
                                                onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                                                className="bg-slate-800 border-slate-700 h-10 text-sm"
                                            />
                                        </div>
                                        <div className="col-span-5 md:col-span-3">
                                            <div className="relative">
                                                <Input 
                                                    type="number" 
                                                    placeholder="Credits" 
                                                    value={sub.credits}
                                                    onChange={(e) => updateSubject(sub.id, 'credits', parseFloat(e.target.value) || 0)}
                                                    className="bg-slate-800 border-slate-700 h-10 text-sm text-center"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 uppercase">Cr</span>
                                            </div>
                                        </div>
                                        <div className="col-span-5 md:col-span-3">
                                            <Select value={sub.points.toString()} onValueChange={(v) => updateSubject(sub.id, 'points', parseFloat(v))}>
                                                <SelectTrigger className="bg-slate-800 border-slate-700 h-10 text-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-800 border-slate-700">
                                                    {currentGrades.map(g => (
                                                        <SelectItem key={g.label} value={g.points.toString()}>{g.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 md:col-span-1 flex justify-center">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => removeSubject(sub.id)}
                                                className="h-10 w-10 text-slate-600 hover:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Previous Semesters */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="border-b border-slate-800 bg-slate-800/30 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                                    <History className="w-4 h-4 text-purple-500" /> Previous Semesters
                                </CardTitle>
                                <Button onClick={addSemester} variant="ghost" size="sm" className="h-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                                    <Plus className="w-4 h-4 mr-1" /> Add Semester
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {semesters.length === 0 ? (
                                <div className="text-center py-6 text-slate-500 italic text-sm">
                                    No previous semesters added.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {semesters.map((sem, index) => (
                                        <motion.div 
                                            key={sem.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="grid grid-cols-12 gap-4 items-center bg-slate-800/20 p-4 rounded-xl border border-slate-800/50"
                                        >
                                            <div className="col-span-12 md:col-span-4">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Title</span>
                                                <div className="text-sm font-bold text-slate-300">Semester {index + 1}</div>
                                            </div>
                                            <div className="col-span-5 md:col-span-4">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">GPA Score</span>
                                                <Input 
                                                    type="number" 
                                                    step="0.01"
                                                    value={sem.gpa}
                                                    onChange={(e) => updateSemester(sem.id, 'gpa', parseFloat(e.target.value) || 0)}
                                                    className="bg-slate-800 border-slate-700 h-10 font-bold"
                                                />
                                            </div>
                                            <div className="col-span-5 md:col-span-3">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Credits</span>
                                                <Input 
                                                    type="number" 
                                                    value={sem.credits}
                                                    onChange={(e) => updateSemester(sem.id, 'credits', parseFloat(e.target.value) || 0)}
                                                    className="bg-slate-800 border-slate-700 h-10 font-bold"
                                                />
                                            </div>
                                            <div className="col-span-2 md:col-span-1 pt-5 flex justify-center">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => removeSemester(sem.id)}
                                                    className="text-slate-600 hover:text-red-400"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* 3. RESULTS (Right) */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-slate-900 border-slate-700 shadow-2xl overflow-hidden">
                        <div className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-b border-slate-700 text-center space-y-2">
                             <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-2 shadow-lg shadow-blue-600/20">
                                <Trophy className="w-6 h-6 text-white" />
                             </div>
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Overall CGPA</p>
                             <h2 className="text-6xl font-black text-white tracking-tighter tabular-nums">
                                {overallStats.cgpa.toFixed(2)}
                             </h2>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Academic Status</span>
                                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border", getClassification(overallStats.cgpa).color)}>
                                        {getClassification(overallStats.cgpa).label}
                                    </div>
                                </div>
                                <div className="h-px bg-slate-800" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sem GPA</p>
                                        <p className="text-xl font-black text-slate-200">{semesterStats.gpa.toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tot. Credits</p>
                                        <p className="text-xl font-black text-slate-200">{overallStats.totalCredits}</p>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={() => window.print()} className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700">
                                Print Report
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                            <TrendingUp className="w-4 h-4" /> Grade Tip
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            To reach a CGPA of <span className="text-white font-bold">{(overallStats.cgpa + 0.1).toFixed(1)}</span>, you'll need to maintain an average of <span className="text-white font-bold">{(overallStats.cgpa + 0.2).toFixed(1)}</span> in your upcoming 15 credit hours.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
