# 🍅 Tomato Support — Agentic AI Customer Support Assistant

An **Agentic AI customer support application** built with **Java, Spring Boot, Spring AI, and OpenRouter**.

The project started as an AI-powered customer support assistant and has evolved into a practical exploration of **LLM tool calling, multi-tool orchestration, and Agentic AI systems**.

The application can use external tools for calculations, live weather lookup, and currency exchange instead of relying only on the model's internal knowledge.

## 📸 Application Preview

![Tomato Support](screenshots/tomato-support.png)

## 🧩 Current Project Structure

The project currently includes three Spring AI tools:

- 🧮 `CalculatorTool`
- 🌦️ `WeatherTool`
- 💱 `CurrencyExchangeTool`

![Project Structure](screenshots/project-structure.png)

## 🚀 Current Capabilities

### 🧮 Calculator Tool

Used for arithmetic operations such as addition, subtraction, multiplication, and division.

The LLM is instructed to use the calculator tool for arithmetic instead of calculating directly.

### 🌦️ Live Weather Tool

Uses the **OpenWeather API** to retrieve live weather information for a city.

The tool can retrieve temperature, feels-like temperature, humidity, weather condition, and wind speed.

### 💱 Currency Exchange Tool

Uses the **Frankfurter API** to retrieve the latest exchange rate between two currencies.

Examples include:

```text
INR → USD
USD → INR
INR → EUR
```

## 🤖 Tool Calling

The project demonstrates how an LLM can decide when it needs an external tool.

```text
User
  ↓
LLM
  ↓
Select Tool
  ↓
Execute Tool
  ↓
Observe Result
  ↓
LLM
  ↓
Final Response
```

The model can also call multiple tools for a single request.

## 🔄 Multi-Tool Orchestration

A single request can require multiple weather, currency, and calculator calls.

For example:

1. Get weather for multiple cities.
2. Get multiple exchange rates.
3. Perform multiple calculations.
4. Use retrieved exchange-rate data in a calculation.
5. Combine all results into one response.

This demonstrates the basic Agentic AI loop:

```text
Goal
 ↓
Decide
 ↓
Act
 ↓
Observe
 ↓
Decide
 ↓
Act
 ↓
Observe
 ↓
Final Response
```

## 📊 Multi-Tool Test

The agent was tested through Postman with a request requiring multiple weather, currency, and calculator tool calls.

![Postman Multi-Tool Results](screenshots/postman-results.png)

The test successfully demonstrated:

- `WeatherTool` called multiple times
- `CurrencyExchangeTool` called multiple times
- `CalculatorTool` called multiple times
- Tool results combined into a final response
- Live weather and exchange-rate information used in the final response

## 🧠 System Prompt

The agent is instructed to use the appropriate external tool instead of inventing information:

```text
You are a helpful AI assistant with access to external tools.

Follow these rules:
1. For arithmetic calculations, ALWAYS use the calculator tool.
2. For current weather, ALWAYS use the currentWeather tool.
3. For currency conversion or exchange rates, ALWAYS use the currency exchange tool.
4. You may call multiple tools when solving a multi-step request.
5. After receiving tool results, explain the answer naturally.
6. Never invent current weather or exchange-rate information.
```

## 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Spring Boot    │
                         │    REST API      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Spring AI     │
                         │    ChatClient    │
                         └────────┬─────────┘
                                  │
                            Tool Selection
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
       │ Calculator  │     │   Weather   │     │  Currency   │
       │    Tool     │     │    Tool     │     │    Tool     │
       └─────────────┘     └─────────────┘     └─────────────┘
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                         ┌──────────────────┐
                         │   Tool Results   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │       LLM        │
                         │ Observe → Decide │
                         │ → Act → Observe  │
                         └──────────────────┘
```

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Language | Java |
| Backend | Spring Boot |
| AI Framework | Spring AI |
| LLM Provider | OpenRouter |
| Weather API | OpenWeather |
| Currency API | Frankfurter |
| Frontend | HTML, CSS, JavaScript |
| Build Tool | Maven |
| API Testing | Postman |
| Version Control | Git & GitHub |

## 📂 Project Structure

```text
FDE/
├── screenshots/
│   ├── project-structure.png
│   ├── postman-results.png
│   └── tomato-support.png
├── src/
│   └── main/
│       ├── java/
│       │   └── org/example/
│       │       ├── aiTools/
│       │       │   ├── CalculatorTool.java
│       │       │   ├── CurrencyExchangeTool.java
│       │       │   └── WeatherTool.java
│       │       ├── Main.java
│       │       ├── SummarizeController.java
│       │       └── SummarizeService.java
│       └── resources/
│           ├── application.properties
│           └── static/
│               ├── index.html
│               ├── style.css
│               └── script.js
├── .gitignore
├── pom.xml
└── README.md
```

## 🔐 Environment Variables

API keys are **not stored in source code**.

```properties
spring.ai.openai.api-key=${OPENROUTER_API_KEY}
weather.api.key=${OPENWEATHER_API_KEY}
```

Configure them in IntelliJ or your shell:

```bash
export OPENROUTER_API_KEY="YOUR_OPENROUTER_API_KEY"
export OPENWEATHER_API_KEY="YOUR_OPENWEATHER_API_KEY"
```

Frankfurter does not require an API key for the current integration.

> Never commit API keys or other secrets to GitHub.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KunjMaheshwari/Customer-Support-Assistant.git
cd Customer-Support-Assistant
```

### 2. Configure environment variables

```text
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

### 3. Run the application

```bash
./mvnw spring-boot:run
```

Or run the `Main` class from IntelliJ IDEA.

### 4. Open the application

```text
http://localhost:8080
```

## 🔌 API

### Chat Endpoint

```http
POST /api/chat
```

Request:

```http
Content-Type: text/plain
```

Example:

```text
What's the weather in Vidisha?
```

The LLM determines whether a tool is required and invokes the appropriate tool.

## 🎯 What This Project Demonstrates

- Why an LLM cannot directly perform external actions
- LLM = Brain, Tools = Hands
- Tools and Function Calling
- Natural Language → Structured Tool Calls
- Tool Calling with Spring AI
- Calculator Tool
- Live Weather Tool
- Currency Conversion Tool
- Multiple Tool Calls for a Single Request
- The Tool Calling Loop
- Information Tools vs Action Tools
- When an LLM becomes an AI Agent
- AI Agents vs Workflows
- Goal → Decide → Act → Observe
- Tool permissions and security
- Practical Agentic AI architecture

## 🔮 Next Step: AI Website Builder Agent

The next stage is to extend the tool-calling architecture into an **AI Website Builder Agent**.

Planned file-system tools:

- `createDirectory`
- `writeFile`
- `readFile`
- `listFiles`

The agent will be designed around:

```text
User Goal
   ↓
Plan
   ↓
Create Directory
   ↓
Write Files
   ↓
Read Files
   ↓
List Files
   ↓
Observe Results
   ↓
Modify / Continue
   ↓
Complete Website
```

Security considerations will include:

- Agent sandboxing
- Path traversal protection
- Tool permissions
- Safe file-system access
- Human-in-the-loop controls

## 👨‍💻 Author

**Kunj Maheshwari**

GitHub: [KunjMaheshwari](https://github.com/KunjMaheshwari)

---

⭐ If you find this project interesting, consider giving the repository a star.
