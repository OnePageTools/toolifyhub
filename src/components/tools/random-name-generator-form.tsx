"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Copy, 
  RefreshCw, 
  Trash2, 
  Download, 
  ClipboardCheck, 
  Users, 
  Globe, 
  Type, 
  CheckCircle2,
  Shuffle,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// --- Name Data ---

const DATA = {
  pakistani: {
    male: ["Muhammad", "Ali", "Ahmed", "Abdullah", "Bilal", "Hamza", "Hassan", "Hussain", "Umar", "Usman", "Zaid", "Zubair", "Ibrahim", "Tariq", "Kamran", "Faisal", "Adnan", "Shahid", "Raza", "Saad"],
    female: ["Fatima", "Ayesha", "Sara", "Zainab", "Maryam", "Amna", "Khadija", "Hania", "Zoya", "Sana", "Sadia", "Kiran", "Nida", "Iqra", "Bushra", "Uzma", "Hina", "Sobia", "Mahnoor", "Rabia"],
    last: ["Khan", "Ahmed", "Malik", "Qureshi", "Sheikh", "Shah", "Butt", "Mirza", "Gillani", "Jatoi", "Siddiqui", "Farooq", "Abbasi", "Raza", "Chaudhry"],
    cities: ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Quetta"],
    phone: "+92 3XX XXXXXXX"
  },
  indian: {
    male: ["Aarav", "Arjun", "Vivaan", "Aditya", "Vihaan", "Krishna", "Sai", "Ishan", "Shaurya", "Aryan", "Kabir", "Ishaan", "Rohan", "Siddharth", "Rahul"],
    female: ["Diya", "Saanvi", "Ananya", "Aadhya", "Pihu", "Pari", "Kavya", "Avni", "Myra", "Ira", "Kiara", "Isha", "Riya", "Sneha", "Aditi"],
    last: ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patil", "Joshi", "Iyer", "Nair", "Reddy", "Chauhan", "Pandey", "Yadav", "Malhotra"],
    cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"],
    phone: "+91 XXXXXXXXXX"
  },
  arabic: {
    male: ["Youssef", "Adam", "Ibrahim", "Rayan", "Malik", "Khalid", "Kareem", "Mustafa", "Rami", "Sami", "Omar", "Hassan", "Walid", "Mahmoud", "Tarek"],
    female: ["Mariam", "Jana", "Salma", "Nour", "Amira", "Reem", "Farah", "Yasmin", "Dana", "Layla", "Aya", "Hala", "Sara", "Hadeel", "Lina"],
    last: ["Al-Farsi", "Al-Sayed", "Mansour", "Haddad", "Jaber", "Khalil", "Abbas", "Nasser", "Ghanem", "Suleiman", "Saleh", "Bakir", "Zaid"],
    cities: ["Dubai", "Cairo", "Riyadh", "Amman", "Beirut", "Doha", "Kuwait City", "Abu Dhabi"],
    phone: "+971 XX XXXXXXX"
  },
  american_british: {
    male: ["Noah", "Liam", "Oliver", "William", "James", "Benjamin", "Lucas", "Henry", "Theodore", "Jack", "Levi", "Alexander", "Jackson", "Mateo", "Daniel"],
    female: ["Olivia", "Emma", "Charlotte", "Amelia", "Sophia", "Mia", "Evelyn", "Harper", "Luna", "Isabella", "Gianna", "Elizabeth", "Eleanor", "Ella", "Violet"],
    last: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Taylor"],
    cities: ["New York", "London", "Los Angeles", "Chicago", "Manchester", "Birmingham", "Houston", "Liverpool"],
    phone: "+1 (XXX) XXX-XXXX"
  },
  turkish: {
    male: ["Yusuf", "Eray", "Kerem", "Mert", "Burak", "Onur", "Selim", "Arda", "Deniz", "Volkan", "Can", "Hakan", "Mehmet", "Mustafa", "Emre"],
    female: ["Zeynep", "Elif", "Defne", "Azra", "Nehir", "Eylül", "Ada", "Miray", "Zehra", "Duru", "Selin", "Esra", "Irem", "Pinar", "Damla"],
    last: ["Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Yıldız", "Erdoğan", "Aydın", "Özdemir", "Aras", "Koc", "Sarı", "Aslan", "Bulut"],
    cities: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep"],
    phone: "+90 5XX XXX XX XX"
  }
};

