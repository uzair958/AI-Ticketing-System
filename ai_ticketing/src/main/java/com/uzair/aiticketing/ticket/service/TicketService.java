package com.uzair.aiticketing.ticket.service;

import com.uzair.aiticketing.common.response.PageResponse;
import com.uzair.aiticketing.exception.ResourceNotFoundException;
import com.uzair.aiticketing.ticket.dto.AssignTicketRequest;
import com.uzair.aiticketing.ticket.dto.CreateTicketRequest;
import com.uzair.aiticketing.ticket.dto.TicketResponse;
import com.uzair.aiticketing.ticket.dto.UpdateTicketRequest;
import com.uzair.aiticketing.ticket.mapper.TicketMapper;
import com.uzair.aiticketing.ticket.model.Ticket;
import com.uzair.aiticketing.ticket.model.TicketPriority;
import com.uzair.aiticketing.ticket.model.TicketStatus;
import com.uzair.aiticketing.ticket.repository.TicketRepository;
import com.uzair.aiticketing.ticket.specification.TicketSpecification;
import com.uzair.aiticketing.user.model.User;
import com.uzair.aiticketing.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketMapper ticketMapper;

        @Transactional
    public TicketResponse createTicket(
            CreateTicketRequest request,
            User currentUser
    ) {

        Ticket ticket = ticketMapper.toEntity(request);

        ticket.setCreatedBy(currentUser);

        Ticket savedTicket = ticketRepository.save(ticket);

        return ticketMapper.toResponse(savedTicket);
    }

        @Transactional(readOnly = true)
    public PageResponse<TicketResponse> getAllTickets(
            int page,
            int size,
            String sortBy,
            String direction,
            TicketStatus status,
            TicketPriority priority,
            String title
    ) {

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Sort sort = Sort.by(sortDirection, sortBy);

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Ticket> specification = Specification.allOf(
            TicketSpecification.fetchUserRelations(),
                TicketSpecification.hasStatus(status),
                TicketSpecification.hasPriority(priority),
                TicketSpecification.titleContains(title)
        );

        Page<Ticket> ticketPage = ticketRepository.findAll(
                specification,
                pageable
        );

        return PageResponse.of(
                ticketPage,
                ticketMapper.toResponseList(ticketPage.getContent())
        );
    }

        @Transactional(readOnly = true)
    public TicketResponse getTicketById(UUID id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket not found."));

        return ticketMapper.toResponse(ticket);
    }

        @Transactional
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

        @Transactional
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

        @Transactional
    public void deleteTicket(UUID id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket not found."));

        ticketRepository.delete(ticket);
    }

}