export interface User {
  role: string;
  firstName: string;
  token: string;
  // add other properties of a user object
}

export interface AuthState {
  user: User | null;
  role: string | null;
  firstName: string | null;
  token: string | null;
  isAuthReady: boolean;
}

export interface RootState {
  auth: AuthState;
  user: User;
  // other slices of state
}

export interface Devotion {
  image: Devotion;
  previewUrl: Devotion;
  body: string[];
  month: string;
  day: string;
  title: string;
  chapter: string;
  verse: string;
  paragraphs: string[];
  prayer: string;
  subTitles: string[];
  photo: File | string | null; // Assuming 'photo' can be a File object or a string URL to the photo
  _id?: string;
}
