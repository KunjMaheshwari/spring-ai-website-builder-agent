package org.example.aiTools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class WeatherTool {

    private final RestClient restClient;
    private final String apiKey;

    public WeatherTool(
            RestClient.Builder builder,
            @Value("${weather.api.key}") String apiKey
    ) {
        this.restClient = builder
                .baseUrl("https://api.openweathermap.org/data/2.5")
                .build();

        this.apiKey = apiKey;
    }

    @Tool(description = "Get the current weather for a city")
    public String getWeather(
            @ToolParam(description = "Name of the city")
            String city) {

        System.out.println("Weather Tool Called.");

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/weather")
                        .queryParam("appid", apiKey)
                        .queryParam("q", city)
                        .queryParam("units", "metric")
                        .build())
                .retrieve()
                .body(String.class);
    }
}