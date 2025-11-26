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
  fetchAvailableYears,
} from "../../redux/devotionsSlice";
import { ethiopianMonths } from "./devotionUtils";
import PhotoUploader from "./PhotoUploader";
import RichTextEditor from "./../courses/Elements/RichTextEditor"; // Import your RichTextEditor component
import { CircleNotch } from "@phosphor-icons/react";
import { AppDispatch } from "@/redux/store";
import { RootState, Devotion } from "@/redux/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DevotionForm: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.user?.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const form = useSelector(selectForm);
  const [file, setFile] = useState<File | null>(null);
  const [bodyContent, setBodyContent] = useState<string>("");
  const isEditing = useSelector(
    (state: RootState) => state.devotions.isEditing
  );
  const selectedDevotion = useSelector(
    (state: RootState) => state.devotions.selectedDevotion
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Helper function to clear stored date (useful for debugging or manual reset)
  const clearStoredDate = () => {
    localStorage.removeItem('lastDevotionDate');
    toast.info('Stored devotion date cleared. Form will start from defaults on next reload.');
  };
  
  // Helper function to get next day/month
  const getNextDayAndMonth = (currentMonth: string, currentDay: number) => {
    const monthIndex = ethiopianMonths.indexOf(currentMonth);
    
    // If day is 30 or we're at the end of Pagume (13th month with 5-6 days)
    if (currentDay >= 30 || (currentMonth === "ጳጉሜ" && currentDay >= 5)) {
      // Move to next month, day 1
      const nextMonthIndex = monthIndex === 13 ? 1 : monthIndex + 1; // Reset to መስከረም after ጳጉሜ
      return {
        month: ethiopianMonths[nextMonthIndex],
        day: 1
      };
    } else {
      // Same month, next day
      return {
        month: currentMonth,
        day: currentDay + 1
      };
    }
  };

  useEffect(() => {
    // Fetch available years when component mounts
    dispatch(fetchAvailableYears());
  }, [dispatch]);

  useEffect(() => {
    // Initialize form for creating new devotion
    if (!isEditing && !form.year) {
      // Check if there's a stored last devotion date in localStorage
      const storedLastDevotionDate = localStorage.getItem('lastDevotionDate');
      
      if (storedLastDevotionDate && (user?.role === "Admin" || user?.role === "Instructor")) {
        try {
          const lastDate = JSON.parse(storedLastDevotionDate);
          const nextDayAndMonth = getNextDayAndMonth(lastDate.month, parseInt(lastDate.day));
          
          dispatch(updateForm({ 
            year: lastDate.year,
            month: nextDayAndMonth.month,
            day: nextDayAndMonth.day.toString()
          }));
        } catch (error) {
          console.error('Error parsing stored devotion date:', error);
          // Fallback to default values
          dispatch(updateForm({ year: 2018 }));
          if (!form.month) {
            dispatch(updateForm({ month: "መስከረም" }));
          }
          if (!form.day) {
            dispatch(updateForm({ day: "1" }));
          }
        }
      } else {
        // Default initialization for new users or when no stored date
        dispatch(updateForm({ year: 2018 }));
        
        // Set default month and day if not set
        if (!form.month) {
          dispatch(updateForm({ month: "መስከረም" }));
        }
        if (!form.day) {
          dispatch(updateForm({ day: "1" }));
        }
      }
    }
  }, [dispatch, isEditing, user?.role, form.year, form.month, form.day]);

  useEffect(() => {
    if (isEditing && selectedDevotion && selectedDevotion._id) {
      dispatch(updateForm({
        ...selectedDevotion,
        image: typeof selectedDevotion.image === 'string' ? selectedDevotion.image : null,
        previewUrl: selectedDevotion.previewUrl,
      }));

      if (
        Array.isArray(selectedDevotion.body) &&
        selectedDevotion.body.length > 0
      ) {
        setBodyContent(selectedDevotion.body[0]);
      }

      setFile(null); // No new file uploaded yet
    }
  }, [dispatch, isEditing, selectedDevotion]);

  const handleFileUpload = (uploadedFile: File) => {
    const renamedFile = new File([uploadedFile], `${uploadedFile.name}`, {
      type: uploadedFile.type,
    });
    setFile(renamedFile);
  };

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    dispatch(updateForm({ [event.target.name]: event.target.value }));
  };

  const handleBodyContentChange = (content: string) => {
    setBodyContent(content);
    dispatch(
      updateParagraph({
        text: content,
        index: 0,
      })
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const devotion: Devotion = {
      ...form,
      body: [bodyContent],
    };

    if (file) {
      devotion.photo = file;
    } else if (isEditing && selectedDevotion?.photo) {
      devotion.photo = selectedDevotion.photo;
    }

    const validToken = token || "";
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
      
      // Store current devotion date in localStorage for next devotion
      if (!isEditing && (user?.role === "Admin" || user?.role === "Instructor")) {
        const currentDevotionDate = {
          year: form.year,
          month: form.month,
          day: form.day
        };
        localStorage.setItem('lastDevotionDate', JSON.stringify(currentDevotionDate));
      }
      
      // Store current values for auto-increment
      const currentMonth = form.month;
      const currentDay = Number(form.day);
      const currentYear = form.year;
      
      // Reset form but keep some values for next devotion
      setFile(null);
      await dispatch(fetchDevotions());
      setBodyContent(""); // Reset the rich text content
      dispatch(setIsEditing(false));
      
      // For admins and instructors creating new devotions, auto-increment to next day
      if (!isEditing && (user?.role === "Admin" || user?.role === "Instructor")) {
        const nextDayAndMonth = getNextDayAndMonth(currentMonth, currentDay);
        dispatch(resetForm());
        
        // Set the next day/month and keep the same year
        setTimeout(() => {
          dispatch(updateForm({ 
            year: currentYear,
            month: nextDayAndMonth.month,
            day: nextDayAndMonth.day.toString()
          }));
        }, 100); // Small delay to ensure reset completes first
      } else {
        dispatch(resetForm());
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      // Removed window.location.reload() to prevent page reload
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex border-2 shadow-lg rounded-l-2xl h-[100%] font-nokia-bold w-[30%]">
        <form
          onSubmit={handleSubmit}
          className="w-[90%] mx-auto py-6 space-y-3"
        >
          <div className="flex flex-wrap gap-2">
            {localStorage.getItem('lastDevotionDate') && !isEditing && (
              <div className="w-full mb-2 p-2 bg-green-100 border border-green-300 rounded-md text-xs text-green-700">
                📅 Auto-incremented from last devotion. 
                <button 
                  type="button" 
                  onClick={clearStoredDate}
                  className="ml-2 text-red-600 underline hover:text-red-800"
                >
                  Reset
                </button>
              </div>
            )}
            <select
              className="border-2 border-accent-6 bg-[#fff] outline-accent-7 rounded-md px-2 py-1 text-secondary-6 text-xs cursor-pointer"
              name="year"
              value={form.year || ""}
              onChange={handleChange}
            >
              <option value="">
                ዓመት ይምረጡ (አማራጭ)
              </option>
              <option value="2017">
                2017 (የአሁኑ ዓመት)
              </option>
              <option value="2018">
                2018 (የሚመጣው ዓመት)
              </option>
            </select>
            <select
              className="border-2 border-accent-6 bg-[#fff] outline-accent-7 rounded-md px-2 py-1 text-secondary-6 text-xs cursor-pointer"
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
              className="border-2 border-accent-6 bg-[#fff] outline-accent-7 rounded-md px-2 py-1 text-secondary-6 text-xs font-nokia-bold cursor-pointer"
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
              placeholder="የጥቅሱ ርዕስ..."
              className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg text-accent-6 px-3 py-2 font-nokia-bold focus:ring-2 focus:ring-accent-6 focus:border-transparent"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={35}
            />
            <div className="text-xs text-gray-500 text-right">
              {form.title.length}/35 characters
            </div>
          </div>
          <div className="space-y-1 text-sm text-accent-6">
            <label>Chapter to be read</label>
            <input
              type="text"
              name="chapter"
              placeholder="ለምሳሌ: ዮሐንስ 3፡16-21"
              className="w-full border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-accent-6 font-nokia-bold focus:ring-2 focus:ring-accent-6 focus:border-transparent"
              value={form.chapter}
              onChange={handleChange}
              required
              maxLength={35}
            />
            <div className="text-xs text-gray-500 text-right">
              {form.chapter.length}/35 characters
            </div>
          </div>
          <div className="space-y-1 text-sm text-accent-6">
            <label>Main Verse</label>
            <textarea
              name="verse"
              placeholder="ዋናው ክፍል (ቁልፍ ጥቅስ) እዚህ ይጻፉ..."
              className="w-full h-20 border-2 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 text-accent-6 font-nokia-bold resize-y focus:ring-2 focus:ring-accent-6 focus:border-transparent"
              value={form.verse}
              onChange={handleChange}
              required
              maxLength={300}
              style={{
                lineHeight: '1.6',
                fontSize: '14px'
              }}
            />
            <div className="text-xs text-gray-500 text-right">
              {form.verse.length}/300 characters
            </div>
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
              placeholder="የጸሎት ጥያቄ እዚህ ይጻፉ..."
              className="w-full h-24 border-2 text-accent-6 border-accent-6 outline-accent-7 rounded-lg px-3 py-2 font-nokia-bold resize-y focus:ring-2 focus:ring-accent-6 focus:border-transparent"
              value={form.prayer}
              onChange={handleChange}
              required
              maxLength={480}
              style={{
                lineHeight: '1.6',
                fontSize: '14px'
              }}
            />
            <div className="text-xs text-gray-500 text-right">
              {form.prayer.length}/480 characters
            </div>
          </div>
          <div className="flex justify-between items-center">
            <PhotoUploader
              handleFileUpload={handleFileUpload}
              existingImageUrl={
                isEditing && selectedDevotion?.photo
                  ? (selectedDevotion.photo as string)
                  : undefined
              }
            />
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
