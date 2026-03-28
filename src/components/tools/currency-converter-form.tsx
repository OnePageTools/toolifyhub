
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, TrendingUp, Copy, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

// Comprehensive currency data. In a real app, this would come from an API.
const currencyData = {
  USD: { name: 'US Dollar', rate: 1, history: [1, 1, 1, 1, 1, 1, 1] },
  EUR: { name: 'Euro', rate: 0.92, history: [0.93, 0.92, 0.925, 0.91, 0.92, 0.922, 0.92] },
  JPY: { name: 'Japanese Yen', rate: 157.0, history: [156.5, 157.2, 157.1, 156.8, 157.0, 157.3, 157.0] },
  GBP: { name: 'British Pound', rate: 0.79, history: [0.78, 0.785, 0.79, 0.792, 0.788, 0.791, 0.79] },
  AUD: { name: 'Australian Dollar', rate: 1.5, history: [1.49, 1.51, 1.50, 1.505, 1.498, 1.50, 1.5] },
  CAD: { name: 'Canadian Dollar', rate: 1.37, history: [1.36, 1.365, 1.37, 1.372, 1.368, 1.371, 1.37] },
  CHF: { name: 'Swiss Franc', rate: 0.9, history: [0.91, 0.89, 0.9, 0.905, 0.895, 0.9, 0.9] },
  CNY: { name: 'Chinese Yuan', rate: 7.25, history: [7.24, 7.26, 7.25, 7.255, 7.245, 7.25, 7.25] },
  SEK: { name: 'Swedish Krona', rate: 10.45, history: [10.4, 10.5, 10.45, 10.42, 10.48, 10.46, 10.45] },
  NZD: { name: 'New Zealand Dollar', rate: 1.63, history: [1.62, 1.64, 1.63, 1.635, 1.625, 1.63, 1.63] },
  MXN: { name: 'Mexican Peso', rate: 18.1, history: [18.0, 18.2, 18.1, 18.15, 18.05, 18.1, 18.1] },
  SGD: { name: 'Singapore Dollar', rate: 1.35, history: [1.34, 1.36, 1.35, 1.355, 1.345, 1.35, 1.35] },
  HKD: { name: 'Hong Kong Dollar', rate: 7.8, history: [7.79, 7.81, 7.8, 7.805, 7.795, 7.8, 7.8] },
  NOK: { name: 'Norwegian Krone', rate: 10.58, history: [10.5, 10.6, 10.58, 10.55, 10.62, 10.59, 10.58] },
  KRW: { name: 'South Korean Won', rate: 1378.0, history: [1370, 1380, 1378, 1375, 1382, 1379, 1378] },
  TRY: { name: 'Turkish Lira', rate: 32.5, history: [32.4, 32.6, 32.5, 32.55, 32.45, 32.5, 32.5] },
  RUB: { name: 'Russian Ruble', rate: 89.0, history: [88.5, 89.5, 89.0, 89.2, 88.8, 89.1, 89.0] },
  INR: { name: 'Indian Rupee', rate: 83.5, history: [83.4, 83.6, 83.5, 83.55, 83.45, 83.52, 83.5] },
  BRL: { name: 'Brazilian Real', rate: 5.25, history: [5.2, 5.3, 5.25, 5.28, 5.22, 5.26, 5.25] },
  ZAR: { name: 'South African Rand', rate: 18.7, history: [18.6, 18.8, 18.7, 18.75, 18.65, 18.7, 18.7] },
  AED: { name: 'UAE Dirham', rate: 3.67, history: [3.67, 3.67, 3.67, 3.67, 3.67, 3.67, 3.67] },
  AFN: { name: 'Afghan Afghani', rate: 71.5, history: [71, 72, 71.5, 71.2, 71.8, 71.6, 71.5] },
  ALL: { name: 'Albanian Lek', rate: 93.0, history: [92.5, 93.5, 93.0, 93.2, 92.8, 93.1, 93.0] },
  AMD: { name: 'Armenian Dram', rate: 387.0, history: [386, 388, 387, 387.5, 386.5, 387, 387] },
  ANG: { name: 'Netherlands Antillean Guilder', rate: 1.79, history: [1.78, 1.8, 1.79, 1.795, 1.785, 1.79, 1.79] },
  AOA: { name: 'Angolan Kwanza', rate: 830.0, history: [825, 835, 830, 832, 828, 831, 830] },
  ARS: { name: 'Argentine Peso', rate: 900.0, history: [895, 905, 900, 902, 898, 901, 900] },
  AWG: { name: 'Aruban Florin', rate: 1.79, history: [1.78, 1.8, 1.79, 1.795, 1.785, 1.79, 1.79] },
  AZN: { name: 'Azerbaijani Manat', rate: 1.7, history: [1.69, 1.71, 1.7, 1.705, 1.695, 1.7, 1.7] },
  BAM: { name: 'Bosnia-Herzegovina Convertible Mark', rate: 1.8, history: [1.79, 1.81, 1.8, 1.805, 1.795, 1.8, 1.8] },
  BBD: { name: 'Barbadian Dollar', rate: 2.0, history: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0] },
  BDT: { name: 'Bangladeshi Taka', rate: 117.0, history: [116.5, 117.5, 117.0, 117.2, 116.8, 117.1, 117.0] },
  BGN: { name: 'Bulgarian Lev', rate: 1.8, history: [1.79, 1.81, 1.8, 1.805, 1.795, 1.8, 1.8] },
  BHD: { name: 'Bahraini Dinar', rate: 0.38, history: [0.37, 0.39, 0.38, 0.385, 0.375, 0.38, 0.38] },
  BIF: { name: 'Burundian Franc', rate: 2850.0, history: [2840, 2860, 2850, 2855, 2845, 2850, 2850] },
  BMD: { name: 'Bermudan Dollar', rate: 1.0, history: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] },
  BND: { name: 'Brunei Dollar', rate: 1.35, history: [1.34, 1.36, 1.35, 1.355, 1.345, 1.35, 1.35] },
  BOB: { name: 'Bolivian Boliviano', rate: 6.9, history: [6.8, 7.0, 6.9, 6.95, 6.85, 6.9, 6.9] },
  BSD: { name: 'Bahamian Dollar', rate: 1.0, history: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] },
  BTN: { name: 'Bhutanese Ngultrum', rate: 83.5, history: [83.4, 83.6, 83.5, 83.55, 83.45, 83.52, 83.5] },
  BWP: { name: 'Botswanan Pula', rate: 13.7, history: [13.6, 13.8, 13.7, 13.75, 13.65, 13.7, 13.7] },
  BYN: { name: 'Belarusian Ruble', rate: 3.25, history: [3.2, 3.3, 3.25, 3.28, 3.22, 3.26, 3.25] },
  BZD: { name: 'Belize Dollar', rate: 2.0, history: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0] },
  CDF: { name: 'Congolese Franc', rate: 2700.0, history: [2690, 2710, 2700, 2705, 2695, 2700, 2700] },
  CLP: { name: 'Chilean Peso', rate: 925.0, history: [920, 930, 925, 928, 922, 926, 925] },
  COP: { name: 'Colombian Peso', rate: 3900.0, history: [3880, 3920, 3900, 3910, 3890, 3905, 3900] },
  CRC: { name: 'Costa Rican Colón', rate: 520.0, history: [518, 522, 520, 521, 519, 520.5, 520] },
  CUP: { name: 'Cuban Peso', rate: 24.0, history: [24.0, 24.0, 24.0, 24.0, 24.0, 24.0, 24.0] },
  CVE: { name: 'Cape Verdean Escudo', rate: 102.0, history: [101.5, 102.5, 102.0, 102.2, 101.8, 102.1, 102.0] },
  CZK: { name: 'Czech Koruna', rate: 23.0, history: [22.8, 23.2, 23.0, 23.1, 22.9, 23.05, 23.0] },
  DJF: { name: 'Djiboutian Franc', rate: 177.0, history: [176, 178, 177, 177.5, 176.5, 177, 177] },
  DKK: { name: 'Danish Krone', rate: 6.85, history: [6.8, 6.9, 6.85, 6.88, 6.82, 6.86, 6.85] },
  DOP: { name: 'Dominican Peso', rate: 58.0, history: [57.8, 58.2, 58.0, 58.1, 57.9, 58.05, 58.0] },
  DZD: { name: 'Algerian Dinar', rate: 134.0, history: [133.5, 134.5, 134.0, 134.2, 133.8, 134.1, 134.0] },
  EGP: { name: 'Egyptian Pound', rate: 47.5, history: [47.3, 47.7, 47.5, 47.6, 47.4, 47.55, 47.5] },
  ERN: { name: 'Eritrean Nakfa', rate: 15.0, history: [15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0] },
  ETB: { name: 'Ethiopian Birr', rate: 57.0, history: [56.8, 57.2, 57.0, 57.1, 56.9, 57.05, 57.0] },
  FJD: { name: 'Fijian Dollar', rate: 2.25, history: [2.2, 2.3, 2.25, 2.28, 2.22, 2.26, 2.25] },
  FKP: { name: 'Falkland Islands Pound', rate: 0.79, history: [0.78, 0.785, 0.79, 0.792, 0.788, 0.791, 0.79] },
  FOK: { name: 'Faroese Króna', rate: 6.85, history: [6.8, 6.9, 6.85, 6.88, 6.82, 6.86, 6.85] },
  GEL: { name: 'Georgian Lari', rate: 2.8, history: [2.78, 2.82, 2.8, 2.81, 2.79, 2.805, 2.8] },
  GGP: { name: 'Guernsey Pound', rate: 0.79, history: [0.78, 0.785, 0.79, 0.792, 0.788, 0.791, 0.79] },
  GHS: { name: 'Ghanaian Cedi', rate: 14.5, history: [14.4, 14.6, 14.5, 14.55, 14.45, 14.5, 14.5] },
  GIP: { name: 'Gibraltar Pound', rate: 0.79, history: [0.78, 0.785, 0.79, 0.792, 0.788, 0.791, 0.79] },
  GMD: { name: 'Gambian Dalasi', rate: 68.0, history: [67.5, 68.5, 68.0, 68.2, 67.8, 68.1, 68.0] },
  GNF: { name: 'Guinean Franc', rate: 8600.0, history: [8580, 8620, 8600, 8610, 8590, 8605, 8600] },
  GTQ: { name: 'Guatemalan Quetzal', rate: 7.75, history: [7.7, 7.8, 7.75, 7.78, 7.72, 7.76, 7.75] },
  GYD: { name: 'Guyanaese Dollar', rate: 209.0, history: [208, 210, 209, 209.5, 208.5, 209, 209] },
  HNL: { name: 'Honduran Lempira', rate: 24.5, history: [24.4, 24.6, 24.5, 24.55, 24.45, 24.5, 24.5] },
  HRK: { name: 'Croatian Kuna', rate: 7.0, history: [6.9, 7.1, 7.0, 7.05, 6.95, 7.0, 7.0] },
  HTG: { name: 'Haitian Gourde', rate: 132.0, history: [131, 133, 132, 132.5, 131.5, 132, 132] },
  HUF: { name: 'Hungarian Forint', rate: 360.0, history: [358, 362, 360, 361, 359, 360.5, 360] },
  IDR: { name: 'Indonesian Rupiah', rate: 16000.0, history: [15950, 16050, 16000, 16020, 15980, 16010, 16000] },
  ILS: { name: 'Israeli New Shekel', rate: 3.7, history: [3.68, 3.72, 3.7, 3.71, 3.69, 3.705, 3.7] },
  IMP: { name: 'Manx pound', rate: 0.79, history: [0.78, 0.785, 0.79, 0.792, 0.788, 0.791, 0.79] },
  IQD: { name: 'Iraqi Dinar', rate: 1310.0, history: [1305, 1315, 1310, 1312, 1308, 1311, 1310] },
  IRR: { name: 'Iranian Rial', rate: 42000.0, history: [41900, 42100, 42000, 42050, 41950, 42000, 42000] },
  ISK: { name: 'Icelandic Króna', rate: 138.0, history: [137, 139, 138, 138.5, 137.5, 138, 138] },
  JEP: { name: 'Jersey Pound', rate: 0.79, history: [0.78, 0.785, 0.79, 0.792, 0.788, 0.791, 0.79] },
  JMD: { name: 'Jamaican Dollar', rate: 155.0, history: [154, 156, 155, 155.5, 154.5, 155, 155] },
  JOD: { name: 'Jordanian Dinar', rate: 0.71, history: [0.7, 0.72, 0.71, 0.715, 0.705, 0.71, 0.71] },
  KES: { name: 'Kenyan Shilling', rate: 130.0, history: [129, 131, 130, 130.5, 129.5, 130, 130] },
  KGS: { name: 'Kyrgystani Som', rate: 84.0, history: [83.5, 84.5, 84.0, 84.2, 83.8, 84.1, 84.0] },
  KHR: { name: 'Cambodian Riel', rate: 4100.0, history: [4090, 4110, 4100, 4105, 4095, 4100, 4100] },
  KID: { name: 'Kiribati Dollar', rate: 1.5, history: [1.49, 1.51, 1.50, 1.505, 1.498, 1.50, 1.5] },
  KMF: { name: 'Comorian Franc', rate: 450.0, history: [448, 452, 450, 451, 449, 450.5, 450] },
  KWD: { name: 'Kuwaiti Dinar', rate: 0.3, history: [0.29, 0.31, 0.3, 0.305, 0.295, 0.3, 0.3] },
  KYD: { name: 'Cayman Islands Dollar', rate: 0.83, history: [0.82, 0.84, 0.83, 0.835, 0.825, 0.83, 0.83] },
  KZT: { name: 'Kazakhstani Tenge', rate: 440.0, history: [438, 442, 440, 441, 439, 440.5, 440] },
  LAK: { name: 'Laotian Kip', rate: 21500.0, history: [21400, 21600, 21500, 21550, 21450, 21500, 21500] },
  LBP: { name: 'Lebanese Pound', rate: 89500.0, history: [89000, 90000, 89500, 89700, 89300, 89600, 89500] },
  LKR: { name: 'Sri Lankan Rupee', rate: 300.0, history: [298, 302, 300, 301, 299, 300.5, 300] },
  LRD: { name: 'Liberian Dollar', rate: 193.0, history: [192, 194, 193, 193.5, 192.5, 193, 193] },
  LSL: { name: 'Lesotho Loti', rate: 18.7, history: [18.6, 18.8, 18.7, 18.75, 18.65, 18.7, 18.7] },
  LYD: { name: 'Libyan Dinar', rate: 4.8, history: [4.7, 4.9, 4.8, 4.85, 4.75, 4.8, 4.8] },
  MAD: { name: 'Moroccan Dirham', rate: 10.0, history: [9.9, 10.1, 10.0, 10.05, 9.95, 10.0, 10.0] },
  MDL: { name: 'Moldovan Leu', rate: 17.7, history: [17.6, 17.8, 17.7, 17.75, 17.65, 17.7, 17.7] },
  MGA: { name: 'Malagasy Ariary', rate: 4400.0, history: [4380, 4420, 4400, 4410, 4390, 4405, 4400] },
  MKD: { name: 'Macedonian Denar', rate: 56.5, history: [56, 57, 56.5, 56.8, 56.2, 56.6, 56.5] },
  MMK: { name: 'Myanmar Kyat', rate: 2100.0, history: [2090, 2110, 2100, 2105, 2095, 2100, 2100] },
  MNT: { name: 'Mongolian Tugrik', rate: 3400.0, history: [3390, 3410, 3400, 3405, 3395, 3400, 3400] },
  MOP: { name: 'Macanese Pataca', rate: 8.0, history: [7.9, 8.1, 8.0, 8.05, 7.95, 8.0, 8.0] },
  MRU: { name: 'Mauritanian Ouguiya', rate: 39.5, history: [39.3, 39.7, 39.5, 39.6, 39.4, 39.55, 39.5] },
  MUR: { name: 'Mauritian Rupee', rate: 46.5, history: [46.3, 46.7, 46.5, 46.6, 46.4, 46.55, 46.5] },
  MVR: { name: 'Maldivian Rufiyaa', rate: 15.4, history: [15.3, 15.5, 15.4, 15.45, 15.35, 15.4, 15.4] },
  MWK: { name: 'Malawian Kwacha', rate: 1750.0, history: [1740, 1760, 1750, 1755, 1745, 1750, 1750] },
  MYR: { name: 'Malaysian Ringgit', rate: 4.7, history: [4.6, 4.8, 4.7, 4.75, 4.65, 4.7, 4.7] },
  MZN: { name: 'Mozambican Metical', rate: 63.5, history: [63, 64, 63.5, 63.8, 63.2, 63.6, 63.5] },
  NAD: { name: 'Namibian Dollar', rate: 18.7, history: [18.6, 18.8, 18.7, 18.75, 18.65, 18.7, 18.7] },
  NGN: { name: 'Nigerian Naira', rate: 1450.0, history: [1440, 1460, 1450, 1455, 1445, 1450, 1450] },
  NIO: { name: 'Nicaraguan Córdoba', rate: 36.8, history: [36.7, 36.9, 36.8, 36.85, 36.75, 36.8, 36.8] },
  NPR: { name: 'Nepalese Rupee', rate: 133.0, history: [132.5, 133.5, 133.0, 133.2, 132.8, 133.1, 133.0] },
  OMR: { name: 'Omani Rial', rate: 0.38, history: [0.37, 0.39, 0.38, 0.385, 0.375, 0.38, 0.38] },
  PAB: { name: 'Panamanian Balboa', rate: 1.0, history: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] },
  PEN: { name: 'Peruvian Sol', rate: 3.75, history: [3.7, 3.8, 3.75, 3.78, 3.72, 3.76, 3.75] },
  PGK: { name: 'Papua New Guinean Kina', rate: 3.8, history: [3.7, 3.9, 3.8, 3.85, 3.75, 3.8, 3.8] },
  PHP: { name: 'Philippine Peso', rate: 58.5, history: [58, 59, 58.5, 58.8, 58.2, 58.6, 58.5] },
  PKR: { name: 'Pakistani Rupee', rate: 278.0, history: [277, 279, 278, 278.5, 277.5, 278, 278] },
  PLN: { name: 'Polish Złoty', rate: 3.95, history: [3.9, 4.0, 3.95, 3.98, 3.92, 3.96, 3.95] },
  PYG: { name: 'Paraguayan Guarani', rate: 7500.0, history: [7480, 7520, 7500, 7510, 7490, 7505, 7500] },
  QAR: { name: 'Qatari Rial', rate: 3.64, history: [3.64, 3.64, 3.64, 3.64, 3.64, 3.64, 3.64] },
  RON: { name: 'Romanian Leu', rate: 4.6, history: [4.5, 4.7, 4.6, 4.65, 4.55, 4.6, 4.6] },
  RSD: { name: 'Serbian Dinar', rate: 108.0, history: [107, 109, 108, 108.5, 107.5, 108, 108] },
  RWF: { name: 'Rwandan Franc', rate: 1300.0, history: [1290, 1310, 1300, 1305, 1295, 1300, 1300] },
  SAR: { name: 'Saudi Riyal', rate: 3.75, history: [3.75, 3.75, 3.75, 3.75, 3.75, 3.75, 3.75] },
  SBD: { name: 'Solomon Islands Dollar', rate: 8.4, history: [8.3, 8.5, 8.4, 8.45, 8.35, 8.4, 8.4] },
  SCR: { name: 'Seychellois Rupee', rate: 13.5, history: [13.4, 13.6, 13.5, 13.55, 13.45, 13.5, 13.5] },
  SDG: { name: 'Sudanese Pound', rate: 600.0, history: [595, 605, 600, 602, 598, 601, 600] },
  SHP: { name: 'Saint Helena Pound', rate: 0.79, history: [0.78, 0.785, 0.79, 0.792, 0.788, 0.791, 0.79] },
  SLE: { name: 'Sierra Leonean Leone', rate: 22.5, history: [22.4, 22.6, 22.5, 22.55, 22.45, 22.5, 22.5] },
  SOS: { name: 'Somali Shilling', rate: 570.0, history: [568, 572, 570, 571, 569, 570.5, 570] },
  SRD: { name: 'Surinamese Dollar', rate: 35.0, history: [34.8, 35.2, 35.0, 35.1, 34.9, 35.05, 35.0] },
  SSP: { name: 'South Sudanese Pound', rate: 1550.0, history: [1540, 1560, 1550, 1555, 1545, 1550, 1550] },
  STN: { name: 'São Tomé and Príncipe Dobra', rate: 24.5, history: [24.4, 24.6, 24.5, 24.55, 24.45, 24.5, 24.5] },
  SYP: { name: 'Syrian Pound', rate: 13000.0, history: [12950, 13050, 13000, 13020, 12980, 13010, 13000] },
  SZL: { name: 'Eswatini Lilangeni', rate: 18.7, history: [18.6, 18.8, 18.7, 18.75, 18.65, 18.7, 18.7] },
  THB: { name: 'Thai Baht', rate: 36.5, history: [36.3, 36.7, 36.5, 36.6, 36.4, 36.55, 36.5] },
  TJS: { name: 'Tajikistani Somoni', rate: 10.9, history: [10.8, 11.0, 10.9, 10.95, 10.85, 10.9, 10.9] },
  TMT: { name: 'Turkmenistani Manat', rate: 3.5, history: [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5] },
  TND: { name: 'Tunisian Dinar', rate: 3.1, history: [3.0, 3.2, 3.1, 3.15, 3.05, 3.1, 3.1] },
  TOP: { name: 'Tongan Paʻanga', rate: 2.3, history: [2.2, 2.4, 2.3, 2.35, 2.25, 2.3, 2.3] },
  TTD: { name: 'Trinidad and Tobago Dollar', rate: 6.8, history: [6.7, 6.9, 6.8, 6.85, 6.75, 6.8, 6.8] },
  TVD: { name: 'Tuvaluan Dollar', rate: 1.5, history: [1.49, 1.51, 1.50, 1.505, 1.498, 1.50, 1.5] },
  TWD: { name: 'New Taiwan Dollar', rate: 32.3, history: [32.2, 32.4, 32.3, 32.35, 32.25, 32.3, 32.3] },
  TZS: { name: 'Tanzanian Shilling', rate: 2600.0, history: [2590, 2610, 2600, 2605, 2595, 2600, 2600] },
  UAH: { name: 'Ukrainian Hryvnia', rate: 40.5, history: [40.3, 40.7, 40.5, 40.6, 40.4, 40.55, 40.5] },
  UGX: { name: 'Ugandan Shilling', rate: 3750.0, history: [3740, 3760, 3750, 3755, 3745, 3750, 3750] },
  UYU: { name: 'Uruguayan Peso', rate: 38.0, history: [37.8, 38.2, 38.0, 38.1, 37.9, 38.05, 38.0] },
  UZS: { name: 'Uzbekistan Som', rate: 12600.0, history: [12550, 12650, 12600, 12620, 12580, 12610, 12600] },
  VES: { name: 'Venezuelan Bolívar', rate: 36.5, history: [36.3, 36.7, 36.5, 36.6, 36.4, 36.55, 36.5] },
  VND: { name: 'Vietnamese Dong', rate: 25400.0, history: [25350, 25450, 25400, 25420, 25380, 25410, 25400] },
  VUV: { name: 'Vanuatu Vatu', rate: 118.0, history: [117, 119, 118, 118.5, 117.5, 118, 118] },
  WST: { name: 'Samoan Tala', rate: 2.7, history: [2.6, 2.8, 2.7, 2.75, 2.65, 2.7, 2.7] },
  XAF: { name: 'Central African CFA Franc', rate: 605.0, history: [603, 607, 605, 606, 604, 605.5, 605] },
  XCD: { name: 'Eastern Caribbean Dollar', rate: 2.7, history: [2.7, 2.7, 2.7, 2.7, 2.7, 2.7, 2.7] },
  XDR: { name: 'Special Drawing Rights', rate: 0.75, history: [0.74, 0.76, 0.75, 0.755, 0.745, 0.75, 0.75] },
  XOF: { name: 'West African CFA Franc', rate: 605.0, history: [603, 607, 605, 606, 604, 605.5, 605] },
  XPF: { name: 'CFP Franc', rate: 110.0, history: [109, 111, 110, 110.5, 109.5, 110, 110] },
  YER: { name: 'Yemeni Rial', rate: 250.0, history: [249, 251, 250, 250.5, 249.5, 250, 250] },
  ZMW: { name: 'Zambian Kwacha', rate: 25.0, history: [24.8, 25.2, 25.0, 25.1, 24.9, 25.05, 25.0] },
};

