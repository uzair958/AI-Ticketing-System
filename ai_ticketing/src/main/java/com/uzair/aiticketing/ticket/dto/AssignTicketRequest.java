package com.uzair.aiticketing.ticket.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignTicketRequest(

        @NotNull(message = "Assigned user id is required.")
        UUID userId

) {
}