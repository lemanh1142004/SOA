package com.example.carservice.service;
import com.example.carservice.dto.AiChatRequest;
import com.example.carservice.dto.AiChatResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    private final RestTemplate restTemplate =
            new RestTemplate();

    public String chat(String message){

        AiChatRequest request =
                new AiChatRequest();

        request.setMessage(message);

        ResponseEntity<AiChatResponse> response =
                restTemplate.postForEntity(
                        "https://gateway-api-ngbw.onrender.com/api/ai/chat",
                        request,
                        AiChatResponse.class
                );

        return response.getBody().getAnswer();
    }
}