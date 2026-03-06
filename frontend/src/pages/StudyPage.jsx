import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { studyAPI } from '../api/client';
import './StudyPage.css';

function StudyPage() {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'spaced';

    const [currentCard, setCurrentCard] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [stats, setStats] = useState({ new: 0, to_review: 0, done: 0 });
    const [sessionCards, setSessionCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userAnswer, setUserAnswer] = useState('');
    const [answerFeedback, setAnswerFeedback] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0); // For exam mode
    const [isShuffled, setIsShuffled] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const isQuizMode = mode === 'quiz' || mode === 'exam';

    // Fetch stats
    const fetchStats = useCallback(async () => {
        try {
            const data = await studyAPI.getStats(deckId);
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    }, [deckId]);

    // Fetch next card
    const fetchNextCard = useCallback(async () => {
        try {
            setLoading(true);
            const card = await studyAPI.getNextCard(deckId, mode, sessionCards, isShuffled);

            if (!card) {
                // No more cards
                alert('Study session complete! 🎉');
                navigate('/dashboard');
                return;
            }

            setCurrentCard(card);
            setShowAnswer(false);
            setUserAnswer('');
            setAnswerFeedback(null);
        } catch (err) {
            console.error('Failed to load next card:', err);
        } finally {
            setLoading(false);
        }
    }, [deckId, mode, sessionCards, navigate]);

    useEffect(() => {
        fetchStats();
        fetchNextCard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deckId, mode]);

    // Handle revealing answer
    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    // Handle difficulty selection (spaced repetition)
    const handleDifficulty = async (quality) => {
        if (!currentCard) return;

        try {
            await studyAPI.submitReview(currentCard.id, mode, quality, null);

            // Add to session cards
            setSessionCards(prev => [...prev, currentCard.id]);

            // Update stats and get next card
            await fetchStats();
            await fetchNextCard();
        } catch (err) {
            console.error('Failed to submit review:', err);
        }
    };

    // Handle quiz answer submission
    const handleSubmitAnswer = async () => {
        if (!currentCard || !userAnswer.trim()) return;

        try {
            const result = await studyAPI.submitReview(currentCard.id, mode, null, userAnswer);
            setAnswerFeedback(result);
            setShowAnswer(true);
        } catch (err) {
            console.error('Failed to submit answer:', err);
        }
    };

    // Handle next card after quiz
    const handleNextAfterQuiz = () => {
        setSessionCards(prev => [...prev, currentCard.id]);
        fetchNextCard();
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!currentCard) return;

            // Space to reveal answer
            if (e.code === 'Space' && !showAnswer && !isQuizMode) {
                e.preventDefault();
                handleShowAnswer();
            }

            // Number keys for difficulty (only in spaced mode after revealing)
            if (showAnswer && mode === 'spaced' && !isQuizMode) {
                if (e.key === '1') handleDifficulty(0); // Impossible
                if (e.key === '2') handleDifficulty(3); // Hard
                if (e.key === '3') handleDifficulty(4); // OK
                if (e.key === '4') handleDifficulty(5); // Easy
            }

            // Enter to submit answer in quiz mode
            if (isQuizMode && !showAnswer && e.key === 'Enter') {
                e.preventDefault();
                handleSubmitAnswer();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentCard, showAnswer, mode, isQuizMode, userAnswer]);

    // Timer for Exam Mode
    useEffect(() => {
        if (mode === 'exam' && currentCard && !showAnswer) {
            // Start timer (e.g., 30 seconds per card)
            setTimeLeft(30);
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmitAnswer(); // Auto-submit when time is up
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [currentCard, mode]);

    const handleShuffle = () => {
        setIsShuffled(!isShuffled);
        fetchNextCard();
    };

    const handleQuit = () => {
        if (stats.done > 0) {
            navigate('/dashboard');
        } else {
            if (confirm('Are you sure you want to quit this study session?')) {
                navigate('/dashboard');
            }
        }
    };

    if (loading && !currentCard) {
        return (
            <div className="study-page">
                <div className="study-loading">
                    <div className="spinner"></div>
                    <p>Loading study session...</p>
                </div>
            </div>
        );
    }

    const difficultyButtons = [
        { label: 'Impossible', quality: 0, color: '#ff6b6b', shortcut: '1' },
        { label: 'Hard', quality: 3, color: '#ffd93d', shortcut: '2' },
        { label: 'OK', quality: 4, color: '#6bcf7f', shortcut: '3' },
        { label: 'Easy', quality: 5, color: '#51cf66', shortcut: '4' }
    ];

    return (
        <div className="study-page">
            {/* Top Bar */}
            <div className="study-header">
                <div className="study-stats">
                    <div className="stat-badge new">{stats.new} New</div>
                    <div className="stat-badge review">{stats.to_review} To Review</div>
                    <div className="stat-badge done">{stats.done} Done</div>
                </div>

                <div className="study-actions">
                    {mode === 'exam' && timeLeft > 0 && (
                        <div className={`exam-timer ${timeLeft < 10 ? 'urgent' : ''}`}>
                            ⏱ {timeLeft}s
                        </div>
                    )}
                    <button
                        className={`btn-icon ${isShuffled ? 'active' : ''}`}
                        onClick={handleShuffle}
                        title="Shuffle"
                    >
                        🔀
                    </button>
                    <button className="btn-quit" onClick={handleQuit}>
                        Quit Study
                    </button>
                </div>
            </div>

            {/* Card Display */}
            <div className="study-content">
                {currentCard && (
                    <div className="study-card-container">
                        <div className="study-card">
                            <div className="card-question">
                                <p>{currentCard.question}</p>
                            </div>

                            {isQuizMode && !showAnswer && (
                                <div className="quiz-input-section">
                                    <input
                                        type="text"
                                        className="quiz-input"
                                        placeholder="Type your answer here..."
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        className="btn-submit-answer"
                                        onClick={handleSubmitAnswer}
                                        disabled={!userAnswer.trim()}
                                    >
                                        Submit Answer ↵
                                    </button>
                                </div>
                            )}

                            {!showAnswer && !isQuizMode && (
                                <button className="btn-show-answer" onClick={handleShowAnswer}>
                                    Show answer • <span className="shortcut">Space</span>
                                </button>
                            )}

                            {showAnswer && (
                                <div className="card-answer">
                                    {answerFeedback && (
                                        <div className={`answer-feedback ${answerFeedback.correct ? 'correct' : 'incorrect'}`}>
                                            {answerFeedback.correct ? '✓ Correct!' : '✗ Incorrect'}
                                        </div>
                                    )}
                                    <p>{currentCard.answer}</p>
                                </div>
                            )}
                        </div>

                        {/* Difficulty Buttons */}
                        {showAnswer && mode === 'spaced' && (
                            <div className="difficulty-buttons">
                                {difficultyButtons.map((btn) => (
                                    <button
                                        key={btn.quality}
                                        className="difficulty-btn"
                                        style={{
                                            backgroundColor: btn.color,
                                            borderColor: btn.color
                                        }}
                                        onClick={() => handleDifficulty(btn.quality)}
                                    >
                                        <span className="btn-shortcut">{btn.shortcut}</span>
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Next button for fast/quiz/exam modes */}
                        {showAnswer && mode !== 'spaced' && (
                            <div className="difficulty-buttons">
                                <button
                                    className="difficulty-btn next-btn"
                                    onClick={mode === 'fast' ? () => handleDifficulty(4) : handleNextAfterQuiz}
                                >
                                    Next Card →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudyPage;
