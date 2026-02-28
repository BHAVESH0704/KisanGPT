"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatDistanceToNow } from 'date-fns';
import {
  getFarmerCommunityPosts,
  type GetFarmerCommunityPostsOutput,
} from "@/ai/flows/get-farmer-community-posts";
import { addCommunityPost } from "@/ai/flows/add-community-post";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import { RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const formSchema = z.object({
  content: z.string().min(1, "Post cannot be empty."),
});

export function FarmerCommunity() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [result, setResult] = useState<GetFarmerCommunityPostsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const postsResult = await getFarmerCommunityPosts({ language });
      setResult(postsResult);
    } catch (err) {
      setError(t('errorOccurred'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  const handlePostSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
        toast({ variant: 'destructive', title: "Authentication required", description: "Please log in to post to the community." });
        return;
    }

    setIsPosting(true);
    try {
        await addCommunityPost({
            content: values.content,
            author: user.displayName || 'Anonymous Farmer',
        });
        toast({ title: "Post successful!", description: "Your post has been added to the community forum." });
        form.reset();
        await fetchPosts();
    } catch (err) {
        setError(t('errorOccurred'));
        toast({ variant: 'destructive', title: "Error", description: "Could not submit your post. Please try again." });
        console.error(err);
    } finally {
        setIsPosting(false);
    }
  };

  const PostSkeleton = () => (
    <div className="flex items-start space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card className="bg-background/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{t('communityForumTitle')}</CardTitle>
            <Button variant="outline" size="sm" onClick={fetchPosts} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading && !result ? 'animate-spin' : ''}`} />
            </Button>
        </CardHeader>
        <CardContent className="space-y-6 h-96 overflow-y-auto pr-4">
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {loading && !result && (
                <div className="space-y-6">
                    <PostSkeleton/>
                    <PostSkeleton/>
                    <PostSkeleton/>
                </div>
            )}
            {result?.posts.map((post) => {
                const relativeTime = post.timestamp 
                    ? formatDistanceToNow(new Date(post.timestamp), { addSuffix: true }) 
                    : 'Just now';

                return(
                    <div key={post.id} className="flex items-start space-x-3 animate-fade-in-up">
                        <Avatar>
                            <AvatarImage src={post.avatarUrl} alt={post.author} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{post.author}</p>
                                <p className="text-xs text-muted-foreground">{relativeTime}</p>
                            </div>
                            <p className="text-sm">{post.content}</p>
                            {post.replies && post.replies.length > 0 && (
                                <div className="pl-4 border-l-2 space-y-2 mt-2">
                                    {post.replies.map((reply, replyIndex) => (
                                        <div key={replyIndex} className="text-xs">
                                            <p className="font-semibold">{reply.author}</p>
                                            <p className="text-muted-foreground">{reply.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </CardContent>
        <CardFooter className="pt-4 border-t">
         {!user ? (
            <div className="text-center w-full text-sm text-muted-foreground">
              Please <Link href="/login" className="underline text-primary">log in</Link> to join the conversation.
            </div>
         ) : (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePostSubmit)} className="flex w-full items-start space-x-2">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormControl>
                        <Input placeholder={t('replyPlaceholder')} {...field} disabled={isPosting} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPosting || loading}>
                    {isPosting ? t('searchingButton') : t('postReplyButton')}
                </Button>
                </form>
            </Form>
         )}
        </CardFooter>
      </Card>
    </div>
  );
}
