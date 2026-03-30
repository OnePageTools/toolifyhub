"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Volume2, BookText, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


type DictionaryEntry = {
    word: string;
    phonetic: string;
    audio: string;
    meanings: {
        partOfSpeech: string;
        definitions: {
            definition: string;
            example?: string;
        }[];
        synonyms: string[];
        antonyms: string[];
    }[];
    sourceUrls: string[];
};

const wordOfTheDayList = [
    'serendipity', 'petrichor', 'supine', 'ephemeral', 'solitude', 
    'eloquence', 'nostalgia', 'sonder', 'ineffable', 'mellifluous',
    'ambivalent', 'ubiquitous', 'gregarious', 'pulchritudinous', 'verisimilitude'
];

export function DictionaryForm() {
    const [word, setWord] = useState('');
    const [entry, setEntry] = useState<DictionaryEntry | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isWordOfTheDay, setIsWordOfTheDay] = useState(false);
    const { toast } = useToast();

    const handleSearch = async (query?: string, isWOTD: boolean = false) => {
        const wordToSearch = query || word;
        if (!wordToSearch.trim()) {
            toast({ variant: "destructive", title: "Word cannot be empty." });
            return;
        }
        setIsLoading(true);
        setEntry(null);
        setIsWordOfTheDay(isWOTD);

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToSearch}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.title || 'Word not found.');
            }

            const data = await response.json();
            const firstEntry = data[0];

            const audioUrl = firstEntry.phonetics.find((p: any) => p.audio && p.audio.length > 0)?.audio || '';

            setEntry({
                word: firstEntry.word,
                phonetic: firstEntry.phonetic || (firstEntry.phonetics.find((p: any) => p.text)?.text) || '',
                audio: audioUrl,
                meanings: firstEntry.meanings.map((m: any) => ({
                    partOfSpeech: m.partOfSpeech,
                    definitions: m.definitions.map((d: any) => ({
                        definition: d.definition,
                        example: d.example
                    })),
                    synonyms: m.synonyms || [],
                    antonyms: m.antonyms || [],
                })),
                sourceUrls: firstEntry.sourceUrls || [],
            });

        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const dayOfYear = Math.floor((new Date().valueOf() - new Date(new Date().getFullYear(), 0, 0).valueOf()) / 1000 / 60 / 60 / 24);
        const wotd = wordOfTheDayList[dayOfYear % wordOfTheDayList.length];
        handleSearch(wotd, true);
    }, []);


    const playAudio = () => {
        if (entry?.audio) {
            const audio = new Audio(entry.audio);
            audio.play().catch(e => toast({ variant: 'destructive', title: 'Could not play audio.', description: 'The audio source may be unavailable.' }));
        }
    };

    const getPartOfSpeechColor = (pos: string) => {
        switch (pos.toLowerCase()) {
            case 'noun': return 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300';
            case 'verb': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';
            case 'adjective': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
            case 'adverb': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300';
            case 'exclamation': return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300';
            case 'pronoun': return 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300';
            case 'preposition': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
            case 'conjunction': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        }
    }
    
    // Collect all synonyms and antonyms from all meanings
    const allSynonyms = entry ? [...new Set(entry.meanings.flatMap(m => m.synonyms))] : [];
    const allAntonyms = entry ? [...new Set(entry.meanings.flatMap(m => m.antonyms))] : [];

    return (
        <div className="relative min-h-screen w-full p-4 md:p-8 flex flex-col items-center overflow-hidden">
            <motion.div 
                key="dictionary-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 -z-10"
            />
             <div className="w-full max-w-3xl space-y-8">
                <div className="text-center text-white space-y-4">
                    {isWordOfTheDay && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                            <Star className="w-5 h-5 text-yellow-300" /> Word of the Day <Star className="w-5 h-5 text-yellow-300" />
                        </motion.div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg flex items-center justify-center gap-3">
                        <BookText className="w-10 h-10"/> English Dictionary
                    </h1>
                    <p className="mt-2 text-lg opacity-90">Find definitions, pronunciations, synonyms, and antonyms.</p>
                </div>
                 <div className="flex gap-2 backdrop-blur-sm bg-white/20 dark:bg-black/20 p-2 rounded-full shadow-lg">
                    <Input
                        id="word-input"
                        placeholder="e.g., knowledge"
                        className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-gray-200"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={() => handleSearch()} disabled={isLoading} variant="ghost" size="icon" className="rounded-full bg-white/30 hover:bg-white/50 dark:bg-black/40 dark:hover:bg-black/60 text-white">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                    </Button>
                </div>

                <AnimatePresence>
                {isLoading && !entry && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-10">
                        <Loader2 className="w-12 h-12 text-white animate-spin" />
                    </motion.div>
                )}
                {entry && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-lg border-white/30 text-white shadow-2xl">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-4xl capitalize">{entry.word}</CardTitle>
                                        <CardDescription className="text-indigo-100">{entry.phonetic}</CardDescription>
                                    </div>
                                    {entry.audio && (
                                        <Button onClick={playAudio} variant="outline" size="icon" className="bg-white/30 border-white/40 text-white hover:bg-white/50">
                                            <Volume2 />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {entry.meanings.map((meaning, index) => (
                                    <div key={index}>
                                        <div className="flex items-center gap-4">
                                            <Badge className={cn('text-base', getPartOfSpeechColor(meaning.partOfSpeech))}>{meaning.partOfSpeech}</Badge>
                                            <Separator className="flex-1 bg-white/30" />
                                        </div>
                                        <ul className="mt-3 space-y-4 text-indigo-50">
                                            {meaning.definitions.map((def, defIndex) => (
                                                <li key={defIndex} className="pl-4 border-l-2 border-white/30">
                                                    <p>{def.definition}</p>
                                                    {def.example && (
                                                        <p className="text-indigo-200 italic mt-1">"{def.example}"</p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                
                                {allSynonyms.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Synonyms</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {allSynonyms.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}
                                        </div>
                                    </div>
                                )}

                                {allAntonyms.length > 0 && (
                                     <div>
                                        <h3 className="font-bold text-lg mb-2">Antonyms</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {allAntonyms.map((a, i) => <Badge key={i} variant="destructive">{a}</Badge>)}
                                        </div>
                                    </div>
                                )}

                                {entry.sourceUrls.length > 0 && (
                                    <div className="pt-4 border-t border-white/20 text-xs">
                                        <a href={entry.sourceUrls[0]} target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:underline">
                                            Source: {entry.sourceUrls[0]}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
                </AnimatePresence>
             </div>
        </div>
    );
}
