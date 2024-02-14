import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import createAxiosInstance from "@/api/axiosInstance";

// Async thunk for fetching devotions
export const fetchDevotions = createAsyncThunk(
  "devotions/fetchDevotions",
  async (arg, { getState }) => {
    const token = getState().auth.token;
    const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.get("/devotion/show");
    return response.data;
  }
);

// Async thunk for creating a devotion
export const createDevotion = createAsyncThunk(
  "devotions/createDevotion",
  async ({ token, devotion }, { getState }) => {
    const axiosInstance = createAxiosInstance(token);
    let transformedDevotion = { ...devotion };
    devotion.paragraphs.forEach((paragraph, index) => {
      transformedDevotion[`paragraph${index + 1}`] = paragraph;
    });
    delete transformedDevotion.paragraphs;
    transformedDevotion.image = transformedDevotion.photo;
    delete transformedDevotion.photo;
    let formData = new FormData();
    Object.entries(transformedDevotion).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await axiosInstance.post("/devotion/create", formData);
    return response.data;
  }
);

// Async thunk for updating a devotion
export const updateDevotion = createAsyncThunk(
  "devotions/updateDevotion",
  async ({ token, devotion }, { getState }) => {
    const axiosInstance = createAxiosInstance(token);
    let transformedDevotion = { ...devotion };
    devotion.paragraphs.forEach((paragraph, index) => {
      transformedDevotion[`paragraph${index + 1}`] = paragraph;
    });
    delete transformedDevotion.paragraphs;
    transformedDevotion.image = transformedDevotion.photo;
    delete transformedDevotion.photo;
    let formData = new FormData();
    Object.entries(transformedDevotion).forEach(([key, value]) => {
      formData.append(key, value);
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
    const token = getState().auth.token; // get the token from the auth state
    const axiosInstance = createAxiosInstance(token);
    await axiosInstance.delete(`/devotion/${id}`);
    return id;
  }
);

const initialState = {
  form: {
    month: "",
    day: "",
    title: "",
    chapter: "",
    verse: "",
    paragraphs: [],
    prayer: "",
    subTitles: [],
    photo: null,
  },
  devotions: [],
  selectedDevotion: null,
  isEditing: false,
};

const devotionsSlice = createSlice({
  name: "devotions",
  initialState,
  reducers: {
    selectDevotion: (state, action) => {
      state.selectedDevotion = action.payload;
    },
    startEditing: (state, action) => {
      state.form = action.payload;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    updateForm: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm: (state) => {
      state.form = initialState.form;
      state.file = initialState.file;
    },
    addParagraph: (state) => {
      state.form.paragraphs.push("");
    },
    updateParagraph: (state, action) => {
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
  },

  extraReducers: (builder) => {
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
      });
  },
  // ... rest of your slice
});

export const selectForm = (state) => state.devotions.form;

export const selectParagraphs = (state) => state.devotions.form.paragraphs;

export const selectPreviewUrl = (state) => state.devotions.form.photo;

export const selectDevotionToDisplay = (state) =>
  state.devotions.devotionToDisplay;

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
} = devotionsSlice.actions;

export default devotionsSlice.reducer;
