import React, { useState } from 'react';
import FolderSelector from './FolderSelector';
import './CreateFolderModal.css';

const COLORS = [
    '#E9571E', // Orange
    '#D97706', // Gold/Dark Orange
    '#65A30D', // Olive Green
    '#16A34A', // Green
    '#0D9488', // Teal
    '#0891B2', // Cyan
    '#2563EB', // Blue
    '#0284C7', // Light Blue
    '#1D4ED8', // Dark Blue
    '#A21CAF', // Purple
    '#DB2777', // Pink
    '#E11D48', // Red
];

const CreateFolderModal = ({ onClose, onCreate, folders = [], initialParentId = null }) => {
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState(initialParentId);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onCreate(name, selectedColor, parentId);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay fade-in" onClick={onClose}>
            <div className="modal-content folder-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-group">
                        <span className="folder-icon">📂</span>
                        <h3>Create a new folder</h3>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="history"
                            autoFocus
                            className="dark-input"
                        />
                    </div>

                    <FolderSelector
                        folders={folders}
                        selectedFolderId={parentId}
                        onChange={setParentId}
                        label="Parent Folder (Optional)"
                    />

                    <div className="form-group">
                        <label>Folder Color</label>
                        <div className="color-grid">
                            {COLORS.map(color => (
                                <div
                                    key={color}
                                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                >
                                    {selectedColor === color && <span className="check-icon">✓</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            ✕ Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-purple" disabled={loading || !name.trim()}>
                            {loading ? 'Creating...' : (
                                <>
                                    <span className="btn-icon">📁</span> Create Folder
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFolderModal;
