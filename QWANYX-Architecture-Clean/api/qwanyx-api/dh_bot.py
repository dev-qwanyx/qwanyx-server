#!/usr/bin/env python3
"""
Minimal Digital Human Bot Process
This script runs as a separate process for each active Digital Human
"""

import sys
import time
import json
import argparse
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [DH-%(dh_id)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

class MinimalDHBot:
    def __init__(self, dh_id, config='minimal'):
        self.dh_id = dh_id
        self.config = config
        self.running = True
        self.logger = logging.getLogger(f'DH-{dh_id}')
        
        # Add dh_id to logger format
        for handler in self.logger.handlers:
            handler.setFormatter(
                logging.Formatter(
                    f'[%(asctime)s] [DH-{dh_id}] %(levelname)s: %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S'
                )
            )
    
    def start(self):
        """Start the Digital Human bot process"""
        self.logger.info(f"Starting Digital Human bot - ID: {self.dh_id}, Config: {self.config}")
        
        # Write PID to file for tracking
        pid_file = f'dh_{self.dh_id}.pid'
        with open(pid_file, 'w') as f:
            f.write(str(sys.argv))
        
        # Main loop - simulate bot activity
        cycle = 0
        while self.running:
            try:
                cycle += 1
                
                # Simulate different activities based on config
                if self.config == 'minimal':
                    # Minimal bot - just heartbeat
                    self.logger.info(f"Heartbeat #{cycle} - Bot is active")
                    time.sleep(10)  # Check every 10 seconds
                    
                elif self.config == 'active':
                    # Active bot - simulate more activity
                    self.logger.info(f"Processing cycle #{cycle}")
                    
                    # Simulate checking for messages
                    if cycle % 3 == 0:
                        self.logger.info("Checking for new messages...")
                    
                    # Simulate AI response generation
                    if cycle % 5 == 0:
                        self.logger.info("Generating AI response...")
                        time.sleep(2)  # Simulate processing time
                    
                    time.sleep(5)  # Active check every 5 seconds
                
                # Check if we should stop (could check a file or signal)
                stop_file = f'stop_dh_{self.dh_id}'
                if os.path.exists(stop_file):
                    self.logger.info("Stop signal received")
                    os.remove(stop_file)
                    self.running = False
                    
            except KeyboardInterrupt:
                self.logger.info("Keyboard interrupt received")
                self.running = False
            except Exception as e:
                self.logger.error(f"Error in main loop: {e}")
                time.sleep(5)  # Wait before retrying
        
        self.logger.info("Digital Human bot stopped")
        
        # Clean up PID file
        try:
            os.remove(pid_file)
        except:
            pass

def main():
    """Main entry point for the DH bot"""
    parser = argparse.ArgumentParser(description='Digital Human Bot Process')
    parser.add_argument('--dh-id', required=True, help='Digital Human ID')
    parser.add_argument('--config', default='minimal', choices=['minimal', 'active'], 
                       help='Bot configuration (minimal or active)')
    parser.add_argument('--workspace', default='autodin', help='Workspace name')
    
    args = parser.parse_args()
    
    # Add os import
    import os
    
    # Create bot instance and start
    bot = MinimalDHBot(args.dh_id, args.config)
    
    try:
        bot.start()
    except Exception as e:
        logging.error(f"Failed to start bot: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()