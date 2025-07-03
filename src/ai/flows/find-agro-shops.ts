'use server';
/**
 * @fileOverview A flow that finds nearby agro shops.
 *
 * - findAgroShops - A function that finds agro shops near a given location.
 * - FindAgroShopsInput - The input type for the findAgroShops function.
 * - FindAgroShopsOutput - The return type for the findAgroShops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindAgroShopsInputSchema = z.object({
  location: z.string().describe('The location to find agro shops near.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "mr").'),
});
export type FindAgroShopsInput = z.infer<typeof FindAgroShopsInputSchema>;

const FindAgroShopsOutputSchema = z.object({
  shops: z.array(
    z.object({
      name: z.string().describe('The name of the agro shop.'),
      address: z
        .string()
        .describe('The address of the agro shop.'),
    })
  ).describe('A list of suggested agro shops near the specified location.'),
});
export type FindAgroShopsOutput = z.infer<typeof FindAgroShopsOutputSchema>;

export async function findAgroShops(
  input: FindAgroShopsInput
): Promise<FindAgroShopsOutput> {
  return findAgroShopsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findAgroShopsPrompt',
  input: {schema: FindAgroShopsInputSchema},
  output: {schema: FindAgroShopsOutputSchema},
  prompt: `You are a helpful assistant for farmers. Find a few agricultural supply shops (agro shops) near the specified location. Provide their name and a plausible address.

Respond in the language specified by the user: {{{language}}}.

Location: {{{location}}}
`,
});

const findAgroShopsFlow = ai.defineFlow(
  {
    name: 'findAgroShopsFlow',
    inputSchema: FindAgroShopsInputSchema,
    outputSchema: FindAgroShopsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
