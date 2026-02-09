import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommunityFeed, Post } from "@/hooks/useSocial";
import { MessageSquare, Share2, ShieldCheck, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const CommunityFeed: React.FC = () => {
  const { data: posts, isLoading } = useCommunityFeed();

  if (isLoading) return <div>Loading community feed...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="text-primary" />
          Community Insights
        </h2>
        <Button size="sm">New Observation</Button>
      </div>
      
      {posts?.map((post: Post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Avatar>
              <AvatarFallback>{post.author_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.author_name}</span>
                <div className="inline-flex items-center rounded-full border border-transparent bg-secondary text-secondary-foreground px-2.5 py-0.5 text-[10px] h-4 font-semibold">
                  {post.type}
                </div>
                {post.peer_validated && (
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.timestamp))} ago
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{post.content}</p>
            {post.media_url && (
              <img 
                src={post.media_url} 
                alt="Post content" 
                className="rounded-lg w-full object-cover max-h-64" 
              />
            )}
            <div className="flex items-center gap-4 pt-2 border-t text-muted-foreground">
              <div className="flex items-center gap-1 text-sm">
                {Object.entries(post.reactions).map(([emoji, count]) => (
                  <span key={emoji} className="flex items-center gap-0.5">
                    {emoji} {count}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm ml-auto">
                <MessageSquare className="w-4 h-4" />
                {post.comments_count}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Share2 className="w-4 h-4" />
                Share
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
