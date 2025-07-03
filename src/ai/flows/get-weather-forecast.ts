'use server';
/**
 * @fileOverview A flow that provides a weather forecast.
 *
 * - getWeatherForecast - A function that retrieves the weather forecast for a location.
 * - GetWeatherForecastInput - The input type for the getWeatherForecast function.
 * - GetWeatherForecastOutput - The return type for the getWeatherForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWeatherForecastInputSchema = z.object({
  location: z.string().describe('The location to get the weather forecast for.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "mr").'),
});
export type GetWeatherForecastInput = z.infer<typeof GetWeatherForecastInputSchema>;

const DailyForecastSchema = z.object({
    day: z.string().describe('The day of the forecast (e.g., "Today", "Tomorrow", "Wednesday").'),
    icon: z.enum(['Sun', 'Cloud', 'Cloudy', 'CloudRain', 'CloudSun', 'Wind', 'Thermometer']).describe('A lucide-react icon name that best represents the weather conditions.'),
    temperature: z.string().describe('The temperature range for the day (e.g., "25°C - 32°C").'),
    description: z.string().describe('A brief description of the weather conditions.'),
});

const GetWeatherForecastOutputSchema = z.object({
  forecast: z.array(DailyForecastSchema).describe('A 3-day weather forecast.'),
  summary: z.string().describe('A summary of the 3-day weather forecast to be used for text-to-speech.'),
});
export type GetWeatherForecastOutput = z.infer<typeof GetWeatherForecastOutputSchema>;

export async function getWeatherForecast(
  input: GetWeatherForecastInput
): Promise<GetWeatherForecastOutput> {
  return getWeatherForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWeatherForecastPrompt',
  input: {schema: GetWeatherForecastInputSchema},
  output: {schema: GetWeatherForecastOutputSchema},
  prompt: `You are a helpful weather assistant. Provide a 3-day weather forecast for the specified location. 
  
For each day, provide the day of the week, a suitable lucide-react icon name from the provided list, the temperature range, and a brief description.
Provide a concise summary of the whole forecast as well.

Respond in the language specified by the user: {{{language}}}.

Location: {{{location}}}
`,
});

const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: GetWeatherForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
