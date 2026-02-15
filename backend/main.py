import functions_framework
from nba_api.stats.endpoints import scoreboardv2
import json
from datetime import datetime, timedelta
import pytz

@functions_framework.http
def get_nba_scores(request):
    """HTTP Cloud Function to be used as a bridge for extension."""
    
    # Manually handles CORS
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main GET request
    headers = {'Access-Control-Allow-Origin': '*'}

    try:
        # Get the current time in US Eastern Time (NBA's timezone)
        us_tz = pytz.timezone('US/Eastern')
        today = datetime.now(us_tz).strftime('%Y-%m-%d')
        tempdate = '2026-02-12'

        # Fetch today's scoreboard, '00' is the league ID for the NBA
        # Due to USA vs AUS timezones the day_offset will need to change sometimes?
        board = scoreboardv2.ScoreboardV2(
            league_id='00', 
            game_date=tempdate,
            day_offset=0
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
                "status": game[4], # e.g., "Final" or "10:30 pm ET"
                "home_team": {},
                "away_team": {}
            }
        
        # 2. Fill in the team specific details from LineScore
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
        
        # Return as a JSON string with the proper headers
        return (json.dumps({"games": list(games_dict.values())}), 200, headers)

    except Exception as e:
        return (json.dumps({"error": str(e)}), 500, headers)