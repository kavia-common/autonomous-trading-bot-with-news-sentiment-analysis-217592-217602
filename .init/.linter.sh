#!/bin/bash
cd /home/kavia/workspace/code-generation/autonomous-trading-bot-with-news-sentiment-analysis-217592-217602/trading_bot_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

