'use server';
/**
 * @fileOverview A flow to generate simulated farmer community posts.
 *
 * - getFarmerCommunityPosts - A function that generates forum posts.
 * - GetFarmerCommunityPostsInput - The input type for the function.
 * - GetFarmerCommunityPostsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetFarmerCommunityPostsInputSchema = z.object({
    language: z.string().describe('The language for the response (e.g., "en", "hi", "mr").'),
});
export type GetFarmerCommunityPostsInput = z.infer<typeof GetFarmerCommunityPostsInputSchema>;

const ReplySchema = z.object({
    author: z.string().describe("The name of the reply's author."),
    content: z.string().describe('The content of the reply.'),
});

const PostSchema = z.object({
    author: z.string().describe("The name of the post's author."),
    avatarUrl: z.string().describe('A placeholder URL for the author avatar.'),
    timestamp: z.string().describe("A relative timestamp, e.g., '2 hours ago'."),
    content: z.string().describe('The content of the forum post.'),
    replies: z.array(ReplySchema).describe('A list of replies to the post.'),
});

const GetFarmerCommunityPostsOutputSchema = z.object({
  posts: z.array(PostSchema).describe('A list of generated forum posts.'),
});
export type GetFarmerCommunityPostsOutput = z.infer<typeof GetFarmerCommunityPostsOutputSchema>;

export async function getFarmerCommunityPosts(
  input: GetFarmerCommunityPostsInput
): Promise<GetFarmerCommunityPostsOutput> {
  return getFarmerCommunityPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFarmerCommunityPostsPrompt',
  input: {schema: GetFarmerCommunityPostsInputSchema},
  output: {schema: GetFarmerCommunityPostsOutputSchema},
  prompt: `You are a community manager for an online forum for Indian farmers. Generate 4-5 realistic forum posts. Each post should have a unique author, a plausible topic (like crop prices, weather, pest control, or new techniques), and a relative timestamp (e.g., 'Just now', '15 minutes ago', '3 hours ago'). Also, generate 1-2 replies for some of the posts. Use 'https://placehold.co/40x40.png' for all avatar URLs.

Respond in the language specified by the user: {{{language}}}.
`,
});

const getFarmerCommunityPostsFlow = ai.defineFlow(
  {
    name: 'getFarmerCommunityPostsFlow',
    inputSchema: GetFarmerCommunityPostsInputSchema,
    outputSchema: GetFarmerCommunityPostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
