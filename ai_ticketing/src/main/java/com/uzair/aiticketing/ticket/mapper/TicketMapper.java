package com.uzair.aiticketing.ticket.mapper;
import java.util.List;
import com.uzair.aiticketing.common.mapper.BaseMapper;
import com.uzair.aiticketing.ticket.dto.CreateTicketRequest;
import com.uzair.aiticketing.ticket.dto.TicketResponse;
import com.uzair.aiticketing.ticket.dto.UpdateTicketRequest;
import com.uzair.aiticketing.ticket.model.Ticket;
import com.uzair.aiticketing.user.model.User;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper implements BaseMapper<Ticket, TicketResponse> {

    public Ticket toEntity(CreateTicketRequest request) {

        return Ticket.builder()
                .title(request.title())
                .description(request.description())
                .priority(request.priority())
                .category(request.category())
                .build();
    }

    public void updateEntity(
            Ticket ticket,
            UpdateTicketRequest request
    ) {

        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setStatus(request.status());
        ticket.setPriority(request.priority());
        ticket.setCategory(request.category());

    }

    public TicketResponse toResponse(Ticket ticket) {

        String createdBy = null;
        String assignedTo = null;

        User creator = ticket.getCreatedBy();

        if (creator != null) {
            createdBy = creator.getFirstName() + " " + creator.getLastName();
        }

        User assignee = ticket.getAssignedTo();

        if (assignee != null) {
            assignedTo = assignee.getFirstName() + " " + assignee.getLastName();
        }

        return new TicketResponse(

                ticket.getId(),

                ticket.getTitle(),

                ticket.getDescription(),

                ticket.getStatus(),

                ticket.getPriority(),

                ticket.getCategory(),

                createdBy,

                assignedTo,

                ticket.getAiSummary(),

                ticket.getAiSuggestedCategory(),

                ticket.getAiConfidence(),

                ticket.getAiProcessed(),

                ticket.getCreatedAt(),

                ticket.getUpdatedAt()

        );

    }

    @Override
    public List<TicketResponse> toResponseList(List<Ticket> tickets) {

        return tickets.stream()
                .map(this::toResponse)
                .toList();
    }
}