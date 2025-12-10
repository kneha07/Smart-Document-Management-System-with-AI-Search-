package com.project.googledrive.service;

import com.theokanning.openai.embedding.EmbeddingRequest;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpenAIService {
    
    private final OpenAiService openAiService;
    
    @Value("${openai.model}")
    private String model;
    
    public OpenAIService(@Value("${openai.api.key}") String apiKey) {
        this.openAiService = new OpenAiService(apiKey);
    }
    
    public List<Double> generateEmbedding(String text) {
        EmbeddingRequest request = EmbeddingRequest.builder()
                .model(model)
                .input(List.of(text))
                .build();
        
        return openAiService.createEmbeddings(request)
                .getData()
                .get(0)
                .getEmbedding();
    }
    
    public double calculateSimilarity(List<Double> embedding1, List<Double> embedding2) {
        if (embedding1.size() != embedding2.size()) {
            return 0.0;
        }
        
        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;
        
        for (int i = 0; i < embedding1.size(); i++) {
            dotProduct += embedding1.get(i) * embedding2.get(i);
            norm1 += Math.pow(embedding1.get(i), 2);
            norm2 += Math.pow(embedding2.get(i), 2);
        }
        
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
}