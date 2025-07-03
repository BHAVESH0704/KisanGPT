import { config } from 'dotenv';
config();

import '@/ai/flows/diagnose-plant-disease.ts';
import '@/ai/flows/summarize-market-trends.ts';
import '@/ai/flows/get-government-scheme-info.ts';
import '@/ai/flows/get-weather-forecast.ts';
import '@/ai/flows/find-agro-shops.ts';
import '@/ai/flows/get-crop-recommendations.ts';
import '@/ai/flows/test-soil.ts';
import '@/ai/flows/get-farmer-community-posts.ts';
