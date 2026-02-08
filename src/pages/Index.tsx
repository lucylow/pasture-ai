// Update this page (the content is just a fallback if you fail to update the page)

import { AIPastureView } from "../components/ai/AIPastureView";
import { CommunityFeed } from "../components/social/CommunityFeed";
import { CooperativeDashboard } from "../components/social/CooperativeDashboard";
import { ImpactReputation } from "../components/social/ImpactReputation";
import { AICommunityAgent } from "../components/social/AICommunityAgent";
import { Link } from "react-router-dom";
import { Tractor, Users, LayoutDashboard, Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-6 mb-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">PastureAI <span className="text-green-600">Social</span></h1>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <Link to="/sustainability" className="hover:text-slate-900 transition-colors">Sustainability</Link>
            <Link to="/farmer" className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors">
               <Tractor className="w-4 h-4" />
               Farmer Mode
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-8">
        <Tabs defaultValue="community" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white dark:bg-slate-900 border">
              <TabsTrigger value="community" className="flex gap-2">
                <Users className="w-4 h-4" />
                Community
              </TabsTrigger>
              <TabsTrigger value="predictions" className="flex gap-2">
                <LayoutDashboard className="w-4 h-4" />
                My Paddocks
              </TabsTrigger>
              <TabsTrigger value="coop" className="flex gap-2">
                <Share2 className="w-4 h-4" />
                Cooperative
              </TabsTrigger>
            </TabsList>
            <div className="hidden md:block text-sm text-muted-foreground">
              Region: <span className="font-semibold text-slate-900 dark:text-slate-100">Northern Tablelands</span>
            </div>
          </div>

          <TabsContent value="community" className="space-y-8 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <CommunityFeed />
              </div>
              <div className="space-y-6">
                <AICommunityAgent />
                <ImpactReputation userId="user1" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="outline-none">
            <AIPastureView pastureId="pasture-delta-9" />
          </TabsContent>

          <TabsContent value="coop" className="space-y-8 outline-none">
            <CooperativeDashboard coopId="coop1" />
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-dashed flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                 <Share2 className="text-blue-600" />
               </div>
               <div className="max-w-md">
                 <h3 className="text-lg font-bold">Cooperative Benchmarking</h3>
                 <p className="text-sm text-muted-foreground">Compare your farm's performance anonymously against the regional average to identify growth opportunities.</p>
               </div>
               <button className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg">View Comparison Charts</button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="max-w-7xl mx-auto mt-12 pb-12 px-6 border-t border-slate-200 dark:border-slate-800 pt-8 flex justify-between items-center text-slate-400 text-xs">
          <p>© 2026 PastureAI. All rights reserved.</p>
          <div className="flex gap-4">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
          </div>
      </footer>
    </div>
  );
};

export default Index;
