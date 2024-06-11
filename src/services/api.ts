import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ApiState {
  id: number;
  _id: string;
  title: string;
  description: string;
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
  | QuizElement
  | AccordionElement
  | SequenceElement
  | RevealElement
  | RangeElement
  | DndElement
  | MixElement;

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
  _id: string;
}

export type DndElementValue = {
  question: string;
  choices: { text: string }[];
  correctDndAnswer: string;
  _id: string;
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

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://ezra-seminary.me/",
    baseUrl: "http://localhost:5100/",
  }),
  endpoints: (builder) => ({
    getCourses: builder.query<ApiState[], void>({
      query: () => "course/getall",
    }),
    getCourseById: builder.query<ApiState, string>({
      query: (id) => `course/get/${id}`,
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseByIdQuery } = api;
