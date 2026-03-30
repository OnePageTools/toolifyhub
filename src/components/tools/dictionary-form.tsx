"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

    const handleSearch = async () => {
        if (!word.trim()) {
            toast({ variant: "destructive", title: "Word cannot be empty." });
            return;
        }
        setIsLoading(true);
        setEntry(null);
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.title || 'Word not found.');
            }

            const data = await response.json();
            const firstEntry = data[0];

            const audioUrl = firstEntry.phonetics.find((p: any) => p.audio)?.audio || '';

            setEntry({
                word: firstEntry.word,
                phonetic: firstEntry.phonetic || '',
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
        <div className="space-y-6">
            <div className="flex gap-2">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="word-input">Word</Label>
                    <Input
                        id="word-input"
                        placeholder="e.g., knowledge"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button onClick={handleSearch} disabled={isLoading} className="self-end">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                </Button>
            </div>

            {entry && (
                <Card className="animate-in fade-in-50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-3xl capitalize">{entry.word}</CardTitle>
                                <CardDescription>{entry.phonetic}</CardDescription>
                            </div>
                            {entry.audio && (
                                <Button onClick={playAudio} variant="outline" size="icon">
                                    <Volume2 />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {entry.meanings.map((meaning, index) => (
                            <div key={index}>
                                <div className="flex items-center gap-4">
                                    <h3 className="font-bold italic text-lg">{meaning.partOfSpeech}</h3>
                                    <Separator className="flex-1" />
                                </div>
                                <ul className="mt-2 space-y-3 list-decimal list-outside pl-5">
                                    {meaning.definitions.map((def, defIndex) => (
                                        <li key={defIndex}>
                                            <p>{def.definition}</p>
                                            {def.example && (
                                                <p className="text-muted-foreground italic mt-1">"{def.example}"</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
