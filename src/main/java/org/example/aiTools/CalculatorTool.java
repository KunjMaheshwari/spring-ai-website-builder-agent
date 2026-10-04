package org.example.aiTools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

@Component
public class CalculatorTool {
    @Tool(description = "Performs arithmetic calculations supported operations:\n" +
            "- Add\n" +
            "- Subtract\n" +
            "- Divide\n" +
            "- Multiply")
    public double calculate(
            @ToolParam(description = "Operation: add, subtract, divide, multiply")
            String operation,
            @ToolParam(description = "First Number")
            double a,
            @ToolParam(description = "Second Number")
            double b) {
        System.out.println("Calculator tool called.");
        if (operation.equals("add")) {
            return a + b;
        } else if (operation.equals("subtract")) {
            return a - b;
        } else if (operation.equals("divide")) {
            return a / b;
        } else if (operation.equals("multiply")) {
            return a * b;
        } else {
            throw new IllegalArgumentException("Invalid operation: " + operation);
        }

    }
}
