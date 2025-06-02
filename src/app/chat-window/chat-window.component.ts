import { Component, OnInit } from '@angular/core';
import { OpenaiChatService } from '../openai-chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import hljs from 'highlight.js';


interface ChatHistory {
  role: 'user' | 'assistant';
  content: string;
  htmlContent?: SafeHtml; // only for assistant
}


@Component({
  selector: 'app-chat-window',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})

export class ChatWindowComponent implements OnInit {

  userPrompt:string = ''
  chatHistory:ChatHistory[] = [];
   rawMarkdown: string = '';
  formattedResponse: SafeHtml = '';

  constructor(private openAiChatService:OpenaiChatService, private sanitizer:DomSanitizer){};

  ngOnInit(){
    (marked as any).setOptions({
  highlight: (code: string, lang: string) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});
  }



  sanitizeMarkdown(md: string): SafeHtml {
  const html:any = marked(md);
  return this.sanitizer.bypassSecurityTrustHtml(html);
}

 onResponseFromAI(markdownResponse: string): void {
    this.rawMarkdown = markdownResponse;
    this.formattedResponse = this.sanitizeMarkdown(markdownResponse);
  }

sendPrompt() {
  if (!this.userPrompt.trim()) return;

  // Add user's prompt to chat history
  this.chatHistory.push({ role: 'user', content: this.userPrompt });

  const body = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: this.userPrompt.trim() }],
  };

  this.openAiChatService.postUserPrompt(body).subscribe((res: any) => {
    const aiResponse = res.choices[0]?.message.content || 'No response';
    const sanitized = this.sanitizeMarkdown(aiResponse);

    // Add assistant response with both raw and sanitized content
    this.chatHistory.push({
      role: 'assistant',
      content: aiResponse,
      htmlContent: sanitized
    });
  });

  this.userPrompt = '';
}

}
