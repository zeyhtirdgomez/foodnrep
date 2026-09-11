import "../css/WorkoutCard.css";

const WorkoutCard = ({ workout }) => {
  const formatText = (text = "") => {
    return text
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <article className="workout-card">

      <div className="workout-card-header">
        <div className="workout-badges">
          <span className="workout-type">
            {formatText(workout.type)}
          </span>

          <span className="workout-difficulty">
            {formatText(workout.difficulty)}
          </span>
        </div>
      </div>


      <div className="workout-card-content">
        {/* Workout Name */}
        <h3 className="workout-name">
          {workout.name}
        </h3>


        <div className="workout-muscle">
          <span className="info-label">
            Target Muscle
          </span>

          <span className="info-value">
            {formatText(workout.muscle)}
          </span>
        </div>


        <div className="workout-section">
          <h4>Equipment</h4>

          <div className="equipment-list">
            {workout.equipments?.length > 0 ? (
              workout.equipments.map((equipment, index) => (
                <span
                  className="equipment-tag"
                  key={`${equipment}-${index}`}
                >
                  {formatText(equipment)}
                </span>
              ))
            ) : (
              <span className="equipment-empty">
                No equipment required
              </span>
            )}
          </div>
        </div>

        <div className="workout-section">
          <h4>Instructions</h4>

          <p className="workout-instructions">
            {workout.instructions}
          </p>
        </div>

        {workout.safety_info && (
          <div className="workout-safety">
            <div className="safety-title">
              Safety
            </div>

            <p>
              {workout.safety_info}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default WorkoutCard;