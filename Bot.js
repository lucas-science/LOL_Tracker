const path = require('path')
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '.env')
});

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", message => {
    console.log(message)
})


// Login to Discord with your client's token
client.login(process.env.TOKEN)