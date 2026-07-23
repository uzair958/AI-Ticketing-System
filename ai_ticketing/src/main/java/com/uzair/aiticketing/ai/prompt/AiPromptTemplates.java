package com.uzair.aiticketing.ai.prompt;

public class AiPromptTemplates {

    public static final String CLASSIFY_PROMPT = """
            Analyze the following support ticket and classify it:
            Title: {title}
            Description: {description}
            
            Predict the ticket category, priority, severity, suggested department, and a confidence level (between 0.0 and 1.0).
            """;

    public static final String RESPONSE_PROMPT = """
            You are a professional support agent. Generate a professional support response for the following ticket:
            Title: {title}
            Description: {description}
            Category: {category}
            Priority: {priority}
            
            Here are some similar historical tickets and their details:
            {similar_tickets}
            
            Use the historical tickets as reference context if relevant to draft a polite, helpful, clear response addressing the specific issue.
            """;

    public static final String SUMMARIZE_PROMPT = """
            Generate a concise, professional summary (1-2 sentences) of the following support ticket:
            Title: {title}
            Description: {description}
            
            Make it clear and helpful for a support agent.
            """;
}
