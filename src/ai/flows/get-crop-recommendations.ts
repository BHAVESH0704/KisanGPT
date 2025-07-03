'use server';
/**
 * @fileOverview A flow to recommend crops based on location.
 *
 * - getCropRecommendations - A function that recommends crops.
 * - GetCropRecommendationsInput - The input type for the function.
 * - GetCropRecommendationsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCropRecommendationsInputSchema = z.object({
  location: z.string().describe('The state in India for which to recommend crops.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "mr").'),
});
export type GetCropRecommendationsInput = z.infer<typeof GetCropRecommendationsInputSchema>;

const CropRecommendationSchema = z.object({
    name: z.string().describe('The name of the crop.'),
    plantingSeason: z.string().describe('The best season to plant the crop.'),
    reasoning: z.string().describe('A brief reason why this crop is suitable.'),
});

const GetCropRecommendationsOutputSchema = z.object({
  recommendations: z.array(CropRecommendationSchema).describe('A list of recommended crops.'),
});
export type GetCropRecommendationsOutput = z.infer<typeof GetCropRecommendationsOutputSchema>;

export async function getCropRecommendations(
  input: GetCropRecommendationsInput
): Promise<GetCropRecommendationsOutput> {
  return getCropRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCropRecommendationsPrompt',
  input: {schema: GetCropRecommendationsInputSchema},
  output: {schema: GetCropRecommendationsOutputSchema},
  prompt: `You are an agricultural expert specializing in Indian farming. Based on the state in India, recommend 3-4 suitable crops to plant. For each crop, provide the ideal planting season and a brief, simple reason for the recommendation.

Respond in the language specified by the user: {{{language}}}.

Location (State): {{{location}}}
`,
});

const getCropRecommendationsFlow = ai.defineFlow(
  {
    name: 'getCropRecommendationsFlow',
    inputSchema: GetCropRecommendationsInputSchema,
    outputSchema: GetCropRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
