import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import createAxiosInstance from "@/api/axiosInstance";
import { RootState } from "./store";
import { FormState } from "./types";

// Define a type for the slice state
interface Devotion {
  month: string;
  day: string;
  year?: number; // Optional for backward compatibility
  title: string;
  chapter: string;
  verse: string;
  paragraphs: string[];
  body: string[];
  prayer: string;
  subTitles: string[];
  photo: File | string | null; // Assuming 'photo' can be a File object or a string URL to the photo
  _id?: string;
}

export interface DevotionsState {
  form: FormState;
  devotions: Devotion[];
  selectedDevotion: Devotion | null;
  isEditing: boolean;
  availableYears: number[];
  selectedYear: number;
}

const initialState: DevotionsState = {
  // eslint-disable-next-line
  // @ts-expect-error
  form: {
    month: "",
    day: "",
    year: 2017, // Default to current Ethiopian year 2017
    title: "",
    chapter: "",
    verse: "",
    paragraphs: [],
    body: [],
    prayer: "",
    subTitles: [],
    photo: null,
  },
  devotions: [],
  selectedDevotion: null,
  isEditing: false,
  availableYears: [],
  selectedYear: 2017, // Default to current Ethiopian year
};

// Async thunk for fetching devotions
export const fetchDevotions = createAsyncThunk(
  "devotions/fetchDevotions",
  async () => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get("/devotion/show");
    return response.data;
  }
);

// Async thunk for creating a devotion
export const createDevotion = createAsyncThunk(
  "devotions/createDevotion",
  async function ({ token, devotion }: { token: string; devotion: Devotion }) {
    const axiosInstance = createAxiosInstance(token);
    const transformedDevotion: {
      [key: string]: string | File | null | string[] | number;
    } = { ...devotion };
    devotion.paragraphs.forEach((paragraph, index) => {
      transformedDevotion[`paragraph${index + 1}`] = paragraph;
    });
    delete transformedDevotion.paragraphs;
    transformedDevotion.image = transformedDevotion.photo;
    delete transformedDevotion.photo;
    const formData = new FormData();
    Object.entries(transformedDevotion).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else {
        if (value !== null && value !== undefined) {
          if (typeof value === 'number') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value);
          }
        }
      }
    });
    const response = await axiosInstance.post("/devotion/create", formData);
    return response.data;
  }
);

// Async thunk for updating a devotion
export const updateDevotion = createAsyncThunk(
  "devotions/updateDevotion",
  async ({ token, devotion }: { token: string; devotion: Devotion }) => {
    const axiosInstance = createAxiosInstance(token);
    const transformedDevotion: {
      [key: string]: string | File | null | string[] | number;
    } = {};

    // Add fields to transformedDevotion
    transformedDevotion.month = devotion.month;
    transformedDevotion.day = devotion.day;
    if (devotion.year) {
      transformedDevotion.year = devotion.year.toString();
    }
    transformedDevotion.title = devotion.title;
    transformedDevotion.chapter = devotion.chapter;
    transformedDevotion.verse = devotion.verse;
    transformedDevotion.prayer = devotion.prayer;

    // Handle paragraphs/body
    if (Array.isArray(devotion.body)) {
      devotion.body.forEach((paragraph, index) => {
        transformedDevotion[`paragraph${index + 1}`] = paragraph;
      });
    }

    // Handle image
    if (devotion.photo instanceof File) {
      transformedDevotion.image = devotion.photo;
    }

    const formData = new FormData();
    Object.entries(transformedDevotion).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else if (value !== null && value !== undefined) {
        if (typeof value === 'number') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value);
        }
      }
    });

    const response = await axiosInstance.put(
      `/devotion/${devotion._id}`,
      formData
    );
    return response.data;
  }
);

// Async thunk for deleting a devotion
export const deleteDevotion = createAsyncThunk(
  "devotions/deleteDevotion",
  async (id, { getState }) => {
    const token = (getState() as RootState).auth.user?.token || ""; // get the token from the auth state
    const axiosInstance = createAxiosInstance(token);
    await axiosInstance.delete(`/devotion/${id}`);
    return id;
  }
);

