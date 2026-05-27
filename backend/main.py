from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from nba_api.stats.endpoints import scoreboardv2
from datetime import datetime
import pytz
from typing import Optional

app = FastAPI()

# Automatically handles all the CORS headers for your Chrome Extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/today-scores")
def get_scores(date: Optional[str] = Query(None)): # Capture date parameter from the incoming extension request
    try:
        # If no explicit date parameter was sent, calculate the true current NBA timezone date string
        if not date:
            us_tz = pytz.timezone('US/Eastern')
            date = datetime.now(us_tz).strftime('%Y-%m-%d')

        # Request data for the precise date string calculated or requested
        board = scoreboardv2.ScoreboardV2(
            league_id='00', 
            game_date=date,
            day_offset=0 # 0 is today, -1 is yesterday, +1 is tomorrow
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