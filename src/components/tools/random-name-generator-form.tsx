"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
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
        identity.phone = natData.phone.replace(/X/g, () => Math.floor(Math.random() * 10).toString());
      }

      newResults.push(identity);
    }

    setResults(newResults);
  }, [nationality, gender, nameType, count, fullIdentity]);

  useEffect(() => {
    generateNames();
  }, []);

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
    link.download = `random-names.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white dark:bg-card border-border shadow-md">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Globe className="w-3 h-3 text-primary" /> Nationality
              </Label>
              <Select value={nationality} onValueChange={(v: Nationality) => setNationality(v)}>
                <SelectTrigger className="bg-secondary/20 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="pakistani">Pakistani</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="american_british">Western</SelectItem>
                  <SelectItem value="turkish">Turkish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Users className="w-3 h-3 text-primary" /> Gender
              </Label>
              <Select value={gender} onValueChange={(v: Gender) => setGender(v)}>
                <SelectTrigger className="bg-secondary/20 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Type className="w-3 h-3 text-primary" /> Name Style
              </Label>
              <Select value={nameType} onValueChange={(v: NameType) => setNameType(v)}>
                <SelectTrigger className="bg-secondary/20 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Name</SelectItem>
                  <SelectItem value="first">First Name</SelectItem>
                  <SelectItem value="last">Last Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Users className="w-3 h-3 text-primary" /> Quantity (1-50)
              </Label>
              <Input 
                type="number" 
                value={count} 
                onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                className="bg-secondary/20 border-border"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-xl border border-border">
              <div className="space-y-0.5">
                <Label className="text-foreground font-bold text-sm">Full Identity</Label>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Age, City, Contact</p>
              </div>
              <Switch checked={fullIdentity} onCheckedChange={setFullIdentity} />
            </div>

            <Button 
              onClick={generateNames} 
              size="lg" 
              className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-lg rounded-xl shadow-xl"
            >
              <Shuffle className="mr-2 h-5 w-5" /> Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <h3 className="text-muted-foreground font-bold uppercase tracking-widest text-xs ml-1 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Results: {results.length}
          </h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopyAll} className="text-muted-foreground hover:text-foreground">
              {isCopied === 'all' ? <ClipboardCheck className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy All
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setResults([])} className="text-muted-foreground hover:text-destructive">
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
              >
                <Card 
                  className="bg-white dark:bg-card border-border group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => handleCopy(item.name, item.id)}
                >
                  <CardContent className="p-5">
                    {!fullIdentity ? (
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">{item.nationality} • {item.gender}</p>
                        </div>
                        <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                          {isCopied === item.id ? <ClipboardCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-border pb-3">
                           <div className="space-y-0.5">
                              <h4 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{item.name}</h4>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.nationality} • {item.gender}</p>
                           </div>
                           <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleCopy(item.name, item.id); }} className="h-8 w-8">
                             {isCopied === item.id ? <ClipboardCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                           </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                           <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Age
                              </Label>
                              <div className="flex items-center justify-between bg-secondary/20 p-1.5 px-3 rounded-lg border border-border">
                                <span className="text-xs text-foreground font-bold">{item.age}</span>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> City
                              </Label>
                              <div className="flex items-center justify-between bg-secondary/20 p-1.5 px-3 rounded-lg border border-border">
                                <span className="text-xs text-foreground font-bold truncate">{item.city}</span>
                              </div>
                           </div>
                           <div className="space-y-1 col-span-2">
                              <Label className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                <Mail className="w-3 h-3" /> Email
                              </Label>
                              <div className="flex items-center justify-between bg-secondary/20 p-1.5 px-3 rounded-lg border border-border">
                                <span className="text-xs text-foreground font-mono truncate">{item.email}</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
