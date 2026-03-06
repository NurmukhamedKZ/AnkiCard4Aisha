import { useState, useMemo } from 'react';
import FolderMenu from './FolderMenu';
import DeckMenu from './DeckMenu';
import './DeckList.css';

function DeckList({ decks, folders = [], pendingUploads = [], selectedDeckId, selectedFolderId, onSelectDeck, onSelectFolder, onDeleteDeck, onExportDeck, onStudyDeck, onRemovePending, onCreateFolder, onDeleteFolder, onEditFolder, onMoveFolder, onMoveDeck, loading }) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [folderDeleteConfirm, setFolderDeleteConfirm] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(new Set());

    const toggleFolder = (folderId) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
        }
        setExpandedFolders(newExpanded);
    };

    const handleDelete = (e, deckId) => {
        e.stopPropagation();
        if (deleteConfirm === deckId) {
            onDeleteDeck(deckId);
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(deckId);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const handleFolderDelete = (e, folderId) => {
        // e.stopPropagation(); // Handled by menu or button
        if (folderDeleteConfirm === folderId) {
            onDeleteFolder(folderId);
            setFolderDeleteConfirm(null);
        } else {
            setFolderDeleteConfirm(folderId);
            setTimeout(() => setFolderDeleteConfirm(null), 3000);
        }
    };

    const handleExport = (e, deckId) => {
        e.stopPropagation();
        onExportDeck(deckId);
    };

    const handleCreateFolderClick = (parentId = null) => {
        onCreateFolder(parentId);
    };

    const handleDragStart = (e, deckId) => {
        e.dataTransfer.setData("deckId", deckId);
    };

    const handleDrop = (e, folderId) => {
        e.preventDefault();
        const deckId = parseInt(e.dataTransfer.getData("deckId"));
        if (deckId) {
            onMoveDeck(deckId, folderId);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Group data
    const { rootDecks, decksInFolders, folderTree } = useMemo(() => {
        const decksMap = {};
        const rootDecksArr = [];

        decks.forEach(deck => {
            if (deck.folder_id) {
                if (!decksMap[deck.folder_id]) decksMap[deck.folder_id] = [];
                decksMap[deck.folder_id].push(deck);
            } else {
                rootDecksArr.push(deck);
            }
        });

        // Build folder tree
        const tree = [];
        const folderMap = {};
        folders.forEach(f => folderMap[f.id] = { ...f, children: [] });

        folders.forEach(f => {
            if (f.parent_id && folderMap[f.parent_id]) {
                folderMap[f.parent_id].children.push(folderMap[f.id]);
            } else {
                tree.push(folderMap[f.id]);
            }
        });

        return { rootDecks: rootDecksArr, decksInFolders: decksMap, folderTree: tree };
    }, [decks, folders]);


    if (loading) {
        return (
            <div className="deck-list">
                <div className="deck-list-header"><h3>Folders</h3></div>
                <div className="deck-loading"><div className="spinner"></div></div>
            </div>
        );
    }

    const renderDeck = (deck) => (
        <div
            key={deck.id}
            className={`tree-item deck-tree-item ${selectedDeckId === deck.id ? 'active' : ''}`}
            onClick={() => onSelectDeck(deck.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, deck.id)}
        >
            <div className="connector-elbow"></div>
            <div className="folder-item-content" style={{ paddingLeft: '4px' }}>
                <span className="deck-icon-box" style={{ background: '#E65100', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '10px' }}>📄</span>
                </span>
                <span className="folder-name" style={{ fontWeight: 'normal' }}>{deck.name}</span>
                <span className="deck-count">{deck.card_count}</span>

                <div className="folder-actions deck-actions">
                    <DeckMenu
                        onStudy={(e) => { onStudyDeck(deck.id); }}
                        onExport={() => handleExport(null, deck.id)}
                        onMove={() => onMoveDeck(deck.id)}
                        onDelete={() => handleDelete(null, deck.id)}
                    />
                </div>
            </div>
        </div>
    );

    const renderFolder = (folder, index, siblings) => {
        const isExpanded = expandedFolders.has(folder.id);
        const childFolders = folder.children || [];
        const childDecks = decksInFolders[folder.id] || [];
        const hasChildren = childFolders.length > 0 || childDecks.length > 0;

        return (
            <div
                key={folder.id}
                className="folder-tree-container"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, folder.id)}
            >
                {/* Connector line from parent */}
                {index < siblings.length - 1 && (
                    <div className="tree-connector-line-v" style={{ top: '14px', bottom: '-2px' }}></div>
                )}

                <div
                    className={`tree-item folder-tree-item ${selectedFolderId === folder.id ? 'active' : ''}`}
                    onClick={() => {
                        onSelectFolder && onSelectFolder(folder.id);
                        // Optional: Auto-expand on select
                        // if (!isExpanded) toggleFolder(folder.id);
                    }}
                >
                    <div className="folder-item-content" style={{
                        backgroundColor: selectedFolderId === folder.id ? '#2c2c2c' : (isExpanded ? `rgba(${parseInt(folder.color?.slice(1, 3) || '22', 16)}, ${parseInt(folder.color?.slice(3, 5) || '163', 16)}, ${parseInt(folder.color?.slice(5, 7) || '74', 16)}, 0.1)` : 'transparent'),
                        border: `1px solid ${selectedFolderId === folder.id ? folder.color || '#16A34A' : 'transparent'}`,
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <div
                            className="expand-icon-wrapper"
                            onClick={(e) => { e.stopPropagation(); toggleFolder(folder.id); }}
                            style={{ padding: '0 4px', cursor: 'pointer', opacity: 0.7 }}
                        >
                            <span style={{ fontSize: '0.7rem', display: 'inline-block', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
                        </div>

                        <div className="folder-icon-wrapper">
                            <span className="folder-icon" style={{ color: folder.color || '#16A34A', fontSize: '1.2rem' }}>
                                {isExpanded ? '📂' : '📁'}
                            </span>
                        </div>
                        <span className="folder-name">{folder.name}</span>

                        <div className="folder-actions">
                            <FolderMenu
                                onEdit={() => onEditFolder && onEditFolder(folder)}
                                onMove={() => onMoveFolder && onMoveFolder(folder)}
                                onDelete={() => handleFolderDelete(null, folder.id)}
                            />
                            <div className="action-icon" onClick={(e) => { e.stopPropagation(); handleCreateFolderClick(folder.id); }}>+</div>
                        </div>
                    </div>
                </div>

                {isExpanded && hasChildren && (
                    <div className="folder-children">
                        <div className="tree-connector-line-v" style={{ left: '12px', top: -14, bottom: 20 }}></div>
                        {childFolders.map((child, i) => renderFolder(child, i, childFolders))}
                        {childDecks.map((deck) => renderDeck(deck))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="deck-list">
            <div className="deck-nav-items">
                <div className="nav-item" onClick={() => onSelectDeck(null)}><div className="nav-icon">🏠</div><span>Home</span></div>
                <div className="nav-item"><div className="nav-icon">📤</div><span>Upload Document</span></div>
            </div>

            <div className="deck-list-header">
                <h3>Folders</h3>
                <button className="new-folder-btn" onClick={() => handleCreateFolderClick(null)}>+</button>
            </div>

            <div className="deck-items tree-view">
                {folderTree.map((folder, i) => renderFolder(folder, i, folderTree))}

                {/* Root Decks */}
                {rootDecks.length > 0 && (
                    <div className="root-decks-section" style={{ position: 'relative', marginTop: '10px' }}>
                        {folderTree.length > 0 && <div className="tree-connector-line-v" style={{ left: '14px', top: '-10px', height: '24px', zIndex: 0 }}></div>}
                        <div className="root-decks-header">
                            <span className="root-decks-icon">📂</span><span>Decks without folder</span>
                        </div>
                        <div style={{ position: 'relative', marginLeft: '6px' }}>
                            <div className="tree-connector-line-v" style={{ left: '6px', top: '0', bottom: '20px', backgroundColor: '#555' }}></div>
                            {rootDecks.map((deck) => (
                                <div key={deck.id} className="root-deck-item">
                                    <div className="root-deck-connector"></div>
                                    <div className={`folder-item-content ${selectedDeckId === deck.id ? 'active' : ''}`} style={{ padding: '6px', cursor: 'pointer', background: selectedDeckId === deck.id ? '#111' : 'transparent' }} onClick={() => onSelectDeck(deck.id)}>
                                        <span className="deck-icon-box" style={{ background: '#E65100', width: '20px', height: '20px' }}>
                                            <span style={{ fontSize: '10px' }}>📄</span>
                                        </span>
                                        <span className="folder-name" style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>{deck.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pending Uploads */}
                {pendingUploads.map(upload => (
                    <div key={upload.id} className={`deck-item pending ${upload.status === 'error' ? 'error' : ''}`}>
                        <span className="deck-spinner"></span><span className="deck-name">{upload.name}</span>
                        {upload.status === 'error' && <button onClick={() => onRemovePending(upload.id)}>×</button>}
                    </div>
                ))}
            </div>

            <div className="deck-list-drop-root" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, null)} style={{ height: '50px', flexShrink: 0 }}></div>
        </div>
    );
}

export default DeckList;
