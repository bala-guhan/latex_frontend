import React, { useState, useCallback } from 'react';
import axios from 'axios';
//eslint-disable-next-line
import { motion } from 'framer-motion';

const BACKEND_URL = 'https://latex-backend-0k75.onrender.com';

const PdfUploader = ({ setSessionId }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState('');

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
            setUploadProgress(0);
            setProcessingStatus('');
            
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            if (response.data && response.data.session_id) {
                setUploadProgress(100);
                setUploadStatus('Processing PDF...');
                setProcessingStatus('Reading and indexing document...');
                
                // Poll for processing status
                const checkProcessingStatus = async () => {
                    try {
                        const statusResponse = await axios.get(`${BACKEND_URL}/processing-status/${response.data.session_id}`);
                        if (statusResponse.data.status === 'completed') {
                            setSessionId(response.data.session_id);
                            setUploadStatus('Ready for chat!');
                            setProcessingStatus('');
                        } else if (statusResponse.data.status === 'processing') {
                            setProcessingStatus(statusResponse.data.message || 'Processing...');
                            setTimeout(checkProcessingStatus, 1000);
                        } else {
                            setUploadStatus('Error processing PDF');
                            setProcessingStatus('');
                        }
                    } catch (error) {
                        console.error('Error checking processing status:', error);
                        setUploadStatus('Error checking processing status');
                        setProcessingStatus('');
                    }
                };
                
                checkProcessingStatus();
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('Upload failed. Please try again.');
            setProcessingStatus('');
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

            {(uploadStatus || processingStatus) && (
                <div className="mt-4 w-full max-w-md">
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                            <motion.div
                                className="bg-white h-2.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    )}
                    <div className={`p-3 rounded-lg font-fira text-center ${
                        uploadStatus.includes('successful') || uploadStatus.includes('Ready')
                            ? 'bg-green-900 text-green-200' 
                            : uploadStatus.includes('failed') || uploadStatus.includes('Error')
                                ? 'bg-red-900 text-red-200'
                                : 'bg-gray-800 text-gray-200'
                    }`}>
                        {uploadStatus}
                        {processingStatus && (
                            <div className="mt-2 text-sm">
                                <motion.div
                                    className="inline-block w-3 h-3 bg-white rounded-full mr-2"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                {processingStatus}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-4 ">
                <p className="text-white font-fira text-center mb-2">
                    More formats coming soon! (docx, txt, etc.)
                </p>
            </div>
        </div>
    );
};

export default PdfUploader; 