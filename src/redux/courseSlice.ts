import { createSlice, createSelector } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
  name: "course",
  initialState: {
    title: "",
    description: "",
    image: "",
    chapters: [],
  },
  reducers: {
    setCourse: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    addChapter: (state) => {
      state.chapters.push({
        chapter: "",
        slides: [],
      });
    },
    updateChapter: (state, action) => {
      const { chapterIndex, value } = action.payload;
      state.chapters[chapterIndex].chapter = value;
    },

    addSlide: (state, action) => {
      const { chapterIndex } = action.payload;
      state.chapters[chapterIndex].slides.push({
        slide: "",
        elements: [],
      });
    },
    deleteElement(state, action) {
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
    updateSlide: (state, action) => {
      const { chapterIndex, slideIndex, value } = action.payload;
      state.chapters[chapterIndex].slides[slideIndex].slide = value;
    },
    addElementToSlide: (state, action) => {
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
    updateElement: (state, action) => {
      const { chapterIndex, slideIndex, elementId, value } = action.payload;
      const elements = state.chapters[chapterIndex].slides[slideIndex].elements;
      const elementIndex = elements.findIndex((e) => e.id === elementId);
      if (elementIndex !== -1) {
        elements[elementIndex].value = value;
      }
    },

    setCurrentChapter: (state, action) => {
      state.currentChapterIndex = action.payload;
    },
    setCurrentSlide: (state, action) => {
      const { chapterIndex, slideIndex } = action.payload;
      state.currentChapterIndex = chapterIndex;
      state.currentSlideIndex = slideIndex;
    },
    selectCurrentChapter: (state) => {
      return state.chapters[state.currentChapterIndex] || {};
    },
    selectCurrentSlide: (state) => {
      const chapter = state.chapters[state.currentChapterIndex];
      if (chapter) {
        return chapter.slides[state.currentSlideIndex] || {};
      }
      return {};
    },
    deleteChapter: (state, action) => {
      const { chapterIndex } = action.payload;
      state.chapters.splice(chapterIndex, 1);
    },

    deleteSlide: (state, action) => {
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
  selectCurrentChapter,
  selectCurrentSlide,
} = courseSlice.actions;

export default courseSlice.reducer;

export const selectCourse = (state) => state.course;
export const selectChapters = (state) => state.course.chapters;
export const selectSlides = (state, chapterIndex) => {
  return state.course.chapters[chapterIndex]?.slides;
};

export const selectElements = (state, chapterIndex, slideIndex) => {
  const { chapters } = state.course;
  return chapters[chapterIndex]?.slides[slideIndex]?.elements || [];
};

export const selectAllSlides = createSelector([selectChapters], (chapters) =>
  chapters.map((chapter) => chapter.slides)
);
