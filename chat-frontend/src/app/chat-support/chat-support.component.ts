import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-support.component.html',
  styleUrl: './chat-support.component.scss',
})
export class ChatSupportComponent implements OnInit {
  title = 'frontend';
  username: string = ''; // Stores the username entered by the user
  message: string = ''; // Stores the message being typed by the user
  messages: any[] = []; // Stores all the chat messages
  isConnected = false; // Tracks whether the user is connected to the WebSocket
  connectingMessage = ''; // Message to show while connecting
  isConnecting = false; // Track if we're in the process of connecting

  constructor(
    private websocketService: WebsocketService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('AppComponent constructor called');
  }

  ngOnInit(): void {
    console.log('AppComponent ngOnInit called');

    // Subscribe to messages observable to receive messages from the WebSocket service
    this.websocketService.messages$.subscribe((message) => {
      if (message) {
        // Log and add the received message to the array of messages
        console.log('Message received in component:', message);
        console.log(
          `Message received from ${message.sender}: ${message.content}`
        );
        this.messages.push(message);
        this.cdr.markForCheck(); // Force change detection
      }
    });

    // Subscribe to connection status observable to monitor connection status
    this.websocketService.connectionStatus$.subscribe((connected) => {
      console.log('Connection status changed:', connected);
      this.isConnected = connected; // Update the connection status
      if (connected) {
        this.connectingMessage = ''; // Clear the connecting message once connected
        this.isConnecting = false; // Stop the connecting state
        console.log('WebSocket connection established');
      } else {
        this.connectingMessage = 'Disconnected';
        this.isConnecting = false;
      }
      this.cdr.markForCheck(); // Force change detection
    });
  }

  connect() {
    if (!this.username.trim()) {
      alert('Please enter a username');
      return;
    }
    
    if (this.isConnecting) {
      console.log('Already connecting, please wait...');
      return;
    }
    
    console.log(
      'Attempting to connect to WebSocket at http://localhost:8080/ws with username:',
      this.username
    );
    this.connectingMessage = 'Connecting...';
    this.isConnecting = true;
    this.cdr.markForCheck(); // Force change detection
    this.websocketService.connect(this.username); // Call the WebSocket service to connect
  }

  sendMessage() {
    if (this.message && this.message.trim()) {
      this.websocketService.sendMessage(this.username, this.message); // Send the message via WebSocket service
      this.message = ''; // Clear the message input after sending
    }
  }

  getAvatarColor(sender: string): string {
    // Array of colors to choose from
    const colors = [
      '#2196F3',
      '#32c787',
      '#00BCD4',
      '#ff5652',
      '#ffc107',
      '#ff85af',
      '#FF9800',
      '#39bbb0',
    ];
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
      // Generate a hash from the sender's name
      hash = 31 * hash + sender.charCodeAt(i); // Create a hash based on the username
    }
    // Return a color from the array based on the hash value
    return colors[Math.abs(hash % colors.length)];
  }
}
