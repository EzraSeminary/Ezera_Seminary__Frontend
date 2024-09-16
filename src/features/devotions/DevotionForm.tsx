import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import {
  updateForm,
  updateParagraph,
  selectForm,
  createDevotion,
  updateDevotion,
  resetForm,
  setIsEditing,
  fetchDevotions,
} from "../../redux/devotionsSlice";
import PhotoUploader from "./PhotoUploader";
import RichTextEditor from "./../courses/Elements/RichTextEditor"; // Import your RichTextEditor component
import { CircleNotch } from "@phosphor-icons/react";
import { AppDispatch } from "@/redux/store";
import { RootState, Devotion } from "@/redux/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DevotionForm: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.user?.token);
  const dispatch = useDispatch<AppDispatch>();

  const form = useSelector(selectForm);
  const [file, setFile] = useState<File | null>(null);
  const [bodyContent, setBodyContent] = useState<string>(""); // Handle the rich text body content
  const isEditing = useSelector((state: RootState) => state.devotions.isEditing);
  const selectedDevotion = useSelector((state: RootState) => state.devotions.selectedDevotion);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && selectedDevotion && selectedDevotion._id) {
      dispatch(updateForm(selectedDevotion));
  
      // Set bodyContent if body exists and has at least one entry
      if (Array.isArray(selectedDevotion.body) && selectedDevotion.body.length > 0) {
        setBodyContent(selectedDevotion.body[0]);
      }
  
      // Set file if photo exists
      setFile(selectedDevotion.photo ? (selectedDevotion.photo as File) : null);
    }
  }, [dispatch, isEditing, selectedDevotion]);

  // This function will now handle file uploads directly
  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    dispatch(updateForm({ [event.target.name]: event.target.value }));
  };

  const handleBodyContentChange = (content: string) => {
    setBodyContent(content);
    dispatch(updateParagraph({
      text: content,
      index: 0
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const devotion: Devotion = {
      ...form,
      body: [bodyContent], // Use the rich text content for body as an array
      photo: file, // Attach the photo file
    };
    const validToken = token || "";
    try {
      let response;
      if (form._id) {
        response = await dispatch(updateDevotion({ token: validToken, devotion }));
        if (response.payload) {
          toast.success("Devotion updated successfully!");
        }
      } else {
        response = await dispatch(createDevotion({ token: validToken, devotion }));
        if (response.payload) {
          toast.success("Devotion created successfully!");
        }
      }

      if (!response.payload) {
        throw new Error();
      }

      await dispatch(fetchDevotions());
      dispatch(resetForm());
      setBodyContent(""); // Reset the rich text content
      dispatch(setIsEditing(false));
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex border-2 shadow-lg rounded-l-2xl h-[100%] font-nokia-bold w-[30%]">
        <form onSubmit={handleSubmit} className="w-[90%] mx-auto py-6 space-y-3">
          <div>
            <select
              className="border-2 border-accent-6 bg-[#fff] outline-accent-7 rounded-md px-2 py-1 text-secondary-6 cursor-pointer text-xs mr-6"
              name="month"
              value={form.month}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Month
              </option>
              <option value="መስከረም">መስከረም</option>
              <option value="ጥቅምት">ጥቅምት</option>
              <option value="ህዳር">ህዳር</option>
              <option value="ታህሳስ">ታህሳስ</option>
              <option value="ጥር">ጥር</option>
              <option value="የካቲት">የካቲት</option>
              <option value="መጋቢት">መጋቢት</option>
              <option value="ሚያዚያ">ሚያዚያ</option>
              <option value="ግንቦት">ግንቦት</option>
              <option value="ሰኔ">ሰኔ</option>
              <option value="ሐምሌ">ሐምሌ</option>
              <option value="ነሐሴ">ነሐሴ</option>
              <option value="ጳጉሜ">ጳጉሜ</option>
            </select>
            <input
              type="number"
              name="day"
              min="1"
              max="30"
              placeholder="Day"
              className="border-2 border-accent-6 bg-[#fff] outline-accent-7 rounded-md px-2 py-1 text-secondary-6 cursor-pointer text-xs font-nokia-bold w-[27%]"
              value={form.day}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1 text-sm text-accent-6">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg text-accent-6 px-2 py-1"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={35}
            />
          </div>
          <div className="space-y-1 text-sm text-accent-6">
            <label>Chapter to be read</label>
            <p> </p>
            <input
              type="text"
              name="chapter"
              placeholder="Chapter"
              className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg px-2 py-1"
              value={form.chapter}
              onChange={handleChange}
              required
              maxLength={35}
            />
          </div>
          <div className="space-y-1 text-sm text-accent-6">
            <label>Main Verse</label>
            <input
              type="text"
              name="verse"
              placeholder="Verse"
              className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg px-2 py-1"
              value={form.verse}
              onChange={handleChange}
              required
              maxLength={300}
            />
          </div>
          <div className="space-y-1 text-sm text-accent-6">
            <label>Body</label>
            <RichTextEditor
              initialValue={bodyContent}
              setRichTextData={handleBodyContentChange}
            />
          </div>
          <div className="space-y-1 text-sm text-accent-6">
            <label>Prayer</label>
            <textarea
              name="prayer"
              placeholder="Prayer"
              className="w-full border-2 text-accent-6 border-accent-6 outline-accent-7 rounded-lg px-2 py-1"
              value={form.prayer}
              onChange={handleChange}
              required
              maxLength={480}
            />
          </div>
          <div className="flex justify-between items-center">
            <PhotoUploader handleFileUpload={handleFileUpload} />
            <div className="space-y-1 text-sm text-accent-6">
              {isSubmitting ? (
                <CircleNotch size={32} />
              ) : (
                <button
                  type="submit"
                  className="bg-accent-6 hover:bg-accent-7 text-[#fff] px-6 py-1 rounded-full cursor-pointer"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default DevotionForm;
