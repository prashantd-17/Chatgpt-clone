import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpenaiChatService {

  constructor(private http:HttpClient) { }

  apiUrl:string = "https://openrouter.ai/api/v1/chat/completions";
  apiKey:string = "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";

  headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    });
    
    postUserPrompt(body:any){
    return this.http.post(this.apiUrl,body, {headers: this.headers})
  }


}
