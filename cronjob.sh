#!/bin/zsh

# set cronjobs crontab -e

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed

# Run telegram bot every wed - sat at 9am
# 0 9 * * wed,sat (cd $GLOBAL_PATH/byverdu_lotto_bot && ./cronjob.sh)

# Add timestamp
echo "start bot => $(date)" >> log.txt

# Run Telegram bot
yarn start

# Add timestamp
echo "end bot => $(date)" >> log.txt
