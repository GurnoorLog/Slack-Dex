# Slack Dex ⚡️

A Pokémon companion bot for Slack that lets you look up Pokémon stats, encounter wild Pokémon, catch them, and play trivia — all inside your workspace. Features animated Gen V sprites and real trading card-style layouts.

## Commands

| Command | Description |
|---|---|
| `/pokedex-gt <name>` | Look up any Pokémon — shows an animated trading card with HP, Attack, type, and stat bars |
| `/wild-encounter-gt` | A random Gen 1 Pokémon appears! 15% chance of a **shiny** encounter. Tap *Throw Pokéball!* to try to catch it (50% catch rate) |
| `/my-team-gt` | View all the Pokémon you've caught |
| `/poke-trivia-gt` | "Who's That Pokémon?" — guess the mystery Pokémon from type clues with multiple-choice buttons |

## Tech Stack

- **Node.js** with `@slack/bolt` framework
- **PokéAPI** — live Pokémon data and animated sprites (Gen V Black/White)
- **Slack Block Kit** — interactive buttons, trading card UI with emoji stat bars
- **Render** — free 24/7 cloud deployment

## Deployment

1. Create a Slack app at https://api.slack.com/apps
2. Set up slash commands (`/pokedex-gt`, `/wild-encounter-gt`, `/my-team-gt`, `/poke-trivia-gt`) pointing to `https://your-domain.onrender.com/slack/events`
3. Enable Interactivity & Shortcuts with the same URL
4. Set environment variables: `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `PORT`
5. Deploy to Render (or any Node.js host)

## Environment Variables

```
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
PORT=3000
```
