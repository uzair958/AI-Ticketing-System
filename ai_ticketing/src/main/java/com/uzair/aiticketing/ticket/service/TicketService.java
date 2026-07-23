package com.uzair.aiticketing.ticket.service;

import com.uzair.aiticketing.common.response.PageResponse;
import com.uzair.aiticketing.exception.ResourceNotFoundException;
import com.uzair.aiticketing.ticket.dto.AssignTicketRequest;
import com.uzair.aiticketing.ticket.dto.CreateTicketRequest;
import com.uzair.aiticketing.ticket.dto.TicketResponse;
import com.uzair.aiticketing.ticket.dto.UpdateTicketRequest;
import com.uzair.aiticketing.ticket.mapper.TicketMapper;
import com.uzair.aiticketing.ticket.model.Ticket;
import com.uzair.aiticketing.ticket.repository.TicketRepository;
import com.uzair.aiticketing.user.model.User;
import com.uzair.aiticketing.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketMapper ticketMapper;

    public TicketResponse createTicket(
            CreateTicketRequest request,
            User currentUser
    ) {

        Ticket ticket = ticketMapper.toEntity(request);

        ticket.setCreatedBy(currentUser);

        Ticket savedTicket = ticketRepository.save(ticket);

        return ticketMapper.toResponse(savedTicket);
    }

    public PageResponse<TicketResponse> getAllTickets(
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Ticket> ticketPage = ticketRepository.findAll(pageable);

        return PageResponse.of(
                ticketPage,
                ticketMapper.toResponseList(ticketPage.getContent())
        );
    }

    public TicketResponse getTicketById(UUID id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket not found."));

        return ticketMapper.toResponse(ticket);
    }

    public TicketResponse updateTicket(
            UUID id,
            UpdateTicketRequest request
    ) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket not found."));

        ticketMapper.updateEntity(ticket, request);

        Ticket updatedTicket = ticketRepository.save(ticket);

        return ticketMapper.toResponse(updatedTicket);
    }

    public TicketResponse assignTicket(
            UUID id,
            AssignTicketRequest request
    ) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket not found."));

        User assignedUser = userRepository.findById(request.userId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        ticket.setAssignedTo(assignedUser);

        Ticket updatedTicket = ticketRepository.save(ticket);

        return ticketMapper.toResponse(updatedTicket);
    }

    public void deleteTicket(UUID id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket not found."));

        ticketRepository.delete(ticket);
    }

}