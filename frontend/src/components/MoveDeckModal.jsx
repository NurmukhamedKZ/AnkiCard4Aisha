import { useState } from 'react';
import FolderSelector from './FolderSelector';
import './Modal.css';

function MoveDeckModal({ deck, folders, onClose, onMove }) {
    const [selectedFolderId, setSelectedFolderId] = useState(deck?.folder_id || null);

    const handleSave = () => {
        onMove(deck.id, selectedFolderId);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Move Deck</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <p style={{ marginBottom: '1rem', color: '#ccc' }}>
                        Move <strong>{deck?.name}</strong> to:
                    </p>

                    <FolderSelector
                        folders={folders}
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

export default MoveDeckModal;
