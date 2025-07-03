"use client";

import { useState, useEffect } from "react";
import {
  getFarmerCommunityPosts,
  type GetFarmerCommunityPostsOutput,
} from "@/ai/flows/get-farmer-community-posts";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import { RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

export function FarmerCommunity() {
  const { language, t } = useLanguage();
  const [result, setResult] = useState<GetFarmerCommunityPostsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
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
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

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
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
        </CardHeader>
        <CardContent className="space-y-6 h-96 overflow-y-auto pr-4">
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {loading && (
                <div className="space-y-6">
                    <PostSkeleton/>
                    <PostSkeleton/>
                    <PostSkeleton/>
                </div>
            )}
            {result?.posts.map((post, index) => (
                <div key={index} className="flex items-start space-x-3">
                    <Avatar>
                        <AvatarImage src={post.avatarUrl} alt={post.author} data-ai-hint="farmer avatar" />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{post.author}</p>
                            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                        </div>
                        <p className="text-sm">{post.content}</p>
                        <div className="pl-4 border-l-2 space-y-2 mt-2">
                            {post.replies.map((reply, replyIndex) => (
                                <div key={replyIndex} className="text-xs">
                                    <p className="font-semibold">{reply.author}</p>
                                    <p className="text-muted-foreground">{reply.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </CardContent>
        <CardFooter className="pt-4 border-t">
            <div className="flex w-full items-center space-x-2">
                <Input type="text" placeholder={t('replyPlaceholder')} />
                <Button type="submit">{t('postReplyButton')}</Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
