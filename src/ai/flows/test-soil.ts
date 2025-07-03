'use server';
/**
 * @fileOverview A flow to analyze soil based on description and an optional photo.
 *
 * - testSoil - A function that analyzes soil.
 * - TestSoilInput - The input type for the function.
 * - TestSoilOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TestSoilInputSchema = z.object({
  soilDescription: z.string().describe('A description of the soil, including color, texture, etc.'),
  photoDataUri: z.optional(z.string()).describe(
      "An optional photo of the soil, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "mr").'),
});
export type TestSoilInput = z.infer<typeof TestSoilInputSchema>;

const TestSoilOutputSchema = z.object({
  report: z.object({
    phLevel: z.string().describe('The estimated pH level of the soil.'),
    nutrientDeficiencies: z.string().describe('A summary of potential nutrient deficiencies.'),
    recommendations: z.string().describe('Recommendations for improving the soil quality.'),
  }),
});
export type TestSoilOutput = z.infer<typeof TestSoilOutputSchema>;

export async function testSoil(input: TestSoilInput): Promise<TestSoilOutput> {
  return testSoilFlow(input);
}

const prompt = ai.definePrompt({
  name: 'testSoilPrompt',
  input: {schema: TestSoilInputSchema},
  output: {schema: TestSoilOutputSchema},
  prompt: `You are an expert soil scientist. Analyze the provided soil information and generate a concise soil test report. The report should include an estimated pH level, potential nutrient deficiencies, and simple, actionable recommendations for improvement suitable for a small farmer in India.

Respond in the language specified by the user: {{{language}}}.

Soil Description: {{{soilDescription}}}
{{#if photoDataUri}}
Soil Image: {{media url=photoDataUri}}
{{/if}}
`,
});

const testSoilFlow = ai.defineFlow(
  {
    name: 'testSoilFlow',
    inputSchema: TestSoilInputSchema,
    outputSchema: TestSoilOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
