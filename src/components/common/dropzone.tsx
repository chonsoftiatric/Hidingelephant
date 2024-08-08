import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

// Components
import Image from "next/image";
import { ArrowUpFromLineIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/common/button/Button";

export interface DropzoneProps {
  handleDrop: (files: File[]) => void;
  accept?: Accept;
  className?: string;
  maxFiles?: number;
  actionText?: string;
  withIcon?: boolean;
}

export interface Accept {
  [key: string]: string[];
}

function Dropzone({
  handleDrop,
  accept,
  className,
  maxFiles,
  actionText,
  withIcon = true,
}: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach((file: File) => {
          toast.error(`Error uploading file:${file.name}`);
        });
        return;
      }
      handleDrop(acceptedFiles);
    },
    [handleDrop]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept,
    maxFiles: maxFiles,
  });

  return (
    <div
      onError={() => toast.error(`Error uploading file`)}
      className={cn(
        "flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-10 text-sm leading-6 text-gray-600 transition-all duration-150 ease-out",
        isDragActive ? "border-orange-600" : "border-gray-200",
        className
      )}
      {...getRootProps()}
    >
      <input className="w-full" {...getInputProps()} />

      <div className="flex flex-col items-center justify-center gap-y-4">
        <p className="text-center text-xs">
          {isDragActive
            ? "Drop the files here ..."
            : "Drag & drop some files here, or click to select files"}
        </p>
        <Button>
          <ArrowUpFromLineIcon className="h-5 w-5 stroke-white" />{" "}
          {actionText ? actionText : "Choose Files"}
        </Button>
      </div>
    </div>
  );
}

export default Dropzone;
