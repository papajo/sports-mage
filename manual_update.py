#!/usr/bin/env python3
"""
Sports Data Fetcher - Manual Update Script

This script provides a simple way to manually update sports data
as an alternative to scheduled cron jobs.
"""

import os
import sys
import time
import logging
import argparse
from datetime import datetime
from sports_data_fetcher import SportsDataFetcher

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("manual_update.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("manual_update")

def run_update(update_type, interval=None, iterations=None):
    """Run updates at specified intervals."""
    fetcher = SportsDataFetcher()
    
    if update_type not in ["full", "live"]:
        logger.error(f"Invalid update type: {update_type}")
        sys.exit(1)
    
    # If interval is provided, run updates at that interval
    if interval:
        count = 0
        try:
            while True:
                if update_type == "full":
                    logger.info("Running full update...")
                    fetcher.run_full_update()
                else:
                    logger.info("Updating live fixtures...")
                    fetcher.update_live_fixtures()
                
                count += 1
                logger.info(f"Update #{count} completed. Next update in {interval} seconds.")
                
                # Check if we've reached the maximum number of iterations
                if iterations and count >= iterations:
                    logger.info(f"Reached maximum number of iterations ({iterations}). Exiting.")
                    break
                
                # Sleep until next update
                time.sleep(interval)
                
        except KeyboardInterrupt:
            logger.info("Update process interrupted by user.")
        except Exception as err:
            logger.error(f"Error during update: {err}")
    else:
        # Run a single update
        try:
            if update_type == "full":
                logger.info("Running full update...")
                fetcher.run_full_update()
            else:
                logger.info("Updating live fixtures...")
                fetcher.update_live_fixtures()
            
            logger.info("Update completed successfully.")
        except Exception as err:
            logger.error(f"Error during update: {err}")
            sys.exit(1)

def main():
    """Main function to run the manual update script."""
    parser = argparse.ArgumentParser(description="Manually update sports data")
    parser.add_argument("--type", choices=["full", "live"], default="live",
                        help="Type of update to run (default: live)")
    parser.add_argument("--interval", type=int,
                        help="Interval in seconds between updates (if not specified, runs once)")
    parser.add_argument("--iterations", type=int,
                        help="Maximum number of update iterations to run (if not specified, runs indefinitely)")
    
    args = parser.parse_args()
    
    run_update(args.type, args.interval, args.iterations)

if __name__ == "__main__":
    main()
