const path = require('path')
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '.env')
});


// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

const allIntents = new Intents(32767);
const client = new Client({ intents: allIntents });



// controllers 
const { AddPlayer, RemovePlayer } = require('./controllers/ClientActions.js')
const { getCallingWord } = require('./controllers/otherFunctions.js')


// When the client is ready, run this code (only once)
client.on("ready", (content) => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", message => {
    const { content } = message
    const iscallingBot = getCallingWord(content, message)
    if (iscallingBot) {
        switch (iscallingBot) {
            case 'add':
                AddPlayer(content, message)
                break;
            case 'remove':
                RemovePlayer(content, message)
                break;
        }
    }
})

// Login to Discord with your client's token
client.login(process.env.TOKEN)