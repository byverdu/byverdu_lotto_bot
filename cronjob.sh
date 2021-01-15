#!/bin/zsh

# set cronjobs crontab -e

# Run telegram bot every wed - sat at 9am1
# * 9 * * wed,sat (cd /Users/albertvallverdu/Projects/repos/byverdu_lotto_bot && ./cronjob.sh)

# Add timestamp
echo "start bot => $(date)" >> log.txt

# Run Telegram bot
yarn start

# Add timestamp
echo "end bot => $(date)" >> log.txt
