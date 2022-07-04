const axios = require('axios')
const fs = require('fs')

const { GetPseudoURL, getSecondWord, isInJsonData, AddPlayerFile } = require('./otherFunctions.js')

const AddPlayer = (content, message) => {
    const pseudoToAdd = getSecondWord(content)
    axios.post(GetPseudoURL(pseudoToAdd))
        .then(res => {
            const { summoner_id } = res.data.pageProps.data
            if (summoner_id) {
                if (!isInJsonData(summoner_id)) {
                    console.log("ADD : " + pseudoToAdd)
                    AddPlayerFile(summoner_id, pseudoToAdd)
                    message.reply(`Le joueur ${pseudoToAdd} a été ajouté à la liste du tracker.`)
                } else {
                    message.reply(`Le joueur ${pseudoToAdd} est déjà enregistré.`)
                }
            } else {
                message.reply(`Le joueur ${pseudoToAdd} est introuvable.`)
            }
        })
        .catch(res => console.log(res))
}


const RemovePlayer = (content, message) => {
    const pseudoToRemove = getSecondWord(content)
    const obj = fs.readFileSync(__dirname + '/data.json')
    const dataFile = JSON.parse(obj)

    const filtrePlayers = dataFile.target.filter(player => player.name != pseudoToRemove)

    if (filtrePlayers.length === dataFile.target.length) {
        message.reply(`Le joueur ${pseudoToRemove} n'est pas dans la liste du tracker.`)
    } else {
        const data = JSON.stringify({ target: filtrePlayers }, null, 4);
        fs.writeFileSync(__dirname + '/data.json', data, 'utf8');
        message.reply(`Le joueur ${pseudoToRemove} a été enlevé de la liste du tracker.`)
    }

}

module.exports = {
    AddPlayer,
    RemovePlayer
}