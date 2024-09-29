/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { cn } from "../../lib/utils";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { useMotionTemplate, useMotionValue } from "framer-motion";
import React from "react";

const mainVariant = {
    initial: {
        x: 0,
        y: 0,
    },
    animate: {
        x: 0,
        y: -20,
        opacity: 0.9,
    },
};

interface FileUploadProps {
    updateCourse: (file: File) => void;
    fileType: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ updateCourse, fileType }) => {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (newFiles: File[]) => {
        if (newFiles.length > 0) {
            const selectedFile = newFiles[0];
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'];
            if (!allowedTypes.includes(selectedFile.type)) {
                return;
            }
            setFile(selectedFile);
            console.log(selectedFile.name);
            updateCourse(selectedFile);
        }
    };


    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const { getRootProps, isDragActive } = useDropzone({
        multiple: false, // Allow only single file upload
        noClick: true,
        onDrop: handleFileChange,
        onDropRejected: (error) => {
            console.log(error);
        },
    });

    const radius = 100;
    const [visible, setVisible] = React.useState(false);

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            style={{
                background: useMotionTemplate`
                    radial-gradient(
                        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
                        var(--blue-500),
                        transparent 80%
                    )
                `,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className="p-[2px] rounded-lg transition duration-300 group/input w-full shadow-input border-1"
            {...getRootProps()}
        >
            <motion.div
                onClick={handleClick}
                whileHover="animate"
                className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
            >
                <input
                    ref={fileInputRef}
                    id="file-upload-handle"
                    type="file"
                    onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
                    className="hidden"
                />
                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                    <GridPattern />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p className="text-center relative z-20 font-sans font-bold text-neutral-700 text-base">
                        Upload your Course {fileType}
                    </p>
                    <p className="text-center relative z-20 font-sans font-normal text-neutral-400 text-base mt-2">
                        Drag or drop your {fileType} here or click to upload
                    </p>
                    <div className="relative w-full mt-10 max-w-xl mx-auto">
                        {file && ( // Changed to check for a single file
                            <motion.div
                                key="file-upload"
                                layoutId="file-upload"
                                className={cn(
                                    "relative overflow-hidden z-40 bg-white flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                                    "shadow-sm"
                                )}
                            >
                                <div className="flex justify-between w-full items-center gap-4">
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        layout
                                        className="text-base text-neutral-700 truncate max-w-xs"
                                    >
                                        {file.name}
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        layout
                                        className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 shadow-input"
                                    >
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </motion.p>
                                </div>

                                <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600">
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        layout
                                        className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                                    >
                                        {file.type}
                                    </motion.p>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        layout
                                    >
                                        modified{" "}
                                        {new Date(file.lastModified).toLocaleDateString()}
                                    </motion.p>
                                </div>
                            </motion.div>
                        )}
                        {!file && (
                            <motion.div
                                layoutId="file-upload"
                                variants={mainVariant}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                className={cn(
                                    "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                                )}
                            >
                                {isDragActive ? (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-neutral-600 flex flex-col items-center"
                                    >
                                        Drop it
                                        <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </motion.p>
                                ) : (
                                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                                )}
                            </motion.div>
                        )}

                        {!file && (
                            <motion.div
                                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                            ></motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export function GridPattern() {
    const columns = 41;
    const rows = 11;
    return (
        <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
            {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: columns }).map((_, col) => {
                    const index = row * columns + col;
                    return (
                        <div
                            key={`${col}-${row}`}
                            className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${index % 2 === 0
                                ? "bg-gray-50 dark:bg-neutral-950"
                                : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                                }`}
                        />
                    );
                })
            )}
        </div>
    );
}