import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { HeaderComponent } from './header/header.component';
import { GameBoardComponent } from './game-board/game-board.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ControlPanelComponent,
    HeaderComponent,
    GameBoardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
