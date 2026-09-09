import '../css/ExerciseCard.css';
const ExerciseCard = ({ exercise, onDelete }) => {
    
    const toSentenceCase = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <div className="exercise-card">

            <h2>{exercise.name}</h2>

            {exercise.category !== undefined && (
                <p> Category: {toSentenceCase(exercise.category)} </p>
            )}

            {exercise.sets !== undefined && (
                <p>Sets: {exercise.sets}</p>
            )}

            {exercise.reps !== undefined && (
                <p>Reps: {exercise.reps}</p>
            )}

            {exercise.weight !== undefined && (
                <p>Weight: {exercise.weight} kg</p>
            )}

            {exercise.time !== undefined && (
                <p>Time: {exercise.time} minutes</p>
            )}

            <button onClick={() => onDelete(exercise._id)}>
                Delete
            </button>

        </div>
    );
};

export default ExerciseCard;