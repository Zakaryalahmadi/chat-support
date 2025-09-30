package com.example.springbootwebsocketangular.modules.supportChat.controller;


import com.example.springbootwebsocketangular.modules.supportChat.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @MessageMapping("chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage msg) {

        System.out.println("Message received from " + msg.getSender() + ": " + msg.getContent());

        return msg;
    }

    @MessageMapping("chat.addUser")
    @SendTo("/topic/chat")
    public ChatMessage addUser(@Payload ChatMessage msg, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", msg.getSender());

        System.out.println("User joined: " + msg.getSender());

        return msg;
    }
}