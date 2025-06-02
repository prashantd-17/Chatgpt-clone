import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopnavComponent } from "./topnav/topnav.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { ChatWindowComponent } from "./chat-window/chat-window.component";

@Component({
  selector: 'app-root',
  imports: [TopnavComponent, SidenavComponent, ChatWindowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chatGPT-clone';

   toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.documentElement.setAttribute('data-theme', 'dark'); // or 'light'

  }









}
