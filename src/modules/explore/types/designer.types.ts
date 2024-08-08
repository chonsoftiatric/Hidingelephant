export type IGetDesignerFeed = {
  offset: number;
  id: string;
};

export type IDesignerProfile = {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string | null;
  cover: string | null;
  imagesGenerated: number;
  totalLikes: number;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
};
