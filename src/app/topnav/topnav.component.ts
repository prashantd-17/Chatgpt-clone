import { Component } from '@angular/core';
import { StateServiceService } from '../../state-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topnav',
  imports: [CommonModule],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss'
})
export class TopnavComponent {

  constructor(public stateService:StateServiceService){}

     toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.documentElement.setAttribute('data-theme', 'dark'); // or 'light'

  }
}
