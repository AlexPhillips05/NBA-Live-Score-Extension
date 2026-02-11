import './App.css'
import { useState, useEffect } from 'react'

// Helper to resolve SVG paths dynamically in Vite
const getLogoUrl = (teamName) => {
    return new URL(`./assets/${teamName}.svg`, import.meta.url).href
}

function App() {
    //State variables
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
    if (loading) return <div style={{ width: '320px', padding: '15px', textAlign: 'center' }}>Loading...</div>;
    if (error) return <div style={{ width: '320px', padding: '15px', color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{
            width: '420px',
            padding: '15px',
            backgroundColor: '#121212', // dark popup background
            color: 'white',
        }}>

            <h2 style={{ fontSize: '18px', borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '12px', textAlign: 'center' }}>
                NBA Live Scores
            </h2>
            
            {games.length > 0 ? (
                games.map((game) => (
                    <div 
                        key={game.game_id}
                        style={{
                        marginBottom: '14px',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        backgroundColor: '#1c1c1c'
                        }}
                    >

                        {/* LOGOS ROW */}
                        <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px'
                        }}>

                        <img
                            src={getLogoUrl(game.home_team.name)}
                            alt={game.home_team.name}
                            style={{ width: '38px', height: '38px' }}
                        />

                        <img
                            src={getLogoUrl(game.away_team.name)}
                            alt={game.away_team.name}
                            style={{ width: '38px', height: '38px' }}
                        />
                        </div>

                        {/* STATUS */}
                        <div style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#ff5252',
                        marginBottom: '8px'
                        }}>
                        {game.status}
                        </div>

                        {/* NAME + SCORE ROW */}
                        <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                        }}>

                        {/* Home Name */}
                        <div style={{ flex: 1, textAlign: 'left', fontWeight: 'bold' }}>
                            {game.home_team.name}
                        </div>

                        {/* Center Score */}
                        <div style={{
                            flex: 1,
                            textAlign: 'center',
                            fontSize: '26px',
                            fontWeight: 'bold'
                        }}>
                            {game.home_team.score} - {game.away_team.score}
                        </div>

                        {/* Away Name */}
                        <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
                            {game.away_team.name}
                        </div>

                        </div>

                        {/* RECORD ROW */}
                        <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        opacity: 0.6
                        }}>
                        <div>{game.home_team.record}</div>
                        <div>{game.away_team.record}</div>
                        </div>

                    </div>
                    ))
            ) : (
                <p style={{ textAlign: 'center', color: '#666' }}>No games scheduled for today.</p>
            )}
        </div>
    )
}

export default App
