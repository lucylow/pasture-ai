// data/mock/community.ts
export type CommunityPost = {
  id: string;
  author_name: string;
  type: 'observation' | 'community_goal' | 'tip' | 'question';
  content: string;
  timeAgo: string;
  thumbs: number;
  plant: number;
  comments: number;
  peer_validated: boolean;
};

export const communityPosts: CommunityPost[] = [
  {
    id: 'p1',
    author_name: 'Farmer Joe',
    type: 'observation',
    content: 'Noticed strong biomass recovery in Paddock 4 after 30 days rest. AI predicted 450g/m2, actual was 472g/m2.',
    timeAgo: 'less than a minute ago',
    thumbs: 12,
    plant: 8,
    comments: 3,
    peer_validated: true,
  },
  {
    id: 'p2',
    author_name: 'Sarah Miller',
    type: 'community_goal',
    content: 'Just reached 90% rest period compliance this month! Road to 100%.',
    timeAgo: '1 day ago',
    thumbs: 15,
    plant: 5,
    comments: 2,
    peer_validated: false,
  },
  {
    id: 'p3',
    author_name: 'Mike Thompson',
    type: 'tip',
    content: 'Cell grazing with 8 paddocks has improved our biomass stability by 22% over the past season. Worth the extra fencing!',
    timeAgo: '2 days ago',
    thumbs: 34,
    plant: 18,
    comments: 7,
    peer_validated: true,
  },
  {
    id: 'p4',
    author_name: 'Emma Wilson',
    type: 'observation',
    content: 'Dry spell hit our lower paddocks hard. PastureAI predicted 180g/m2 — rest 45 days recommended. Following it.',
    timeAgo: '3 days ago',
    thumbs: 8,
    plant: 4,
    comments: 5,
    peer_validated: false,
  },
  {
    id: 'p5',
    author_name: 'James Chen',
    type: 'question',
    content: 'Anyone using PastureAI with multispecies pastures? How does it handle clover vs grass dominance?',
    timeAgo: '4 days ago',
    thumbs: 21,
    plant: 12,
    comments: 14,
    peer_validated: false,
  },
  {
    id: 'p6',
    author_name: 'Rachel Green',
    type: 'community_goal',
    content: 'Co-op hit 450 tCO2e sequestered this quarter. Celebrating with the team!',
    timeAgo: '5 days ago',
    thumbs: 42,
    plant: 28,
    comments: 9,
    peer_validated: true,
  },
  {
    id: 'p7',
    author_name: 'Tom Anderson',
    type: 'tip',
    content: 'Pro tip: export your biomass maps as GeoTIFF and overlay in QGIS for farm planning. Game changer.',
    timeAgo: '6 days ago',
    thumbs: 56,
    plant: 31,
    comments: 4,
    peer_validated: true,
  },
];
