package com.uzair.aiticketing.ticket.dto;

import com.uzair.aiticketing.ticket.model.TicketCategory;
import com.uzair.aiticketing.ticket.model.TicketPriority;
import com.uzair.aiticketing.ticket.model.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateTicketRequest(

        @NotBlank(message = "Title is required.")
        String title,

        @NotBlank(message = "Description is required.")
        String description,

        @NotNull(message = "Status is required.")
        TicketStatus status,

        @NotNull(message = "Priority is required.")
        TicketPriority priority,

        @NotNull(message = "Category is required.")
        TicketCategory category

) {
}