import { useQuery } from "@tanstack/react-query";

export interface Post {
  id: string;
  author_id: string;
  author_name: string;
  type: "observation" | "journal_entry" | "community_goal" | "alert";
  content: string;
  media_url?: string;
  timestamp: string;
  reactions: Record<string, number>;
  comments_count: number;
  peer_validated: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  role: "farmer" | "coop_admin" | "regional_advisor" | "guest";
  reputation_score: number;
  bio?: string;
  trust_score: number;
  impact_badges: string[];
}

export interface CooperativeStats {
  id: string;
  name: string;
  region: string;
  member_ids: string[];
  total_biomass_managed: number;
  sustainability_rating: number;
  carbon_sequestration_total: number;
}

export interface SustainabilityKPIs {
  grazing_efficiency_delta: number;
  rest_period_compliance: number;
  biomass_stability_index: number;
  overgrazing_prevention_score: number;
  peer_validated_adoption_rate: number;
  soil_carbon_sequestration: number;
}

export const useCommunityFeed = () => {
  return useQuery<Post[]>({
    queryKey: ["community-feed"],
    queryFn: async () => {
      // In a real app, this would be a fetch call to the FastAPI backend
      // return fetch("/api/v1/social/feed").then(res => res.json());
      
      // Mock data for demo
      return [
        {
          id: "p1",
          author_id: "user1",
          author_name: "Farmer Joe",
          type: "observation",
          content: "Noticed strong biomass recovery in Paddock 4 after 30 days rest. AI predicted 450g/m2, actual was 472g/m2.",
          timestamp: new Date().toISOString(),
          reactions: { "👍": 12, "🌱": 8 },
          comments_count: 3,
          peer_validated: true,
        },
        {
          id: "p2",
          author_id: "user2",
          author_name: "Sarah Miller",
          type: "community_goal",
          content: "Just reached 90% rest period compliance this month! Road to 100%.",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          reactions: { "👏": 15, "🙌": 5 },
          comments_count: 2,
          peer_validated: false,
        }
      ];
    }
  });
};

export const useCooperativeStats = (coopId: string) => {
  return useQuery<CooperativeStats>({
    queryKey: ["cooperative-stats", coopId],
    queryFn: async () => {
      return {
        id: coopId,
        name: "Valley Regenerative Collective",
        region: "Northern Tablelands",
        member_ids: ["user1", "user2", "user3"],
        total_biomass_managed: 1250.0,
        sustainability_rating: 4.8,
        carbon_sequestration_total: 450.2,
      };
    }
  });
};

export const useReputation = (userId: string) => {
  return useQuery<UserProfile>({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      return {
        id: userId,
        username: "farmer_joe",
        role: "farmer",
        reputation_score: 85.5,
        trust_score: 0.92,
        impact_badges: ["Regen Pioneer", "Top Observer", "Carbon Saver"],
      };
    }
  });
};

export const useSustainabilityKPIs = (userId: string) => {
  return useQuery<SustainabilityKPIs>({
    queryKey: ["sustainability-kpis", userId],
    queryFn: async () => {
      return {
        grazing_efficiency_delta: 0.18,
        rest_period_compliance: 0.95,
        biomass_stability_index: 0.88,
        overgrazing_prevention_score: 0.92,
        peer_validated_adoption_rate: 0.75,
        soil_carbon_sequestration: 2.4,
      };
    }
  });
};
