import React from 'react';
import './FolderSelector.css';

const FolderSelector = ({ folders = [], selectedFolderId, onChange, label = "Folder" }) => {
    return (
        <div className="folder-selector-group">
            <label className="folder-selector-label">{label}</label>
            <select
                className="folder-selector"
                value={selectedFolderId === null ? '' : selectedFolderId}
                onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value))}
            >
                <option value="">No folder (root level)</option>
                {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                        📁 {folder.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FolderSelector;
