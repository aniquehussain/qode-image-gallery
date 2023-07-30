import React, { useEffect, useState } from "react";

const Dialog = ({ message, onClose, status }) => {
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-opacity-60 backdrop-filter backdrop-blur-md bg-white p-8 rounded-lg shadow-lg w-10/12 md:w-1/2 xl:w-1/3">
        {status === "success" ? (
          <h2 className="text-green-600 text-lg font-semibold mb-4">Success</h2>
        ) : (
          <h2 className="text-red-600 font-semibold text-lg mb-4">Error</h2>
        )}

        <p className="text-gray-800 mb-6">{message}</p>
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full font-semibold"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Dialog;
