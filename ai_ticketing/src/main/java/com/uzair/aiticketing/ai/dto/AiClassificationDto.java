package com.uzair.aiticketing.ai.dto;

import com.uzair.aiticketing.ticket.model.TicketCategory;
import com.uzair.aiticketing.ticket.model.TicketPriority;

public record AiClassificationDto(
        TicketCategory category,
        TicketPriority priority,
        String severity,
        String suggestedDepartment,
        Double confidence
) {
}