type Currency = keyof typeof currencyData;

export function CurrencyConverterForm() {
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('EUR');
  const [inputValue, setInputValue] = useState('100');
  const [outputValue, setOutputValue] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currencies = Object.keys(currencyData).sort() as Currency[];

  const exchangeRate = useMemo(() => {
    if (!fromCurrency || !toCurrency) return 0;
    const fromRate = currencyData[fromCurrency].rate;
    const toRate = currencyData[toCurrency].rate;
    return toRate / fromRate;
  }, [fromCurrency, toCurrency]);
  
   const chartData = useMemo(() => {
    if (!fromCurrency || !toCurrency) return [];
    const fromHistory = currencyData[fromCurrency].history;
    const toHistory = currencyData[toCurrency].history;
    return fromHistory.map((_, i) => ({
      day: `Day ${i + 1}`,
      rate: parseFloat((toHistory[i] / fromHistory[i]).toFixed(4)),
    }));
  }, [fromCurrency, toCurrency]);

  const chartConfig = {
    rate: {
      label: 'Exchange Rate',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const inputNum = parseFloat(inputValue);
    if (isNaN(inputNum)) {
      setOutputValue('');
      return;
    }
    const result = inputNum * exchangeRate;
    setOutputValue(result.toLocaleString(undefined, { maximumFractionDigits: 2 }));
  }, [inputValue, exchangeRate]);
  
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setInputValue(outputValue.replace(/,/g, ''));
  };

  const handleCopy = () => {
    if (!outputValue) return;
    navigator.clipboard.writeText(outputValue.replace(/,/g, '')).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: 'Copied to clipboard!' });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Failed to copy' });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* From Section */}
        <Card className="shadow-inner w-full">
          <CardContent className="p-4 space-y-2">
            <label className="text-sm text-muted-foreground">Amount</label>
            <Input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-2xl h-14"
              aria-label="Input amount"
            />
            <Select value={fromCurrency} onValueChange={(v) => setFromCurrency(v as Currency)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c} value={c}>{c} - {currencyData[c].name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        {/* Swap Button */}
        <Button variant="ghost" size="icon" onClick={handleSwap} className="rotate-90 md:rotate-0">
          <ArrowRightLeft className="h-6 w-6 text-primary" />
        </Button>
        
        {/* To Section */}
        <Card className="shadow-inner w-full">
          <CardContent className="p-4 space-y-2">
            <label className="text-sm text-muted-foreground">Converted Amount</label>
             <div className="relative">
                <Input 
                    type="text" 
                    value={outputValue}
                    readOnly
                    className="text-2xl h-14 font-bold bg-background pr-10"
                    aria-label="Output amount"
                />
                <Button variant="ghost" size="icon" onClick={handleCopy} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground">
                    {isCopied ? <ClipboardCheck className="text-primary"/> : <Copy />}
                </Button>
             </div>
             <Select value={toCurrency} onValueChange={(v) => setToCurrency(v as Currency)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c} value={c}>{c} - {currencyData[c].name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Quick Conversions:</span>
        <Button variant="outline" size="sm" onClick={() => { setFromCurrency('USD'); setToCurrency('PKR'); }}>USD to PKR</Button>
        <Button variant="outline" size="sm" onClick={() => { setFromCurrency('EUR'); setToCurrency('USD'); }}>EUR to USD</Button>
      </div>

      <p className="text-center text-muted-foreground">
        1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency} (Last updated: {new Date().toLocaleDateString()})
      </p>

      {isClient && (
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp/> 7-Day Exchange Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
              <ChartContainer config={chartConfig} className="h-48 w-full">
                  <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0.1}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                       <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                       <YAxis width={60} domain={['dataMin - 0.01', 'dataMax + 0.01']} tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="rate" stroke="var(--color-rate)" fillOpacity={1} fill="url(#colorRate)" />
                  </AreaChart>
              </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
