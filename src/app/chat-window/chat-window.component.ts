import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { OpenaiChatService } from '../openai-chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import hljs from 'highlight.js';
// import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml'; // html/xml
import css from 'highlight.js/lib/languages/css';
import { Title } from '@angular/platform-browser';

interface ChatHistory {
  id : string;
  role: 'user' | 'assistant';
  content: string;
  htmlContent?: SafeHtml; // only for assistant
  title?: string;
}

export interface Chat {
  chatId: string;
  title: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
  }[];
}

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
}


declare const puter: any;

@Component({
  selector: 'app-chat-window',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss',
})
export class ChatWindowComponent implements OnInit, AfterViewChecked {
  userPrompt: string = '';
  chatHistory: ChatHistory[] = [];
  rawMarkdown: string = '';
  formattedResponse: SafeHtml = '';
  chatTitle: string = '';
  allChats: any = {};

  constructor(
    private openAiChatService: OpenaiChatService,
    private sanitizer: DomSanitizer,
    private titleService: Title
  ) {}

  ngOnInit() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      this.chatHistory = parsed.map((msg: ChatHistory) => {
        if (msg.role === 'assistant') {
          return {
            ...msg,
            htmlContent: this.sanitizeMarkdown(msg.content),
          };
        }
        return msg;
      });
      console.log(this.chatHistory);
    }
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('html', html);
    hljs.registerLanguage('css', css);

    (marked as any).setOptions({
      highlight: (code: string, lang: string) => {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    });
  }

  sanitizeMarkdown(md: string): SafeHtml {
    const html: any = marked(md);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onResponseFromAI(markdownResponse: string): void {
    this.rawMarkdown = markdownResponse;
    this.formattedResponse = this.sanitizeMarkdown(markdownResponse);
  }

  sendPrompt() {
    if (!this.userPrompt.trim()) return;

    this.chatHistory.push({id : 'chat-' + Date.now() , role: 'user', content: this.userPrompt });
    this.saveHistory();

    puter.ai.chat(this.userPrompt).then((response: any) => {
      const aiResponse = response?.message?.content || 'No response';
      const sanitized = this.sanitizeMarkdown(aiResponse);

      if (this.chatTitle === '' && response) {
        puter.ai
          .chat(
            `Summarize this in 5 words or less: ${response?.message?.content}`
          )
          .then((titleRes: any) => {
            this.chatTitle = titleRes?.message?.content || 'ChatGPTClone';
            this.titleService.setTitle(this.chatTitle);
            console.log('=========', this.chatTitle);
          });
      }
      this.chatHistory.push({
        id : 'chat-' + Date.now(),
        role: 'assistant',
        content: aiResponse,
        htmlContent: sanitized,
        title: this.chatTitle.trim(),
      });

      this.saveHistory();
    });

        // const body = {
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'user', content: this.userPrompt.trim() }],
    // };

    // this.openAiChatService.postUserPrompt(body).subscribe((res: any) => {
    //   const aiResponse = res.choices[0]?.message.content || 'No response';
    //   const sanitized = this.sanitizeMarkdown(aiResponse);

    //   // Add assistant response with both raw and sanitized content
    //   this.chatHistory.push({
    //     role: 'assistant',
    //     content: aiResponse,
    //     htmlContent: sanitized
    //   });
    // });

    this.userPrompt = '';
  }

  ngAfterViewChecked() {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }

  saveHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
  }
}
