package com.uzair.aiticketing.ai.service;

import com.uzair.aiticketing.ai.dto.AiClassificationDto;
import com.uzair.aiticketing.ai.dto.AiResponseDto;
import com.uzair.aiticketing.ai.prompt.AiPromptTemplates;
import com.uzair.aiticketing.exception.ResourceNotFoundException;
import com.uzair.aiticketing.ticket.model.Ticket;
import com.uzair.aiticketing.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceImpl implements AiService {

    private final TicketRepository ticketRepository;
    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final TicketIndexingService ticketIndexingService;

    @Override
    @Transactional
    public AiClassificationDto classifyTicket(UUID id) {
        log.info("Starting AI classification for ticket ID: {}", id);
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found."));

        AiClassificationDto classification = chatClient.prompt()
                .user(userSpec -> userSpec
                        .text(AiPromptTemplates.CLASSIFY_PROMPT)
                        .param("title", ticket.getTitle())
                        .param("description", ticket.getDescription())
                )
                .call()
                .entity(AiClassificationDto.class);

        if (classification != null) {
            log.info("AI Classification completed. Suggested Category: {}, Priority: {}, Confidence: {}", 
                     classification.category(), classification.priority(), classification.confidence());
            if (classification.category() != null) {
                ticket.setCategory(classification.category());
                ticket.setAiSuggestedCategory(classification.category().name());
            }
            if (classification.priority() != null) {
                ticket.setPriority(classification.priority());
            }
            ticket.setAiConfidence(classification.confidence());
            ticket.setAiProcessed(true);
            Ticket savedTicket = ticketRepository.save(ticket);
            
            // Index the ticket into Qdrant after classification updates
            ticketIndexingService.indexTicket(savedTicket);
        }

        return classification;
    }

    @Override
    public AiResponseDto generateResponse(UUID id) {
        log.info("Generating AI response suggestion for ticket ID: {}", id);
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found."));

        // Search for top 2 similar tickets in Qdrant VectorStore
        String similarTicketsContext = "";
        try {
            List<Document> similarDocuments = vectorStore.similaritySearch(
                    SearchRequest.builder()
                            .query(ticket.getDescription())
                            .topK(2)
                            .build()
            );

            // Filter out the current ticket from the search results to avoid self-referencing
            List<Document> filteredDocs = similarDocuments.stream()
                    .filter(doc -> !doc.getId().equals(ticket.getId().toString()))
                    .toList();

            if (!filteredDocs.isEmpty()) {
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < filteredDocs.size(); i++) {
                    Document doc = filteredDocs.get(i);
                    sb.append(String.format("Similar Ticket #%d:\n%s\n\n", i + 1, doc.getContent()));
                }
                similarTicketsContext = sb.toString();
            } else {
                similarTicketsContext = "No similar historical tickets found.";
            }
        } catch (Exception e) {
            log.warn("Failed to retrieve similar tickets from Qdrant: {}. Proceeding without context.", e.getMessage());
            similarTicketsContext = "No similar historical tickets found.";
        }

        final String finalContext = similarTicketsContext;

        String responseText = chatClient.prompt()
                .user(userSpec -> userSpec
                        .text(AiPromptTemplates.RESPONSE_PROMPT)
                        .param("title", ticket.getTitle())
                        .param("description", ticket.getDescription())
                        .param("category", ticket.getCategory() != null ? ticket.getCategory().name() : "OTHER")
                        .param("priority", ticket.getPriority() != null ? ticket.getPriority().name() : "MEDIUM")
                        .param("similar_tickets", finalContext)
                )
                .call()
                .content();

        return new AiResponseDto(responseText);
    }

    @Override
    @Transactional
    public AiResponseDto summarizeTicket(UUID id) {
        log.info("Generating AI summary for ticket ID: {}", id);
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found."));

        String summaryText = chatClient.prompt()
                .user(userSpec -> userSpec
                        .text(AiPromptTemplates.SUMMARIZE_PROMPT)
                        .param("title", ticket.getTitle())
                        .param("description", ticket.getDescription())
                )
                .call()
                .content();

        ticket.setAiSummary(summaryText);
        Ticket savedTicket = ticketRepository.save(ticket);

        // Index the ticket into Qdrant after summarization updates
        ticketIndexingService.indexTicket(savedTicket);

        return new AiResponseDto(summaryText);
    }
}
