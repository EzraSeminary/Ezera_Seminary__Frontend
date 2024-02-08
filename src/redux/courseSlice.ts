import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface CourseState {
  title: string;
  description: string;
  image: string;
  chapters: Chapter[];
  currentChapterIndex?: number;
  currentSlideIndex?: number;
}

// Define a type for the Chapter
export interface Chapter {
  chapter: string;
  slides: Slide[];
}

// Define a type for each of the Slide and Element properties
export interface Slide {
  slide: string;
  elements: Element[];
}

export interface Element {
  type: string;
  id: string;
  value: string | string[];
}

// Define the initial state using `CourseState`
const initialState: CourseState = {
  title: '',
  description: '',
  image: '',
  chapters: [],
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
    setImage: (state, action: PayloadAction<string>) => {
      state.image = action.payload;
    },
    addChapter: (state) => {
      state.chapters.push({
        chapter: "",
        slides: [],
      });
    },
    updateChapter: (state, action: PayloadAction<{ chapterIndex: number; value: string }>) => {
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
    deleteElement(state, action: PayloadAction<{ chapterIndex: number; slideIndex: number; elementId: string }>) {
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
    updateSlide: (state, action: PayloadAction<{ chapterIndex: number; slideIndex: number; value: string }>) => {
      const { chapterIndex, slideIndex, value } = action.payload;
      state.chapters[chapterIndex].slides[slideIndex].slide = value;
    },
    addElementToSlide: (state, action: PayloadAction<{ chapterIndex: number; slideIndex: number; elementType: string; value: string }>) => {
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

      const newElement = {
        type: elementType,
        id: `${elementType}${Math.random().toString(36).substr(2, 9)}`, // Unique ID generation
        value: elementType === "list" || elementType === "slide" ? value : "",
      };

      // Handle other element types and set their values accordingly
      if (
        elementType === "title" ||
        elementType === "sub" ||
        elementType === "text" ||
        elementType === "img" ||
        elementType === "quiz"
      ) {
        newElement.value = ""; // For other types, initialize the value as an empty string
      }

      slides[slideIndex].elements.push(newElement);
    },
    updateElement: (state, action: PayloadAction<{ chapterIndex: number; slideIndex: number; elementId: string; value: string }>) => {
      const { chapterIndex, slideIndex, elementId, value } = action.payload;
      const elements = state.chapters[chapterIndex].slides[slideIndex].elements;
      const elementIndex = elements.findIndex((e) => e.id === elementId);
      if (elementIndex !== -1) {
        elements[elementIndex].value = value;
      }
    },

    setCurrentChapter: (state, action: PayloadAction<number>) => {
      state.currentChapterIndex = action.payload;
    },
    setCurrentSlide: (state, action: PayloadAction<{ chapterIndex: number; slideIndex: number }>) => {
      const { chapterIndex, slideIndex } = action.payload;
      state.currentChapterIndex = chapterIndex;
      state.currentSlideIndex = slideIndex;
    },

    deleteChapter: (state, action: PayloadAction<{ chapterIndex: number }>) => {
      const { chapterIndex } = action.payload;
      state.chapters.splice(chapterIndex, 1);
    },

    deleteSlide: (state, action: PayloadAction<{ chapterIndex: number; slideIndex: number }>) => {
      const { chapterIndex, slideIndex } = action.payload;
      state.chapters[chapterIndex].slides.splice(slideIndex, 1);
    },
  },
});

export const {
  setCourse,
  setTitle,
  setDescription,
  setImage,
  addChapter,
  updateChapter,

  addSlide,
  updateSlide,
  addElementToSlide,
  updateElement,
  deleteElement,
  deleteChapter,
  deleteSlide,

  setCurrentChapter,
  setCurrentSlide,
} = courseSlice.actions;

export default courseSlice.reducer;

export const selectCourse = (state: { course: CourseState }) => state.course;
export const selectChapters = (state: { course: CourseState }) => state.course.chapters;
export const selectSlides = (state: { course: CourseState }, chapterIndex: number) => {
  return state.course.chapters[chapterIndex]?.slides || [];
};

export const selectElements = (state: { course: CourseState }, chapterIndex: number, slideIndex: number) => {
  const { chapters } = state.course;
  return chapters[chapterIndex]?.slides[slideIndex]?.elements || [];
};

export const selectAllSlides = createSelector([selectChapters], (chapters) =>
  chapters.map((chapter) => chapter.slides)
);
