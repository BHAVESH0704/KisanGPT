'use server';
/**
 * @fileOverview Summarizes market trends and predicts future prices for crops.
 *
 * - summarizeMarketTrends - A function that summarizes market trends and predicts future prices.
 * - SummarizeMarketTrendsInput - The input type for the summarizeMarketTrends function.
 * - SummarizeMarketTrendsOutput - The return type for the summarizeMarketTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMarketTrendsInputSchema = z.object({
  crop: z.string().describe('The crop to summarize market trends for.'),
  location: z.string().describe('The location to summarize market trends for.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "mr").'),
});
export type SummarizeMarketTrendsInput = z.infer<typeof SummarizeMarketTrendsInputSchema>;

const SummarizeMarketTrendsOutputSchema = z.object({
  summary: z.string().describe('A summary of recent market trends for the specified crop and location.'),
  prediction: z.string().describe('A prediction of future prices for the specified crop and location.'),
});
export type SummarizeMarketTrendsOutput = z.infer<typeof SummarizeMarketTrendsOutputSchema>;

export async function summarizeMarketTrends(input: SummarizeMarketTrendsInput): Promise<SummarizeMarketTrendsOutput> {
  return summarizeMarketTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMarketTrendsPrompt',
  input: {schema: SummarizeMarketTrendsInputSchema},
  output: {schema: SummarizeMarketTrendsOutputSchema},
  prompt: `You are an expert agricultural market analyst. Provide a summary of recent market trends and a prediction of future prices for the following crop and location.

Respond in the language specified by the user: {{{language}}}.

Crop: {{{crop}}}
Location: {{{location}}}

Summary:
Prediction:`,
});

const summarizeMarketTrendsFlow = ai.defineFlow(
  {
    name: 'summarizeMarketTrendsFlow',
    inputSchema: SummarizeMarketTrendsInputSchema,
    outputSchema: SummarizeMarketTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
