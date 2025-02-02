import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import ollama from 'ollama';
import { marked } from 'marked';
import { NavComponent } from './nav/nav.component';

import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  @ViewChild('response', { read: ElementRef }) response!: ElementRef;

  public prompt = '';
  public promptAsked = '';
  // private model = 'deepseek-r1'; //qwen2.5, deepseek-r1, gemma
  private googleModel!: GenerativeModel;

  ngOnInit(): void {
    const genAI = new GoogleGenerativeAI(
      'AIzaSyDfZgIO2jcmQRr-2jB9DnqZP_j3NGVN3D8'
    );
    this.googleModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  public async ask() {
    let responseText = '';
    this.response.nativeElement.innerHTML = 'thinking...🤔';
    this.promptAsked = '';
    if (this.prompt) {
      try {
        // const streamResponse = await ollama.chat({
        //   model: `${this.model}:latest`,
        //   messages: [{ role: 'user', content: this.prompt }],
        //   stream: true,
        // });
        // this.promptAsked = this.prompt;
        // this.prompt = '';

        // for await (const part of streamResponse) {
        //   responseText += part.message.content;
        //   this.response.nativeElement.innerHTML = marked(responseText);
        // }
        // const result = await this.googleModel.generateContent(this.prompt);
        // this.response.nativeElement.innerHTML = marked(result.response.text());

        const chat = this.googleModel.startChat({});
        let result = await chat.sendMessageStream(this.prompt);

        this.promptAsked = this.prompt;
        this.prompt = '';

        for await (const part of result.stream) {
          responseText += part.text();
          this.response.nativeElement.innerHTML = marked(responseText);
        }
      } catch (error) {}
    } else {
      alert('Ask me anything 😁!');
    }
  }
}
