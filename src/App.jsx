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
    // Start tracking date inside React state. Defaulting to the final day of the regular season for current testing purposes, since that day had all 30 teams playing. This will need to be changed for production to track the actual current date.
    const [currentDate, setCurrentDate] = useState(new Date('2026-04-12'));
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Formats JS Date object to YYYY-MM-DD for the API request parameter
    const formatDateQuery = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Formats JS Date object to a clean reader display (e.g., "Apr 12, 2026")
    const formatDateDisplay = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC' // Forces display stability regardless of local machine settings
        });
    };

    useEffect(() => {
        //Function to fetch the data
        const fetchScores = async () => {
            setLoading(true);
            try {
                // Pass the current selected date directly to your backend as a URL parameter string
                const targetDateStr = formatDateQuery(currentDate);
                const CLOUD_URL = `https://nba-live-score-extension.onrender.com/today-scores?date=${targetDateStr}`;

                const response = await fetch(CLOUD_URL);
                // Check if the server actually responded with "OK"
                if (!response.ok) {
                    throw new Error('Server not connected');
                }

                const data = await response.json();
                setGames(data.games); // This matches the {"games": [...]} structure from FastAPI
                setLoading(false);
            } 
            catch (error) {
                // If the fetch fails, save the error message
                console.error("Fetch error:", error);
                setError('Server not connected');
                setLoading(false);
            }
        };
        fetchScores();
    }, [currentDate]); // Trigger re-run whenever the state of currentDate alters

    // Click handler adjustments
    const handlePrevDay = () => {
        const prevDay = new Date(currentDate);
        prevDay.setUTCDate(prevDay.getUTCDate() - 1);
        setCurrentDate(prevDay);
    };

    const handleNextDay = () => {
        const nextDay = new Date(currentDate);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        setCurrentDate(nextDay);
    };

    // Conditional rendering for the UI
    //if (loading) return <div style={{ width: '320px', padding: '15px', textAlign: 'center' }}>Loading...</div>;
    //if (error) return <div style={{ width: '320px', padding: '15px', color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{
            width: '420px',
            padding: '15px',
            backgroundColor: '#121212',
            color: 'white',
        }}>

            {/* DATE NAVIGATION ROW HEADER */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #2c2c2c',
                paddingBottom: '10px',
                marginBottom: '16px'
            }}>
                <button 
                    onClick={handlePrevDay} 
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff5252',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '0 10px',
                        fontWeight: 'bold'
                    }}
                >
                    &larr;
                </button>

                <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {formatDateDisplay(currentDate)}
                </h2>

                <button 
                    onClick={handleNextDay} 
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff5252',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '0 10px',
                        fontWeight: 'bold'
                    }}
                >
                    &rarr;
                </button>
            </div>
            
            {/* INLINE RENDERING CONTAINER STATES */}
            {loading ? (
                <div style={{ padding: '30px', textAlign: 'center', opacity: 0.5 }}>Loading games...</div>
            ) : error ? (
                <div style={{ padding: '30px', color: '#ff5252', textAlign: 'center' }}>{error}</div>
            ) : games.length > 0 ? (
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
                        {/* MAIN DISPLAY ROW */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            {/* HOME TEAM COLUMN */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px', textAlign: 'center' }}>
                                <img src={getLogoUrl(game.home_team.name)} alt={game.home_team.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                <div style={{ fontWeight: 'bold', marginTop: '6px', fontSize: '14px' }}>{game.home_team.name}</div>
                                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>{game.home_team.record}</div>
                            </div>

                            {/* MIDDLE COLUMN (STATUS + SCORE) */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff5252', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{game.status}</div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '1px' }}>{game.home_team.score} - {game.away_team.score}</div>
                            </div>

                            {/* AWAY TEAM COLUMN */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px', textAlign: 'center' }}>
                                <img src={getLogoUrl(game.away_team.name)} alt={game.away_team.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                <div style={{ fontWeight: 'bold', marginTop: '6px', fontSize: '14px' }}>{game.away_team.name}</div>
                                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>{game.away_team.record}</div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>No games scheduled for this date.</p>
            )}
        </div>
    )
}

export default App
