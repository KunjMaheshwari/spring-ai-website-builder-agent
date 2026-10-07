package org.example;

import org.example.aiTools.CalculatorTool;
import org.example.aiTools.CurrencyExchangeTool;
import org.example.aiTools.WeatherTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.*;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final CalculatorTool calculatorTool;
    private final WeatherTool weatherTool;
    private final CurrencyExchangeTool currencyExchangeTool;

    public ChatService(
            ChatClient.Builder builder,
            CalculatorTool calculatorTool,
            WeatherTool weatherTool,
            CurrencyExchangeTool currencyExchangeTool
    ) {
        this.chatClient = builder.build();
        this.calculatorTool = calculatorTool;
        this.weatherTool = weatherTool;
        this.currencyExchangeTool = currencyExchangeTool;
    }

    private final List<Message> history = new ArrayList<>();

//    private final String SYSTEM_PROMPT = """
//You are a professional customer support executive for "Tomato", a food delivery application.
//
//Your job is to respond to customer queries related ONLY to:
//- Food ordering
//- Order-related queries
//- Refunds and cancellations
//- Order tracking and delivery status
//- Tomato's company policies
//
//Instructions:
//1. Always respond professionally, politely, and concisely.
//2. If the customer is angry, frustrated, upset, or reports a problem, acknowledge their concern before providing the solution. Use empathetic language such as:
//   - "I understand your concern."
//   - "I'm sorry you had to go through this."
//   - "I understand how frustrating this can be."
//3. Provide a clear and helpful response that directly addresses the customer's query.
//4. Do not make up information, policies, refund amounts, order statuses, or guarantees that are not provided in the customer's query or available system information.
//5. If the query cannot be resolved with the available information, politely ask the customer for the necessary details.
//6. If the customer asks something unrelated to food ordering, orders, refunds, tracking, or Tomato's policies, do not answer the question. Respond only with:
//   "I'm sorry, I can only assist with Tomato's food ordering, order, refund, tracking, and policy-related queries."
//7. Keep every response to exactly ONE line.
//8. Do not use bullet points, headings, or multiple paragraphs.
//
//Customer Query:
//""";

//    private static final String SYSTEM_PROMPT = """
//        You are a helpful AI assistant with access to external tools.
//
//        Follow these rules:
//        1. For arithmetic calculations, ALWAYS use the calculator tool.
//        2. For current weather, ALWAYS use the currentWeather tool.
//        3. For currency conversion or exchange rates, ALWAYS use the currency exchange tool.
//        4. You may call multiple tools when solving a multi-step request.
//        5. After receiving tool results, explain the answer naturally.
//        6. Never invent current weather or exchange-rate information.
//        """;

    private static final String SYSTEM_PROMPT = """
            You are a funny AI Assistant. You reply everything sarcastically.
            """;

    public Flux<String> chat(String message) {

//        String prompt = "You are a customer support executive of our food delivery application Tomato. Respond to customer query professionally. If the user is furious or angry or has any issue, use words like I understand your concern or I am sorry you have to go through this and so on, then solve the customer query and give a response. Do not Respond to any other messages which are not related to:\n" +
//                "- ordering food\n" +
//                "- query\n" +
//                "- refund query\n" +
//                "- order tracking status query\n" +
//                "- the company policy query. Always respond in 1 line. Below is customer query - " + message;

        //history.add(new UserMessage(message));

        /*
         * Store the complete AI response so that
         * it can be added to the conversation history
         * after streaming finishes.
         */
        StringBuilder fullResponse = new StringBuilder();

        /*
         * Add the user's message to the conversation history.
         *
         * IMPORTANT:
         * This should happen only once.
         */
        history.add(new UserMessage(message));

        /*
         * Start the Spring AI streaming response.
         */
        Flux<String> response = chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .tools(
                        calculatorTool,
                        weatherTool,
                        currencyExchangeTool
                )
                .messages(history)
                //.user(message)
                .stream()
                .content()

                /*
                 * This executes every time Spring AI
                 * receives a new chunk from the model.
                 */
                .doOnNext(chunk -> {

                    System.out.println(
                            "STREAM CHUNK: " + chunk
                    );

                    fullResponse.append(chunk);
                })

                /*
                 * This executes only after the complete
                 * streaming response has finished.
                 */
                .doOnComplete(() -> {

                    history.add(
                            new AssistantMessage(
                                    fullResponse.toString()
                            )
                    );

                    System.out.println(
                            "STREAM COMPLETE"
                    );
                })

                /*
                 * Log streaming errors.
                 */
                .doOnError(error -> {

                    System.err.println(
                            "STREAM ERROR: " + error.getMessage()
                    );
                });


        //history.add(new AssistantMessage(fullResponse));
        return response;
    }
}

/*
We have 2 types of Roles -
1. User role
2. Assistant role

Good System Role -
1. Role
2. Task
3. Behaviour
4. Constraints
 */