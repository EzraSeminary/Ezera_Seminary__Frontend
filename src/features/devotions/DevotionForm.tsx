// import Devotion from "@/pages/user/Devotion"; // Assuming correct path
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  updateForm,
  updateParagraph,
  selectForm,
  selectParagraphs,
  createDevotion,
  updateDevotion,
  resetForm,
  setIsEditing,
  fetchDevotions,
} from "../../redux/devotionsSlice";
import AddParagraph from "./AddParagraph";
import PhotoUploader from "./PhotoUploader";
import { CircleNotch } from "@phosphor-icons/react";
import { AppDispatch } from "@/redux/store";
import { RootState, Devotion } from "@/redux/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DevotionFormProps {
  // Add any custom props if needed
}

const DevotionForm: React.FC<DevotionFormProps> = () => {
  const token = useSelector((state: RootState) => state.auth.user?.token);
  const dispatch = useDispatch<AppDispatch>();

  // Use destructuring and type annotations for clarity
  const form = useSelector(selectForm);
  const paragraphs = useSelector(selectParagraphs);
  const [file, setFile] = useState<File | null>(null);
  const [localParagraphs, setLocalParagraphs] = useState<string[]>([]);
  const isEditing = useSelector(
    (state: RootState) => state.devotions.isEditing
  );
  const selectedDevotion = useSelector(
    (state: RootState) => state.devotions.selectedDevotion
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && selectedDevotion && selectedDevotion._id) {
      dispatch(updateForm(selectedDevotion));
      if (selectedDevotion.paragraphs) {
        selectedDevotion.paragraphs.forEach(
          (paragraph: string, index: number) => {
            dispatch(updateParagraph({ index, text: paragraph }));
          }
        );
      }
      setFile(selectedDevotion.photo ? (selectedDevotion.photo as File) : null);
    }
  }, [dispatch, isEditing, selectedDevotion]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (event.target.name === "image") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setFile(event.target.files);
    } else {
      dispatch(updateForm({ [event.target.name]: event.target.value }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    const devotion: Devotion = {
      ...form,
      paragraphs,
      photo: file,
      image: form.image,
      body: form.body || [],
    };
    const validToken = token || ""; // Ensure token is not undefined

    try {
      let response;
      if (form._id) {
        response = await dispatch(
          updateDevotion({ token: validToken, devotion })
        );
        if (response.payload) {
          toast.success("Devotion updated successfully!");
        }
      } else {
        response = await dispatch(
          createDevotion({ token: validToken, devotion })
        );
        if (response.payload) {
          toast.success("Devotion created successfully!");
        }
      }

      if (!response.payload) {
        throw new Error();
      }

      await dispatch(fetchDevotions());

      dispatch(resetForm());
      setLocalParagraphs([]);
      dispatch(setIsEditing(false));
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false); // Set back to false after submission is complete
      // Reload the page
      window.location.reload();
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex border-2 shadow-lg rounded-l-2xl h-[100%] font-nokia-bold ">
        <form
          onSubmit={handleSubmit}
          className="w-[90%] mx-auto py-6 space-y-3 "
        >
          <div>
            <select
              className="border-2 border-accent-6 bg-[#fff] outline-accent-7  rounded-md px-2 py-1 text-secondary-6 cursor-pointer text-xs  mr-6"
              name="month"
              value={form.month}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                handleChange(event)
              }
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
              className="border-2 border-accent-6 bg-[#fff] outline-accent-7  rounded-md px-2 py-1 text-secondary-6 cursor-pointer text-xs font-nokia-bold w-[27%] placeholder-secondary-6 focus:placeholder-secondary-4"
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
              className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg text-accent-6 px-2 py-1 placeholder-accent-4"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={35}
            />
          </div>
          <div className="space-y-1 text-sm text-accent-6">
            <label>Chapter to be read</label>
            <input
              type="text"
              name="chapter"
              placeholder="chapter"
              className="w-full border-2 text-accent-6 border-accent-6 outline-accent-7 rounded-lg px-2 py-1 placeholder-accent-4"
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
              placeholder="verse"
              className="w-full border-2 text-accent-6 border-accent-6 outline-accent-7 rounded-lg px-2 py-1 placeholder-accent-4"
              value={form.verse}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </div>
          <AddParagraph
            paragraphs={form.body}
            localParagraphs={localParagraphs}
            setLocalParagraphs={setLocalParagraphs}
          />
          <div className="space-y-1 text-sm text-accent-6">
            <label>Prayer</label>
            <textarea
              name="prayer"
              placeholder="prayer"
              className="w-full border-2 text-accent-6 border-accent-6 outline-accent-7 rounded-lg px-2 py-1 placeholder-accent-4 "
              value={form.prayer}
              onChange={handleChange}
              required
              maxLength={280}
            />
          </div>
          <div className="flex justify-between items-center">
            <PhotoUploader handleChange={handleChange} />
            <div className="space-y-1 text-sm text-accent-6">
              {isSubmitting ? (
                <CircleNotch size={32} /> // Display the spinner while the form is being submitted
              ) : (
                <button
                  type="submit"
                  className=" bg-accent-6 hover:bg-accent-7 text-[#fff] px-6 py-1 rounded-full cursor-pointer "
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
