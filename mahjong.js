var gameState = {
    numberOfPlayers: 4,
    playerNames: ['player1','player2','player3','player4'],
    allTiles: [], 
    unpickedUp: 0,
    lastDropped: 0,
    unwantedTiles: [0],
    inHandTiles: [[0]],
    laidOutTiles: [[0]],
    playerTurn: 0,
    playerPickUp: true,
    dealer: 0,
    money: []
};

var tilesS = '🀇🀈🀉🀊🀋🀌🀍🀎🀏🀐🀑🀒🀓🀔🀕🀖🀗🀘🀙🀚🀛🀜🀝🀞🀟🀠🀡🀀🀁🀂🀃🀄🀅🀆'
var tiles = '🀇🀈🀉🀊🀋🀌🀍🀎🀏🀐🀑🀒🀓🀔🀕🀖🀗🀘🀙🀚🀛🀜🀝🀞🀟🀠🀡🀀🀁🀂🀃🀄🀅🀆'.split('');
console.log(tiles)
console.log(tilesS)

var actions = {
    showMyTiles: showMyTiles,
    showStatus: showStatus,
    showUnwanted: showUnwanted,
    newGame: newGame,
    dropTile: dropTile,
    pickUpNewTile: pickUpNewTile,
    peng: peng,
    gang: gang,
    chi: chi,
    nextTurn: nextTurn,
    win: win,
    addPlayer: addPlayer,
    removePlayer: removePlayer,
};

function showMyTiles() {
    let myTilesIn = 'In hand: ';
    myTilesIn = numToTiles(gameState.inHandTiles[playerNum], myTilesIn);
    console.log(myTilesIn);
    let myTilesOut = 'Laid out: ';
    myTilesOut = numToTiles(gameState.laidOutTiles[playerNum], myTilesOut);
    console.log(myTilesOut);
}

function numToTiles(numbers, pictures) {
    for (let tile of numbers) {
        pictures += tiles[tile*2] + tiles[tile*2 + 1];
        console.log(pictures);
    }
    return pictures;
}

function showStatus() {
    if (gameState.playerPickUp) {
        var str = 'pick up'
    } else {
        var str = 'drop'
    }
    console.log(gameState.playerNames[gameState.playerTurn] + "'s turn to " + str);
    console.log('Players(' + gameState.numberOfPlayers + '): ' + gameState.playerNames)
    console.log(gameState.playerNames[gameState.dealer] + ' is the dealer this round')
}

function showUnwanted() {
    console.log('Unwanted tiles: ' + gameState.unwantedTiles);
}

function newGame() {
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
}

