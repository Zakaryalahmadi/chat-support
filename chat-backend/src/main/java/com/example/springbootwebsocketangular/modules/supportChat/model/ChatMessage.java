package com.example.springbootwebsocketangular.modules.supportChat.model;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String sender;
    private String content;
    private ChatMessageType type;
}