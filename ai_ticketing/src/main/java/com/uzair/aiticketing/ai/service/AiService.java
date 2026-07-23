package com.uzair.aiticketing.ai.service;

import com.uzair.aiticketing.ai.dto.AiClassificationDto;
import com.uzair.aiticketing.ai.dto.AiResponseDto;

import java.util.UUID;

public interface AiService {

    AiClassificationDto classifyTicket(UUID id);

    AiResponseDto generateResponse(UUID id);

    AiResponseDto summarizeTicket(UUID id);
}
