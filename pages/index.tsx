import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, ButtonGroup, useDisclosure } from "@chakra-ui/react";
import Dialog from "@/components/Dialog/Dialog";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import axios from "axios";
import { ChatIcon, DownloadIcon, LinkIcon } from "@chakra-ui/icons";
import ImageModal from "@/components/ImageModal";

export default function Home() {
  const [responseMessage, setResponseMessage] = useState({
    status: "",
    message: "",
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalDetails, setImageModalDetails] = useState(null)

  // State to store the fetched images
  const [images, setImages] = useState([]);
  // Function to fetch all images from the API

  const fetchImages = async () => {
    try {
      const response = await axios.get("/api/imageHandler");
      const imageData = response.data.data;
      setImages(imageData);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Use useEffect to fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <main className="flex min-h-screen flex-col mx-0 pt-20 sm:mx-20 md:mx-24 sm:pt-10 md:pt-10 xl:p-10">
      <div className="z-10 items-center justify-between text-base font-medium font-mono  lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-100 lg:p-4 ">

          <Button
            className="sticky top-0 right-0 z-10"
            colorScheme="facebook"
            variant="solid"
            size="lg"
            onClick={onOpen}
          >
            Upload Image
          </Button>
        </p>
      </div>

      <div className="flex before:rounded-full before:bg-gradient-radial before:from-white after:blur-2xl mt-4">
        <div className=" mx-auto container mb-2 columns-2 sm:columns-2 lg:columns-3 gap-x-1 gap-y-1 pb-2">
          {images.map((img) => (
            <div key={img.imageId} className="relative mb-1">
              {" "}
              <Image
                src={img.imageUrl}
                className="hover:opacity-70 duration-300 hover:cursor-pointer"
                height={0}
                width={400}
                placeholder="blur"
                blurDataURL={
                  "https://res.cloudinary.com/deswjevcm/image/upload/v1690719541/ujpqclrinhkfdncnsfb2.jpg"
                }
                loading="lazy"
                alt="background image"
              />
              <div
                className="cursor-pointer absolute bottom-1 left-1 bg-white px-2 py-0.5 rounded-md opacity-60 hover:opacity-100"
                onClick={() => setImageModalDetails(img)}
              >
                {/* Add the icon here */}
                <ChatIcon className="duration-300" />
              </div>
              <div className="cursor-pointer absolute bottom-1 left-10 bg-white px-2 py-0.5 rounded-md opacity-60 hover:opacity-100">
                {/* Add the icon here */}
                <DownloadIcon className="duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageUpload
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose}
        setResponseMessage={setResponseMessage}
        setImages={setImages}
        images={images}
      />

      {/* Dialog */}
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        {responseMessage.status !== "" && (
          <Dialog
            status={responseMessage.status}
            message={responseMessage.message}
            onClose={() => {
              setResponseMessage({
                status: "",
                message: "",
              });
            }}
          />
        )}
      </div>

      {/* Image Modal */}
      {imageModalDetails !== null && (
        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
          <ImageModal
            imageModalDetails={imageModalDetails}
            onClose={() => {
              setImageModalDetails(null);
            }}
          />
        </div>
      )}
    </main>
  );
}
