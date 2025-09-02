import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Loading = () => {
  const { nextUrl } = useParams();

  useEffect(() => {
    const redirectToStripe = () => {
      const url = localStorage.getItem("stripeRedirectUrl");
      if (url) {
        window.location.href = url;
      } else {
        // Fallback if no URL found
        window.location.href = "/";
      }
    };

    setTimeout(redirectToStripe, 3000); // Show loading for 3 seconds
  }, [nextUrl]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
    </div>
  );
};

export default Loading;
