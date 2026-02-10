import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Create a function to fetch the data
    const fetchScores = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/today-scores');

        // Check if the server actually responded with "OK"
        if (!response.ok) {
          throw new Error('Server not connected');
        }

        const data = await response.json();
        setGames(data.games); // This matches the {"games": [...]} structure from FastAPI
        setLoading(false);
      } catch (error) {
        // If the fetch fails, save the error message
        console.error("Fetch error:", error);
        setError('Server not connected');
        setLoading(false);
      }
    };

    fetchScores();
  }, []); // The empty array means this runs once when the popup opens

  // Conditional rendering for the UI
  if (loading) return <div style={{ width: '300px', padding: '10px' }}>Loading...</div>;
  if (error) return <div style={{ width: '300px', padding: '10px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ width: '300px', padding: '10px', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '1px solid #ccc' }}>NBA Live Scores</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {games.length > 0 ? games.map((game) => (
          <li key={game.game_id} style={{ marginBottom: '10px', padding: '8px', background: '#f4f4f4', borderRadius: '4px' }}>
            <strong>{game.matchup}</strong>
            <div style={{ fontSize: '12px', color: '#666' }}>Status: {game.status}</div>
          </li>
        )) : <p>No games today.</p>}
      </ul>
    </div>
  )
}

export default App
