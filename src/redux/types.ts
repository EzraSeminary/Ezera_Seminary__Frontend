export interface User {
  _id: string;
  role: string;
  firstName: string;
  lastName: string;
  token: string;
  email: string;
  avatar: string | null;
  password: string | null;
  progress: Progress[];
  achievement: number;
  createdAt: string;
  deletedAt: string;
  lastLogin: string;
}

export interface Progress {
  courseId: string;
  currentChapter: number;
  currentSlide: number;
}

export interface AuthState {
  user: User | null;
  role: string | null;
  firstName: string | null;
  token: string | null;
  isAuthReady: boolean;
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

export interface FormState {
  image: Devotion;
  previewUrl: Devotion;
  _id: string;
  body: string[] | undefined;
  month: string;
  day: string;
  title: string;
  chapter: string;
  verse: string;
  paragraphs: string[];
  prayer: string;
  subTitles: string[];
  photo: File | string | null;
}

export interface DevotionsState {
  form: FormState;
  devotions: Devotion[];
  selectedDevotion: Devotion | null;
  isEditing: boolean;
}

export interface LinkType {
  quarter: string;
  lesson: string;
  id?: string;
  videoUrl: string;
}

export interface RootState {
  auth: AuthState;
  user: User;
  devotions: DevotionsState;
  // other slices of state
}

export interface ApiState {
  id: number;
  _id: string;
  title: string;
  description: string;
  category: string;
  updatedAt: string;
  image: string | File;
  chapters: Chapter[];
  published: boolean;
  chapterCount: number;
}

export interface Chapter {
  chapter: string;
  slides: Slide[];
  _id: string;
}

export interface Slide {
  slide: string;
  elements: CustomElement[];
  _id: string;
}

export type CustomElement =
  | TitleElement
  | SubElement
  | TextElement
  | ImgElement
  | ListElement
  | SlideElement
  | VerseElement
  | MainVerseElement
  | QuizElement
  | AccordionElement
  | SequenceElement
  | RevealElement
  | RangeElement
  | DndElement
  | MixElement
  | AudioElement
  | VideoElement;

export interface TitleElement extends Omit<Element, "value"> {
  type: "title";
  value: string;
  _id: string;
}

export interface SubElement extends Omit<Element, "value"> {
  type: "sub";
  value: string;
  _id: string;
}

export interface TextElement extends Omit<Element, "value"> {
  type: "text";
  value: string;
  _id: string;
}

export interface ImgElement extends Omit<Element, "value"> {
  type: "img";
  value: File | string; // File if it's to be uploaded or string if it's a URL
  _id: string;
}

export interface ListElement extends Omit<Element, "value"> {
  type: "list";
  value: string[];
  _id: string;
}
export interface VerseElement extends Omit<Element, "value"> {
  type: "verse";
  value: string[];
  _id: string;
}
export interface MainVerseElement extends Omit<Element, "value"> {
  type: "main-verse";
  value: string[];
  _id: string;
}

export interface SlideElement extends Omit<Element, "value"> {
  type: "slide";
  _id: string;
  value: string[];
}

export interface QuizElement extends Omit<Element, "value"> {
  type: "quiz";
  value: QuizElementValue;
  _id: string;
}

export type QuizElementValue = {
  question: string;
  choices: { text: string }[];
  correctAnswer: string;
  _id: string;
};

export interface AccordionElement extends Omit<Element, "value"> {
  type: "accordion";
  value: AccordionElementValue[];
  _id: string;
}

export type AccordionElementValue = {
  title: string;
  content: string;
  _id: string;
};

export interface SequenceElement extends Omit<Element, "value"> {
  type: "sequence";
  value: string[];
  _id: string;
}

export interface RevealElement extends Omit<Element, "value"> {
  type: "reveal";
  value: RevealElementValue[];
  _id: string;
}

export type RevealElementValue = {
  title: string;
  content: string;
  _id: string;
};

export interface RangeElement extends Omit<Element, "value"> {
  type: "range";
  value: boolean;
  _id: string;
}

export interface DndElement extends Omit<Element, "value"> {
  type: "dnd";
  value: DndElementValue;
  _id?: string;
}

export type DndElementValue = {
  question: string;
  choices: { text: string }[];
  correctDndAnswer: string;
  _id?: string;
};

export interface MixElement extends Omit<Element, "value"> {
  type: "mix";
  value: MixElementValue;
  _id: string;
}

export type MixElementValue = {
  text1: string;
  file: File | string;
  text2: string;
  _id: string;
};

export interface AudioElement extends Omit<Element, "value"> {
  type: "audio";
  value: File | string;
}

export interface VideoElement extends Omit<Element, "value"> {
  type: "video";
  value: string;
}
