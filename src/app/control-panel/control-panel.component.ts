import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelComponent {
  playState$: BehaviorSubject<boolean>;
  speed$: BehaviorSubject<number>;
  generations$: BehaviorSubject<number>;

  constructor(private gameState: GameStateService) {
    this.playState$ = this.gameState.getPlayState();
    this.speed$ = this.gameState.getSpeed();
    this.generations$ = this.gameState.getGenerations();
  }

  togglePlayState(): void {
    this.gameState.tooglePlayState();
  }

  restart(): void {
    this.gameState.restart();
  }

  changeSpeed(e: Event): void {
    const speed = +(e.currentTarget as HTMLInputElement).value;
    this.gameState.changeSpeed(speed);
  }

  nextGeneration(): void {
    this.gameState.nextGeneration();
  }

}
