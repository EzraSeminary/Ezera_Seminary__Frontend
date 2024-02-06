// import Devotion from "@/routes/Devotion";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
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

const DevotionForm = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const form = useSelector(selectForm); // select the form from the Redux store
  const paragraphs = useSelector(selectParagraphs); // select the paragraphs from the Redux store
  const [file, setFile] = useState(null);
  const [localParagraphs, setLocalParagraphs] = useState([]);
  const isEditing = useSelector((state) => state.devotions.isEditing);
  const selectedDevotion = useSelector(
    (state) => state.devotions.selectedDevotion
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && selectedDevotion && selectedDevotion._id) {
      // Dispatch an action to populate the form with the selected devotion's data
      dispatch(updateForm(selectedDevotion));
      // Dispatch an action to populate the paragraphs with the selected devotion's paragraphs
      if (selectedDevotion && selectedDevotion.paragraphs) {
        selectedDevotion.paragraphs.forEach((paragraph, index) => {
          dispatch(updateParagraph({ index, text: paragraph }));
        });
      }
      // Store the existing image URL in the local state
      setFile(selectedDevotion.photo);
    }

    // Cleanup function
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch, selectedDevotion, isEditing]);

  const handleChange = (event) => {
    if (event.target.name === "image") {
      setFile(event.target.file); // store the file object in the local state
    }
    dispatch(updateForm({ [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    let devotion = { ...form, paragraphs, photo: file };

    if (form._id) {
      await dispatch(updateDevotion({ token, devotion }));
    } else {
      await dispatch(createDevotion({ token, devotion }));
    }

    await dispatch(fetchDevotions());

    dispatch(resetForm());
    setLocalParagraphs([]);
    dispatch(setIsEditing(false));

    setIsSubmitting(false); // Set isSubmitting back to false when the form submission is complete

    // Reload the page
    window.location.reload();
  };

  return (
    <div className="flex border-2 shadow-lg rounded-l-2xl h-[100%] font-nokia-bold ">
      <form onSubmit={handleSubmit} className="w-[90%] mx-auto py-6 space-y-3 ">
        <div>
          <select
            className="border-2 border-accent-6 bg-[#fff] outline-accent-7  rounded-md px-2 py-1 text-secondary-6 cursor-pointer text-xs  mr-6"
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
            <option value="ነሀሴ">ነሀሴ</option>
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
            type="text"
            name="prayer"
            placeholder="prayer"
            className="w-full border-2 text-accent-6 border-accent-6 outline-accent-7 rounded-lg px-2 py-1 placeholder-accent-4 "
            value={form.prayer}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex justify-between items-center">
          <PhotoUploader handleChange={handleChange} required />
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
  );
};

export default DevotionForm;
