import { useState, useRef } from 'react';
import './GenerateAIModal.css';

function GenerateAIModal({ onClose, onGenerate }) {
    const [activeTab, setActiveTab] = useState('text');
    const [deckName, setDeckName] = useState('');
    const [textContent, setTextContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const tabs = [
        { id: 'text', label: 'Text', icon: '📝' },
        { id: 'pdf', label: 'PDF', icon: '📄' },
        { id: 'pptx', label: 'PowerPoint', icon: '📊' },
    ];

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type based on active tab
            const validTypes = activeTab === 'pdf'
                ? ['application/pdf']
                : ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'];

            if (!validTypes.some(type => file.type === type || file.name.endsWith(activeTab === 'pdf' ? '.pdf' : '.pptx'))) {
                setError(`Please select a valid ${activeTab.toUpperCase()} file`);
                return;
            }

            setSelectedFile(file);
            setError('');

            // Auto-fill deck name from filename
            if (!deckName) {
                setDeckName(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!deckName) {
                setDeckName(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleGenerate = async () => {
        if (!deckName.trim()) {
            setError('Please enter a deck name');
            return;
        }

        if (activeTab === 'text' && !textContent.trim()) {
            setError('Please enter some text to generate cards from');
            return;
        }

        if ((activeTab === 'pdf' || activeTab === 'pptx') && !selectedFile) {
            setError(`Please select a ${activeTab.toUpperCase()} file`);
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onGenerate({
                type: activeTab,
                deckName: deckName.trim(),
                content: activeTab === 'text' ? textContent : null,
                file: activeTab !== 'text' ? selectedFile : null,
            });
            onClose();
        } catch (err) {
            console.error('Generation failed:', err);
            setError('Failed to generate cards. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetFileInput = () => {
        setSelectedFile(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        resetFileInput();
        setTextContent('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal generate-modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🤖 Generate with AI</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {/* Deck Name */}
                    <div className="input-group">
                        <label>Deck Name</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter deck name"
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="generate-tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`generate-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => handleTabChange(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="generate-content">
                        {activeTab === 'text' ? (
                            <div className="text-input-section">
                                <label>Paste your content</label>
                                <textarea
                                    className="generate-textarea"
                                    placeholder="Paste text, notes, or any content you want to convert into flashcards..."
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                    rows={10}
                                />
                                <p className="helper-text">
                                    AI will analyze your text and create question-answer flashcards.
                                </p>
                            </div>
                        ) : (
                            <div
                                className={`file-drop-zone ${selectedFile ? 'has-file' : ''}`}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={activeTab === 'pdf' ? '.pdf' : '.pptx,.ppt'}
                                    onChange={handleFileSelect}
                                    hidden
                                />

                                {selectedFile ? (
                                    <div className="selected-file">
                                        <div className="file-icon">
                                            {activeTab === 'pdf' ? '📄' : '📊'}
                                        </div>
                                        <div className="file-info">
                                            <span className="file-name">{selectedFile.name}</span>
                                            <span className="file-size">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                        <button
                                            className="remove-file"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                resetFileInput();
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="drop-icon">
                                            {activeTab === 'pdf' ? '📄' : '📊'}
                                        </div>
                                        <p className="drop-text">
                                            <strong>Drop your {activeTab.toUpperCase()} here</strong>
                                            <br />
                                            or click to browse
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {error && <div className="modal-error">{error}</div>}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Generating...
                            </>
                        ) : (
                            <>
                                ✨ Generate Cards
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GenerateAIModal;
