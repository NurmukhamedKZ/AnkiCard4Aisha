import React, { useState, useMemo } from 'react';
import FolderSelector from './FolderSelector';
import './Modal.css';

function MoveFolderModal({ folder, allFolders, onClose, onMove }) {
    const [selectedFolderId, setSelectedFolderId] = useState(folder?.parent_id || null);

    // Filter out the folder itself and its children from potential destinations
    // to prevent circular references
    const validDestinations = useMemo(() => {
        if (!folder) return [];

        const invalidIds = new Set();
        invalidIds.add(folder.id);

        // Helper to find all descendants
        const findDescendants = (parentId) => {
            allFolders.forEach(f => {
                if (f.parent_id === parentId) {
                    invalidIds.add(f.id);
                    findDescendants(f.id);
                }
            });
        };

        findDescendants(folder.id);

        return allFolders.filter(f => !invalidIds.has(f.id));
    }, [folder, allFolders]);

    const handleSave = () => {
        // Don't move if destination hasn't changed
        if (selectedFolderId === folder.parent_id) {
            onClose();
            return;
        }
        onMove(folder.id, selectedFolderId);
        onClose();
    };

    return (
        <div className="modal-overlay fade-in" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Move Folder</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <p style={{ marginBottom: '1rem', color: '#ccc' }}>
                        Move <strong>{folder?.name}</strong> to:
                    </p>

                    <FolderSelector
                        folders={validDestinations}
                        selectedFolderId={selectedFolderId}
                        onChange={setSelectedFolderId}
                        label="Destination Folder"
                    />
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Move
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MoveFolderModal;
