from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from nba_api.stats.endpoints import scoreboardv2

app = FastAPI()

# CRUCIAL: Allows Chrome Extension to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you'd specify your extension ID
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/today-scores")
def get_scores():
    # Get today's date in YYYY-MM-DD format
    target_date = "2026-02-10"

    # Fetch today's scoreboard, '00' is the league ID for the NBA
    # Due to USA vs AUS timezones the day_offset will need to change sometimes?
    board = scoreboardv2.ScoreboardV2(
        league_id='00', 
        game_date=target_date,
        day_offset=-0  # 0 is today, -1 is yesterday, 1 is tomorrow
    )

    # Extract the tables we need
    headers = board.game_header.get_dict()
    linescore = board.line_score.get_dict()

    games_dict = {}

    # 1. First map the basic game status from GameHeader
    for game in headers['data']:
        game_id = game[2]
        games_dict[game_id] = {
            "game_id": game_id,
            "status": game[4], # e.g., "Final" or "10:30 pm ET"
            "home_team": {},
            "away_team": {}
        }
    
    # 2. Fill in the team-specific details from LineScore
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
        # We check the original headers to see which ID matches
        if team[3] == next(g[6] for g in headers['data'] if g[2] == game_id):
            games_dict[game_id]["home_team"] = team_data
        else:
            games_dict[game_id]["away_team"] = team_data
    
    return {"games": list(games_dict.values())}