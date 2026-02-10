from nba_api.stats.endpoints import scoreboardv2
from datetime import datetime
import json

def test_fetch():
    try:
        # Get today's date in YYYY-MM-DD format
        target_date = "2026-02-10"

        # Fetch today's scoreboard, '00' is the league ID for the NBA
        # Due to USA vs AUS timezones the day_offset will need to change sometimes?
        board = scoreboardv2.ScoreboardV2(
            league_id='00', 
            game_date=target_date,
            day_offset=-1  # 0 is today, -1 is yesterday, 1 is tomorrow
        )
        
        # Convert the 'GameHeader' data into a dictionary
        games = board.game_header.get_dict()
        
        if not games['data']:
            print("No games found for today.")
        else:
            print(f"Found {len(games['data'])} games")
            for game in games['data']:
                # Index 4 is usually the Game ID, Index 5 is Gamecode (e.g., 20260210/GSWLAL)
                print(f"Game ID: {game[2]} | Matchup: {game[5]}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_fetch()