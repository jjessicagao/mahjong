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


  difficulty = 'easy';
  title = 'sudoku';
  selectedRow = -1;
  selectedCol = -1;
  puzzle: number[][] = [];

  current: number[][]=[];
  wrong: boolean[][]=[];
  won = false;

  constructor (private mahjong: MahjongService) {
    setInterval(() => mahjong.getStatus().subscribe((data:any) => this.status = data), 3000);
  }

  // selectCell (i:number, j:number) {
  //   if (this.won) {
  //     return;
  //   }
  //   this.selectedRow = i;
  //   this.selectedCol = j;
  // }
  
  // @HostListener('window:keypress', ['$event'])
  // keyPress(event: KeyboardEvent) {
  //   if (this.won) {
  //     return;
  //   }
  //   const input = event.charCode - 48;
  //   if (input >= 1 && input <= 9) {   
  //     this.pickNumber(input);
  //   } else {
  //     event.preventDefault();
  //   }
  // }

  public ngOnInit(): void {
    this.mahjong.checkID(
      (data: any) => {
        this.joined = 1;
        this.status=data;
      }, 
      () => this.joined = 0
      );
  }

  numToTiles(numbers: number[]) {
    let pictures = '';
    for (let tile of numbers) {
        pictures += this.tiles[tile*2] + this.tiles[tile*2 + 1];
    }
    return pictures;
  }

  addPlayer(name: string) {
    // check trimmed name
    this.mahjong.addPlayer(name, (data:any) => {
      this.joined = 1;
      this.status = data;
    });
  }

  dropTile(index: string) {
    let tile = this.status.inHand[parseInt(index) - 1];
    this.mahjong.dropTile(tile).subscribe((data:any) => this.status = data);
  }

  pickUpNewTile() {
    this.mahjong.pickUpNewTile().subscribe((data:any) => this.status = data);
  }

  newGame() {
    this.mahjong.newGame().subscribe((data:any) => this.status = data);
  }

  peng() {
    this.mahjong.peng().subscribe((data:any) => this.status = data);
  }

  gang(index: string) {
    let tile = this.status.inHand[parseInt(index) - 1];
    this.mahjong.gang(tile).subscribe((data:any) => this.status = data);
  }

  chi(index1: string, index2: string) {
    let tile1 = this.status.inHand[parseInt(index1) - 1];
    let tile2 = this.status.inHand[parseInt(index2) - 1];
    this.mahjong.chi(tile1, tile2).subscribe((data:any) => this.status = data);
  }

  win() {
    this.mahjong.win().subscribe((data:any) => this.status = data);
  }

  // pickNumber (n: number) {
  //   if (this.won) {
  //     return;
  //   }
  //   if (this.puzzle[this.selectedRow][this.selectedCol] == 0) {
  //     this.current[this.selectedRow][this.selectedCol] = n;
  //     for (let row = 0 ; row < 9 ; row++) {
  //       loop:
  //       for (let col = 0 ; col < 9 ; col++) {
  //         const num = this.current[row][col];
  //         if (this.puzzle[row][col] != 0 || num == 0) {
  //           this.wrong[row][col] = false;
  //           continue;
  //         }
  //         for (let i = 0 ; i < 9 ; i++) {
  //           if (i != col && this.current[row][i] == num || i != row && this.current[i][col] == num) {
  //             this.wrong[row][col] = true;
  //             continue loop;
  //           }
  //         }
  //         const top = row - row % 3;
  //         const left = col - col % 3;
  //         for (let i = top ; i < top + 3 ; i++) {
  //           for (let j = left ; j < left + 3 ; j++) {
  //             if ((i != row || j != col) && this.current[i][j] == num) {
  //               this.wrong[row][col] = true;
  //               continue loop;
  //             }
  //           }
  //         }
  //         this.wrong[row][col] = false;
  //       }
  //     }
  //   }
  //   for (let row = 0 ; row < 9 ; row++) {
  //     for (let col = 0 ; col < 9 ; col++) {
  //       if (this.current[row][col] == 0 || this.wrong[row][col]) {
  //         this.won = false;
  //         return;
  //       }
  //     }
  //   }
  //   this.won = true;
  // }

  // deleteNumber () {
  //   this.pickNumber(0);
  // }

  // askNewGame () {
  //   if (!this.won) {
  //     if (!confirm('Are you sure?')) {
  //       return;
  //     }
  //   }
  //   let count = 35;
  //   if (this.difficulty == "med") {
  //     count = 45;
  //   } else if (this.difficulty == "hard") {
  //     count = 55;
  //   }
  //   this.newGame(count); 
  // }

  // newGame (count: number) {
  //   const solution = SudokuSolver.generate();
  //   const masked = SudokuSolver.carve(solution, count);
  //   this.selectedRow = -1;
  //   this.selectedCol = -1;
  //   this.puzzle = masked;
  //   this.current = this.puzzle.map(function(arr) {
  //     return arr.slice();
  //   });
  //   this.wrong = new Array(9).fill(false).map(() => new Array(9));
  //   this.won = false;
  // }
}
