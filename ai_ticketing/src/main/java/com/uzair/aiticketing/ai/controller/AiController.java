package com.uzair.aiticketing.ai.controller;

import com.uzair.aiticketing.ai.dto.AiClassificationDto;
import com.uzair.aiticketing.ai.dto.AiResponseDto;
import com.uzair.aiticketing.ai.service.AiService;
import com.uzair.aiticketing.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/ai/tickets")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/{id}/classify")
    public ResponseEntity<ApiResponse<AiClassificationDto>> classifyTicket(@PathVariable UUID id) {
        AiClassificationDto classification = aiService.classifyTicket(id);
        return ResponseEntity.ok(
                ApiResponse.success("Ticket classified successfully.", classification)
        );
    }

    @PostMapping("/{id}/response")
    public ResponseEntity<ApiResponse<AiResponseDto>> generateResponse(@PathVariable UUID id) {
        AiResponseDto response = aiService.generateResponse(id);
        return ResponseEntity.ok(
                ApiResponse.success("Suggested response generated successfully.", response)
        );
    }

    @PostMapping("/{id}/summary")
    public ResponseEntity<ApiResponse<AiResponseDto>> summarizeTicket(@PathVariable UUID id) {
        AiResponseDto summary = aiService.summarizeTicket(id);
        return ResponseEntity.ok(
                ApiResponse.success("Ticket summarized successfully.", summary)
        );
    }
}
