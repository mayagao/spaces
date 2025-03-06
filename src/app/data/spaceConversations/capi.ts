import { Conversation } from "../mockConversations";

export const capiConversations: Conversation[] = [
  {
    id: "capi-1",
    title: "CAPI Architecture Overview",
    lastMessage:
      "CAPI uses a microservices architecture with a gateway that routes requests to specialized services.",
    timestamp: "2024-04-10T15:45:00Z",
    messages: [
      {
        role: "user",
        content: "Can you explain the overall architecture of CAPI?",
      },
      {
        role: "assistant",
        content:
          "CAPI uses a microservices architecture with a gateway that routes requests to specialized services. The core components include: 1) API Gateway for request routing and authentication, 2) Model Router for selecting appropriate AI models, 3) Prompt Management Service for template storage and versioning, 4) Model Integration Services for different AI providers, 5) Caching Layer for performance optimization, 6) Observability Stack for monitoring and logging, and 7) Admin Dashboard for configuration. This architecture allows for flexibility in adding new models and scaling individual components independently.",
      },
    ],
  },
  {
    id: "capi-2",
    title: "Model Fallback Strategies",
    lastMessage:
      "Implement priority-based routing with automatic fallback based on availability, latency, and cost considerations.",
    timestamp: "2024-04-09T13:15:00Z",
    messages: [
      {
        role: "user",
        content:
          "What's the best approach for implementing model fallbacks in CAPI?",
      },
      {
        role: "assistant",
        content:
          "Implement priority-based routing with automatic fallback based on availability, latency, and cost considerations. Key strategies include: 1) Define a fallback chain for each use case with compatible models, 2) Implement health checks to detect model availability issues, 3) Set timeout thresholds to trigger fallbacks for slow responses, 4) Use circuit breakers to temporarily disable problematic models, 5) Consider cost optimization by falling back to cheaper models during high load, and 6) Log all fallback events for analysis. Ensure prompt templates are compatible across fallback models or implement model-specific transformations.",
      },
    ],
  },
  {
    id: "capi-3",
    title: "Prompt Template Management",
    lastMessage:
      "Use a versioned template system with variables, conditional logic, and model-specific optimizations.",
    timestamp: "2024-04-08T11:30:00Z",
    messages: [
      {
        role: "user",
        content: "How should we manage prompt templates in CAPI?",
      },
      {
        role: "assistant",
        content:
          "Use a versioned template system with variables, conditional logic, and model-specific optimizations. Implement: 1) A template repository with version control, 2) Variable substitution for dynamic content, 3) Conditional sections based on context, 4) Model-specific variants to optimize for different architectures, 5) A/B testing capabilities to compare template performance, and 6) Template validation to ensure compatibility with target models. Consider using a DSL (Domain Specific Language) for templates that can compile to model-specific formats. Implement governance workflows for template changes in production.",
      },
    ],
  },
  {
    id: "capi-4",
    title: "Rate Limiting Implementation",
    lastMessage:
      "Use token-based rate limiting with different tiers for various client applications and implement fair queuing.",
    timestamp: "2024-04-07T16:30:00Z",
    messages: [
      {
        role: "user",
        content:
          "What's the best approach for implementing rate limiting in CAPI?",
      },
      {
        role: "assistant",
        content:
          "Use token-based rate limiting with different tiers for various client applications and implement fair queuing. Key components include: 1) Token bucket algorithm for flexible burst handling, 2) Redis or a similar distributed store for rate limit state, 3) Client identification through API keys or JWT tokens, 4) Tiered limits based on client priority or subscription level, 5) Separate limits for different endpoints or models, 6) Fair queuing to prevent monopolization by single clients, and 7) Clear rate limit headers in responses. Consider implementing request prioritization for critical workloads that need to bypass normal limits.",
      },
    ],
  },
  {
    id: "capi-5",
    title: "Caching Strategies",
    lastMessage:
      "Implement multi-level caching with request-based and semantic-based cache keys for optimal performance.",
    timestamp: "2024-04-06T10:45:00Z",
    messages: [
      {
        role: "user",
        content:
          "How should we implement caching in CAPI to improve performance?",
      },
      {
        role: "assistant",
        content:
          "Implement multi-level caching with request-based and semantic-based cache keys for optimal performance. Strategies include: 1) Request-based caching using normalized prompts and parameters as keys, 2) Semantic caching that identifies similar but not identical requests, 3) Tiered caching with in-memory for hot items and distributed cache for broader coverage, 4) Time-based expiration policies based on content volatility, 5) Cache warming for common queries, and 6) Cache invalidation hooks for model or prompt template updates. Consider using probabilistic data structures like SimHash for semantic similarity detection. Implement analytics to track cache hit rates and optimize cache policies.",
      },
    ],
  },
  {
    id: "capi-6",
    title: "Cost Optimization Techniques",
    lastMessage:
      "Implement model selection based on requirements, batching for efficiency, and caching to reduce redundant calls.",
    timestamp: "2024-04-05T14:15:00Z",
    messages: [
      {
        role: "user",
        content: "How can we optimize costs in our CAPI implementation?",
      },
      {
        role: "assistant",
        content:
          "Implement model selection based on requirements, batching for efficiency, and caching to reduce redundant calls. Specific techniques include: 1) Dynamic model selection based on task complexity, 2) Request batching to maximize throughput and minimize per-request overhead, 3) Aggressive caching for repeatable queries, 4) Prompt optimization to reduce token usage, 5) Implementing cheaper models for pre-filtering or simple tasks, 6) Token usage monitoring and alerting, and 7) Cost allocation tracking by client or use case. Consider implementing budget controls that can automatically shift to more economical models when spending thresholds are approached.",
      },
    ],
  },
  {
    id: "capi-7",
    title: "Observability and Monitoring",
    lastMessage:
      "Implement comprehensive logging, metrics collection, and tracing across all CAPI components.",
    timestamp: "2024-04-04T11:15:00Z",
    messages: [
      {
        role: "user",
        content: "What should our observability strategy be for CAPI?",
      },
      {
        role: "assistant",
        content:
          "Implement comprehensive logging, metrics collection, and tracing across all CAPI components. Key elements include: 1) Structured logging with consistent formats and correlation IDs, 2) Performance metrics for latency, throughput, and error rates, 3) Business metrics for usage patterns and model performance, 4) Distributed tracing to track requests across services, 5) Real-time dashboards for system health, 6) Alerting based on SLOs and anomaly detection, and 7) Cost and token usage tracking. Consider implementing model output quality monitoring through sampling and evaluation. Use OpenTelemetry for standardized instrumentation across services.",
      },
    ],
  },
  {
    id: "capi-8",
    title: "Security Best Practices",
    lastMessage:
      "Implement robust authentication, fine-grained authorization, and comprehensive audit logging.",
    timestamp: "2024-04-03T09:30:00Z",
    messages: [
      {
        role: "user",
        content: "What security measures should we implement in CAPI?",
      },
      {
        role: "assistant",
        content:
          "Implement robust authentication, fine-grained authorization, and comprehensive audit logging. Security measures should include: 1) API key or OAuth-based authentication, 2) Role-based access control for different capabilities, 3) Input validation and sanitization to prevent prompt injection, 4) Rate limiting to prevent abuse, 5) Comprehensive audit logging of all requests and administrative actions, 6) Encryption for data in transit and at rest, 7) Regular security scanning and penetration testing, and 8) Secure handling of model provider credentials. Consider implementing content filtering for both inputs and outputs to prevent misuse of the API for generating harmful content.",
      },
    ],
  },
  {
    id: "capi-9",
    title: "Model Evaluation Framework",
    lastMessage:
      "Implement automated evaluation pipelines with benchmark datasets and continuous monitoring of production performance.",
    timestamp: "2024-04-02T15:45:00Z",
    messages: [
      {
        role: "user",
        content: "How should we evaluate and compare different models in CAPI?",
      },
      {
        role: "assistant",
        content:
          "Implement automated evaluation pipelines with benchmark datasets and continuous monitoring of production performance. Key components include: 1) Curated benchmark datasets for different tasks and domains, 2) Automated evaluation pipelines that test new models against benchmarks, 3) Metrics tailored to specific use cases (accuracy, fluency, toxicity, etc.), 4) A/B testing framework for comparing models in production, 5) User feedback collection and analysis, 6) Performance monitoring across different request types, and 7) Cost-performance analysis to identify optimal models. Consider implementing human-in-the-loop evaluation for critical use cases and developing synthetic test generation for continuous testing.",
      },
    ],
  },
  {
    id: "capi-10",
    title: "Handling Model Context Limitations",
    lastMessage:
      "Implement document chunking, retrieval-augmented generation, and context prioritization strategies.",
    timestamp: "2024-04-01T13:30:00Z",
    messages: [
      {
        role: "user",
        content:
          "How should we handle large documents that exceed model context limits?",
      },
      {
        role: "assistant",
        content:
          "Implement document chunking, retrieval-augmented generation, and context prioritization strategies. Approaches include: 1) Intelligent document chunking with overlap to maintain context, 2) Summarization of lengthy content before processing, 3) Retrieval-augmented generation to fetch only relevant context, 4) Hierarchical processing where chunks are processed individually and then results are combined, 5) Context prioritization to ensure the most important information fits within limits, and 6) Model selection based on context length requirements. Consider implementing specialized indexing for large documents to enable efficient retrieval of relevant sections at query time.",
      },
    ],
  },
  {
    id: "capi-11",
    title: "Streaming Implementation",
    lastMessage:
      "Use server-sent events or WebSockets with proper backpressure handling and client reconnection strategies.",
    timestamp: "2024-03-31T10:15:00Z",
    messages: [
      {
        role: "user",
        content:
          "What's the best way to implement streaming responses in CAPI?",
      },
      {
        role: "assistant",
        content:
          "Use server-sent events or WebSockets with proper backpressure handling and client reconnection strategies. Implementation considerations include: 1) Server-sent events (SSE) for simpler one-way streaming or WebSockets for bidirectional communication, 2) Chunked transfer encoding for HTTP-based streaming, 3) Backpressure handling to manage clients that can't keep up with stream rate, 4) Client-side reconnection logic with exponential backoff, 5) Heartbeat mechanisms to detect connection issues, 6) Proper error handling in the stream, and 7) Consideration of proxy and load balancer configurations that support long-lived connections. Ensure your model providers support streaming and implement adapters for those that don't.",
      },
    ],
  },
];
