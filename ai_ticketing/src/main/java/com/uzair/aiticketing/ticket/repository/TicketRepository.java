package com.uzair.aiticketing.ticket.repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.uzair.aiticketing.ticket.model.Ticket;
import com.uzair.aiticketing.ticket.model.TicketPriority;
import com.uzair.aiticketing.ticket.model.TicketStatus;
import com.uzair.aiticketing.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TicketRepository extends
        JpaRepository<Ticket, UUID>,
        JpaSpecificationExecutor<Ticket> {

    Page<Ticket> findAll(Pageable pageable);

    Page<Ticket> findByCreatedBy(User user, Pageable pageable);

    Page<Ticket> findByAssignedTo(User user, Pageable pageable);

    Page<Ticket> findByStatus(TicketStatus status, Pageable pageable);

    Page<Ticket> findByPriority(TicketPriority priority, Pageable pageable);

    Page<Ticket> findByTitleContainingIgnoreCase(
            String title,
            Pageable pageable
    );

}