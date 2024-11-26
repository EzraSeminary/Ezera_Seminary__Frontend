// src/types/courseTypes.ts

export interface Course {
  id: number;
  _id: string;
  title: string;
  description: string;
  category: string;
  updatedAt: string;
  image: string | File;
  chapters: Chapter[];
  published: boolean;
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

export interface TitleElement {
  type: "title";
  value: string;
  _id: string;
}

export interface SubElement {
  type: "sub";
  value: string;
  _id: string;
}

export interface TextElement {
  type: "text";
  value: string;
  _id: string;
}

export interface ImgElement {
  type: "img";
  value: File | string; // File if it's to be uploaded or string if it's a URL
  _id: string;
}

export interface ListElement {
  type: "list";
  value: string[];
  _id: string;
}

export interface VerseElement {
  type: "verse";
  value: string[];
  _id: string;
}

export interface MainVerseElement {
  type: "main-verse";
  value: string[];
  _id: string;
}

export interface SlideElement {
  type: "slide";
  _id: string;
  value: string[];
}

export interface QuizElement {
  type: "quiz";
  value: QuizElementValue;
  _id: string;
}

export interface QuizElementValue {
  question: string;
  choices: { text: string }[];
  correctAnswer: string;
  _id: string;
}

export interface AccordionElement {
  type: "accordion";
  value: AccordionElementValue[];
  _id: string;
}

export interface AccordionElementValue {
  title: string;
  content: string;
  _id: string;
}

export interface SequenceElement {
  type: "sequence";
  value: string[];
  _id: string;
}

export interface RevealElement {
  type: "reveal";
  value: RevealElementValue[];
  _id: string;
}

export interface RevealElementValue {
  title: string;
  content: string;
  _id: string;
}

export interface RangeElement {
  type: "range";
  value: boolean;
  _id: string;
}

export interface DndElement {
  type: "dnd";
  value: DndElementValue;
  _id?: string;
}

export interface DndElementValue {
  question: string;
  choices: { text: string }[];
  correctDndAnswer: string;
  _id?: string;
}

export interface MixElement {
  type: "mix";
  value: MixElementValue;
  _id: string;
}

export interface MixElementValue {
  text1: string;
  file: File | string;
  text2: string;
  _id: string;
}

export interface AudioElement {
  type: "audio";
  value: File | string;
}

export interface VideoElement {
  type: "video";
  value: string;
}
