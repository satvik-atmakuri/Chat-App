// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-chat',
//   template: `
//     <div>
//       <h1>Chat App</h1>
//       <div *ngFor="let msg of messages">{{ msg }}</div>
//       <input [(ngModel)]="message" placeholder="Type a message" />
//       <button (click)="sendMessage()">Send</button>
//     </div>
//   `,
//   styleUrls: ['./chat.component.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule]
// })
// export class ChatComponent implements OnInit {
//   private socket: WebSocket | null = null;
//   messages: string[] = [];
//   message: string = '';

//   ngOnInit() {
//     this.socket = new WebSocket('ws://localhost:8000/ws');
//     this.socket.onmessage = (event) => {
//       this.messages.push(event.data);
//     };
//   }

//   sendMessage() {
//     if (this.socket && this.message.trim()) {
//       this.socket.send(this.message);
//       this.message = '';
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Message {
  text: string;
  sentByUser: boolean; // Flag to indicate if the message is sent by the user
}

@Component({
  selector: 'app-chat',
  template: `
    <div>
      <h1>Chat App</h1>
      <div *ngFor="let msg of messages" [ngClass]="{'user-message': msg.sentByUser, 'received-message': !msg.sentByUser}">
        {{ msg.text }}
      </div>
      <input [(ngModel)]="message" placeholder="Type a message" />
      <button (click)="sendMessage()">Send</button>
    </div>
  `,
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit {
  private socket: WebSocket | null = null;
  messages: Message[] = []; // Array to hold chat messages
  message: string = ''; // Current message being typed

  ngOnInit() {
    // Connect to the WebSocket server
    this.socket = new WebSocket('ws://localhost:8000/ws');

    // Listen for incoming messages from the WebSocket
    this.socket.onmessage = (event) => {
      const incomingMessage: Message = { text: event.data, sentByUser: false };
      this.messages.push(incomingMessage); // Add incoming message to messages array
    };
  }

  sendMessage() {
    if (this.socket && this.message.trim()) { // Check if message is not empty
      const outgoingMessage: Message = { text: this.message, sentByUser: true };
      this.messages.push(outgoingMessage); // Add user's message to messages array
      this.socket.send(this.message); // Send message to server
      this.message = ''; // Clear input after sending
    }
  }
}
