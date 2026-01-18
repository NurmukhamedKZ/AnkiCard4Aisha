import { useState, useRef } from 'react';
import './Modal.css';

function UploadModal({ onClose, onFileSelect }) {
    const [dragActive, setDragActive] = useState(false);
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
            onFileSelect(droppedFile);
            onClose();
        } else {
            setError('Please upload a PDF file');
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            onFileSelect(selectedFile);
            onClose();
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
                        className={`upload-zone ${dragActive ? 'active' : ''}`}
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

                        <div className="upload-icon">📤</div>
                        <p className="upload-text">
                            <strong>Drop your PDF here</strong>
                            <br />
                            or click to browse
                        </p>
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
                </div>
            </div>
        </div>
    );
}

export default UploadModal;
