# Slack Dex

A Pokémon bot for Slack I built for the Hack Club Stardance challenge. You can look up any Pokémon's stats, encounter wild ones in your channel, catch them, and play guess-the-Pokémon trivia.

## Commands

**`/pokedex-gt <name>`** — Gets data from PokéAPI and shows an animated trading card with HP, attack, type, and stat bars. The sprites are from Pokémon Black/White so they actually move.

**`/wild-encounter-gt`** — A random Gen 1 Pokémon pops up. 15% of the time it'll be shiny (different color + special sparkle). Hit the button to try catching it — it's a 50/50 chance.

**`/my-team-gt`** — Lists every Pokémon you've caught so far.

**`/poke-trivia-gt`** — Four multiple choice buttons, one mystery Pokémon. Guess right and you win.

## How it works

Node.js + Slack's Bolt framework. All Pokémon data comes live from PokéAPI. The card layout uses Slack's Block Kit. Runs on a Hack Club Nest server.

## Setup

Created a Slack app at api.slack.com, added 4 slash commands pointing to the bot's endpoint, turned on Interactivity, and deployed it. The bot token and signing secret are set as env variables.

## Environment Variables

```
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
PORT=3000
```
