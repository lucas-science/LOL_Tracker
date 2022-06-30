/*
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
client.login("OTkxMzU2NDQ5MzUzNjQ2MTAx.Gr5HYH.IGhWo3IQFelmgZqBu6EyQ-0yLv2V6blG8ZgXRw")

*/

const axios = require('axios')
const fs = require('fs')
const dataFile = require('./data.json')

let token = process.env.TOKEN;
let channel_id = "992046980945690705";

const sendMessage = async(channelID, message) => {
    const channel_url = `https://discord.com/api/v8/channels/${channel_id}/messages`;

    const result = await axios.post(channel_url, {
        content: message
    }, {
        headers: {
            Authorization: 'Bot ' + token
        }
    })
    return `Status : ${result.status}, message sended succesfully !`
}

const isNewGame = async(element, GameID) => {
    let pos = dataFile.target.map(function(e) {
        return e.name;
    }).indexOf(element.name);

    const target = dataFile.target[pos]
    let SendDiscordMessage = false

    const d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    const final_date = d.toString()

    if (final_date === target.date_last_game) {
        if (GameID != target.last_GameID) {
            target.last_GameID = GameID
            target.numberGame_of_the_day++;
            SendDiscordMessage = true
        }
    } else {
        target.date_last_game = final_date
        target.numberGame_of_the_day = 1
        SendDiscordMessage = true
    }
    const data = JSON.stringify(dataFile, null, 4);
    fs.writeFileSync('./data.json', data, 'utf8');

    return { SendDiscordMessage: SendDiscordMessage, numberOfGames: target.numberGame_of_the_day }
}

const SendMessageOfPeopleWhoIsInGame = (element) => {
    const isInGame_URL = `https://euw.op.gg/api/spectates/${element.id}?region=euw`
    axios.post(isInGame_URL)
        .then(async res => {
            console.log(`${element.name} is in game`)

            const Send = await isNewGame(element, res.data.data.game_id)
            if (Send.SendDiscordMessage) {
                sendMessage(channel_id, `Aujourd'hui ${element.name} est à ça ${Send.numberOfGames}ème game de la journée sur league of legends. `).then(status => console.log(status))
            }
        })
        .catch(res => console.log(`${element.name} isn't in game`))
}

const main = () => {
    dataFile.target.forEach(element => {
        SendMessageOfPeopleWhoIsInGame(element)
    })
}

main()

setInterval(main, 300000)