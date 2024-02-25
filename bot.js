const { Client, GatewayIntentBits, PermissionFlagsBits, Events, Collection, EmbedBuilder, ChannelType, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');
const INTENTS = Object.values(GatewayIntentBits);
const client = new Client({ intents: INTENTS });
const config = require("./config.json");
const chalk = require('chalk');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { readdirSync } = require("fs");
const moment = require("moment");
const db = require("croxydb")
const discordTranscripts = require('discord-html-transcripts')

let token = config.token;

client.commands = new Collection();
client.slashcommands = new Collection();
client.commandaliases = new Collection();

const rest = new REST({ version: "10" }).setToken(token);

const slashcommands = [];
const commandFolders = fs.readdirSync('./commands');

console.log(chalk.red('[COMMANDS] Loading Commands...'));

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const commandPath = `./commands/${folder}/${file}`;
        const command = require(commandPath);
        const commandCategory = folder.toLocaleUpperCase();
        slashcommands.push(command.data.toJSON());
        client.slashcommands.set(command.data.name, command);
        console.log(chalk.cyan('[COMMANDS] ' + command.data.name + ' Yüklendi' + chalk.yellow(' - ') + chalk.red('Kategori: ' + commandCategory)));
    }
}


client.on(Events.ClientReady, async () => {
    try {
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: slashcommands,
        });
    } catch (error) {
        console.error(error);
    }
    console.log(chalk.red(`[wondexz]`) + chalk.green(` ${client.user.username} Discord'a bağlandı!`));
});


readdirSync("./events").forEach(async (file) => {
    const event = await require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
});

client.login(config.token);