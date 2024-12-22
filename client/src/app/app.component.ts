import { Component, HostListener } from '@angular/core';
import { MahjongService } from './mahjong.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  status = {
    playerNum: 0,
    inHand: [2, 3, 5, 7, 9, 14, 26, 29],
    laidOut: [[1, 2, 3], [], [7, 7, 7, 7]],
    players: [{name: 'jess', money: 70}, {name: 'jenn', money: -20}, {name: 'jessica', money: 70}],
    lastDropped: 0,
    lastPickedUp: 0,
    unwantedTiles: [1, 8, 10, 11, 14, 15, 16, 17, 20],
    playerTurn: 0,
    playerPickUp: false,
    dealer: 0,
    inGame: false,
    winner: -1,
    winnerInHand: []
  };

  tiles = '🀇🀈🀉🀊🀋🀌🀍🀎🀏🀐🀑🀒🀓🀔🀕🀖🀗🀘🀙🀚🀛🀜🀝🀞🀟🀠🀡🀀🀁🀂🀃🀄🀅🀆'.split('');
  joined = -1;
  selectedTiles: number[] = [];
  
  errorMsg = '';
  showError = false;

  title = 'mahjong';

  constructor (private mahjong: MahjongService) {
    setInterval(() => mahjong.getStatus().subscribe((data:any) => {
      this.status = data;
      if (!this.status.inGame && this.selectedTiles.length > 0) {
        this.selectedTiles=[];
      }
    }), 3000);
  }

  public ngOnInit(): void {
    this.mahjong.checkID(
      (data: any) => {
        this.joined = 1;
        this.status=data;
      }, 
      () => this.joined = 0
      );
  }

  selectTile(index: number) {
    let i = this.selectedTiles.indexOf(index);
    if (i >= 0) {
      this.selectedTiles.splice(i, 1);
    } else {
      this.selectedTiles.push(index);
    }
  }

  numToTiles(numbers: number[]) {
    let pictures = '';
    for (let tile of numbers) {
        pictures += this.tiles[tile*2] + this.tiles[tile*2 + 1];
    }
    return pictures;
  }

  addPlayer(name: string) {
    this.mahjong.addPlayer(name, (data:any) => {
      this.joined = 1;
      this.status = data;
    });
  }

  dropTile() {
    if (this.selectedTiles.length == 1) {
      let tile = this.status.inHand[this.selectedTiles[0]];
      this.mahjong.dropTile(tile).subscribe((data:any) => {
        this.status = data;
        this.selectedTiles = [];
      },
      (error: any) => {
        this.errorMsg = error;
        this.showError = true;
      });
    }
  }

  pickUpNewTile() {
    this.mahjong.pickUpNewTile().subscribe((data:any) => {
      this.status = data;
      this.selectedTiles = [];
    },
    (error: any) => {
      this.errorMsg = error;
      this.showError = true;
    });
  }

  newGame() {
    this.mahjong.newGame().subscribe((data:any) => {
      this.status = data
    },
    (error: any) => {
      this.errorMsg = error;
      this.showError = true;
    });
  }

  peng() {
    this.mahjong.peng().subscribe((data:any) => {
      this.status = data;
      this.selectedTiles = [];
    },
    (error: any) => {
      this.errorMsg = error;
      this.showError = true;
    });
  }

  gang() {
    if (this.selectedTiles.length == 0 && this.status.playerPickUp ||
       this.selectedTiles.length == 1 && !this.status.playerPickUp) {
      let tile = this.status.inHand[this.selectedTiles[0]];
      this.mahjong.gang(tile).subscribe((data:any) => {
        this.status = data;
        this.selectedTiles = [];
      },
      (error: any) => {
        this.errorMsg = error;
        this.showError = true;
      });
    }
  }

  chi() {
    if (this.selectedTiles.length == 2) {
      let tile1 = this.status.inHand[this.selectedTiles[0]];
      let tile2 = this.status.inHand[this.selectedTiles[1]];
      this.mahjong.chi(tile1, tile2).subscribe((data:any) => {
        this.status = data;
        this.selectedTiles = [];
      },
      (error: any) => {
        this.errorMsg = error;
        this.showError = true;
      });
    }
  }

  win() {
    this.mahjong.win().subscribe((data:any) => {
      this.status = data;
      this.selectedTiles = [];
    })
  }

  closePopup() {
    this.showError = false;
  }
}
