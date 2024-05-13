import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface CourseState {
  title: string;
  description: string;
  image: string | File;
  chapters: Chapter[];
  published: boolean;
}

// Define a type for the Chapter
export interface Chapter {
  chapter: string;
  slides: Slide[];
}

// Define a type for each of the Slide and Element properties
export interface Slide {
  slide: string;
  elements: CustomElement[];
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
  | DndElement;

export interface TitleElement extends Omit<Element, "value"> {
  type: "title";
  value: string;
}

export interface SubElement extends Omit<Element, "value"> {
  type: "sub";
  value: string;
}

export interface TextElement extends Omit<Element, "value"> {
  type: "text";
  value: string;
}

export interface ImgElement extends Omit<Element, "value"> {
  type: "img";
  value: File | string; // File if it's to be uploaded or string if it's a URL
}

export interface ListElement extends Omit<Element, "value"> {
  type: "list";
  value: string[];
}

export interface SlideElement extends Omit<Element, "value"> {
  type: "slide";
  _id?: string;
  value: string[];
}

export interface QuizElement extends Omit<Element, "value"> {
  type: "quiz";
  value: QuizElementValue;
}

export type QuizElementValue = {
  question: string;
  choices: { text: string }[];
  correctAnswer: string;
};
export interface AccordionElement extends Omit<Element, "value"> {
  type: "accordion";
  value: AccordionElementValue[];
}

export type AccordionElementValue = {
  title: string;
  content: string;
};

export interface SequenceElement extends Omit<Element, "value"> {
  type: "sequence";
  value: string[];
}

export interface RevealElement extends Omit<Element, "value"> {
  type: "reveal";
  value: RevealElementValue[];
}

export type RevealElementValue = {
  title: string;
  content: string;
};

export interface RangeElement extends Omit<Element, "value"> {
  type: "range";
  value: boolean;
}

export interface DndElement extends Omit<Element, "value"> {
  type: "dnd";
  value: DndElementValue;
}

export type DndElementValue = {
  question: string;
  choices: { text: string }[];
  correctDndAnswer: string;
};

// Define the initial state using `CourseState`
const initialState: CourseState = {
  title: "",
  description: "",
  image: "",
  chapters: [],
  published: false,
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setCourse: (state, action: PayloadAction<CourseState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setImage: (state, action: PayloadAction<string | File>) => {
      state.image = action.payload;
    },
    togglePublished: (state) => {
      state.published = !state.published;
    },
    addChapter: (state) => {
      state.chapters.push({
        chapter: "",
        slides: [],
      });
    },
    updateChapter: (
      state,
      action: PayloadAction<{ chapterIndex: number; value: string }>
    ) => {
      const { chapterIndex, value } = action.payload;
      state.chapters[chapterIndex].chapter = value;
    },

    addSlide: (state, action: PayloadAction<{ chapterIndex: number }>) => {
      const { chapterIndex } = action.payload;
      state.chapters[chapterIndex].slides.push({
        slide: "",
        elements: [],
      });
    },
    deleteElement(
      state,
      action: PayloadAction<{
        chapterIndex: number;
        slideIndex: number;
        elementId: string;
      }>
    ) {
      const { chapterIndex, slideIndex, elementId } = action.payload;
      const chapter = state.chapters[chapterIndex];
      if (chapter) {
        const slide = chapter.slides[slideIndex];
        if (slide) {
          slide.elements = slide.elements.filter(
            (element) => element.id !== elementId
          );
        }
      }
    },
    updateSlide: (
      state,
      action: PayloadAction<{
        chapterIndex: number;
        slideIndex: number;
        value: string;
      }>
    ) => {
      const { chapterIndex, slideIndex, value } = action.payload;
      state.chapters[chapterIndex].slides[slideIndex].slide = value;
    },
    addElementToSlide: (
      state,
      action: PayloadAction<{
        chapterIndex: number;
        slideIndex: number;
        elementType: string;
        value:
          | string
          | string[]
          | File
          | boolean
          | QuizElementValue
          | AccordionElementValue[]
          | RevealElementValue[]
          | DndElementValue
          | null;
      }>
    ) => {
      const { chapterIndex, slideIndex, elementType, value } = action.payload;

      if (state.chapters[chapterIndex] == null) {
        console.warn(
          "Cannot add element, invalid chapter index:",
          chapterIndex
        );
        return;
      }

      const slides = state.chapters[chapterIndex].slides;
      if (!slides) {
        console.warn(
          "Cannot add element, no slides array in chapter:",
          chapterIndex
        );
        return;
      }

      if (slides[slideIndex] == null) {
        console.warn(
          `Cannot add element, invalid slide index: ${slideIndex} for chapter: ${chapterIndex}`
        );
        return;
      }

      const newElement: CustomElement = {
        id: `${elementType}${Math.random().toString(36).substr(2, 9)}`, // Unique ID generation
      } as CustomElement;

      // Determine the type of the element and set additional properties as needed
      switch (elementType) {
        case "title":
        case "sub":
        case "text":
          newElement.type = elementType;
          newElement.value = value as string; // Cast value to string for these element types for now
          break;
        case "img":
          newElement.type = elementType;
          newElement.value = value as string | File; // Cast value to string or File for image element
          break;
        case "list":
          newElement.type = elementType;
          newElement.value = value as string[]; // Cast value to string array for list element
          break;
        case "slide": // Assuming this type is similar to list
          newElement.type = elementType;
          newElement.value = value as string[]; // Cast value to string array for slide element
          break;
        case "quiz":
          newElement.type = elementType;
          newElement.value = value as QuizElementValue; // Cast value to QuizElementValue for quiz element
          break;
        case "accordion":
          newElement.type = elementType;
          newElement.value = value as AccordionElementValue[]; // Cast value to AccordionElementValue array for accordion element
          break;
        case "sequence":
          newElement.type = elementType;
          newElement.value = value as string[];
          break;
        case "reveal":
          newElement.type = elementType;
          newElement.value = value as RevealElementValue[];
          break;
        case "range":
          newElement.type = elementType;
          newElement.value = value as boolean;
          break;
        case "dnd":
          newElement.type = elementType;
          newElement.value = value as DndElementValue;
        break;
        default:
          // Handle unknown element type or throw error
          throw new Error(`Unknown element type: ${elementType}`);
      }
      // eslint-disable-next-line
      // @ts-expect-error
      slides[slideIndex].elements.push(newElement);
      // console.log(`Adding element of type ${elementType} to slide with index ${slideIndex} in chapter with index ${chapterIndex}`);
    },
    updateElement: (
      state,
      action: PayloadAction<{
        chapterIndex: number;
        slideIndex: number;
        elementId: string;
        value:
          | string
          | string[]
          | File
          | boolean
          | QuizElementValue
          | AccordionElementValue[]
          | RevealElementValue[]
          | DndElementValue;
      }>
    ) => {
      const { chapterIndex, slideIndex, elementId, value } = action.payload;
      const elements = state.chapters[chapterIndex].slides[slideIndex].elements;
      const elementIndex = elements.findIndex((e) => e.id === elementId);
      if (elementIndex !== -1) {
        const element = elements[elementIndex] as unknown as CustomElement;
        switch (element.type) {
          case "title":
          case "sub":
          case "text":
            element.value = value as string;
            break;
          case "img":
            element.value = value as string | File;
            break;
          case "list":
            element.value = value as string[];
            break;
          case "slide":
            element.value = value as string[];
            break;
          case "quiz":
            element.value = value as QuizElementValue;
            break;
          case "accordion":
            element.value = value as AccordionElementValue[];
            break;
          case "sequence":
            element.value = value as string[];
            break;
          case "reveal":
            element.value = value as RevealElementValue[];
            break;
          case "range":
            element.value = value as boolean;
            break;
          case "dnd":
            element.value = value as DndElementValue;
            break;
          default:
            // Handle unknown element type or throw error
            throw new Error(
              `Unknown element type: ${(element as CustomElement).type}`
            );
        }
      }
    },

    deleteChapter: (state, action: PayloadAction<{ chapterIndex: number }>) => {
      const { chapterIndex } = action.payload;
      state.chapters.splice(chapterIndex, 1);
    },

    deleteSlide: (
      state,
      action: PayloadAction<{ chapterIndex: number; slideIndex: number }>
    ) => {
      const { chapterIndex, slideIndex } = action.payload;
      state.chapters[chapterIndex].slides.splice(slideIndex, 1);
    },

    resetCourse: () => {
      return {
        title: "",
        description: "",
        image: "",
        chapters: [],
        published: false,
      };
    },
  },
});

export const {
  setCourse,
  setTitle,
  setDescription,
  setImage,
  togglePublished,
  addChapter,
  updateChapter,

  addSlide,
  updateSlide,
  addElementToSlide,
  updateElement,
  deleteElement,
  deleteChapter,
  deleteSlide,

  resetCourse,
} = courseSlice.actions;

export default courseSlice.reducer;

export const selectCourse = (state: { course: CourseState }) => state.course;
export const selectChapters = (state: { course: CourseState }) =>
  state.course.chapters;
export const selectSlides = (
  state: { course: CourseState },
  chapterIndex: number
) => {
  return state.course.chapters[chapterIndex]?.slides || [];
};

export const selectElements = (
  state: { course: CourseState },
  chapterIndex: number,
  slideIndex: number
) => {
  const { chapters } = state.course;
  return chapters[chapterIndex]?.slides[slideIndex]?.elements || [];
};

export const selectAllSlides = createSelector([selectChapters], (chapters) =>
  chapters.map((chapter) => chapter.slides)
);
