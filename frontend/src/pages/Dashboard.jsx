import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cardsAPI, decksAPI, foldersAPI } from '../api/client';
import Header from '../components/Header';
import DeckList from '../components/DeckList';
import CardGrid from '../components/CardGrid';
import EditModal from '../components/EditModal';
import UploadModal from '../components/UploadModal';
import PageSelection from '../components/PageSelection';
import HomeDashboard from '../components/HomeDashboard';
import CreateFolderModal from '../components/CreateFolderModal';
import EditFolderModal from '../components/EditFolderModal';
import MoveFolderModal from '../components/MoveFolderModal';
import CreateDeckModal from '../components/CreateDeckModal';
import MoveDeckModal from '../components/MoveDeckModal';
import FolderView from '../components/FolderView';

import GenerateAIModal from '../components/GenerateAIModal';
import StudyModeModal from '../components/StudyModeModal';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cards, setCards] = useState([]);
    const [decks, setDecks] = useState([]);
    const [folders, setFolders] = useState([]);
    const [pendingUploads, setPendingUploads] = useState([]); // {id, name, status: 'uploading' | 'error'}
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [decksLoading, setDecksLoading] = useState(true);
    const [editingCard, setEditingCard] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [createFolderParentId, setCreateFolderParentId] = useState(null);
    const [editingFolder, setEditingFolder] = useState(null);
    const [movingFolder, setMovingFolder] = useState(null);
    const [moveDeckId, setMoveDeckId] = useState(null);
    const [showDeckModal, setShowDeckModal] = useState(false);

    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showStudyModal, setShowStudyModal] = useState(false);
    const [studyDeckId, setStudyDeckId] = useState(null);
    const [pageSelectionFile, setPageSelectionFile] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const fetchDecks = useCallback(async () => {
        try {
            setDecksLoading(true);
            const [decksData, foldersData] = await Promise.all([
                decksAPI.getDecks(),
                foldersAPI.getFolders()
            ]);
            setDecks(decksData);
            setFolders(foldersData);
        } catch (err) {
            console.error('Failed to load decks:', err);
        } finally {
            setDecksLoading(false);
        }
    }, []);

    const fetchCards = useCallback(async () => {
        try {
            setLoading(true);
            const data = await cardsAPI.getCards(selectedDeckId);
            setCards(data);
        } catch (err) {
            setError('Failed to load cards');
        } finally {
            setLoading(false);
        }
    }, [selectedDeckId]);

    useEffect(() => {
        fetchDecks();
    }, [fetchDecks]);

    useEffect(() => {
        if (selectedDeckId !== null) {
            fetchCards();
        }
    }, [fetchCards, selectedDeckId]);

    // Handle file upload (PDF)
    const handleFileUpload = async (file, pages = null) => {
        if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
            setError('Please select a PDF file');
            return;
        }

        const uploadId = Date.now();
        const fileName = file.name.replace('.pdf', '');

        // Add to pending uploads
        setPendingUploads(prev => [...prev, { id: uploadId, name: fileName, status: 'uploading' }]);

        try {
            const newCards = await cardsAPI.uploadPDF(file, pages);

            // Remove from pending
            setPendingUploads(prev => prev.filter(u => u.id !== uploadId));

            // Refresh decks and cards
            await fetchDecks();
            setCards(prevCards => [...newCards, ...prevCards]);

        } catch (err) {
            console.error('Upload failed:', err);
            // Mark as error
            setPendingUploads(prev =>
                prev.map(u => u.id === uploadId ? { ...u, status: 'error' } : u)
            );
            setError('Failed to upload PDF. Please try again.');
        }
    };

    // Handle Import dropdown option selection
    const handleImportOption = (optionId) => {
        switch (optionId) {
            case 'pdf':
                setShowUpload(true);
                break;
            case 'anki':
                // TODO: Implement Anki import modal
                setError('Anki import coming soon!');
                break;
            case 'csv':
            case 'quizlet':
                // Navigate to import cards page
                navigate('/import');
                break;
            default:
                break;
        }
    };

    // Handle Create dropdown option selection
    const handleCreateOption = (optionId) => {
        switch (optionId) {
            case 'deck':
                setShowDeckModal(true);
                break;
            case 'generate':
                setShowGenerateModal(true);
                break;
            case 'folder':
                setShowFolderModal(true);
                break;
            default:
                break;
        }
    };

    // Handle AI generation
    const handleGenerate = async ({ type, deckName, content, file }) => {
        const uploadId = Date.now();
        setPendingUploads(prev => [...prev, { id: uploadId, name: deckName, status: 'uploading' }]);

        try {
            let newCards;

            if (type === 'text') {
                newCards = await cardsAPI.generateFromText(content, deckName);
            } else if (type === 'pdf') {
                newCards = await cardsAPI.uploadPDF(file);
            } else if (type === 'pptx') {
                newCards = await cardsAPI.importPPTX(file, deckName);
            }

            setPendingUploads(prev => prev.filter(u => u.id !== uploadId));
            await fetchDecks();

            if (newCards && newCards.length > 0) {
                setCards(prevCards => [...newCards, ...prevCards]);
            }
        } catch (err) {
            console.error('Generation failed:', err);
            setPendingUploads(prev =>
                prev.map(u => u.id === uploadId ? { ...u, status: 'error' } : u)
            );
            setError('Failed to generate cards. Please try again.');
            throw err;
        }
    };

    // Handle deck creation
    const handleCreateDeck = async (name) => {
        try {
            const newDeck = await decksAPI.createDeck(name);
            setDecks([newDeck, ...decks]);
            setSelectedDeckId(newDeck.id);
        } catch (err) {
            console.error('Create deck failed:', err);
            throw err;
        }
    };

    // Show upload modal
    const handleUploadClick = () => {
        setShowUpload(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setPageSelectionFile(file);
            e.target.value = ''; // Reset input
        }
    };

    // Remove pending upload (after error)
    const handleRemovePending = (uploadId) => {
        setPendingUploads(prev => prev.filter(u => u.id !== uploadId));
    };

    const handleSelectDeck = (deckId) => {
        setSelectedDeckId(deckId);
        setSelectedFolderId(null);
    };

    const handleSelectFolder = (folderId) => {
        setSelectedFolderId(folderId);
        setSelectedDeckId(null);
    };

    const handleDeleteDeck = async (deckId) => {
        try {
            await decksAPI.deleteDeck(deckId);
            setDecks(decks.filter(d => d.id !== deckId));
            if (selectedDeckId === deckId) {
                setSelectedDeckId(null);
            }
            fetchCards();
        } catch (err) {
            setError('Failed to delete deck');
        }
    };

    const handleCreateFolder = async (name, color, parentId) => {
        try {
            const newFolder = await foldersAPI.createFolder(name, color, parentId);
            setFolders([...folders, newFolder]);
            setShowFolderModal(false);
            setCreateFolderParentId(null);
        } catch (err) {
            setError('Failed to create folder');
        }
    };

    const handleEditFolder = (folder) => {
        setEditingFolder(folder);
    };

    const handleSaveEditFolder = async (folderId, data) => {
        try {
            const updatedFolder = await foldersAPI.updateFolder(folderId, data);
            setFolders(folders.map(f => f.id === folderId ? updatedFolder : f));
            setEditingFolder(null);
        } catch (err) {
            setError('Failed to update folder');
        }
    };

    const handleMoveFolder = (folder) => {
        setMovingFolder(folder);
    };

    const handleSaveMoveFolder = async (folderId, newParentId) => {
        try {
            // Optimistic update
            const updatedFolder = { ...folders.find(f => f.id === folderId), parent_id: newParentId };
            setFolders(folders.map(f => f.id === folderId ? updatedFolder : f));

            await foldersAPI.updateFolder(folderId, { parent_id: newParentId });
            setMovingFolder(null);
        } catch (err) {
            setError('Failed to move folder');
            fetchDecks(); // Revert
        }
    };

    const handleDeleteFolder = async (folderId) => {
        if (!confirm('Are you sure you want to delete this folder? Decks inside will become uncategorized.')) return;
        try {
            await foldersAPI.deleteFolder(folderId);
            setFolders(folders.filter(f => f.id !== folderId));
            fetchDecks();
        } catch (err) {
            setError('Failed to delete folder');
        }
    };

    const handleSaveMoveDeck = async (deckId, folderId) => {
        try {
            // Optimistic update
            const updatedDeck = { ...decks.find(d => d.id === deckId), folder_id: folderId };
            setDecks(decks.map(d => d.id === deckId ? updatedDeck : d));

            await decksAPI.updateDeck(deckId, { folder_id: folderId });
            setMoveDeckId(null);
        } catch (err) {
            setError('Failed to move deck');
            fetchDecks(); // Revert on error
        }
    };

    const handleMoveDeck = (deckId, folderId) => {
        if (folderId === undefined) {
            setMoveDeckId(deckId);
        } else {
            handleSaveMoveDeck(deckId, folderId);
        }
    };



    const handleStudyDeck = (deckId) => {
        setStudyDeckId(deckId);
        setShowStudyModal(true);
    };

    const handleExportDeck = async (deckId) => {
        try {
            const blob = await decksAPI.exportDeck(deckId);
            const deck = decks.find(d => d.id === deckId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${deck?.name || 'deck'}_cards.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (err) {
            setError('Failed to export deck');
        }
    };

    const handleEditCard = (card) => {
        setEditingCard(card);
    };

    const handleSaveEdit = async (id, data) => {
        try {
            const updatedCard = await cardsAPI.updateCard(id, data);
            setCards(cards.map(c => c.id === id ? updatedCard : c));
            setEditingCard(null);
        } catch (err) {
            setError('Failed to update card');
        }
    };

    const handleDeleteCard = async (id) => {
        if (!confirm('Are you sure you want to delete this card?')) return;

        try {
            await cardsAPI.deleteCard(id);
            setCards(cards.filter(c => c.id !== id));
            fetchDecks();
        } catch (err) {
            setError('Failed to delete card');
        }
    };

    const handleExportAll = async () => {
        try {
            const blob = await cardsAPI.exportCards();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'anki_cards.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (err) {
            setError('Failed to export cards');
        }
    };

    const selectedDeck = decks.find(d => d.id === selectedDeckId);
    const selectedFolder = folders.find(f => f.id === selectedFolderId);

    return (
        <div className="dashboard page">
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                style={{ display: 'none' }}
            />

            <Header
                onImportOption={handleImportOption}
                onCreateOption={handleCreateOption}
                onExport={selectedDeckId ? () => handleExportDeck(selectedDeckId) : handleExportAll}
                cardsCount={cards.length}
                deckName={selectedDeck?.name}
                decks={decks}
                selectedDeckId={selectedDeckId}
                onSelectDeck={handleSelectDeck}
                onStudy={selectedDeckId ? () => handleStudyDeck(selectedDeckId) : null}
            />

            <div className="dashboard-layout">
                <DeckList
                    decks={decks}
                    folders={folders}
                    pendingUploads={pendingUploads}
                    selectedDeckId={selectedDeckId}
                    selectedFolderId={selectedFolderId}
                    onSelectDeck={handleSelectDeck}
                    onSelectFolder={handleSelectFolder}
                    onDeleteDeck={handleDeleteDeck}
                    onExportDeck={handleExportDeck}
                    onRemovePending={handleRemovePending}
                    onCreateFolder={(parentId) => {
                        setCreateFolderParentId(parentId);
                        setShowFolderModal(true);
                    }}
                    onDeleteFolder={handleDeleteFolder}
                    onEditFolder={handleEditFolder}
                    onMoveFolder={handleMoveFolder}
                    onMoveDeck={handleMoveDeck}
                    onStudyDeck={handleStudyDeck}
                    loading={decksLoading}
                />

                <main className="dashboard-content">
                    {error && (
                        <div className="dashboard-error">
                            {error}
                            <button onClick={() => setError('')} className="error-dismiss">×</button>
                        </div>
                    )}

                    {loading && selectedDeckId !== null ? (
                        <div className="dashboard-loading flex-center">
                            <div className="spinner"></div>
                            <span>Loading your cards...</span>
                        </div>
                    ) : selectedFolderId ? (
                        <FolderView
                            folder={selectedFolder}
                            allFolders={folders}
                            allDecks={decks}
                            onSelectFolder={handleSelectFolder}
                            onSelectDeck={handleSelectDeck}
                            onUpload={handleUploadClick}
                            onCreateFolder={(parentId) => {
                                setCreateFolderParentId(parentId);
                                setShowFolderModal(true);
                            }}
                        />
                    ) : selectedDeckId === null ? (
                        <HomeDashboard
                            user={user}
                            decks={decks}
                            folders={folders}
                            onSelectDeck={handleSelectDeck}
                            onUpload={handleUploadClick}
                            onImportOption={handleImportOption}
                        />
                    ) : cards.length === 0 ? (
                        <div className="dashboard-empty fade-in">
                            <div className="empty-icon">📄</div>
                            <h2>No Cards in This Deck</h2>
                            <p className="text-muted">Upload a PDF to generate your first flashcards</p>
                            <button className="btn btn-primary" onClick={handleUploadClick}>
                                Upload PDF
                            </button>
                        </div>
                    ) : (
                        <CardGrid
                            cards={cards}
                            onEdit={handleEditCard}
                            onDelete={handleDeleteCard}
                        />
                    )}
                </main>
            </div>

            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    folders={folders}
                    onFileSelect={(file, folderId) => {
                        setShowUpload(false);
                        setPageSelectionFile(file);
                        // Store folderId for later use
                        setPageSelectionFile(Object.assign(file, { targetFolderId: folderId }));
                    }}
                />
            )}

            {editingCard && (
                <EditModal
                    card={editingCard}
                    onClose={() => setEditingCard(null)}
                    onSave={handleSaveEdit}
                />
            )}

            {moveDeckId && (
                <MoveDeckModal
                    deck={decks.find(d => d.id === moveDeckId)}
                    folders={folders}
                    onClose={() => setMoveDeckId(null)}
                    onMove={handleSaveMoveDeck}
                />
            )}

            {pageSelectionFile && (
                <PageSelection
                    file={pageSelectionFile}
                    onContinue={(selectedPages) => {
                        handleFileUpload(pageSelectionFile, selectedPages);
                        setPageSelectionFile(null);
                    }}
                    onCancel={() => setPageSelectionFile(null)}
                />
            )}

            {showFolderModal && (
                <CreateFolderModal
                    onClose={() => {
                        setShowFolderModal(false);
                        setCreateFolderParentId(null);
                    }}
                    onCreate={handleCreateFolder}
                    folders={folders}
                    initialParentId={createFolderParentId}
                />
            )}

            {editingFolder && (
                <EditFolderModal
                    folder={editingFolder}
                    onClose={() => setEditingFolder(null)}
                    onSave={handleSaveEditFolder}
                />
            )}

            {movingFolder && (
                <MoveFolderModal
                    folder={movingFolder}
                    allFolders={folders}
                    onClose={() => setMovingFolder(null)}
                    onMove={handleSaveMoveFolder}
                />
            )}

            {showDeckModal && (
                <CreateDeckModal
                    onClose={() => setShowDeckModal(false)}
                    onCreate={handleCreateDeck}
                />
            )}

            {showGenerateModal && (
                <GenerateAIModal
                    onClose={() => setShowGenerateModal(false)}
                    onGenerate={handleGenerate}
                />
            )}

            {showStudyModal && studyDeckId && (
                <StudyModeModal
                    deckId={studyDeckId}
                    onClose={() => {
                        setShowStudyModal(false);
                        setStudyDeckId(null);
                    }}
                />
            )}
        </div>
    );
}

export default Dashboard;
