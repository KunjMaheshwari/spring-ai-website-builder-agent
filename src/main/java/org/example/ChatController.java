package org.example;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

//    public SummarizeController(SummarizeService summarizeService){
//        this.summarizeService = summarizeService;
//    }

    @PostMapping(
            value = "/chat",
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    public Flux<String> chat(@RequestBody String message) {

        return chatService.chat(message);
    }
}