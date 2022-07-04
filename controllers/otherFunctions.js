const fs = require('fs')

const CallingKeyBot = '-'

const GetPseudoURL = (pseudo) => {
    return `https://euw.op.gg/_next/data/sjaGumjI-f4X0Nh2jsgvP/summoners/euw/${pseudo}.json?region=euw&summoner=${pseudo}`
}
const getCallingWord = (sentence) => {
    const FirstWord = sentence.split(' ')[0]
    const FirstCharacter = FirstWord.split('')[0]
    if (CallingKeyBot === FirstCharacter) {
        const NewWord = FirstWord.substring(1)
        return NewWord
    } else {
        return false
    }
}

const getSecondWord = (sentence) => {
    return sentence.split(' ')[1]
}
const isInJsonData = (summoner_id) => {
    const obj = fs.readFileSync(__dirname + '/data.json')
    const dataFile = JSON.parse(obj)
    const player = dataFile.target.find(player => player.id === summoner_id)
    if (player === undefined) {
        return false
    }
    return true
}

const AddPlayerFile = (id, pseudo) => {
    const obj = fs.readFileSync(__dirname + '/data.json')
    const dataFile = JSON.parse(obj)
    dataFile.target.push({
        name: pseudo,
        id: id,
        last_GameID: "",
        date_last_game: "",
        numberGame_of_the_day: 0
    })
    const data = JSON.stringify(dataFile, null, 4);
    fs.writeFileSync(__dirname + '/data.json', data, 'utf8');
}


module.exports = {
    GetPseudoURL,
    getCallingWord,
    getSecondWord,
    isInJsonData,
    AddPlayerFile
}