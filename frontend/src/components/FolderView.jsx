import React, { useMemo } from 'react';
import './FolderView.css';

const FolderView = ({
    folder,
    allFolders,
    allDecks,
    onSelectFolder,
    onSelectDeck,
    onCreateDeck,
    onUpload,
    onCreateFolder
}) => {
    // Get immediate children
    const { subFolders, decks } = useMemo(() => {
        if (!folder) return { subFolders: [], decks: [] };

        const subs = allFolders.filter(f => f.parent_id === folder.id);
        const childDecks = allDecks.filter(d => d.folder_id === folder.id);

        return { subFolders: subs, decks: childDecks };
    }, [folder, allFolders, allDecks]);

    // Build breadcrumbs path
    const breadcrumbs = useMemo(() => {
        if (!folder) return [];
        const path = [];
        let current = folder;
        while (current) {
            path.unshift(current);
            if (current.parent_id) {
                current = allFolders.find(f => f.id === current.parent_id);
            } else {
                current = null;
            }
        }
        return path;
    }, [folder, allFolders]);

    if (!folder) return null;

    const isEmpty = subFolders.length === 0 && decks.length === 0;

    return (
        <div className="folder-view fade-in">
            {/* Header / Breadcrumbs */}
            <div className="folder-header">
                <div className="breadcrumbs">
                    <span
                        className="breadcrumb-item"
                        onClick={() => onSelectFolder(null)}
                    >
                        🏠 Home
                    </span>
                    {breadcrumbs.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <span className="breadcrumb-separator">›</span>
                            <span
                                className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                                onClick={() => index !== breadcrumbs.length - 1 && onSelectFolder(item.id)}
                            >
                                <span className="breadcrumb-icon">📁</span> {item.name}
                            </span>
                        </React.Fragment>
                    ))}
                </div>

                <div className="folder-title-section">
                    <div className="folder-title-group">
                        <div className="folder-large-icon" style={{ backgroundColor: folder.color || '#16A34A' }}>
                            📁
                        </div>
                        <h1>{folder.name}</h1>
                    </div>

                    <div className="folder-actions-header">
                        <button className="btn btn-secondary" onClick={() => onCreateFolder(folder.id)}>
                            + Add Folder
                        </button>
                        {/* Future: <button className="btn btn-primary" onClick={onStudyFolder}>Study Folder</button> */}
                    </div>
                </div>
            </div>

            {/* Content */}
            {isEmpty ? (
                <div className="folder-empty-state">
                    <div className="empty-icon-large">📂</div>
                    <h2>Looks like this folder is empty!</h2>
                    <p>No decks here yet, upload your documents and create your first deck in this folder</p>
                    <div className="empty-actions">
                        <button className="btn btn-primary" onClick={onUpload}>
                            Upload Document
                        </button>
                        <button className="btn btn-secondary" onClick={() => onCreateFolder(folder.id)}>
                            + Add Folder
                        </button>
                    </div>
                </div>
            ) : (
                <div className="folder-content-grid">
                    {/* Subfolders */}
                    {subFolders.map(sub => (
                        <div
                            key={sub.id}
                            className="folder-card"
                            onClick={() => onSelectFolder(sub.id)}
                        >
                            <div className="folder-card-icon" style={{ color: sub.color || '#16A34A' }}>
                                📁
                            </div>
                            <div className="folder-card-info">
                                <h3>{sub.name}</h3>
                                <span>Folder</span>
                            </div>
                        </div>
                    ))}

                    {/* Decks */}
                    {decks.map(deck => (
                        <div
                            key={deck.id}
                            className="deck-card"
                            onClick={() => onSelectDeck(deck.id)}
                        >
                            <div className="deck-card-strip" style={{ backgroundColor: '#E65100' }}></div>
                            <div className="deck-card-content">
                                <h3>{deck.name}</h3>
                                <div className="deck-stats">
                                    <span className="badge">{deck.card_count} cards</span>
                                    {/* Future: <span className="badge to-do">10 to-do</span> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FolderView;
