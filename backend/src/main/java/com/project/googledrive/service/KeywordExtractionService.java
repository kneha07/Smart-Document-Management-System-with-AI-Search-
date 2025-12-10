package com.project.googledrive.service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KeywordExtractionService {
    
    private final OpenAiService openAiService;
    
    public KeywordExtractionService(@Value("${openai.api.key}") String apiKey) {
        this.openAiService = new OpenAiService(apiKey);
    }
    
    public List<String> extractKeywords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            // Limit text to avoid token limits
            String textForKeywords = text.length() > 3000 
                ? text.substring(0, 3000) 
                : text;
            
            // Create prompt for keyword extraction
            String prompt = "Extract 5-7 main keywords or topics from this text. " +
                          "Return ONLY the keywords separated by commas, nothing else. " +
                          "Keywords should be single words or short phrases (2-3 words max). " +
                          "Text: " + textForKeywords;
            
            ChatMessage systemMessage = new ChatMessage("system", 
                "You are a keyword extraction expert. Return only keywords separated by commas.");
            ChatMessage userMessage = new ChatMessage("user", prompt);
            
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model("gpt-3.5-turbo")
                    .messages(Arrays.asList(systemMessage, userMessage))
                    .maxTokens(100)
                    .temperature(0.3)
                    .build();
            
            String response = openAiService.createChatCompletion(request)
                    .getChoices()
                    .get(0)
                    .getMessage()
                    .getContent()
                    .trim();
            
            // Parse keywords from response
            List<String> keywords = Arrays.stream(response.split(","))
                    .map(String::trim)
                    .map(keyword -> keyword.replaceAll("[\"']", "")) // Remove quotes
                    .filter(keyword -> !keyword.isEmpty())
                    .limit(7) // Max 7 keywords
                    .collect(Collectors.toList());
            
            System.out.println("✅ Extracted keywords: " + keywords);
            return keywords;
            
        } catch (Exception e) {
            System.err.println("❌ Keyword extraction failed: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}