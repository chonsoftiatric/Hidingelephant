export const API_ROUTES = {
  USER: {
    GET_BY_ID: (id: number) => `user-details-by-id-${id}`,
    GET_CREDIT: `current-user-credit-details`,
    GET_STATS: "user-designer-stats",
  },
  // Projects
  PROJECTS: {
    CURRENT_USER_PROJECTS: "current-user-projects",
  },
  SUB_PROJECTS: {
    GET_SUB_PROJECT_PROMPTS_BY_ID: (id: string) =>
      `sub-project-prompts-by-id-${id}`,
  },
  PROMPTS: {
    GET_RECENT_PROMPTS: "recent-prompts-from-projects",
  },
  VECTORIZE: {
    API_URL: `${process.env.VECTORIZE_SERVER}/upload-by-url`,
    GET_SAVED_IMAGES: (subProjectId: string | number) =>
      `saved-vectorized-images-${subProjectId}`,
  },
  SUB_PROJECT_BOOKMARK: {
    GET_SUB_PROJECT_BOOKMARKS: (subProjectId: number) =>
      `get-sub-project-bookmarks-${subProjectId}`,
  },
  OPENAI_API: {
    generation: "https://api.openai.com/v1/images/generations",
    variations: "https://api.openai.com/v1/images/variations",
    edits: "https://api.openai.com/v1/images/edits",
  },
};
