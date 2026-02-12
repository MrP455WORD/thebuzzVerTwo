export interface MovieItem {
  id: string;
  title: string;
  link: string;
  poster: string;
}

export interface Episode {
  name: string;
  url: string;
}

export interface SeasonData {
  [seasonName: string]: Episode[];
}

export interface SearchState {
  query: string;
  isActive: boolean;
  isLoading: boolean;
  results: MovieItem[];
  error: string | null;
}

export enum ViewMode {
  HOME = 'HOME',
  DETAILS = 'DETAILS',
  PLAYER = 'PLAYER',
}