type Nationality = keyof typeof DATA | 'random';
type Gender = 'male' | 'female' | 'any';
type NameType = 'full' | 'first' | 'last';

type GeneratedName = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: string;
  nationality: string;
  age?: number;
  city?: string;
  email?: string;
  phone?: string;
};

export function RandomNameGeneratorForm() {
  const [nationality, setNationality] = useState<Nationality>('random');
  const [gender, setGender] = useState<Gender>('any');
  const [nameType, setNameType] = useState<NameType>('full');
  const [count, setCount] = useState(12);
  const [fullIdentity, setFullIdentity] = useState(false);
  const [results, setResults] = useState<GeneratedName[]>([]);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const generateNames = useCallback(() => {
    const newResults: GeneratedName[] = [];
    const nats = Object.keys(DATA) as (keyof typeof DATA)[];

    for (let i = 0; i < count; i++) {
      const selectedNat = nationality === 'random' ? nats[Math.floor(Math.random() * nats.length)] : nationality;
      const natData = DATA[selectedNat];
      
      const selectedGender = gender === 'any' ? (Math.random() > 0.5 ? 'male' : 'female') : gender;
      const firstNameList = natData[selectedGender as 'male' | 'female'];
      const lastNameList = natData.last;

      const firstName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
      const lastName = lastNameList[Math.floor(Math.random() * lastNameList.length)];

      let finalName = '';
      if (nameType === 'first') finalName = firstName;
      else if (nameType === 'last') finalName = lastName;
      else finalName = `${firstName} ${lastName}`;

      const identity: GeneratedName = {
        id: Math.random().toString(36).substr(2, 9),
        name: finalName,
        firstName,
        lastName,
        gender: selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1),
        nationality: selectedNat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' & '),
      };

      if (fullIdentity) {
        identity.age = Math.floor(Math.random() * 62) + 18;
        identity.city = natData.cities[Math.floor(Math.random() * natData.cities.length)];
        identity.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 99)}@example.com`;
        
        // Randomize phone digits for specific format
        identity.phone = natData.phone.replace(/X/g, () => Math.floor(Math.random() * 10).toString());
      }

      newResults.push(identity);
    }

    setResults(newResults);
  }, [nationality, gender, nameType, count, fullIdentity]);

  useEffect(() => {
    generateNames();
  }, []); // Initial load

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(id);
      setTimeout(() => setIsCopied(null), 2000);
      toast({ title: "Copied!", description: text });
    });
  };

  const handleCopyAll = () => {
    const text = results.map(r => r.name).join('\n');
    handleCopy(text, 'all');
  };

  const handleDownload = () => {
    const text = results.map(r => {
      if (fullIdentity) {
        return `Name: ${r.name}\nAge: ${r.age}\nCity: ${r.city}\nEmail: ${r.email}\nPhone: ${r.phone}\n-------------------`;
      }
      return r.name;
    }).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `random-names-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* 1. CONFIGURATION CARD */}
      <Card className="bg-slate-800/40 border-slate-700">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Nationality */}
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <Globe className="w-3 h-3 text-blue-400" /> Nationality
              </Label>
              <Select value={nationality} onValueChange={(v: Nationality) => setNationality(v)}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="pakistani">Pakistani</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="american_british">Western (US/UK)</SelectItem>
                  <SelectItem value="turkish">Turkish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <Users className="w-3 h-3 text-purple-400" /> Gender
              </Label>
              <Select value={gender} onValueChange={(v: Gender) => setGender(v)}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="male">Male Only</SelectItem>
                  <SelectItem value="female">Female Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Name Type */}
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <Type className="w-3 h-3 text-emerald-400" /> Name Style
              </Label>
              <Select value={nameType} onValueChange={(v: NameType) => setNameType(v)}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Name</SelectItem>
                  <SelectItem value="first">First Name Only</SelectItem>
                  <SelectItem value="last">Last Name Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Count */}
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <Users className="w-3 h-3 text-orange-400" /> Quantity (1-50)
              </Label>
              <Input 
                type="number" 
                min="1" 
                max="50" 
                value={count} 
                onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                className="bg-slate-900 border-slate-700"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-slate-200 font-bold text-sm">Full Identity Mode</Label>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Age, City, Contact Info</p>
                </div>
                <Switch 
                  checked={fullIdentity} 
                  onCheckedChange={setFullIdentity}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={generateNames} 
                size="lg" 
                className="flex-1 sm:flex-none h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold text-lg rounded-xl shadow-xl shadow-blue-600/20"
              >
                <Shuffle className="mr-2 h-5 w-5" /> Generate Names
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. RESULTS GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs ml-1 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Results Found: {results.length}
          </h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopyAll} className="text-slate-400 hover:text-white">
              {isCopied === 'all' ? <ClipboardCheck className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy All
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} className="text-slate-400 hover:text-white">
              <Download className="w-4 h-4 mr-2" /> Download .txt
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setResults([])} className="text-slate-500 hover:text-red-400">
              <Trash2 className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
        </div>

        <div className={cn(
          "grid gap-4",
          fullIdentity ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}>
          <AnimatePresence mode="popLayout">
            {results.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="bg-[#1E293B] border-slate-700 group hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => handleCopy(item.name, item.id)}
                >
                  <CardContent className="p-5">
                    {/* Basic Name Card */}
                    {!fullIdentity ? (
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                            {item.nationality} • {item.gender}
                          </p>
                        </div>
                        <div className="shrink-0 text-slate-700 group-hover:text-blue-400 transition-colors">
                          {isCopied === item.id ? <ClipboardCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </div>
                      </div>
                    ) : (
                      /* Full Identity Card */
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                           <div className="space-y-0.5">
                              <h4 className="text-xl font-black text-slate-100 group-hover:text-blue-400 transition-colors">{item.name}</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{item.nationality} • {item.gender}</p>
                           </div>
                           <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleCopy(item.name, item.id); }} className="h-8 w-8 text-slate-500">
                             {isCopied === item.id ? <ClipboardCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                           </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                           <div className="space-y-1 group/field">
                              <Label className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Age
                              </Label>
                              <div className="flex items-center justify-between bg-slate-900/50 p-1.5 px-3 rounded-lg border border-slate-800">
                                <span className="text-xs text-slate-300 font-bold">{item.age}</span>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleCopy(item.age?.toString() || '', `${item.id}-age`); }} className="h-4 w-4 opacity-0 group-hover/field:opacity-100 transition-opacity">
                                  <Copy className="w-2.5 h-2.5" />
                                </Button>
                              </div>
                           </div>

                           <div className="space-y-1 group/field">
                              <Label className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> City
                              </Label>
                              <div className="flex items-center justify-between bg-slate-900/50 p-1.5 px-3 rounded-lg border border-slate-800">
                                <span className="text-xs text-slate-300 font-bold truncate">{item.city}</span>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleCopy(item.city || '', `${item.id}-city`); }} className="h-4 w-4 opacity-0 group-hover/field:opacity-100 transition-opacity">
                                  <Copy className="w-2.5 h-2.5" />
                                </Button>
                              </div>
                           </div>

                           <div className="space-y-1 group/field col-span-2">
                              <Label className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                                <Mail className="w-3 h-3" /> Email
                              </Label>
                              <div className="flex items-center justify-between bg-slate-900/50 p-1.5 px-3 rounded-lg border border-slate-800">
                                <span className="text-xs text-slate-300 font-mono truncate">{item.email}</span>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleCopy(item.email || '', `${item.id}-email`); }} className="h-4 w-4 opacity-0 group-hover/field:opacity-100 transition-opacity">
                                  <Copy className="w-2.5 h-2.5" />
                                </Button>
                              </div>
                           </div>

                           <div className="space-y-1 group/field col-span-2">
                              <Label className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                                <Phone className="w-3 h-3" /> Phone
                              </Label>
                              <div className="flex items-center justify-between bg-slate-900/50 p-1.5 px-3 rounded-lg border border-slate-800">
                                <span className="text-xs text-slate-300 font-mono">{item.phone}</span>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleCopy(item.phone || '', `${item.id}-phone`); }} className="h-4 w-4 opacity-0 group-hover/field:opacity-100 transition-opacity">
                                  <Copy className="w-2.5 h-2.5" />
                                </Button>
                              </div>
                           </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Copy Overlay Indicator */}
                    <AnimatePresence>
                      {isCopied === item.id && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-blue-600/10 flex items-center justify-center pointer-events-none"
                        >
                           <Badge className="bg-emerald-500 text-white animate-bounce">COPIED!</Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {results.length === 0 && (
           <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
              <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">Your generated names will appear here.</p>
           </div>
        )}
      </div>
    </div>
  );
}
