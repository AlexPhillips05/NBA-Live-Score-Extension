from nba_api.stats.endpoints import scoreboardv2

# Force the exact date instead of using the offset
try:
    print("Fetching data for April 12, 2026...")
    board = scoreboardv2.ScoreboardV2(
        league_id='00', 
        game_date='2026-04-12', 
        day_offset=0
    )
    
    headers = board.game_header.get_dict()
    games_count = len(headers['data'])
    
    print(f"Success! Found {games_count} games.")
    print(headers['data'][0]) # Print the raw data for the first game
    
except Exception as e:
    print(f"NBA API Error: {e}")