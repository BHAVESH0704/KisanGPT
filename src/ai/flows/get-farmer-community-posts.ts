'use server';
/**
 * @fileOverview A flow to retrieve or generate farmer community posts.
 * Fetches posts from Firestore. If the database is empty, it generates
 * and saves seed posts.
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

// Define schemas for what the AI will generate for seeding
const SeedReplySchema = z.object({
    author: z.string().describe("The name of the reply's author."),
    content: z.string().describe('The content of the reply.'),
});

const SeedPostSchema = z.object({
    author: z.string().describe("The name of the post's author."),
    avatarUrl: z.string().describe("A placeholder URL for the author avatar. Use 'https://placehold.co/40x40.png'."),
    content: z.string().describe('The content of the forum post.'),
    replies: z.array(SeedReplySchema).describe('A list of replies to the post.'),
});

const GetFarmerCommunityPostsOutputSchema = z.object({
  posts: z.array(
    SeedPostSchema.extend({
        id: z.string(),
        timestamp: z.any(), // Firestore Timestamp object
    })
  ).describe('A list of forum posts from the database.'),
});
export type GetFarmerCommunityPostsOutput = z.infer<typeof GetFarmerCommunityPostsOutputSchema>;

export async function getFarmerCommunityPosts(
  input: { language: string }
): Promise<GetFarmerCommunityPostsOutput> {
  return getFarmerCommunityPostsFlow(input);
}

// Prompt to generate seed data if the database is empty
const seedPrompt = ai.definePrompt({
  name: 'generateSeedPostsPrompt',
  input: { schema: z.object({ language: z.string() }) },
  output: { schema: z.object({ posts: z.array(SeedPostSchema) }) },
  prompt: `You are a community manager for an online forum for Indian farmers. Generate 4-5 realistic forum posts. Each post should have a unique author, a plausible topic (like crop prices, weather, pest control, or new techniques). Generate 1-2 replies for some of the posts. Use 'https://placehold.co/40x40.png' for all avatar URLs. Do not include a timestamp. Respond in the language specified by the user: {{{language}}}.`,
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
    const querySnapshot = await getDocs(q);

    let posts: any[] = [];

    if (querySnapshot.empty) {
      // Database is empty, generate and save seed posts
      console.log('Community posts collection is empty. Seeding database...');
      const { output } = await seedPrompt({ language });
      const seedPosts = output?.posts ?? [];
      
      const postPromises = seedPosts.map(post => {
        return addDoc(postsCollection, {
          ...post,
          timestamp: serverTimestamp(),
        });
      });
      await Promise.all(postPromises);
      console.log('Seeding complete.');

      // Re-fetch the newly added posts to get correct timestamps and IDs
      const newQuerySnapshot = await getDocs(q);
      newQuerySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });

    } else {
      // Database has posts, fetch them
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
    }

    return { posts };
  }
);
