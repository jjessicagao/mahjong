import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class MahjongService {

  readonly baseUrl = 'http://' + window.location.hostname + ':3000/api';
  playerID = '';

  constructor(private http: HttpClient, private cookies: CookieService) { }

  checkID(action: any, errorAction: any) {
    this.playerID = this.cookies.get('playerID');
    this.getStatus().subscribe((data: any) => action(data), () => errorAction());
  }

  addPlayer(name: string, action: any) {
    const response = this.http.post<any>(`${this.baseUrl}/player/${name}`, '');
    response.subscribe((data: any) => {
        this.playerID = data.playerID; 
        action(data);
        this.cookies.set('playerID', this.playerID)
    });
  }

  removePlayer() {
    return this.http.put<any>(`${this.baseUrl}/removePlayer/${this.playerID}`, '');
  }

  dropTile(tile: number) {
    return this.http.put<any>(`${this.baseUrl}/dropTile/${this.playerID}?tile=${tile}`, '');
  }

  pickUpNewTile() {
    return this.http.put<any>(`${this.baseUrl}/pickUpNewTile/${this.playerID}`, '');
  }

  newGame() {
    return this.http.put<any>(`${this.baseUrl}/newGame/${this.playerID}`, '');
  }

  getStatus() {
    return this.http.get<any>(`${this.baseUrl}/status/${this.playerID}`);
  }

  peng() {
    return this.http.put<any>(`${this.baseUrl}/peng/${this.playerID}`, '');
  }

  gang(tile: number) {
    return this.http.put<any>(`${this.baseUrl}/gang/${this.playerID}?tile=${tile}`, '');
  }

  chi(tile1: number, tile2: number) {
    return this.http.put<any>(`${this.baseUrl}/chi/${this.playerID}?tile1=${tile1}&tile2=${tile2}`, '');
  }

  win() {
    return this.http.put<any>(`${this.baseUrl}/win/${this.playerID}`, '');
  }

}
