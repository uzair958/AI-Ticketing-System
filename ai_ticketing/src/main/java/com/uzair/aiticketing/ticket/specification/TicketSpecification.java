package com.uzair.aiticketing.ticket.specification;

import com.uzair.aiticketing.ticket.model.Ticket;
import com.uzair.aiticketing.ticket.model.TicketPriority;
import com.uzair.aiticketing.ticket.model.TicketStatus;
import org.springframework.data.jpa.domain.Specification;

public class TicketSpecification {

    public static Specification<Ticket> hasStatus(TicketStatus status) {

        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);

    }

    public static Specification<Ticket> hasPriority(TicketPriority priority) {

        return (root, query, cb) ->
                priority == null ? null : cb.equal(root.get("priority"), priority);

    }

    public static Specification<Ticket> titleContains(String title) {

        return (root, query, cb) ->
                title == null || title.isBlank()
                        ? null
                        : cb.like(
                        cb.lower(root.get("title")),
                        "%" + title.toLowerCase() + "%"
                );

    }

}