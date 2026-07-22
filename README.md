# Slack Dex

A Pokémon bot I made for Slack as part of Hack Club's Stardance challenge. You can look up Pokémon, run into wild ones in your channel, catch them, and play a guessing game.

## Commands

**`/pokedex-gt pikachu`** — type any Pokémon name and it shows up as a little trading card with its stats, type, and an animated sprite that actually bounces around (it's the Gen 5 sprite from the games).

**`/wild-encounter-gt`** — a random Pokémon appears in the channel. About 15% of the time it'll be shiny (different color + sparkle). Hit the button to throw a Pokéball and try to catch it — it's random whether you get it or not.

**`/my-team-gt`** — shows every Pokémon you've caught.

**`/poke-trivia-gt`** — four buttons pop up with different names, one of them is the mystery Pokémon. Guess right and it tells everyone you got it.

## How it works

It's a Node.js app using Slack's Bolt library. The Pokémon data comes live from the PokéAPI whenever someone runs a command. The card layout is done with Slack's Block Kit — it's not real CSS but you can fake a card look pretty well with emojis and dividers. 

It runs on a Hack Club Nest server so it stays on 24/7.

## Making your own

You'll need a Slack app from api.slack.com, a bot token, and a signing secret. Point the slash commands and interactivity URL to wherever you host it (like `https://your-domain/slack/events`). The env vars are SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, and PORT.

The code is just one file — app.js. Everything happens in there.
