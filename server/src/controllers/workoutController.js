const getWorkout = async (req, res, next) => {
  const api = process.env.EXERCISES_API;
  const { type, muscle, difficulty } = req.query;

  const url = Object.keys(req.query).length === 0 ? 
              `https://api.api-ninjas.com/v1/exercises` :
              type && muscle && difficulty ? `https://api.api-ninjas.com/v1/exercises/?type=${type}&muscle=${muscle}&difficulty=${difficulty}` :
              
              type && muscle ? `https://api.api-ninjas.com/v1/exercises/?type=${type}&muscle=${muscle}` :
              type && difficulty ? `https://api.api-ninjas.com/v1/exercises/?type=${type}&difficulty=${difficulty}` :
              muscle && difficulty ? `https://api.api-ninjas.com/v1/exercises/?muscle=${muscle}&difficulty=${difficulty}` :
              
              type ? `https://api.api-ninjas.com/v1/exercises/?type=${type}` :
              muscle ? `https://api.api-ninjas.com/v1/exercises/?muscle=${muscle}` :
              difficulty ? `https://api-ninjas.com{difficulty}` :
              
              `https://api.api-ninjas.com/v1/exercises`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': api,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return res.status(200).json(data);

  } catch (error) {
    next(error);
  }
}

export default getWorkout;
