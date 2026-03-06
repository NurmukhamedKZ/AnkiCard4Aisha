import React, { useState } from 'react';
import './HomeDashboard.css';

const HomeDashboard = ({ user, decks, folders = [], onSelectDeck, onUpload, onImportOption }) => {
    // Todo list data (mock)
    const [todos, setTodos] = useState([
        { id: 1, text: 'Use AI Helps while Studying', completed: true, points: 10 },
        { id: 2, text: 'Do 10 Quizzes 🚀', completed: false, points: 10 },
        { id: 3, text: 'Share your Deck 👥', subtext: 'Share your flashcards to your study buddies.', completed: false, points: 10, action: 'Earn +10 credits now' }
    ]);

    const handleToggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    // Filter decks by folder if needed, but for HomeDashboard we likely show all or top recently used
    // For now, let's show all decks grouped or just a grid.
    // The mockup shows "Folders" section and "Decks" section.

    // Group decks by folder for display if needed, but DeckList handles the tree view.
    // Here we probably just want a grid of decks.

    // We can also have a "Folders" section if there are folders.

    return (
        <div className="home-dashboard fade-in">
            <div className="home-columns">
                {/* Left/Center Column: Content */}
                <div className="home-main-content">

                    {/* Folders Section */}
                    {folders && folders.length > 0 && (
                        <div className="home-section">
                            <h3 className="home-section-title">📁 Folders</h3>
                            <div className="folders-grid">
                                {folders.map(folder => (
                                    <div key={folder.id} className="folder-card">
                                        <div className="folder-icon" style={{ color: folder.color || '#16A34A' }}>📁</div>
                                        <div className="folder-info">
                                            <h4>{folder.name}</h4>
                                            <span>{decks.filter(d => d.folder_id === folder.id).length} decks</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Decks Section */}
                    <div className="home-section">
                        <h3 className="home-section-title">🗂️ Decks</h3>
                        <div className="decks-grid">
                            {/* Create New Deck Card */}
                            <div className="deck-card create-card" onClick={onUpload}>
                                <div className="create-icon">+</div>
                                <span>Create New Deck</span>
                            </div>

                            {decks.map(deck => (
                                <div key={deck.id} className="deck-card" onClick={() => onSelectDeck(deck.id)}>
                                    <div className="deck-card-color" style={{ background: getRandomColor(deck.id) }}></div>
                                    <div className="deck-card-content">
                                        <h4>{deck.name}</h4>
                                        <div className="deck-card-stats">
                                            <span className="sc-badge">{deck.card_count} cards</span>
                                            <span className="sc-badge-outline">0 to-do</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Todo List */}
                <div className="home-sidebar">
                    <div className="todo-panel">
                        <div className="todo-header">
                            <h3>✅ Todo List</h3>
                            <div className="todo-actions">
                                <button className="icon-btn">⚙️</button>
                                <button className="icon-btn">📊</button>
                            </div>
                        </div>

                        <div className="todo-items">
                            {todos.map(todo => (
                                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                                    <div className="todo-checkbox-wrapper">
                                        <div
                                            className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                                            onClick={() => handleToggleTodo(todo.id)}
                                        >
                                            {todo.completed && '✓'}
                                        </div>
                                    </div>
                                    <div className="todo-content">
                                        <div className="todo-text">{todo.text}</div>
                                        {todo.subtext && <div className="todo-subtext">{todo.subtext}</div>}
                                        {todo.action && (
                                            <button className="todo-action-btn">{todo.action}</button>
                                        )}
                                    </div>
                                    <div className="todo-points">
                                        +{todo.points} credits
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for random gradients based on ID
const colors = ['#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
const getRandomColor = (id) => colors[id % colors.length];

export default HomeDashboard;
