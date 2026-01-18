import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { cardsAPI, decksAPI } from '../api/client';
import Header from '../components/Header';
import DeckList from '../components/DeckList';
import CardGrid from '../components/CardGrid';
import EditModal from '../components/EditModal';
import './Dashboard.css';

function Dashboard() {
    const { user } = useAuth();
    const [cards, setCards] = useState([]);
    const [decks, setDecks] = useState([]);
    const [pendingUploads, setPendingUploads] = useState([]); // {id, name, status: 'uploading' | 'error'}
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [decksLoading, setDecksLoading] = useState(true);
    const [editingCard, setEditingCard] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const fetchDecks = useCallback(async () => {
        try {
            setDecksLoading(true);
            const data = await decksAPI.getDecks();
            setDecks(data);
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
        fetchCards();
    }, [fetchCards]);

    // Handle file upload directly
    const handleFileUpload = async (file) => {
        if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
            setError('Please select a PDF file');
            return;
        }

        const uploadId = Date.now();
        const fileName = file.name.replace('.pdf', '');

        // Add to pending uploads
        setPendingUploads(prev => [...prev, { id: uploadId, name: fileName, status: 'uploading' }]);

        try {
            const newCards = await cardsAPI.uploadPDF(file);

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

    // Trigger file input
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
            e.target.value = ''; // Reset input
        }
    };

    // Remove pending upload (after error)
    const handleRemovePending = (uploadId) => {
        setPendingUploads(prev => prev.filter(u => u.id !== uploadId));
    };

    const handleSelectDeck = (deckId) => {
        setSelectedDeckId(deckId);
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
                onUpload={handleUploadClick}
                onExport={selectedDeckId ? () => handleExportDeck(selectedDeckId) : handleExportAll}
                cardsCount={cards.length}
                deckName={selectedDeck?.name}
                decks={decks}
                selectedDeckId={selectedDeckId}
                onSelectDeck={handleSelectDeck}
            />

            <div className="dashboard-layout">
                <DeckList
                    decks={decks}
                    pendingUploads={pendingUploads}
                    selectedDeckId={selectedDeckId}
                    onSelectDeck={handleSelectDeck}
                    onDeleteDeck={handleDeleteDeck}
                    onExportDeck={handleExportDeck}
                    onRemovePending={handleRemovePending}
                    loading={decksLoading}
                />

                <main className="dashboard-content">
                    {error && (
                        <div className="dashboard-error">
                            {error}
                            <button onClick={() => setError('')} className="error-dismiss">×</button>
                        </div>
                    )}

                    {loading ? (
                        <div className="dashboard-loading flex-center">
                            <div className="spinner"></div>
                            <span>Loading your cards...</span>
                        </div>
                    ) : cards.length === 0 ? (
                        <div className="dashboard-empty fade-in">
                            <div className="empty-icon">📄</div>
                            <h2>{selectedDeckId ? 'No Cards in This Deck' : 'No Cards Yet'}</h2>
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

            {editingCard && (
                <EditModal
                    card={editingCard}
                    onClose={() => setEditingCard(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
}

export default Dashboard;
