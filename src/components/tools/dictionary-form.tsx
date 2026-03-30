"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Volume2, BookText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

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
    }[];
};

export function DictionaryForm() {
    const [word, setWord] = useState('');
    const [entry, setEntry] = useState<DictionaryEntry | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        handleSearch('hello');
    }, []);

    const handleSearch = async (query?: string) => {
        const wordToSearch = query || word;
        if (!wordToSearch.trim()) {
            toast({ variant: "destructive", title: "Word cannot be empty." });
            return;
        }
        setIsLoading(true);
        setEntry(null);
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToSearch}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.title || 'Word not found.');
            }

            const data = await response.json();
            const firstEntry = data[0];

            const audioUrl = firstEntry.phonetics.find((p: any) => p.audio)?.audio || '';

            setEntry({
                word: firstEntry.word,
                phonetic: firstEntry.phonetic || (firstEntry.phonetics[0]?.text) || '',
                audio: audioUrl,
                meanings: firstEntry.meanings.map((m: any) => ({
                    partOfSpeech: m.partOfSpeech,
                    definitions: m.definitions,
                })),
            });

        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const playAudio = () => {
        if (entry?.audio) {
            const audio = new Audio(entry.audio);
            audio.play().catch(e => toast({ variant: 'destructive', title: 'Could not play audio.' }));
        }
    };

    return (
        <div className="relative min-h-screen w-full p-4 md:p-8 flex flex-col items-center overflow-hidden">
            <motion.div 
                key="dictionary-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 -z-10"
            />
             <div className="w-full max-w-2xl space-y-8">
                <div className="text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg flex items-center justify-center gap-3">
                        <BookText className="w-10 h-10"/> English Dictionary
                    </h1>
                    <p className="mt-2 text-lg opacity-90">Find definitions, phonetics, and examples for any word.</p>
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
                                <div className="flex items-center justify-between">
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
                                            <h3 className="font-bold italic text-xl">{meaning.partOfSpeech}</h3>
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
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
                </AnimatePresence>
             </div>
        </div>
    );
}
