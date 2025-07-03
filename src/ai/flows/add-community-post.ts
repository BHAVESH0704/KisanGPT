'use server';
/**
 * @fileOverview A flow to add a community post to Firestore.
 */
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddPostInputSchema = z.object({
    author: z.string(),
    content: z.string(),
});
export type AddPostInput = z.infer<typeof AddPostInputSchema>;

export async function addCommunityPost(input: AddPostInput) {
    return addCommunityPostFlow(input);
}

const addCommunityPostFlow = ai.defineFlow(
    {
        name: 'addCommunityPostFlow',
        inputSchema: AddPostInputSchema,
        outputSchema: z.string(), // Returns the new document ID
    },
    async (input) => {
        const docRef = await addDoc(collection(db, 'community-posts'), {
            author: input.author,
            content: input.content,
            avatarUrl: 'https://placehold.co/40x40.png', // Default avatar for new posts
            replies: [],
            timestamp: serverTimestamp(),
        });
        return docRef.id;
    }
);
