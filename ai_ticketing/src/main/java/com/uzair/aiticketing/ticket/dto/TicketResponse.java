package com.uzair.aiticketing.ticket.dto;

import com.uzair.aiticketing.ticket.model.TicketCategory;
import com.uzair.aiticketing.ticket.model.TicketPriority;
import com.uzair.aiticketing.ticket.model.TicketStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketResponse(

        UUID id,

        String title,

        String description,

        TicketStatus status,

        TicketPriority priority,

        TicketCategory category,

        String createdBy,

        String assignedTo,

        String aiSummary,

        String aiSuggestedCategory,

        Double aiConfidence,

        Boolean aiProcessed,

        LocalDateTime createdAt,

        LocalDateTime updatedAt

) {
}