// Async thunk for fetching available years
export const fetchAvailableYears = createAsyncThunk(
  "devotions/fetchAvailableYears",
  async () => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get("/devotion/years");
    return response.data;
  }
);

// Async thunk for fetching devotions by year
export const fetchDevotionsByYear = createAsyncThunk(
  "devotions/fetchDevotionsByYear",
  async (year: number) => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`/devotion/year/${year}`);
    return response.data;
  }
);

// Async thunk for creating devotions for a new year
export const createDevotionsForNewYear = createAsyncThunk(
  "devotions/createDevotionsForNewYear",
  async ({ sourceYear, targetYear }: { sourceYear: number; targetYear: number }, { getState }) => {
    const token = (getState() as RootState).auth.user?.token || "";
    const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.post("/devotion/copy-year", {
      sourceYear,
      targetYear
    });
    return response.data;
  }
);

// The slice definition
const devotionsSlice = createSlice({
  name: "devotions",
  initialState,
  reducers: {
    selectDevotion(state, action: PayloadAction<Devotion>) {
      state.selectedDevotion = action.payload;
    },
    startEditing(state, action: PayloadAction<FormState>) {
      state.form = action.payload;
    },
    setIsEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
    updateForm(state, action: PayloadAction<Partial<FormState>>) {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm(state) {
      state.form = initialState.form;
    },
    addParagraph: (state) => {
      state.form.paragraphs.push("");
    },
    updateParagraph: (
      state,
      action: PayloadAction<{ index: number; text: string }>
    ) => {
      const { index, text } = action.payload;
      state.form.paragraphs[index] = text;
    },
    deleteParagraph: (state, action) => {
      state.form.paragraphs.splice(action.payload, 1);
    },
    updateFile: (state, action) => {
      state.form.photo = action.payload;
    },
    addSubtitle: (state) => {
      state.form.subTitles.push("");
    },
    updateSubtitle: (state, action) => {
      const { index, value } = action.payload;
      state.form.subTitles[index] = value;
    },
    deleteSubtitle: (state, action) => {
      state.form.subTitles.splice(action.payload, 1);
    },
    clearSelectedDevotion: (state) => {
      state.form = initialState.form;
      state.selectedDevotion = null;
    },
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
    // ... additional reducers will need to update their action payloads with types as well
  },
  extraReducers: (builder) => {
    // Add matchers or cases with types for the fulfilled actions
    builder
      .addCase(fetchDevotions.fulfilled, (state, action) => {
        state.devotions = action.payload;
      })
      .addCase(createDevotion.fulfilled, (state, action) => {
        state.devotions.push(action.payload);
      })
      .addCase(updateDevotion.fulfilled, (state, action) => {
        const index = state.devotions.findIndex(
          (devotion) => devotion._id === action.payload._id
        );
        if (index !== -1) {
          state.devotions[index] = action.payload;
        }
      })
      .addCase(deleteDevotion.fulfilled, (state, action) => {
        const index = state.devotions.findIndex(
          (devotion) => devotion._id === action.payload
        );
        if (index !== -1) {
          state.devotions.splice(index, 1);
        }
      })
      .addCase(fetchAvailableYears.fulfilled, (state, action) => {
        state.availableYears = action.payload;
      })
      .addCase(fetchDevotionsByYear.fulfilled, (state, action) => {
        state.devotions = action.payload;
      });
  },
});

// ... export actions and the reducer
export const selectForm = (state: { devotions: { form: FormState } }) =>
  state.devotions.form;

export const selectParagraphs = (state: { devotions: { form: FormState } }) =>
  state.devotions.form.paragraphs;

export const selectPreviewUrl = (state: { devotions: { form: FormState } }) =>
  state.devotions.form.photo;

export const selectDevotionToDisplay = (state: {
  devotions: { devotionToDisplay: Devotion };
}) => state.devotions.devotionToDisplay;

export const {
  selectDevotion,
  startEditing,
  setIsEditing,
  updateForm,
  addParagraph,
  updateParagraph,
  deleteParagraph,
  addSubtitle,
  updateSubtitle,
  deleteSubtitle,
  updateFile,
  resetForm,
  clearSelectedDevotion,
  setSelectedYear,
} = devotionsSlice.actions;

export default devotionsSlice.reducer;
