import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSustainabilityKPIs, useReputation } from "@/hooks/useSocial";
import { Trophy, Award, Target, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const ImpactReputation: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: kpis } = useSustainabilityKPIs(userId);
  const { data: profile } = useReputation(userId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="text-yellow-500 w-5 h-5" />
            Farmer Reputation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-3xl font-bold">{profile?.reputation_score}</div>
              <div className="text-sm text-muted-foreground">Reputation Points</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Trust Score</div>
              <div className="text-lg font-bold text-green-600">{(profile?.trust_score || 0) * 100}%</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Next Level: Master Steward</span>
              <span>750 / 1000 XP</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          <div className="flex flex-wrap gap-2">
            {profile?.impact_badges.map(badge => (
              <div key={badge} className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-full font-medium">
                <Award className="w-3 h-3" />
                {badge}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="text-blue-500 w-5 h-5" />
            Sustainability KPIs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Grazing Efficiency</div>
              <div className="text-lg font-bold text-green-600">+{kpis?.grazing_efficiency_delta.toLocaleString(undefined, {style: 'percent'})}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Rest Compliance</div>
              <div className="text-lg font-bold">{(kpis?.rest_period_compliance || 0) * 100}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Biomass Stability</div>
              <div className="text-lg font-bold">{kpis?.biomass_stability_index}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Soil Carbon</div>
              <div className="text-lg font-bold text-blue-600">{kpis?.soil_carbon_sequestration} t/ha</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
