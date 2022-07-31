import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, skip, Subject, takeUntil } from 'rxjs';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent implements OnInit, OnDestroy {
  table$: BehaviorSubject<string[][] | null> = new BehaviorSubject<
    string[][] | null
  >(null);
  gameInterval!: ReturnType<typeof setInterval>;
  playState$: BehaviorSubject<boolean>;
  restart$: BehaviorSubject<string>;
  nextGeneration$: BehaviorSubject<string>;
  speed$: BehaviorSubject<number>;
  generations$: BehaviorSubject<number>;
  unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private gameState: GameStateService) {
    this.playState$ = this.gameState.getPlayState();
    this.restart$ = this.gameState.getRestart();
    this.nextGeneration$ = this.gameState.getNextGeneration();
    this.speed$ = this.gameState.getSpeed();
    this.generations$ = this.gameState.getGenerations();
  }

  ngOnInit(): void {
    this.initTable();
    this.subscribeToGameState();
  }

  subscribeToGameState() {
    this.playState$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((state) => {
      if (state) {
        this.runGame();
      } else {
        this.stopGame();
      }
    });
    this.restart$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.stopGame();
      this.initTable();
    });
    this.speed$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      if (this.playState$.getValue()) {
        this.stopGame();
        this.runGame();
      }
    });
    this.nextGeneration$.pipe(
      skip(1),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.nextGeneration();
    });
  }

  initTable(): void {
    const numOfCells = Math.floor(window.innerWidth / 17);
    const numOfRows = Math.floor((window.innerHeight - 190) / 17);
    const cells = new Array(numOfCells).fill('dead');
    const rows = new Array(numOfRows).fill('').map(() => [...cells]);
    this.table$.next(rows);
  }

  toggleCell(x: number, y: number) {
    const copyTable = this.table$.getValue();
    if (copyTable) {
      copyTable[x][y] = copyTable[x][y] === 'dead' ? 'live' : 'dead';
      this.table$.next(copyTable);
    }
  }

  runGame() {
    this.gameInterval = setInterval(() => {
      this.nextGeneration();
    }, this.speed$.getValue());
  }

  nextGeneration(): void {
    const copyTable = this.table$.getValue();
    if (copyTable) {
      const nextGeneration = copyTable.map((row, i) => {
        return row.map((cell, j) => {
          const numOfiveNeighbors = this.getNumOfLiveNeighbors(i, j);
          return this.getCellNewState(numOfiveNeighbors, cell);
        });
      });
      this.table$.next(nextGeneration);
      this.gameState.updateGenerations(this.generations$.getValue() + 1);
    }
  }

  getNumOfLiveNeighbors(i: number, j: number) {
    const copyTable = this.table$.getValue();
    if (copyTable) {
      return [
        copyTable[i - 1] ? copyTable[i - 1][j - 1] : 'dead',
        copyTable[i - 1] ? copyTable[i - 1][j] : 'dead',
        copyTable[i - 1] ? copyTable[i - 1][j + 1] : 'dead',
        copyTable[i][j - 1],
        copyTable[i][j + 1],
        copyTable[i + 1] ? copyTable[i + 1][j - 1] : 'dead',
        copyTable[i + 1] ? copyTable[i + 1][j] : 'dead',
        copyTable[i + 1] ? copyTable[i + 1][j + 1] : 'dead',
      ].filter((stat) => stat === 'live').length;
    }
    return 0;
  }

  getCellNewState(neighbors: number, state: string) {
    if (neighbors <= 1 || neighbors > 3) {
      return 'dead';
    } else if (neighbors === 2 || (state === 'live' && neighbors === 3)) {
      return state;
    } else {
      return 'live';
    }
  }

  stopGame(): void {
    clearInterval(this.gameInterval);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

}
