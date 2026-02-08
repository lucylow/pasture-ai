import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bot, Sparkles, AlertCircle, TrendingDown, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AICommunityAgent: React.FC = () => {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="bg-primary p-2 rounded-lg">
          <Bot className="text-primary-foreground w-5 h-5" />
        </div>
        <div>
          <CardTitle className="text-lg">Community Agent</CardTitle>
          <p className="text-xs text-muted-foreground font-normal">Synthesizing trends from 12 regional farms</p>
        </div>
        <Sparkles className="w-4 h-4 text-primary ml-auto animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex gap-3 items-start p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Regional Alert:</span> Low biomass recovery detected in Eastern paddocks. Recommend increasing rest period to 45 days for the next rotation.
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-green-200 dark:border-green-900">
            <Lightbulb className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Peer Insight:</span> Farmers in your coop using <span className="underline italic">holistic cell grazing</span> are seeing 18% higher biomass stability during the dry spell.
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="outline" className="w-full text-xs gap-2">
            Generate Weekly Coop Briefing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
