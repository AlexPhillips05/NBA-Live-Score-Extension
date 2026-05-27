import './App.css'
import { useState, useEffect } from 'react'

// Explicitly import all SVGs so Vite bundles them into the extension
import atlanta from './assets/AtlantaHawks.svg';
import boston from './assets/BostonCeltics.svg';
import brooklyn from './assets/BrooklynNets.svg';
import charlotte from './assets/CharlotteHornets.svg';
import chicago from './assets/ChicagoBulls.svg';
import cleveland from './assets/ClevelandCavaliers.svg';
import dallas from './assets/DallasMavericks.svg';
import denver from './assets/DenverNuggets.svg';
import detroit from './assets/DetroitPistons.svg';
import golden_state from './assets/GoldenStateWarriors.svg';
import houston from './assets/HoustonRockets.svg';
import indiana from './assets/IndianaPacers.svg';
import clippers from './assets/LosAngelesClippers.svg';
import lakers from './assets/LosAngelesLakers.svg';   
import memphis from './assets/MemphisGrizzlies.svg';
import miami from './assets/MiamiHeat.svg';
import milwaukee from './assets/MilwaukeeBucks.svg';
import minnesota from './assets/MinnesotaTimberwolves.svg';
import new_orleans from './assets/NewOrleansPelicans.svg';
import new_york from './assets/NewYorkKnicks.svg';
import okc from './assets/OklahomaCityThunder.svg';
import orlando from './assets/OrlandoMagic.svg';
import philadelphia from './assets/Philadelphia76ers.svg';
import phoenix from './assets/PhoenixSuns.svg';
import portland from './assets/PortlandTrailBlazers.svg';
import sacramento from './assets/SacramentoKings.svg';
import san_antonio from './assets/SanAntonioSpurs.svg';
import toronto from './assets/TorontoRaptors.svg';
import utah from './assets/UtahJazz.svg';
import washington from './assets/WashingtonWizards.svg';
import nbaFallback from './assets/NBALogo.svg';

// Map the API's Team Name (last word of full_name) to the correct imported file
const logoMap = {
    "Atlanta": atlanta,
    "Boston": boston,
    "Brooklyn": brooklyn,
    "Charlotte": charlotte,
    "Chicago": chicago,
    "Cleveland": cleveland,
    "Dallas": dallas,
    "Denver": denver,
    "Detroit": detroit,
    "Golden State": golden_state,
    "Houston": houston,
    "Indiana": indiana,
    "LA": clippers,
    "Los Angeles": lakers,
    "Memphis": memphis,
    "Miami": miami,
    "Milwaukee": milwaukee,
    "Minnesota": minnesota,
    "New Orleans": new_orleans,
    "New York": new_york,
    "Oklahoma City": okc,
    "Orlando": orlando,
    "Philadelphia": philadelphia,
    "Phoenix": phoenix,
    "Portland": portland,
    "Sacramento": sacramento,
    "San Antonio": san_antonio,
    "Toronto": toronto,
    "Utah": utah,
    "Washington": washington
};

const getLogoUrl = (teamName) => {
    console.log("Looking for logo for:", teamName); // Debugging line to check team names
    return logoMap[teamName] || nbaFallback;
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
                const CLOUD_URL = 'https://nba-live-score-extension.onrender.com/today-scores';
                const response = await fetch(CLOUD_URL);

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
                        padding: '10px 18px',
                        borderRadius: '12px',
                        backgroundColor: '#1c1c1c'
                        }}
                    >

                        {/* LOGOS ROW */}
                        <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0px'
                        }}>

                        <img
                            src={getLogoUrl(game.home_team.name)}
                            alt={game.home_team.name}
                            style={{ width: '60px', height: '60px' }}
                        />

                        <img
                            src={getLogoUrl(game.away_team.name)}
                            alt={game.away_team.name}
                            style={{ width: '60px', height: '60px' }}
                        />
                        </div>

                        {/* STATUS */}
                        <div style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#ff5252',
                        marginTop: '-25px', // Adjust this value to move the status closer to the logos
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
                            {game.home_team.full_name.split(' ').pop()} {/* This extracts the Team Name (e.g., "Celtics") */}
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
                            {game.away_team.full_name.split(' ').pop()} {/* This extracts the Team Name */}
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
