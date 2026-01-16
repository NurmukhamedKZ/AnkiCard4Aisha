import { useState } from 'react';
import './CardItem.css';

function CardItem({ card, index, onEdit, onDelete }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={`card-item ${isFlipped ? 'flipped' : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="card-inner" onClick={() => setIsFlipped(!isFlipped)}>
                <div className="card-front">
                    <div className="card-label">Question</div>
                    <div className="card-content">{card.question}</div>
                    <div className="card-hint">Click to flip</div>
                </div>

                <div className="card-back">
                    <div className="card-label">Answer</div>
                    <div className="card-content">{card.answer}</div>
                    <div className="card-hint">Click to flip back</div>
                </div>
            </div>

            <div className="card-actions">
                <button
                    className="card-action-btn edit"
                    onClick={(e) => { e.stopPropagation(); onEdit(card); }}
                    title="Edit card"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </button>
                <button
                    className="card-action-btn delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
                    title="Delete card"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default CardItem;
