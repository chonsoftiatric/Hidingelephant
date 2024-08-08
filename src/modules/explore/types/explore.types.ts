export type IFeedQueryStore = {
  tag: string | undefined;
  setTag: (arg: string | undefined) => void;
  sortBy: string | undefined;
  setSortBy: (arg: string | undefined) => void;
  username: string | undefined;
  setUsername: (arg: string | undefined) => void;
};
