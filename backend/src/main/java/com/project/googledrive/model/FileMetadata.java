package com.project.googledrive.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "files")
public class FileMetadata {
    @Id
    private String id;
    
    private String fileName;
    private String originalFileName;
    private String fileType;
    private long fileSize;
    private String filePath;
    private String ownerEmail;
    private LocalDateTime uploadedAt;
    private String encryptionKey;
    
    // Field for sharing
    private List<String> sharedWith = new ArrayList<>();

    // Field for AI semantic search
    private List<Double> embedding;
    
    // Field for NLP keyword extraction
    private List<String> keywords = new ArrayList<>();
    
    // 🆕 NEW: Field for document summary
    private String summary;
}