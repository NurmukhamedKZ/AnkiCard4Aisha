import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import './PageSelection.css';

// Set worker to use CDN to avoid version mismatches and bundling issues
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PageSelection = ({ file, onContinue, onCancel }) => {
    const [numPages, setNumPages] = useState(null);
    const [selectedPages, setSelectedPages] = useState(new Set());
    const [loading, setLoading] = useState(true);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        // Default select all
        const allPages = new Set(Array.from({ length: numPages }, (_, i) => i));
        setSelectedPages(allPages);
        setLoading(false);
    };

    const togglePage = (pageIndex) => {
        const newSelected = new Set(selectedPages);
        if (newSelected.has(pageIndex)) {
            newSelected.delete(pageIndex);
        } else {
            newSelected.add(pageIndex);
        }
        setSelectedPages(newSelected);
    };

    const handleSelectAll = () => {
        const allPages = new Set(Array.from({ length: numPages }, (_, i) => i));
        setSelectedPages(allPages);
    };

    const handleDeselectAll = () => {
        setSelectedPages(new Set());
    };

    const handleContinue = () => {
        // Pass selected pages as array
        onContinue(Array.from(selectedPages));
    };

    return (
        <div className="page-selection-overlay">
            <div className="page-selection-container">
                <header className="page-selection-header">
                    <h2>Select pages to process</h2>
                    <div className="selection-controls">
                        <button onClick={handleSelectAll} className="btn btn-sm btn-outline">Select All</button>
                        <button onClick={handleDeselectAll} className="btn btn-sm btn-outline">Deselect All</button>
                    </div>
                </header>

                <div className="pdf-preview-grid">
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="spinner"></div>}
                        error={<div className="error-message">Failed to load PDF preview.</div>}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <div
                                key={`page_${index}`}
                                className={`pdf-page-item ${selectedPages.has(index) ? 'selected' : ''}`}
                                onClick={() => togglePage(index)}
                            >
                                <div className="page-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedPages.has(index)}
                                        readOnly
                                    />
                                </div>
                                <Page
                                    pageNumber={index + 1}
                                    width={200}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                                <span className="page-number">Page {index + 1}</span>
                            </div>
                        ))}
                    </Document>
                </div>

                <footer className="page-selection-footer">
                    <span className="selection-count">{selectedPages.size} pages selected</span>
                    <div className="footer-actions">
                        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
                        <button
                            onClick={handleContinue}
                            className="btn btn-primary"
                            disabled={selectedPages.size === 0}
                        >
                            Continue
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PageSelection;
