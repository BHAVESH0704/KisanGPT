'use server';

/**
 * @fileOverview A flow that provides information on government schemes for farmers.
 *
 * - getGovernmentSchemeInfo - A function that retrieves information about relevant government schemes.
 * - GetGovernmentSchemeInfoInput - The input type for the getGovernmentSchemeInfo function.
 * - GetGovernmentSchemeInfoOutput - The return type for the getGovernmentSchemeInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetGovernmentSchemeInfoInputSchema = z.object({
  farmerDetails: z
    .string()
    .describe(
      'Details about the farmer, including their location, crops grown, and any other relevant information.'
    ),
  query: z
    .string()
    .describe(
      'Specific query about government schemes, such as eligibility criteria or application process.'
    ),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "mr").'),
});
export type GetGovernmentSchemeInfoInput = z.infer<typeof GetGovernmentSchemeInfoInputSchema>;

const GetGovernmentSchemeInfoOutputSchema = z.object({
  schemes: z.array(
    z.object({
      name: z.string().describe('The name of the government scheme.'),
      eligibility: z
        .string()
        .describe('The eligibility criteria for the scheme.'),
      applicationProcess: z
        .string()
        .describe('The application process for the scheme.'),
      statusUpdates: z
        .string()
        .describe('How to check the status of the application.'),
    })
  ).describe('A list of government schemes relevant to the farmer.'),
});
export type GetGovernmentSchemeInfoOutput = z.infer<typeof GetGovernmentSchemeInfoOutputSchema>;

export async function getGovernmentSchemeInfo(
  input: GetGovernmentSchemeInfoInput
): Promise<GetGovernmentSchemeInfoOutput> {
  return getGovernmentSchemeInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getGovernmentSchemeInfoPrompt',
  input: {schema: GetGovernmentSchemeInfoInputSchema},
  output: {schema: GetGovernmentSchemeInfoOutputSchema},
  prompt: `You are an expert in Indian government schemes for farmers. Given the farmer's details and their query, provide information about relevant schemes.

Respond in the language specified by the user: {{{language}}}.

Farmer Details: {{{farmerDetails}}}
Query: {{{query}}}

Provide the scheme name, eligibility criteria, application process, and how to check the status of the application for each relevant scheme.
`,
});

const getGovernmentSchemeInfoFlow = ai.defineFlow(
  {
    name: 'getGovernmentSchemeInfoFlow',
    inputSchema: GetGovernmentSchemeInfoInputSchema,
    outputSchema: GetGovernmentSchemeInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
