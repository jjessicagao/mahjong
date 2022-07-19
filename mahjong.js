const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

var gameState = {
    numberOfPlayers: 0,
    playerIDs: [],
    players: [],
    allTiles: [], 
    unpickedUp: 0,
    lastDropped: 0,
    unwantedTiles: [0],
    inHandTiles: [[0]],
    laidOutTiles: [[0]],
    playerTurn: 0,
    playerPickUp: false,
    dealer: 0,
    inGame: false
};

outOfGameActions = [addPlayer, newGame, removePlayer];

var tilesS = '🀇🀈🀉🀊🀋🀌🀍🀎🀏🀐🀑🀒🀓🀔🀕🀖🀗🀘🀙🀚🀛🀜🀝🀞🀟🀠🀡🀀🀁🀂🀃🀄🀅🀆'
var tiles = '🀇🀈🀉🀊🀋🀌🀍🀎🀏🀐🀑🀒🀓🀔🀕🀖🀗🀘🀙🀚🀛🀜🀝🀞🀟🀠🀡🀀🀁🀂🀃🀄🀅🀆'.split('');
// console.log(tiles)
// console.log(tilesS)

// var actions = {
//     showStatus: showStatus,
//     newGame: newGame,
//     dropTile: dropTile,
//     pickUpNewTile: pickUpNewTile,
//     peng: peng,
//     gang: gang,
//     chi: chi,
//     nextTurn: nextTurn,
//     win: win,
//     addPlayer: addPlayer,
//     removePlayer: removePlayer,
// };

app.get('/api/showStatus/:id', (req, res) => {
    handleApi(req, res, showStatus);
})

function showStatus(req) {
    const playerNum = getPlayerID(req);
    const status = {
        inHand: gameState.inHandTiles[playerNum],
        laidOut: gameState.laidOutTiles[playerNum],
        players: gameState.players,
        lastDropped: gameState.lastDropped,
        unwantedTiles: gameState.unwantedTiles,
        playerTurn: gameState.playerTurn,
        playerPickUp: gameState.playerPickUp,
        dealer: gameState.dealer
    };
    return status;
}

function handleApi(req, res, action) {
    if (action != showStatus) {
        if (!outOfGameActions.includes(action) && !gameState.inGame) {
            return res.status(400).send('Not in game.');
        } else if (outOfGameActions.includes(action) && gameState.inGame) {
            return res.status(400).send('Cannot be done in game.');
        }
    }
    try {
        res.send(action(req));
    } catch (e) {
        if (typeof e == 'string') return res.status(400).send(e);
        res.status(500).send('Internal server error');
        console.log(e);
    }
}

function getPlayerID(req) {
    const playerNum = gameState.playerIDs.indexOf(req.params.id);
    if (playerNum < 0) throw 'The player with the given ID was not found.';
    return playerNum;
}

// function showMyTiles() {
//     let myTilesIn = 'In hand: ';
//     myTilesIn = numToTiles(gameState.inHandTiles[playerNum], myTilesIn);
//     console.log(myTilesIn);
//     let myTilesOut = 'Laid out: ';
//     myTilesOut = numToTiles(gameState.laidOutTiles[playerNum], myTilesOut);
//     console.log(myTilesOut);
// }

function numToTiles(numbers, pictures) {
    for (let tile of numbers) {
        pictures += tiles[tile*2] + tiles[tile*2 + 1];
        console.log(pictures);
    }
    return pictures;
}

app.put('/api/newGame', (req, res) => {
    handleApi(req, res, newGame);
})
function newGame() {
    if (gameState.numberOfPlayers < 3) throw 'Not enough players to play a game.';
    var Unshuffled = [];
    for (let i = 0 ; i < 34 ; i++) {
        Unshuffled.push(i,i,i,i);
    }
    shuffleTiles(Unshuffled);
    distributeTiles();
    gameState.laidOutTiles = [];
    for (let i = 0 ; i < gameState.numberOfPlayers ; i++) {
        gameState.laidOutTiles.push([]);
    }
    gameState.unwantedTiles = [];
    dealer = Math.floor(Math.random() * gameState.numberOfPlayers)
    playerTurn = dealer;
    gameState.playerPickUp = false;
    gameState.inGame = true;
}

function shuffleTiles(Unshuffled) {
    for (let i = 0 ; i < 7 ; i++) {
        var Shuffled = [];
        let left = 0;
        let right = 68;
        while (left < 68 && right < 136) {
            let n = Math.random();
            if (n < 0.5) {
                Shuffled.push(Unshuffled[left]);
                left++;
            } else {
                Shuffled.push(Unshuffled[right]);
                right++;
            }
        }
        if (left == 68) {
            Shuffled.push(...Unshuffled.slice(right,136));
        } else {
            Shuffled.push(...Unshuffled.slice(left,68));
        }
        Unshuffled = Shuffled;
    }
    gameState.allTiles = Shuffled;
}

