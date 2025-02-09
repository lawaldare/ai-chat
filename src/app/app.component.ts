import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
// import ollama from 'ollama';
import { marked } from 'marked';
import { NavComponent } from './nav/nav.component';

import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

interface ChatModel {
  role: string;
  parts: {
    text: string;
  }[];
}

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
  public history: ChatModel[] = [];
  public aiResponse = signal('');

  ngOnInit(): void {
    const genAI = new GoogleGenerativeAI(
      'AIzaSyDfZgIO2jcmQRr-2jB9DnqZP_j3NGVN3D8'
    );
    this.googleModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  public async ask() {
    let responseText = '';
    this.response.nativeElement.innerHTML = 'thinking...🤔';
    this.promptAsked = '';
    if (this.prompt) {
      try {
        // const newUserHistory = { role: 'user', parts: [{ text: this.prompt }] };

        // this.history.push(newUserHistory);

        // const newModelHistory = {
        //   role: 'model',
        //   parts: [{ text: this.aiResponse() }],
        // };

        // this.history.push(newModelHistory);

        // const chat = this.googleModel.startChat({
        //   history: this.history,
        // });

        const result = await this.googleModel.generateContentStream(
          this.prompt
        );

        // let result = await chat.sendMessageStream(this.prompt);

        this.promptAsked = this.prompt;
        this.prompt = '';

        for await (const part of result.stream) {
          responseText += part.text();
          this.response.nativeElement.innerHTML = marked(responseText);
        }

        this.aiResponse.set(responseText);
      } catch (error) {}
    } else {
      alert('Ask me anything 😁!');
    }
  }
}
