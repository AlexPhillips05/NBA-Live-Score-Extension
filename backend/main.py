from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from nba_api.stats.endpoints import scoreboardv2
from datetime import datetime
import pytz

app = FastAPI()

# Automatically handles all the CORS headers for your Chrome Extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/today-scores")
def get_scores():
    try:
        # Get the current time in US Eastern Time (NBA's timezone)
        us_tz = pytz.timezone('US/Eastern')
        today = datetime.now(us_tz).strftime('%Y-%m-%d')

        # Fetch today's scoreboard
        # Due to USA vs AUS timezones the day_offset will need to change sometimes?
        board = scoreboardv2.ScoreboardV2(
            league_id='00', 
            game_date=today,
            day_offset=-45 # 0 is today, -1 is yesterday, +1 is tomorrow
        )

        # Extract the tables we need
        headers_data = board.game_header.get_dict()
        linescore = board.line_score.get_dict()

        games_dict = {}

        # First map the basic game status from GameHeader
        for game in headers_data['data']:
            game_id = game[2]
            games_dict[game_id] = {
                "game_id": game_id,
                "status": game[4],
                "home_team": {},
                "away_team": {}
            }
        
        # Fill in the team specific details from LineScore
        # LineScore has two rows per game (one for home, one for away)
        for team in linescore['data']:
            game_id = team[2]
            team_data = {
                "name": team[5],        # TEAM_ABBREVIATION (e.g., "LAL")
                "full_name": team[6],   # TEAM_CITY_NAME 
                "record": team[7],      # TEAM_WINS_LOSSES (e.g., "30-22")
                "score": team[22] or 0  # PTS (points)
            }
            
            # Determine if this row is the Home or Away team
            # Check the original headers to see which ID matches
            if team[3] == next(g[6] for g in headers_data['data'] if g[2] == game_id):
                games_dict[game_id]["home_team"] = team_data
            else:
                games_dict[game_id]["away_team"] = team_data
        
        # FastAPI automatically converts this dictionary to JSON
        return {"games": list(games_dict.values())}

    except Exception as e:
        return {"error": str(e)}