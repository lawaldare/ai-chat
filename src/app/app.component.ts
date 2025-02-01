import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import ollama from 'ollama';
import { marked } from 'marked';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  @ViewChild('response', { read: ElementRef }) response!: ElementRef;

  public prompt = '';
  public promptAsked = '';

  public async ask() {
    let responseText = '';
    try {
      const streamResponse = await ollama.chat({
        model: 'deepseek-r1:latest',
        messages: [{ role: 'user', content: this.prompt }],
        stream: true,
      });
      this.promptAsked = this.prompt;
      this.prompt = '';

      for await (const part of streamResponse) {
        responseText += part.message.content;
        this.response.nativeElement.innerHTML = marked(responseText);
      }
    } catch (error) {}
  }
}
