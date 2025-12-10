package com.project.googledrive.service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class DocumentSummaryService {
    
    private final OpenAiService openAiService;
    
    public DocumentSummaryService(@Value("${openai.api.key}") String apiKey) {
        this.openAiService = new OpenAiService(apiKey);
    }
    
    public String generateSummary(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "";
        }
        
        try {
            // Limit text to avoid token limits
            String textForSummary = text.length() > 4000 
                ? text.substring(0, 4000) 
                : text;
            
            // Create prompt for summarization
            String prompt = "Summarize this document in 2-3 concise sentences. " +
                          "Focus on the main topic and key points. " +
                          "Be specific and informative. " +
                          "Text: " + textForSummary;
            
            ChatMessage systemMessage = new ChatMessage("system", 
                "You are a document summarization expert. Provide clear, concise summaries.");
            ChatMessage userMessage = new ChatMessage("user", prompt);
            
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model("gpt-3.5-turbo")
                    .messages(Arrays.asList(systemMessage, userMessage))
                    .maxTokens(150)
                    .temperature(0.5)
                    .build();
            
            String summary = openAiService.createChatCompletion(request)
                    .getChoices()
                    .get(0)
                    .getMessage()
                    .getContent()
                    .trim();
            
            System.out.println("✅ Generated summary: " + summary.substring(0, Math.min(100, summary.length())) + "...");
            return summary;
            
        } catch (Exception e) {
            System.err.println("❌ Summary generation failed: " + e.getMessage());
            return "";
        }
    }
}