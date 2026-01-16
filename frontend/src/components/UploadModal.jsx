import { useState, useRef } from 'react';
import { cardsAPI } from '../api/client';
import './Modal.css';

function UploadModal({ onClose, onComplete }) {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type === 'application/pdf') {
            setFile(droppedFile);
            setError('');
        } else {
            setError('Please upload a PDF file');
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const newCards = await cardsAPI.uploadPDF(file);
            onComplete(newCards);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to process PDF. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Upload PDF</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div
                        className={`upload-zone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            hidden
                        />

                        {file ? (
                            <div className="file-preview">
                                <div className="file-icon">📄</div>
                                <div className="file-name">{file.name}</div>
                                <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                        ) : (
                            <>
                                <div className="upload-icon">📤</div>
                                <p className="upload-text">
                                    <strong>Drop your PDF here</strong>
                                    <br />
                                    or click to browse
                                </p>
                            </>
                        )}
                    </div>

                    {error && <div className="modal-error">{error}</div>}

                    <p className="upload-note text-muted">
                        AI will analyze your PDF and generate flashcards automatically.
                    </p>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                    >
                        {uploading ? (
                            <>
                                <span className="spinner"></span>
                                Generating Cards...
                            </>
                        ) : (
                            'Generate Cards'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadModal;
