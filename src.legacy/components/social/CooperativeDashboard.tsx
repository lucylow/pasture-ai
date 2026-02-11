import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCooperativeStats } from "@/hooks/useSocial";
import { Users, Leaf, Globe, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const CooperativeDashboard: React.FC<{ coopId: string }> = ({ coopId }) => {
  const { data: stats, isLoading } = useCooperativeStats(coopId);

  if (isLoading) return <div>Loading cooperative dashboard...</div>;
  if (!stats) return <div className="text-sm text-slate-500">No cooperative data.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Coop Members</CardTitle>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.member_ids.length}</div>
          <p className="text-xs text-muted-foreground">+2 from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Managed Biomass</CardTitle>
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_biomass_managed}t</div>
          <p className="text-xs text-muted-foreground">Across Northern Tablelands</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Sustainability Rating</CardTitle>
          <Leaf className="w-4 h-4 text-green-500" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">{stats?.sustainability_rating}/5.0</div>
          <Progress value={(stats?.sustainability_rating || 0) * 20} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Carbon Sequestered</CardTitle>
          <Globe className="w-4 h-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.carbon_sequestration_total} tCO2e</div>
          <p className="text-xs text-muted-foreground">Estimated YTD Impact</p>
        </CardContent>
      </Card>
    </div>
  );
};
