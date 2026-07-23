package com.uzair.aiticketing.ticket.specification;

import com.uzair.aiticketing.ticket.model.Ticket;
import com.uzair.aiticketing.ticket.model.TicketPriority;
import com.uzair.aiticketing.ticket.model.TicketStatus;
import jakarta.persistence.criteria.JoinType;
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

    public static Specification<Ticket> fetchUserRelations() {

        return (root, query, cb) -> {
            if (Long.class.equals(query.getResultType())) {
                return cb.conjunction();
            }

            root.fetch("createdBy", JoinType.LEFT);
            root.fetch("assignedTo", JoinType.LEFT);
            query.distinct(true);

            return cb.conjunction();
        };

    }

}