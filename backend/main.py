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
        day_offset=-1  # 0 is today, -1 is yesterday, 1 is tomorrow
    )
    games = board.game_header.get_dict()
    
    # Clean the data here so the Javascript only gets the essentials
    cleaned_games = []
    for game in games['data']:
        cleaned_games.append({
            "game_id": game[2],
            "matchup": game[5],
            "status": game[4]
        })
    
    return {"games": cleaned_games}