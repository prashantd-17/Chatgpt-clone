import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { StateServiceService } from '../../state-service.service';
interface ChatSidebarItem {
  chatId: string;
  title: string;
  dateGroup: string;
}
@Component({
  selector: 'app-sidenav',
  imports: [CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {

  allChats:any = {}
  sidebarChats: { [group: string]: ChatSidebarItem[] } = {};


  constructor(public stateService:StateServiceService){}

  ngOnInit(){
    this.allChats = localStorage.getItem('allChats');
    console.log('====', this.allChats)
  }

  loadSidebarChatList(){
    const raw = localStorage.getItem('allChats');
    this.allChats = raw ? JSON.parse(raw) : {};
  const grouped: { [key: string]: ChatSidebarItem[] } = {};

for (const chatId in this.allChats) {
    const messages = this.allChats[chatId];
    const assistantMsg = messages.find((m: any) => m.role === 'assistant' && m.title);
    const title = assistantMsg?.title || 'New Chat';

    // Use first message timestamp for grouping
    const firstMsgTimestamp = messages[0]?.timestamp || parseInt(chatId.replace('chat-', '')) || Date.now();
    const dateGroup = this.getDateGroup(firstMsgTimestamp);

    const item: ChatSidebarItem = {
      chatId,
      title,
      dateGroup
    };

    if (!grouped[dateGroup]) {
      grouped[dateGroup] = [];
    }
    grouped[dateGroup].push(item);
  }

  this.sidebarChats = grouped;
  }

  getDateGroup(timestamp: number): string {
  const today = new Date();
  const date = new Date(timestamp);
  const oneDay = 24 * 60 * 60 * 1000;

  const diffDays = Math.floor((today.getTime() - date.getTime()) / oneDay);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString(); // or format as needed
}

toggleSidenav(){
}


}
