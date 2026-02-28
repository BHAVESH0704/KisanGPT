'use server';
/**
 * @fileOverview A flow to retrieve or generate farmer community posts.
 * Fetches posts from Firestore and ensures safe serialization for Next.js.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

const SeedReplySchema = z.object({
    author: z.string().describe("The name of the reply's author."),
    content: z.string().describe('The content of the reply.'),
});

const SeedPostSchema = z.object({
    author: z.string().describe("The name of the post's author."),
    avatarUrl: z.string().describe("A placeholder URL for the author avatar."),
    content: z.string().describe('The content of the forum post.'),
    replies: z.array(SeedReplySchema).describe('A list of replies to the post.'),
});

const GetFarmerCommunityPostsOutputSchema = z.object({
  posts: z.array(
    z.object({
        id: z.string(),
        author: z.string(),
        avatarUrl: z.string(),
        content: z.string(),
        timestamp: z.number().nullable().describe('The timestamp in milliseconds.'),
        replies: z.array(SeedReplySchema),
    })
  ).describe('A list of forum posts from the database.'),
});
export type GetFarmerCommunityPostsOutput = z.infer<typeof GetFarmerCommunityPostsOutputSchema>;

export async function getFarmerCommunityPosts(
  input: { language: string }
): Promise<GetFarmerCommunityPostsOutput> {
  return getFarmerCommunityPostsFlow(input);
}

const seedPrompt = ai.definePrompt({
  name: 'generateSeedPostsPrompt',
  input: { schema: z.object({ language: z.string() }) },
  output: { schema: z.object({ posts: z.array(SeedPostSchema) }) },
  prompt: `You are a community manager for an online forum for Indian farmers. Generate 4-5 realistic forum posts. Each post should have a unique author and a plausible topic (like crop prices, weather, or pest control). Generate 1-2 replies for some of the posts.

CRITICAL: The "replies" field MUST ALWAYS be included in the output for every post, even if it is an empty array [].

Use 'https://placehold.co/40x40.png' for all avatar URLs.
Respond in the language specified: {{{language}}}.`,
});

const getFarmerCommunityPostsFlow = ai.defineFlow(
  {
    name: 'getFarmerCommunityPostsFlow',
    inputSchema: z.object({ language: z.string() }),
    outputSchema: GetFarmerCommunityPostsOutputSchema,
  },
  async ({ language }) => {
    const postsCollection = collection(db, 'community-posts');
    const q = query(postsCollection, orderBy('timestamp', 'desc'), limit(20));
    let querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const { output } = await seedPrompt({ language });
      const seedPosts = output?.posts ?? [];
      
      for (const post of seedPosts) {
        await addDoc(postsCollection, {
          ...post,
          timestamp: serverTimestamp(),
        });
      }
      querySnapshot = await getDocs(q);
    }

    const posts = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        author: data.author,
        avatarUrl: data.avatarUrl,
        content: data.content,
        replies: data.replies || [],
        // Convert Firestore Timestamp to plain number for serialization
        timestamp: data.timestamp?.toMillis() || null,
      };
    });

    return { posts };
  }
);
