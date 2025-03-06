import { Conversation } from "../mockConversations";

export const backendApiConversations: Conversation[] = [
  {
    id: "ba-1",
    title: "RESTful API Design Principles",
    lastMessage:
      "Use resource-based URLs, appropriate HTTP methods, and consistent response formats.",
    timestamp: "2024-04-10T13:45:00Z",
    messages: [
      {
        role: "user",
        content: "What are the key principles of RESTful API design?",
      },
      {
        role: "assistant",
        content:
          "Use resource-based URLs, appropriate HTTP methods, and consistent response formats. Follow these principles: client-server separation, statelessness, cacheability, uniform interface, layered system, and code on demand (optional). Use nouns instead of verbs in endpoints, implement proper status codes, and version your APIs. Consider using HATEOAS for discoverability and implement proper pagination for large collections.",
      },
    ],
  },
  {
    id: "ba-2",
    title: "GraphQL vs REST",
    lastMessage:
      "GraphQL allows clients to request exactly what they need, while REST provides a simpler, more cacheable architecture.",
    timestamp: "2024-04-09T15:30:00Z",
    messages: [
      {
        role: "user",
        content: "Should we use GraphQL or REST for our new API?",
      },
      {
        role: "assistant",
        content:
          "GraphQL allows clients to request exactly what they need, while REST provides a simpler, more cacheable architecture. GraphQL excels at reducing over-fetching and under-fetching of data, especially for complex UIs with varying data needs. REST is more mature with better tooling and caching. Consider your use case - GraphQL works well for complex data requirements and multiple clients with different needs, while REST is often simpler for basic CRUD operations.",
      },
    ],
  },
  {
    id: "ba-3",
    title: "API Authentication Methods",
    lastMessage:
      "JWT is stateless and scalable, while session-based auth is simpler but requires server-side storage.",
    timestamp: "2024-04-08T10:15:00Z",
    messages: [
      {
        role: "user",
        content:
          "What's the difference between JWT and session-based authentication?",
      },
      {
        role: "assistant",
        content:
          "JWT is stateless and scalable, while session-based auth is simpler but requires server-side storage. With JWTs, the token itself contains the user information, making it portable across services but potentially larger. Session auth stores a simple identifier in a cookie with user data on the server. JWTs are better for distributed systems but have challenges with invalidation. Consider your architecture - microservices often benefit from JWTs, while monoliths may be simpler with sessions.",
      },
    ],
  },
  {
    id: "ba-4",
    title: "API Rate Limiting Strategies",
    lastMessage:
      "Implement token bucket or leaky bucket algorithms and clearly communicate limits in response headers.",
    timestamp: "2024-04-07T16:45:00Z",
    messages: [
      {
        role: "user",
        content: "How should we implement rate limiting for our API?",
      },
      {
        role: "assistant",
        content:
          "Implement token bucket or leaky bucket algorithms and clearly communicate limits in response headers. Use Redis or a similar in-memory store to track request counts across distributed systems. Include rate limit information in response headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset). Consider different limits for different endpoints based on resource cost, and implement tiered limits for different user types or subscription levels.",
      },
    ],
  },
  {
    id: "ba-5",
    title: "API Versioning Approaches",
    lastMessage:
      "URL path versioning is the most explicit, while header-based versioning is less visible but cleaner.",
    timestamp: "2024-04-06T11:30:00Z",
    messages: [
      { role: "user", content: "What's the best way to version our API?" },
      {
        role: "assistant",
        content:
          "URL path versioning is the most explicit, while header-based versioning is less visible but cleaner. Common approaches include: 1) URL path (/v1/resources), 2) Query parameter (?version=1), 3) Custom header (X-API-Version: 1), or 4) Accept header with content type (Accept: application/vnd.company.v1+json). URL versioning is the most straightforward for clients but can lead to duplication. Consider your audience - public APIs often benefit from the explicitness of URL versioning.",
      },
    ],
  },
  {
    id: "ba-6",
    title: "Database Selection for APIs",
    lastMessage:
      "SQL databases provide ACID compliance and structured data, while NoSQL offers flexibility and horizontal scaling.",
    timestamp: "2024-04-05T09:15:00Z",
    messages: [
      {
        role: "user",
        content: "Should we use SQL or NoSQL for our API backend?",
      },
      {
        role: "assistant",
        content:
          "SQL databases provide ACID compliance and structured data, while NoSQL offers flexibility and horizontal scaling. SQL (PostgreSQL, MySQL) works well for complex queries, transactions, and structured data with relationships. NoSQL options like MongoDB excel at handling unstructured data, rapid development, and horizontal scaling. Consider your data model, query patterns, and scaling needs. Many modern applications use a combination - SQL for transactional data and NoSQL for specific use cases like caching or document storage.",
      },
    ],
  },
  {
    id: "ba-7",
    title: "API Documentation Best Practices",
    lastMessage:
      "Use OpenAPI/Swagger, provide examples, and keep documentation in sync with code.",
    timestamp: "2024-04-04T14:30:00Z",
    messages: [
      { role: "user", content: "How should we approach API documentation?" },
      {
        role: "assistant",
        content:
          "Use OpenAPI/Swagger, provide examples, and keep documentation in sync with code. Generate documentation from code when possible to prevent drift. Include authentication details, error responses, and rate limiting information. Provide SDKs or code examples in multiple languages. Consider tools like Swagger UI, Redoc, or Stoplight for interactive documentation. Test your documentation with developers outside your team to ensure clarity. For internal APIs, consider adding context about when and why to use specific endpoints.",
      },
    ],
  },
  {
    id: "ba-8",
    title: "Microservices Communication Patterns",
    lastMessage:
      "Synchronous REST/gRPC works for simple interactions, while async messaging is better for reliability and decoupling.",
    timestamp: "2024-04-03T11:45:00Z",
    messages: [
      {
        role: "user",
        content:
          "What are the best ways for microservices to communicate with each other?",
      },
      {
        role: "assistant",
        content:
          "Synchronous REST/gRPC works for simple interactions, while async messaging is better for reliability and decoupling. Common patterns include: 1) REST/HTTP for simple request-response, 2) gRPC for efficient internal communication, 3) Message queues (RabbitMQ, Kafka) for async communication, and 4) Event sourcing for complex event-driven architectures. Consider using an API gateway for external-facing services and implement circuit breakers to handle failures gracefully. The right approach depends on your specific requirements for latency, reliability, and coupling.",
      },
    ],
  },
  {
    id: "ba-9",
    title: "API Performance Optimization",
    lastMessage:
      "Implement caching, pagination, and compression to improve API performance and reduce load.",
    timestamp: "2024-04-02T15:20:00Z",
    messages: [
      { role: "user", content: "How can we optimize our API performance?" },
      {
        role: "assistant",
        content:
          "Implement caching, pagination, and compression to improve API performance and reduce load. Use HTTP caching headers (ETag, Cache-Control) and consider a CDN for public APIs. Implement database query optimization and indexing. Use connection pooling and consider read replicas for high-traffic APIs. Enable GZIP/Brotli compression for responses. Implement efficient pagination for large collections and allow clients to request only the fields they need. Profile and benchmark your API to identify bottlenecks before and after optimizations.",
      },
    ],
  },
  {
    id: "ba-10",
    title: "Error Handling in APIs",
    lastMessage:
      "Use appropriate HTTP status codes, provide detailed error messages, and implement consistent error formats.",
    timestamp: "2024-04-01T13:10:00Z",
    messages: [
      {
        role: "user",
        content: "What's the best approach for API error handling?",
      },
      {
        role: "assistant",
        content:
          "Use appropriate HTTP status codes, provide detailed error messages, and implement consistent error formats. Follow these principles: 1) Use standard HTTP status codes correctly (4xx for client errors, 5xx for server errors), 2) Include error codes, messages, and possibly links to documentation, 3) Don't expose sensitive information in errors, 4) Log detailed errors server-side while returning appropriate information to clients. Consider using a standard error format like RFC 7807 (Problem Details for HTTP APIs) for consistency across your services.",
      },
    ],
  },
];