// function countTiles(allTiles) {
//     var count = new Array(34).fill(0)
//     for (let i = 0 ; i < allTiles.length ; i++) {
//         count[allTiles[i]]++;
//     }
//     return count;
// }

function distributeTiles() {
    let n = 14;
    gameState.inHandTiles = new Array(gameState.numberOfPlayers);
    gameState.inHandTiles[0] = gameState.allTiles.slice(0,n)
    gameState.inHandTiles[0].sort(function(a,b) {
        return a - b
    });
    for (let i = 1 ; i < gameState.numberOfPlayers ; i++) {
        gameState.inHandTiles[i] = gameState.allTiles.slice(n,n+13);
        gameState.inHandTiles[i].sort(function(a,b) {
            return a - b
        });
        n += 13;
    }
    gameState.unpickedUp = n;
}

app.put('/api/dropTile/:id', (req, res) => {
    handleApi(req, res, dropTile);
})

function dropTile(req) {
    const playerNum = getPlayerID(req);
    if (playerNum != gameState.playerTurn || gameState.playerPickUp) {
        throw "It's not your turn to drop a tile.";
    } 
    const tile = req.query.tile;
    const index = findTile(playerNum, tile);
    gameState.lastDropped = gameState.inHandTiles[playerNum][index];
    gameState.inHandTiles[playerNum].splice(index, 1);
    nextTurn();
}

function findTile(playerNum, tile) {
    tile = parseInt(tile);
    const index = gameState.inHandTiles[playerNum].indexOf(tile);
    if (index < 0) throw 'You do not have that tile in hand.';
    return index;
}

app.put('/api/pickUpNewTile/:id', (req, res) => {
    handleApi(req, res, pickUpNewTile);
})
function pickUpNewTile (req) {
    const playerNum = getPlayerID(req);
    if (playerNum != gameState.playerTurn || !gameState.playerPickUp) {
        throw "It's not your turn to pick up a tile.";
    } 
    gameState.unwantedTiles.push(gameState.lastDropped);
    gameState.inHandTiles[playerNum].push(gameState.allTiles[gameState.unpickedUp]);
    gameState.inHandTiles[playerNum].sort(function(a,b) {
        return a - b
    });
    gameState.unpickedUp++;
    gameState.playerPickUp = false;
}

function countCard(card, tiles) {
    let count = 0;
    for (let i = 0 ; i < tiles.length ; i++) {
        if (tiles[i] == card) {
            count++;
        }
    }
    return count;
}

app.put('/api/peng/:id', (req, res) => {
    handleApi(req, res, peng);
})

function peng(req) {
    const playerNum = getPlayerID(req);
    if (playerNum == previousPlayer() || !gameState.playerPickUp) throw 'You cannot peng.';
    const tile = gameState.lastDropped;
    const count = countCard(tile, gameState.inHandTiles[playerNum]);
    if (count < 2) throw 'You do not have enough of this tile to peng.';
    let index = findTile(playerNum, tile);
    gameState.inHandTiles[playerNum].splice(index, 2);
    gameState.laidOutTiles[playerNum].push(tile, tile, tile);
    gameState.playerTurn = playerNum;
    gameState.playerPickUp = false;
}

app.put('/api/gang/:id', (req, res) => {
    handleApi(req, res, gang);
})

function gang(req) { 
    const playerNum = getPlayerID(req);
    if (gameState.playerTurn == playerNum && !gameState.playerPickUp) {
        const tile = req.query.tile;
        if (gameState.inHandTiles[playerNum].includes(tile)) {
            const count = countCard(tile, gameState.inHandTiles[playerNum]);
            if (count < 4) throw 'You do not have enough of this tile to gang.';
            gameState.laidOutTiles[playerNum].push(tile, tile, tile, tile);
        } else {
            const count = countCard(tile, gameState.laidOutTiles[playerNum]);
            if (count < 3) throw 'You do not have enough of this tile to gang.';
            gameState.laidOutTiles[playerNum].push(tile);
        }
    } else {
        if (playerNum == previousPlayer() || !gameState.playerPickUp) throw 'You cannot gang.';
        const tile = gameState.lastDropped;
        const count = countCard(tile, gameState.inHandTiles[playerNum]);
        if (count < 3) throw 'You do not have enough of this tile to gang.';
        gameState.laidOutTiles[playerNum].push(tile, tile, tile, tile);
        gameState.playerTurn = playerNum;
    }
    for (let i = gameState.inHandTiles[playerNum].length - 1 ; i >= 0 ; i--) {
        if (gameState.inHandTiles[playerNum] == card) {
            gameState.inHandTiles[playerNum].splice(i, 1);
        }
    }
    gameState.playerPickUp = true;
    pickUpNewTile();
}

app.put('/api/chi/:id', (req, res) => {
    handleApi(req, res, chi);
})

