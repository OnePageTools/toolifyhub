"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Percent, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  PieChart as PieChartIcon,
  TrendingUp,
  Receipt,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type ResultData = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortization: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
};

export function LoanCalculatorForm() {
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [loanTerm, setLoanTerm] = useState<number>(5);
  const [isYearlyTerm, setIsYearlyTerm] = useState(true);
  const [results, setResult] = useState<ResultData | null>(null);
  const [showFullTable, setShowAllTable] = useState(false);

  const calculateLoan = () => {
    const P = loanAmount;
    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const n = isYearlyTerm ? loanTerm * 12 : loanTerm;

    if (P <= 0 || n <= 0) return;

    let emi: number;
    if (monthlyRate === 0) {
      emi = P / n;
    } else {
      emi = (P * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    const amortization = [];
    let remainingBalance = P;

    for (let i = 1; i <= n; i++) {
      const interestForMonth = remainingBalance * monthlyRate;
      const principalForMonth = emi - interestForMonth;
      remainingBalance = Math.max(0, remainingBalance - principalForMonth);

      amortization.push({
        month: i,
        payment: emi,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: remainingBalance,
      });
    }

    setResult({
      monthlyPayment: emi,
      totalPayment,
      totalInterest,
      amortization,
    });
  };

  // Initial calculation
  useEffect(() => {
    calculateLoan();
  }, []);

  const chartData = useMemo(() => {
    if (!results) return [];
    return [
      { name: 'Principal', value: loanAmount, color: '#3B82F6' },
      { name: 'Total Interest', value: results.totalInterest, color: '#F97316' },
    ];
  }, [results, loanAmount]);

  const displayedAmortization = results?.amortization.slice(0, showFullTable ? results.amortization.length : 12);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-400" /> Loan Amount
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="bg-slate-800/50 border-slate-700 h-12 pl-10 text-lg font-bold text-slate-100"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 font-semibold flex items-center gap-2">
                  <Percent className="w-4 h-4 text-orange-400" /> Interest Rate (%)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="bg-slate-800/50 border-slate-700 h-12 text-lg font-bold text-slate-100"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" /> Loan Term
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Math.max(1, parseInt(e.target.value) || 0))}
                    className="bg-slate-800/50 border-slate-700 h-12 text-lg font-bold text-slate-100 flex-1"
                  />
                  <div className="flex items-center gap-2 bg-slate-800/50 px-3 rounded-md border border-slate-700">
                    <span className={cn("text-xs font-bold", !isYearlyTerm ? "text-blue-400" : "text-slate-500")}>Mo</span>
                    <Switch
                      checked={isYearlyTerm}
                      onCheckedChange={setIsYearlyTerm}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className={cn("text-xs font-bold", isYearlyTerm ? "text-blue-400" : "text-slate-500")}>Yr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={calculateLoan}
            className="w-full h-[52px] rounded-xl text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20"
          >
            Calculate Loan Payments
          </Button>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-[#1E293B] border-blue-500/30 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Wallet className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Monthly EMI</span>
                    </div>
                    <p className="text-3xl font-black text-blue-400 tabular-nums">
                      ${results.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#1E293B] border-orange-500/30 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Interest</span>
                    </div>
                    <p className="text-3xl font-black text-orange-400 tabular-nums">
                      ${results.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#1E293B] border-emerald-500/30 sm:col-span-2 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Receipt className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Payment</span>
                    </div>
                    <p className="text-4xl font-black text-emerald-400 tabular-nums">
                      ${results.totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card className="bg-[#1E293B] border-slate-700">
                <CardHeader className="pb-0">
                  <CardTitle className="text-slate-100 flex items-center gap-2 text-lg">
                    <PieChartIcon className="w-5 h-5 text-purple-400" /> Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#F1F5F9' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Amortization Table Section */}
      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-2xl font-bold text-slate-100">Amortization Schedule</h3>
            <Button 
              variant="outline" 
              onClick={() => setShowAllTable(!showFullTable)}
              className="border-slate-700 hover:bg-slate-800"
            >
              {showFullTable ? <><ChevronUp className="mr-2" /> Show Less</> : <><ChevronDown className="mr-2" /> Show All {results.amortization.length} Months</>}
            </Button>
          </div>

          <div className="rounded-xl border border-slate-700 overflow-hidden bg-[#1E293B]/50">
            <ScrollArea className="h-[400px] sm:h-auto">
              <Table>
                <TableHeader className="bg-slate-800/50">
                  <TableRow>
                    <TableHead className="w-[100px] text-slate-300 font-bold">Month</TableHead>
                    <TableHead className="text-right text-slate-300 font-bold">Payment</TableHead>
                    <TableHead className="text-right text-slate-300 font-bold">Principal</TableHead>
                    <TableHead className="text-right text-slate-300 font-bold">Interest</TableHead>
                    <TableHead className="text-right text-slate-300 font-bold">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedAmortization?.map((row) => (
                    <TableRow key={row.month} className="border-slate-800/50 hover:bg-slate-800/30">
                      <TableCell className="font-mono font-medium text-slate-400">#{row.month}</TableCell>
                      <TableCell className="text-right font-mono text-slate-200">
                        ${row.payment.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-blue-400">
                        ${row.principal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-orange-400">
                        ${row.interest.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-emerald-400">
                        ${row.balance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </motion.div>
      )}
    </div>
  );
}
