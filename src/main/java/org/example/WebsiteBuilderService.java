package org.example;

import org.example.aiTools.CalculatorTool;
import org.example.aiTools.CurrencyExchangeTool;
import org.example.aiTools.WeatherTool;
import org.example.aiTools.WebsiteTools;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WebsiteBuilderService {

    private ChatClient chatClient;
    private WebsiteTools websiteTools;

    public WebsiteBuilderService(ChatClient.Builder builder, WebsiteTools websiteTools){
        this.chatClient = builder.build();
        this.websiteTools = websiteTools;
    }

    private List<Message> history = new ArrayList<>();

    private static final String SYSTEM_PROMPT = """
        You are an AI Website Builder Agent.

        Your job is to create complete websites based on the user's requirements.
        You have access to tools that allow you to create directories, write files,
        read files, and list files inside a secure website workspace.

        Follow these rules:

        1. Understand the user's website requirements before taking action.
        2. Plan the website structure before creating files.
        3. Use the available file-system tools to build the website.
        4. Create a separate directory for each website project.
        5. Use createDirectory to create required directories.
        6. Use writeFile to create HTML, CSS, and JavaScript files.
        7. Use readFile to inspect files when you need to verify or modify their contents.
        8. Use listFiles to inspect the current website structure.
        9. You may call multiple tools in sequence when building a website.
        10. After creating files, verify the important files using readFile or listFiles.
        11. Keep all generated files inside the provided website workspace.
        12. Never attempt to access files outside the website workspace.
        13. Never use path traversal such as ../ to access files outside the workspace.
        14. Do not delete or modify unrelated files.
        15. If the user's requirements are unclear, ask for clarification before building.
        16. Generate clean, responsive, and well-structured HTML, CSS, and JavaScript.
        17. Prefer semantic HTML and accessible UI elements.
        18. Keep the generated code maintainable and easy to understand.
        19. After completing the website, summarize what was created and mention the
            important files and directories.
        20. Do not claim that a file was created or modified unless the corresponding
            tool call successfully completed.

        Follow this general workflow:

        Understand → Plan → Create Directories → Write Files → Read/List Files →
        Verify → Improve if necessary → Report Completion

        You are an agent, so do not simply describe how the website could be built.
        Actually use the available tools to build it inside the workspace.
        """;

    public String generateWebsite(String message){

        history.add(new UserMessage(message));
        String output = chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .tools(websiteTools)
                .messages(history)
                .call().content();

        history.add(new AssistantMessage(output));
        return output;
    }
}