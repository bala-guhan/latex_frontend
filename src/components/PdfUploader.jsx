import React, { useState, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://latex-backend-0k75.onrender.com';

const PdfUploader = ({ setSessionId }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            await uploadFile(file);
        } else {
            setUploadStatus('Please upload a PDF file');
        }
    }, []);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await uploadFile(file);
        }
    };

    const uploadFile = async (file) => {
        try {
            setIsUploading(true);
            setUploadStatus('Uploading...');
            
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.session_id) {
                setSessionId(response.data.session_id);
            }
            setUploadStatus('Upload successful!');
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div
                className={`w-64 h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all
                    ${isDragging 
                        ? 'border-white bg-gray-800 scale-105' 
                        : 'border-gray-600 hover:border-gray-500 hover:scale-105'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isUploading}
                />
                <label htmlFor="pdf-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    <img 
                        src="/images/pdf.png" 
                        alt="PDF Upload" 
                        className="w-24 h-24 mb-4 opacity-80"
                    />
                    <p className="text-white font-fira text-center mb-2">
                        {isUploading ? 'Uploading...' : 'Drop your PDF here'}
                    </p>
                    <p className="text-gray-400 font-fira text-sm text-center">
                        or click to select
                    </p>
                </label>
            </div>

            {uploadStatus && (
                <div className={`mt-4 p-3 rounded-lg font-fira ${
                    uploadStatus.includes('successful') 
                        ? 'bg-green-900 text-green-200' 
                        : uploadStatus.includes('failed') 
                            ? 'bg-red-900 text-red-200'
                            : 'bg-gray-800 text-gray-200'
                }`}>
                    {uploadStatus}
                </div>
            )}
        </div>
    );
};

export default PdfUploader; 