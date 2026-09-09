import '../css/FoodCard.css';
const FoodCard = ({ food, onDelete }) => {
    
    const toSentenceCase = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <div className="food-card">

            <h2>{toSentenceCase(food.name)}</h2>

            <p>
                Amount: {food.grams} g
            </p>

            <p>
                Calories: {Math.round(food.calories)} kcal
            </p>

            <button onClick={() => onDelete(food._id)}>
                Delete
            </button>

        </div>
    );
};

export default FoodCard;