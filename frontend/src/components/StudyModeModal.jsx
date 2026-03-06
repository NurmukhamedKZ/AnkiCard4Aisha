import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudyModeModal.css';

function StudyModeModal({ deckId, onClose }) {
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState(null);

    const modes = [
        {
            id: 'spaced',
            name: 'Spaced Repetition',
            description: 'Study with the best algorithm',
            icon: '🔄'
        },
        {
            id: 'fast',
            name: 'Fast Review',
            description: 'Study without spaced repetition',
            icon: '⚡'
        },
        {
            id: 'quiz',
            name: 'Quiz',
            description: 'Test your knowledge with Quizzes',
            icon: '📝'
        },
        {
            id: 'exam',
            name: 'Exam Simulation',
            description: 'Evaluate yourself with Exam Simulations',
            icon: '📋'
        }
    ];

    const handleModeSelect = (modeId) => {
        setSelectedMode(modeId);
        // Navigate to study page with selected mode
        navigate(`/study/${deckId}?mode=${modeId}`);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="study-mode-modal" onClick={(e) => e.stopPropagation()}>
                <div className="study-mode-header">
                    <h2>📚 Study Mode</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="study-modes-grid">
                    {modes.map((mode) => (
                        <div
                            key={mode.id}
                            className={`study-mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
                            onClick={() => handleModeSelect(mode.id)}
                        >
                            <div className="mode-icon">{mode.icon}</div>
                            <h3>{mode.name}</h3>
                            <p>{mode.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StudyModeModal;
