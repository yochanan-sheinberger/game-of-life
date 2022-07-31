import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private playState$ = new BehaviorSubject<boolean>(false);
  private restart$ = new BehaviorSubject<string>('restart');
  private nextGeneration$ = new BehaviorSubject<string>('next');
  private speed$ = new BehaviorSubject<number>(300);
  private generations$ = new BehaviorSubject<number>(0);

  tooglePlayState(): void {
    this.playState$.next(!this.playState$.getValue());
  }

  getPlayState(): BehaviorSubject<boolean> {
    return this.playState$;
  }

  getRestart(): BehaviorSubject<string> {
    return this.restart$;
  }

  restart(): void {
    this.restart$.next('restart');
    this.playState$.next(false);
    this.generations$.next(0);
  }

  getNextGeneration(): BehaviorSubject<string> {
    return this.nextGeneration$;
  }

  nextGeneration(): void {
    this.nextGeneration$.next('next');
  }

  getSpeed(): BehaviorSubject<number> {
    return this.speed$;
  }

  changeSpeed(speed: number): void {
    this.speed$.next(speed);
  }

  getGenerations(): BehaviorSubject<number> {
    return this.generations$;
  }

  updateGenerations(num: number): void {
    this.generations$.next(num);
  }
}