function shuffleTiles(Unshuffled) {
    console.log(Unshuffled)
    for (let i = 0 ; i < 7 ; i++) {
        var Shuffled = [];
        let left = 0;
        let right = 68;
        while (left < 68 && right < 136) {
            let n = Math.random();
            if (n < 0.5) {
                if (!Unshuffled[left] && Unshuffled[left] != 0) {
                    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                }
                Shuffled.push(Unshuffled[left]);
                left++;
            } else {
                if (!Unshuffled[right] && Unshuffled[right] != 0) {
                    console.log('sdfd' + right)
                    return
                }
                Shuffled.push(Unshuffled[right]);
                right++;
            }
        }
        console.log(left, right)
        if (left == 68) {
            Shuffled.push(...Unshuffled.slice(right,136));
            console.log(Unshuffled.slice(right,136));
        } else {
            Shuffled.push(...Unshuffled.slice(left,68));
            console.log(Unshuffled.slice(left,68))
        }   
        console.log(Shuffled.slice(0,68))
        console.log(Shuffled.slice(69,136))
        console.log(Shuffled.length)
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

function dropTile() {
    let index = answer[2];
    if (playerNum != gameState.playerTurn || gameState.playerPickUp) {
        console.log('Not your turn!');
        return;
    } 
    gameState.lastDropped = gameState.inHandTiles[playerNum][index];
    gameState.inHandTiles[playerNum].splice(index, 1);
    nextTurn();
}

function pickUpNewTile () {
    if (playerNum != gameState.playerTurn || !gameState.playerPickUp) {
        console.log('Not your turn!');
        return;
    } 
    gameState.unwantedTiles.push(gameState.lastDropped);
    gameState.inHandTiles[playerNum].push(gameState.allTiles[unpickedUp]);
    gameState.inHandTiles[playerNum].sort(function(a,b) {
        return a - b
    });
    unpickedUp++;
    playerPickUp = false;
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

function peng() {
    let card = gameState.lastDropped;
    let count = countCard(card, gameState.inHandTiles[playerNum]);
    if (count < 2) {
        console.log('no');
        return;
    }
    let last = gameState.inHandTiles.lastIndexOf(card);
    for (let i = gameState.inHandTiles[playerNum].length - 1 ; i >= 0 ; i--) {
        if (gameState.inHandTiles[playerNum] == card) {
            gameState.inHandTiles[playerNum].splice(i, 1);
        }
    }
    if (count > 3) {
        gameState.inHandTiles[playerNum].splice(last, 0, card);
    }
    gameState.playerTurn = playerNum;
    gameState.laidOutTiles[playerNum].push(card, card, card);
    playerPickUp = false;
}

function gang() { 
    if (gameState.playerTurn == playerNum && !gameState.playerPickUp) {
        var card = answer[2];
        gameState.laidOutTiles[playerNum].push(card);
        if (!gameState.laidOutTiles[playerNum].includes(answer[2])) {
            gameState.laidOutTiles[playerNum].push(card, card, card);
        }
    } else {
        var card = gameState.lastDropped;
        gameState.laidOutTiles[playerNum].push(card, card, card, card);
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

function chi() {
    for (let i = 4 ; i >= 2 ; i++) {
        gameState.laidOutTiles.push(gameState.inHandTiles[playerNum][i]);
        gameState.inHandTiles[playerNum].splice(answer[i], 1);
    }
   nextTurn();
   playerPickup = false;
}

function nextTurn() {
    if (gameState.playerTurn == gameState.numberOfPlayers - 1) {
        gameState.playerTurn = 0;
    } else {
        gameState.playerTurn++;
    }
    gameState.playerPickUp = true;
}

function win() {
    let winning = 1;
    if (gameState.playerTurn == playerNum && gameState.playerPickUp) {
        winning++;
    }
    winning += (gameState.laidOutTiles[playerNum].length + gameState.inHandTiles[playerNum].length - 14);
    if (gameState.laidOutTiles[playerNum].length == 0) {
        winning *= 2;
    }
    if (playerNum == dealer) {
        winning *= 2;
    } else {
        dealer++;
    }
    gameState.money[playerNum] += winning;
    console.log(answer[1] + ' won!!');
    console.log(gameState.inHandTiles[playerNum]);
    console.log('Current moneys:');
    for (let i = 0 ; i < gameState.numberOfPlayers ; i++) {
        console.log(gameState.playerNames[i] + ': ' + gameState.money[i]);
    }
}

function addPlayer() {
    gameState.numberOfPlayers++;
    gameState.playerNames.push(answer[1]);
    gameState.money.push(50);
}

function removePlayer() {
    gameState.numberOfPlayers--;
    gameState.playerNames.splice(playerNum, 1);
    gameState.money.splice(playerNum, 1);
}

const prompt = require('prompt-sync')();
var ans = prompt('What do you want to know? ');
while (ans != 'stop') {
    var answer = ans.split(' ');

    var action = answer[0];

    if (answer.length > 1) {
        var player = answer[1];
        var playerNum = -1;
        for (var i = 0 ; i < gameState.numberOfPlayers ; i++) {
            if (player == gameState.playerNames[i]) {
                playerNum = i;
            }
        }
        if (playerNum == -1) {
            console.log('Invalid player name');
        }
    }

    actions[action]();

    var ans = prompt('What do you want to know? ');
}