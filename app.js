require('dotenv').config();
const { App } = require('@slack/bolt');
const fetch = require('node-fetch');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const trainerTeams = new Map();
const triviaGames = new Map();

app.command('/pokedex-gt', async ({ command, ack, respond }) => {
  await ack();

  const pokemonName = command.text.toLowerCase().trim();
  if (!pokemonName) {
    return await respond("❌ Please provide a Pokémon name! Example: `/pokedex-gt pikachu`");
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();

    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const sprite = data.sprites.front_default || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150";
    const types = data.types.map(t => t.type.name).join(', ');
    const hp = data.stats[0].base_stat;
    const attack = data.stats[1].base_stat;

    await respond({
      blocks: [
        {
          "type": "header",
          "text": { "type": "plain_text", "text": `🟡 Slack Dex Entry: ${name}` }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Type(s):* ${types}\n*HP:* ${hp} | *Attack:* ${attack}\n\n_Data retrieved live from PokéAPI!_`
          },
          "accessory": {
            "type": "image",
            "image_url": sprite,
            "alt_text": name
          }
        }
      ]
    });
  } catch (error) {
    await respond(`❌ Could not find Pokémon named "${pokemonName}". Check your spelling!`);
  }
});

app.command('/wild-encounter-gt', async ({ command, ack, respond }) => {
  await ack();

  try {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await res.json();
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const isShiny = Math.random() < 0.15;
    const sprite = isShiny
      ? data.sprites.front_shiny || data.sprites.front_default
      : data.sprites.front_default;
    const encounterText = isShiny
      ? `✨ *A wild ★ SHINY ★ ${name} appeared!* (1-in-7 odds!) What will you do?`
      : `🌿 *A wild ${name} appeared!* What will you do?`;

    await respond({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": encounterText
          },
          "accessory": {
            "type": "image",
            "image_url": sprite,
            "alt_text": name
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": { "type": "plain_text", "text": "🔴 Throw Pokéball!" },
              "value": name,
              "action_id": "catch_pokemon"
            }
          ]
        }
      ]
    });
  } catch (error) {
    await respond("⚠️ An error occurred during the encounter. Try again!");
  }
});

app.action('catch_pokemon', async ({ ack, body, respond }) => {
  await ack();

  const pokemonName = body.actions[0].value;
  const userId = body.user.id;

  const success = Math.random() < 0.5;

  if (success) {
    if (!trainerTeams.has(userId)) {
      trainerTeams.set(userId, []);
    }
    const userTeam = trainerTeams.get(userId);
    if (!userTeam.includes(pokemonName)) {
      userTeam.push(pokemonName);
    }

    await respond({
      text: `🎉 *GOTCHA!* <@${userId}> caught the wild *${pokemonName}*!`,
      replace_original: true
    });
  } else {
    await respond({
      text: `💨 Oh no! The wild *${pokemonName}* broke free and fled from <@${userId}>!`,
      replace_original: true
    });
  }
});

app.command('/my-team-gt', async ({ command, ack, respond }) => {
  await ack();

  const userId = command.user_id;
  const team = trainerTeams.get(userId) || [];

  if (team.length === 0) {
    return await respond("🎒 Your party is empty! Run `/wild-encounter-gt` to start catching Pokémon.");
  }

  const teamList = team.map((p, index) => `${index + 1}. *${p}*`).join('\n');

  await respond({
    blocks: [
      {
        "type": "header",
        "text": { "type": "plain_text", "text": "🎒 Your Current Team" }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Here are the Pokémon you have successfully caught:\n\n${teamList}`
        }
      }
    ]
  });
});

app.command('/poke-trivia-gt', async ({ command, ack, respond }) => {
  await ack();

  try {
    const correctId = Math.floor(Math.random() * 151) + 1;
    const wrongIds = new Set();
    while (wrongIds.size < 3) {
      const id = Math.floor(Math.random() * 151) + 1;
      if (id !== correctId) wrongIds.add(id);
    }

    const [correctData, ...wrongData] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${correctId}`).then(r => r.json()),
      ...[...wrongIds].map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json()))
    ]);

    const correctName = correctData.name.charAt(0).toUpperCase() + correctData.name.slice(1);
    const types = correctData.types.map(t => t.type.name).join(', ');
    const sprite = correctData.sprites.other['official-artwork']?.front_default || correctData.sprites.front_default;

    const options = [correctName, ...wrongData.map(d =>
      d.name.charAt(0).toUpperCase() + d.name.slice(1)
    )];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    const { ts } = await respond({
      blocks: [
        {
          "type": "header",
          "text": { "type": "plain_text", "text": "❓ Who's That Pokémon?! ❓" }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Clues:*\n• Type(s): \`${types}\`\n\n_Think you know who it is? Cast your vote below!_`
          },
          "accessory": {
            "type": "image",
            "image_url": sprite,
            "alt_text": "Mystery Pokémon"
          }
        },
        {
          "type": "actions",
          "elements": options.map((opt, i) => ({
            "type": "button",
            "text": { "type": "plain_text", "text": `${String.fromCharCode(65 + i)}. ${opt}` },
            "value": opt,
            "action_id": `trivia_guess`
          }))
        }
      ]
    });

    triviaGames.set(ts, correctName);
  } catch (error) {
    await respond("⚠️ Something went wrong setting up the trivia. Try again!");
  }
});

app.action('trivia_guess', async ({ ack, body, respond }) => {
  await ack();

  const guess = body.actions[0].value;
  const correctName = triviaGames.get(body.message.ts);

  if (!correctName) {
    await respond({
      text: "⚠️ This trivia session has expired! Start a new one with `/poke-trivia-gt`.",
      replace_original: true
    });
    return;
  }

  triviaGames.delete(body.message.ts);

  if (guess === correctName) {
    await respond({
      text: `✅ *Correct!* <@${body.user.id}> nailed it — it's *${correctName}*! 🎉`,
      replace_original: true
    });
  } else {
    await respond({
      text: `❌ *Wrong!* <@${body.user.id}> guessed *${guess}*, but the answer was *${correctName}*. Better luck next time!`,
      replace_original: true
    });
  }
});

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Slack Dex is live on port ${port}!`);
})();
