// components/Base64Image.js
import React from "react";

const Base64Image = ({ base64String }: { base64String: string }) => {
  return (
    <img
      className="h-full w-full"
      src={`data:image/jpeg;base64,${base64String}`}
      alt="Base64 Image"
    />
  );
};

export default Base64Image;
