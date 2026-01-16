import CardItem from './CardItem';
import './CardGrid.css';

function CardGrid({ cards, onEdit, onDelete }) {
    return (
        <div className="card-grid fade-in">
            {cards.map((card, index) => (
                <CardItem
                    key={card.id}
                    card={card}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default CardGrid;
