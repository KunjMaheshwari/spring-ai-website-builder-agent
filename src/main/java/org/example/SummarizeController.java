package org.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class SummarizeController {

    @Autowired
    private SummarizeService summarizeService;

//    public SummarizeController(SummarizeService summarizeService){
//        this.summarizeService = summarizeService;
//    }

    @PostMapping("/chat")
    public String chat(@RequestBody String message){
        return summarizeService.chat(message);
    }
}
