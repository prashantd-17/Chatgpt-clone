import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopnavComponent } from "./topnav/topnav.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { ChatWindowComponent } from "./chat-window/chat-window.component";
import { CommonModule } from '@angular/common';
import { StateServiceService } from '../state-service.service';

@Component({
  selector: 'app-root',
  imports: [TopnavComponent, SidenavComponent, ChatWindowComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chatGPT-clone';
isSidenavCollapsed:boolean = false;

constructor(public stateService:StateServiceService){}

getToggleState(state:boolean){
  this.isSidenavCollapsed = state
}



}
