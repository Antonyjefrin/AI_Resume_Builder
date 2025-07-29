import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from '~/lib/utils';

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void;
}

const Uploader = ({ onFileSelect }: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setSelectedFile(file);
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024;

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    });

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        onFileSelect?.(null);
    };

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="space-y-4 cursor-pointer">
                    {selectedFile ? (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-between uploader-selected-file"
                        >
                            <img src="/images/pdf.png" alt="pdf" className="h-15 w-15" />
                            <div className="text-center space-y-1">
                                <p className="text-xl font-bold text-black truncate max-w-sm mx-auto">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-gray-500">{formatSize(selectedFile.size)}</p>
                            </div>
                            <button onClick={handleRemoveFile}>
                                <img src="/icons/cross.svg" alt="cross" className="h-7 w-7 cursor-pointer" />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-between">
                                <img src="/icons/info.svg" alt="upload" className="h-full w-full" />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span>Click to upload</span> or drag and drop files
                            </p>
                            <p className="text-lg text-gray-500">
                                PDF (max {formatSize(maxFileSize)})
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Uploader;