function chi(req) {
    const playerNum = getPlayerID(req);
    if (playerNum != gameState.playerTurn || !gameState.playerPickUp) {
        throw "You cannot chi.";
    } 
    const tile1 = parseInt(req.query.tile1);
    const tile2 = parseInt(req.query.tile2);
    const tile3 = gameState.lastDropped;
    let tiles = [tile1, tile2, tile3].sort(function(a,b) {
        return a - b;
    });
    if (!tiles.every(tile => tile < 27)) {
        throw "You cannot chi.";
    }
    let unique = new Set(tiles.map(tile => Math.floor(tile / 9)));
    if (unique.size != 1) {
        throw "You cannot chi.";
    }
    if (tiles[0] != tiles[1] - 1 || tiles[1] != tiles[2] - 1) {
        throw "You cannot chi.";
    }
    const index1 = findTile(playerNum, tile1);
    let index2 = findTile(playerNum, tile2);
    gameState.inHandTiles[playerNum].splice(index1, 1);
    index2 = findTile(playerNum, tile2);
    gameState.inHandTiles[playerNum].splice(index2, 1);
    gameState.laidOutTiles[playerNum].push(...tiles);
    gameState.playerPickUp = false;
}

function nextTurn() {
    if (gameState.playerTurn == gameState.numberOfPlayers - 1) {
        gameState.playerTurn = 0;
    } else {
        gameState.playerTurn++;
    }
    gameState.playerPickUp = true;
}

function previousPlayer() {
    if (gameState.playerTurn == 0) {
        return gameState.numberOfPlayers;
    } else {
        return gameState.playerTurn - 1;
    }
}

app.put('/api/win/:id', (req, res) => {
    handleApi(req, res, win);
    res.send(results);
})

function win(req) {
    const playerNum = getPlayerID(req);
    let winning = 1;
    if (gameState.playerTurn == playerNum && !gameState.playerPickUp) {
        winning++;
        winning += (gameState.laidOutTiles[playerNum].length + gameState.inHandTiles[playerNum].length - 14);
    } else if (playerNum == previousPlayer() || !gameState.playerPickUp) {
        throw 'You cannot win.';
    } else {
        winning += (gameState.laidOutTiles[playerNum].length + gameState.inHandTiles[playerNum].length - 13);
    }
    if (gameState.laidOutTiles[playerNum].length == 0) {
        winning *= 2;
    }
    if (playerNum == gameState.dealer) {
        winning *= 2;
    }
    for (let i = 0 ; i < gameState.numberOfPlayers ; i++) {
        if (i != playerNum) {
            if (i == gameState.dealer) {
                gameState.players[i].money -= winning * 2;
                gameState.players[playerNum].money += winning * 2;
            } else {
                gameState.players[i].money -= winning;
                gameState.players[playerNum].money += winning;
            }
        }
    }
    if (playerNum != gameState.dealer) {
        gameState.dealer++;
    }
    let results = {
        winner: playerNum,
        inHand: gameState.inHandTiles[playerNum],
        laidOut: gameState.laidOutTiles[playerNum],
        standings: gameState.players
    }
    gameState.inGame = false;
    return results;
}

app.post('/api/addPlayer/:name', (req, res) => {
    handleApi(req, res, addPlayer);
})
function addPlayer(req) {
    const playerName = req.params.name.trim();
    if (gameState.players.some(p => p.name.toLowerCase() == playerName.toLowerCase())) {
        throw 'Name already taken.'
    }
    const player = {
        name: playerName,
        money: 50
    }
    gameState.players.push(player);
    const id = gameState.numberOfPlayers + '';
    // const id = Math.floor(Math.random() * Math.pow(10, 6));
    gameState.playerIDs.push(id);
    gameState.numberOfPlayers++;
    return id;
}

app.delete('api/removePlayer/:id', (req, res) => {
    const playerNum = gameState.players.findIndex(p => p.id === req.params.id);
    removePlayer(playerNum);
    res.send(playerNames)
    
})
function removePlayer(playerNum) {
    gameState.numberOfPlayers--;
    gameState.playerNames.splice(playerNum, 1);
    gameState.money.splice(playerNum, 1);
}

// const prompt = require('prompt-sync')();
// var ans = prompt('What do you want to know? ');
// while (ans != 'stop') {
//     var answer = ans.split(' ');

//     var action = answer[0];

//     if (answer.length > 1) {
//         var player = answer[1];
//         var playerNum = -1;
//         for (var i = 0 ; i < gameState.numberOfPlayers ; i++) {
//             if (player == gameState.playerNames[i]) {
//                 playerNum = i;
//             }
//         }
//         if (playerNum == -1) {
//             console.log('Invalid player name');
//         }
//     }

//     actions[action]();

//     var ans = prompt('What do you want to know? ');
// }

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));