import { useState } from 'react';
import './Modal.css';

function EditModal({ card, onClose, onSave }) {
    const [question, setQuestion] = useState(card.question);
    const [answer, setAnswer] = useState(card.answer);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(card.id, { question, answer });
        setSaving(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Card</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="input-group">
                            <label htmlFor="question">Question</label>
                            <textarea
                                id="question"
                                className="input edit-textarea"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="answer">Answer</label>
                            <textarea
                                id="answer"
                                className="input edit-textarea"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? <span className="spinner"></span> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;
