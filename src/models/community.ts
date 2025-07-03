import type { Timestamp } from 'firebase/firestore';

export interface Reply {
    author: string;
    content: string;
}

export interface Post {
    id: string; // document ID
    author: string;
    avatarUrl: string;
    content: string;
    timestamp: Timestamp;
    replies: Reply[];
}
