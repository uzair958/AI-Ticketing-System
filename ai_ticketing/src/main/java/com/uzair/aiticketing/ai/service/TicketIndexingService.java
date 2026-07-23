package com.uzair.aiticketing.ai.service;

import com.uzair.aiticketing.ticket.model.Ticket;
import com.uzair.aiticketing.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketIndexingService {

    private final VectorStore vectorStore;
    private final TicketRepository ticketRepository;

    public void indexTicket(Ticket ticket) {
        if (ticket == null || ticket.getId() == null) {
            return;
        }
        
        log.info("Indexing ticket ID: {} in Qdrant VectorStore", ticket.getId());
        
        String content = String.format("Title: %s\nDescription: %s\nSummary: %s",
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getAiSummary() != null ? ticket.getAiSummary() : ""
        );

        Document document = new Document(
                ticket.getId().toString(),
                content,
                Map.of(
                        "ticketId", ticket.getId().toString(),
                        "category", ticket.getCategory() != null ? ticket.getCategory().name() : "OTHER",
                        "priority", ticket.getPriority() != null ? ticket.getPriority().name() : "MEDIUM",
                        "status", ticket.getStatus() != null ? ticket.getStatus().name() : "OPEN"
                )
        );

        try {
            vectorStore.add(List.of(document));
            log.info("Ticket ID: {} successfully indexed in Qdrant", ticket.getId());
        } catch (Exception e) {
            log.error("Failed to add ticket ID: {} to Qdrant. Is Qdrant running?", ticket.getId(), e);
        }
    }

    @EventListener(ApplicationReadyEvent.class)
    public void bootstrapIndexing() {
        log.info("Initializing bootstrap indexing of existing tickets into Qdrant...");
        try {
            long count = ticketRepository.count();
            if (count > 0) {
                log.info("Found {} existing tickets to index.", count);
                ticketRepository.findAll().forEach(ticket -> {
                    try {
                        indexTicket(ticket);
                    } catch (Exception e) {
                        log.error("Failed to index ticket ID: {}", ticket.getId(), e);
                    }
                });
                log.info("Bootstrap indexing completed.");
            } else {
                log.info("No existing tickets found to index.");
            }
        } catch (Exception e) {
            log.warn("Could not complete bootstrap indexing. Vector store might be unavailable: {}", e.getMessage());
        }
    }
}
