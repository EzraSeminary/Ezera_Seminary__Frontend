import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useGetCourseByIdQuery } from "../../../services/api";
import BeatLoader from "react-spinners/BeatLoader";
// import { ArrowLeft, CheckCircle, Circle, XCircle } from "@phosphor-icons/react";
import { XCircle } from "@phosphor-icons/react";
import logo from "../../../assets/ezra-logo.svg";
// import bibleImage from "../../../assets/bible2.jpeg";

interface Chapter {
    _id: string;
    chapter: string;
}

interface CourseData {
    chapters: Chapter[];
}
const ChapterModal: React.FC<{
    onOpen: () => void;
    onClose: () => void;
}> = ({ onOpen, onClose }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const { courseId } = useParams<{ courseId: string }>();

    //get single course
    const {
        data: courseData,
        error,
        isLoading,
    } = useGetCourseByIdQuery(courseId, {
        skip: !courseId, // Skip the query if courseId is not available yet
    });

    const { chapters }: CourseData = courseData || {};
    const data: Chapter[] = chapters || [];



    {/* Loading state */ }
    if (isLoading)
        return (
            <div className="h-screen flex justify-center items-center">
                <BeatLoader
                    color={"#707070"}
                    loading
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        );

    if (error) return <div>Something went wrong.</div>;

    if (!onOpen) return null;


    onOpen = () => setIsOpen(false);
    onClose = () => setIsOpen(true);
    return (


        <div className={`fixed inset-0 bg-black  flex justify-center items-center h-screen w-full text-white z-20${isOpen ? `block` : `hidden`}`}>
            {/* Chapter display window*/}
            <div className=" justify-start items-center mx-auto h-[80%] chapter-img-1 bg-no-repeat bg-cover bg-center rounded-lg ">

                {/* Chapter display container */}
                <div className="flex flex-col justify-between h-full">

                    {/* Header */}
                    <div>
                        <div className="w-[90%] pt-4 pb-2 flex justify-between mx-auto items-center">
                            <div className=" z-30 h-full flex justify-center items-center  md:space-x-0   xl:space-x-1 cursor-pointer ">
                                <img src={logo} className="w-8 h-5 md:w-10 md:h-6  z-30" alt="" />
                                <h3 className="text-white font-nokia-bold text-xs md:text-sm ">
                                    <strong>Ezra</strong> Seminary
                                </h3>
                            </div>
                            <button type="button" onClick={onClose}>
                                <XCircle size={24} color={'#EA9215'} className="z-20 cursor-pointer" />
                            </button>
                        </div>
                        <hr className="border-accent-5 border-1 w-[90%] mx-auto" />
                    </div>

                    {/* Chapter content */}
                    {data.map((chapter, index) => {
                        if (index === activeIndex) {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col justify-center h-52 flex-grow"
                                >
                                    <h1 className="text-xl text-[#fff] text-center font-nokia-bold">
                                        {chapter.chapter}
                                    </h1>
                                    <button className="text-white text-center font-nokia-bold mt-2 py-2 px-4 bg-accent-6 hover:bg-accent-7 w-[20%] rounded-3xl mx-auto text-sm ">
                                        <NavLink
                                            to={`/courses/get/${courseId}/chapter/${chapter._id}`}
                                        >
                                            ትምህርቱን ጀምር
                                        </NavLink>
                                    </button>
                                </div>
                            );
                        } else {
                            return null; // Hide the chapter if it doesn't match the activeIndex
                        }
                    })}

                    {/* Footer */}
                    <div>
                        <hr className="border-accent-5 border-1 w-[90%] mx-auto mb-8" />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ChapterModal;
