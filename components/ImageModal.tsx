import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Textarea } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import axios from "axios";

interface Comment {
  _id: string;
  comment: string;
  createdAt: string;
}

interface ImageModalProps {
  imageModalDetails: {
    imageUrl: string;
    imageId: string;
    comments: Comment[];
  };
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageModalDetails, onClose }) => {


  const [isVisible, setIsVisible] = useState(false);

  // Saving the comments sorted by date in a local state
  const [comments, setComments] = useState(
    imageModalDetails?.comments?.length ? imageModalDetails?.comments?.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()).map(
      (comment) => comment.comment
    ):[]
  );
  // State to store the new comment
  const [newComment, setNewComment] = useState("");

  // Define an array of background colors
  const bgColors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-pink-400"];

  // Function to get a random element from an array
  const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  // State to store the randomly chosen background color and character
  const [randomBgColor, setRandomBgColor] = useState("");
  const [randomCharacter, setRandomCharacter] = useState("");

  // Function to generate random values and set the state
  const generateRandomValues = () => {
    const randomColor = getRandomElement(bgColors);
    const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    setRandomBgColor(randomColor);
    setRandomCharacter(randomChar);
  };

  // Generate random values on component mount
  useEffect(() => {
    generateRandomValues();
  }, []);

  useEffect(() => {
    // Set the dialog visibility to true after a short delay to trigger the animation
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Set the dialog visibility to false to trigger the fade-out animation
    setTimeout(onClose, 300); // Wait for the fade-out animation to complete before invoking onClose
  };

  // Function to add a new comment
  const handleAddComment = async () => {
    if (newComment.trim() !== "") {
      try {
        // Send the new comment to the mongodb database
        const response = await axios.patch(
          "/api/imageHandler",
          {
            comment: newComment,
            imageId: imageModalDetails.imageId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // Update the local state with the new comment from the database
        setComments([...comments, response?.data?.data]);
        setNewComment(""); // Clear the input field after adding the comment
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-opacity-80 backdrop-filter backdrop-blur-md bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/2 xl:w-1/2 gap-4 sm:flex">
        {/* Image on the Left */}
        <div className="sm:w-1/2 h-44 sm:h-96 flex-shrink-0 relative">
          <div className="w-full h-full">
            <Image
              src={imageModalDetails.imageUrl}
              className="hover:opacity-70 duration-300 hover:cursor-pointer rounded-lg"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              placeholder="blur"
              blurDataURL={
                "https://res.cloudinary.com/deswjevcm/image/upload/v1690719541/ujpqclrinhkfdncnsfb2.jpg"
              }
              loading="lazy"
              alt="background image"
            />
          </div>

        </div>
        {/* Comment Section on the Right */}
        <div className="flex flex-col space-y-2 sm:w-1/2">
          <p className="text-lg font-bold text-center mt-2 sm:mt-0">Comments</p>
          {/* Display existing comments */}
          <div className="overflow-y-scroll max-h-[12.7rem] sm:h-72 ">
            {comments?.map((comment, index) => (
              <div key={index} className="flex">
                <div
                  className={`rounded-full ${randomBgColor} w-6 h-6 text-center`}
                >
                  {randomCharacter}
                </div>
                <div className="text-xs p-2 shadow-sm bg-gray-100 rounded-tl-none rounded-lg mt-3 my-1">
                  <p className="font-semibold mb-2">Anonymous</p>
                  {comment}
                </div>
              </div>
            ))}
            {/* Display a message if there are no comments */}
            {comments?.length === 0 && (
              <div className="text-center text-gray-400">
                No comments yet, add your first comment
              </div>
            )}
          </div>
          <div className="">
            {/* Input field for adding new comments */}
            <Textarea
              borderRadius={7}
              borderColor="gray.400" // Set border color to dark gray
              color="gray.900" // Set text color to dark gray
              className="mt-2 h-20 out"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment here..."
              size="sm"
              resize={"none"}
            />
            {/* Button to submit the new comment */}
            <Button
              width="full"
              className="mt-2"
              colorScheme="teal"
              variant="solid"
              size="md"
              onClick={handleAddComment}
            >
              Add Comment
            </Button>
          </div>
        </div>
        {/* Cross Button (Close Button) */}
        <button
          className="absolute top-2 right-2 px-2 py-1 rounded-full"
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
