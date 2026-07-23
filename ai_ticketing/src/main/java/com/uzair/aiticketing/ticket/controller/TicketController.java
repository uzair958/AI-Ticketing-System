package com.uzair.aiticketing.ticket.controller;

import com.uzair.aiticketing.common.constants.AppConstants;
import com.uzair.aiticketing.common.response.ApiResponse;
import com.uzair.aiticketing.common.response.PageResponse;
import com.uzair.aiticketing.ticket.dto.AssignTicketRequest;
import com.uzair.aiticketing.ticket.dto.CreateTicketRequest;
import com.uzair.aiticketing.ticket.dto.TicketResponse;
import com.uzair.aiticketing.ticket.dto.UpdateTicketRequest;
import com.uzair.aiticketing.ticket.service.TicketService;
import com.uzair.aiticketing.user.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(AppConstants.TICKET_BASE)
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            @AuthenticationPrincipal User currentUser
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Ticket created successfully.",
                        ticketService.createTicket(request, currentUser)
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TicketResponse>>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Tickets fetched successfully.",
                        ticketService.getAllTickets(page, size, sortBy, direction)
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Ticket fetched successfully.",
                        ticketService.getTicketById(id)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTicket(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTicketRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Ticket updated successfully.",
                        ticketService.updateTicket(id, request)
                )
        );
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TicketResponse>> assignTicket(
            @PathVariable UUID id,
            @Valid @RequestBody AssignTicketRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Ticket assigned successfully.",
                        ticketService.assignTicket(id, request)
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(
            @PathVariable UUID id
    ) {

        ticketService.deleteTicket(id);

        return ResponseEntity.ok(
                ApiResponse.success("Ticket deleted successfully.")
        );
    }

}