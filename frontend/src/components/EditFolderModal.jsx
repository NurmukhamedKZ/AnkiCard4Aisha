import React, { useState, useEffect } from 'react';
import './CreateFolderModal.css'; // Reuse styles

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

const EditFolderModal = ({ folder, onClose, onSave }) => {
    const [name, setName] = useState(folder?.name || '');
    const [selectedColor, setSelectedColor] = useState(folder?.color || COLORS[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (folder) {
            setName(folder.name);
            setSelectedColor(folder.color || COLORS[0]);
        }
    }, [folder]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onSave(folder.id, { name, color: selectedColor });
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
                        <h3>Edit Folder</h3>
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
                            placeholder="Folder Name"
                            autoFocus
                            className="dark-input"
                        />
                    </div>

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
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFolderModal;
