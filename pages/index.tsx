import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, useDisclosure } from "@chakra-ui/react";
import Dialog from "@/components/Dialog/Dialog";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import axios from "axios";
import { ChatIcon, DownloadIcon} from "@chakra-ui/icons";
import ImageModal from "@/components/ImageModal";

export default function Home() {

  // State to store the response message from the API
  const [responseMessage, setResponseMessage] = useState({
    status: "",
    message: "",
  });
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

  // Function to handle the image upload
  const handleDownload = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, { responseType: "blob" });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Adding date to filename to make it unique
      a.download = `${new Date().valueOf()}_image.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

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

      <div className="flex before:rounded-full before:bg-gradient-radial before:from-white after:blur-2xl mt-6 sm:mt-2">
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
              {/* Comment */}
              <div
                className="cursor-pointer absolute bottom-1 left-1 bg-white px-2 py-0.5 rounded-md opacity-60 hover:opacity-100"
                onClick={() => setImageModalDetails(img)}
              >
                <ChatIcon className="duration-300" />
              </div>
              {/* Download */}
              <div className="cursor-pointer absolute bottom-1 left-10 bg-white px-2 py-0.5 rounded-md opacity-60 hover:opacity-100">
                <a href="#" onClick={() => handleDownload(img.imageUrl)}>
                  <DownloadIcon className="duration-300" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      {images.length === 0 && (
        <div className="flex mx-auto justify-center items-center">
          <p className="text-xl font-light text-gray-500 text-center my-10">

            Loading.... <br/>Click on the upload button to upload an
            image
          </p>
          <p></p>
        </div>
      )}
      {/* Upload Image */}
      <ImageUpload
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
