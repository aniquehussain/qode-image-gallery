import React, { useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import { v4 } from "uuid";

function ImageUpload({
  isOpen,
  onClose,
  setResponseMessage,
  setImages,
  images,
}) {
  // Define the state variables for the component
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Create a ref for the file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Event handler for the file input element
  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];

      // ---------------Data validation start----------------------------- //
      // Check if the uploaded file is an image
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = image.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedExtensions.includes(fileExtension)) {
           onClose();
        setSelectedImage(null);
        fileInputRef.current!.value = "";
        setResponseMessage({
          status: "error",
          message: "Please upload a valid image file (jpg, jpeg, png, gif).",
        });

        return;
      }

      // Check file size (less than 5 MB)
      const maximumFileSizeInMB = 5;
      const maximumFileSizeInBytes = maximumFileSizeInMB * 1024 * 1024;
      if (image.size > maximumFileSizeInBytes) {
           onClose();
        setSelectedImage(null);
        fileInputRef.current!.value = "";
        setResponseMessage({
          status: "error",
          message: `Please upload an image smaller than ${maximumFileSizeInMB} MB.`,
        });

        return;
      }

      // -----------------Data validation complete-------------------------- //
      setSelectedImage(image);
    }
  };

  const onImageUpload = async () => {
    // Check if an image is selected
    if (!selectedImage) {
         onClose();
      setResponseMessage({
        status: "error",
        message: "Please select an image to upload.",
      });

      return;
    }

    setLoading(true);

    // Initialize FormData object to store the data
    const formData = new FormData();

    // Append the image to the FormData object
    formData.append("file", selectedImage);
    formData.append("upload_preset", "gxp2r9e7");
    formData.append("cloud_name", "deswjevcm");

    try {
      console.log(selectedImage);
      const uploadImage = await axios.post(
        "https://api.cloudinary.com/v1_1/deswjevcm/image/upload",
        formData
      );

      if (uploadImage.status === 200) {
        // Send the data to the server, use multipart/form-data as the content type
        const addImageDetailsToDb = await axios.post<
          unknown,
          AxiosResponse<{
            status: string;
            message: string;
            data?: any;
          }>
        >(
          "/api/imageHandler",
          {
            imageUrl: uploadImage?.data?.secure_url,
            imageId: v4(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            // Track upload progress with onUploadProgress event
            onUploadProgress: (progressEvent) => {
              // Calculate the upload progress
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              // Update the progress bar
              setUploadProgress(progress);
            },
          }
        );

        // Display the response message

        setResponseMessage({
          status: addImageDetailsToDb?.data?.status,
          message: addImageDetailsToDb?.data?.message,
        });
        setImages([...images, addImageDetailsToDb?.data?.data]);
      } else {

        setResponseMessage({
          status: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {

      setSelectedImage(null);
      fileInputRef.current!.value = "";
      setResponseMessage({
        status: error?.response?.data?.status,
        message: error?.response?.data?.message,
      });
      //   alert("Something went wrong. Please try again.");
    } finally {
         onClose();
      // Reset the state variables
      setUploadProgress(0);
      setSelectedImage(null);
      fileInputRef.current!.value = "";
      setLoading(false);
    }
  };

  return (
    <>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-center text-2xl my-8 font-light">
                Upload Image
              </h1>

              <div className="">
                {loading && (
                  <div className="flex flex-col">
                    <div className="flex justify-center items-center">
                      <div className="border-4 border-solid border-opacity-70 border-blue-500 rounded-full w-12 h-12 animate-pulse opacity-100 duration-300"></div>
                    </div>
                    <div className="text-sm flex text-gray-500 mt-1 justify-center items-center">
                      Processing...
                    </div>
                  </div>
                )}

                {/* <div className="text-sm text-gray-500 mt-1">Progress</div>
                <div className="mt-1 relative h-2 rounded-full bg-gray-300 mb-4">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-green-500 duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div> */}

                <input
                  ref={fileInputRef}
                  className="rounded-lg bg-gray-200 opacity-50 test-sm  duration-300 file:px-2 file:py-1 file:rounded-lg file:bg-gray-900 file:text-white file:opacity-100 file:hover:bg-gray-600 file:duration-300 file:cursor-pointer"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={onImageChange}
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onImageUpload} colorScheme="blue" mr={3}>
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default ImageUpload;
