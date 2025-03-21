"use client"

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";

function ImageUpload({endpoint, onChange, value}) {

  if (value) {
    return (
      <div className="relative size-40">
        <img src={value} alt="Upload" className="rounded-md size-40 object-cover" />
        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 p1 bg-red-500 rounded-full shadow-ssm"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].ufsUrl);
      }}
      onUploadError={(error) => {
        console.error("bakit error?" + error.message);
      }}
    />
  );
}

export default ImageUpload;
