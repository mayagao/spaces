import { Conversation } from "../mockConversations";

export const blackbirdSearchConversations: Conversation[] = [
  {
    id: "bs-1",
    title: "Search Algorithm Fundamentals",
    lastMessage:
      "Modern search engines use a combination of inverted indices, relevance scoring, and machine learning models.",
    timestamp: "2024-04-10T14:30:00Z",
    messages: [
      { role: "user", content: "How do modern search algorithms work?" },
      {
        role: "assistant",
        content:
          "Modern search engines use a combination of inverted indices, relevance scoring, and machine learning models. The process typically involves: 1) Crawling and indexing content, 2) Processing queries through tokenization and normalization, 3) Retrieving candidate documents using inverted indices, 4) Ranking results using algorithms like BM25 or learning-to-rank models, and 5) Applying post-processing like personalization or diversity. Recent advances incorporate semantic understanding through embeddings and transformer models like BERT.",
      },
    ],
  },
  {
    id: "bs-2",
    title: "Vector Search Implementation",
    lastMessage:
      "Use embedding models to convert content to vectors, then store them in specialized vector databases for similarity search.",
    timestamp: "2024-04-09T11:45:00Z",
    messages: [
      {
        role: "user",
        content: "How can we implement vector search in our application?",
      },
      {
        role: "assistant",
        content:
          "Use embedding models to convert content to vectors, then store them in specialized vector databases for similarity search. The process involves: 1) Choose an embedding model (e.g., OpenAI's text-embedding-ada-002 or open-source alternatives like SBERT), 2) Process your content to generate vector embeddings, 3) Store vectors in a vector database like Pinecone, Weaviate, or Milvus, 4) At query time, convert the query to a vector and perform approximate nearest neighbor search. Consider hybrid approaches that combine vector search with keyword search for best results.",
      },
    ],
  },
  {
    id: "bs-3",
    title: "Search Relevance Tuning",
    lastMessage:
      "Collect user feedback, analyze search logs, and use A/B testing to iteratively improve search quality.",
    timestamp: "2024-04-08T16:15:00Z",
    messages: [
      {
        role: "user",
        content: "How can we improve the relevance of our search results?",
      },
      {
        role: "assistant",
        content:
          "Collect user feedback, analyze search logs, and use A/B testing to iteratively improve search quality. Implement these strategies: 1) Analyze zero-result searches and popular queries, 2) Use click-through data to train ranking models, 3) Implement query expansion and synonyms, 4) Consider personalization based on user behavior, 5) Use domain-specific knowledge to boost important content, and 6) Implement faceted search for better filtering. Create a test set of queries with expected results to measure improvements objectively.",
      },
    ],
  },
  {
    id: "bs-4",
    title: "Elasticsearch vs Solr",
    lastMessage:
      "Elasticsearch offers better scalability and real-time search, while Solr has stronger text analysis and traditional search features.",
    timestamp: "2024-04-07T13:30:00Z",
    messages: [
      {
        role: "user",
        content: "What are the differences between Elasticsearch and Solr?",
      },
      {
        role: "assistant",
        content:
          "Elasticsearch offers better scalability and real-time search, while Solr has stronger text analysis and traditional search features. Elasticsearch excels at distributed deployments, has better JSON support, and offers a more comprehensive ecosystem with tools like Kibana and Logstash. Solr has traditionally had better text analysis capabilities, more mature faceting, and stronger caching. Both are built on Lucene and share many core capabilities. Elasticsearch is often preferred for log analysis and real-time applications, while Solr has been stronger for document and e-commerce search.",
      },
    ],
  },
  {
    id: "bs-5",
    title: "Search Query Understanding",
    lastMessage:
      "Use techniques like query classification, intent detection, and entity recognition to better understand user queries.",
    timestamp: "2024-04-06T10:15:00Z",
    messages: [
      {
        role: "user",
        content: "How can we better understand what users are searching for?",
      },
      {
        role: "assistant",
        content:
          "Use techniques like query classification, intent detection, and entity recognition to better understand user queries. Implement: 1) Query preprocessing with spell correction and tokenization, 2) Named entity recognition to identify products, people, or locations, 3) Query classification to categorize searches (navigational, informational, transactional), 4) Intent detection to understand user goals, and 5) Query expansion with synonyms and related terms. Analyze search logs to identify patterns and common queries. Consider using NLP models like BERT for more advanced understanding.",
      },
    ],
  },
  {
    id: "bs-6",
    title: "Multilingual Search Challenges",
    lastMessage:
      "Use language detection, language-specific analyzers, and cross-lingual embeddings for effective multilingual search.",
    timestamp: "2024-04-05T15:45:00Z",
    messages: [
      {
        role: "user",
        content: "What challenges should we consider for multilingual search?",
      },
      {
        role: "assistant",
        content:
          "Use language detection, language-specific analyzers, and cross-lingual embeddings for effective multilingual search. Key challenges include: 1) Different tokenization and stemming requirements per language, 2) Handling scripts with no word boundaries (Chinese, Japanese), 3) Dealing with diacritics and special characters, 4) Supporting right-to-left languages, and 5) Cross-language querying. Solutions include using language-specific analyzers in Elasticsearch, implementing language detection, using multilingual embeddings like mBERT or XLM-R, and maintaining language-specific indices when necessary.",
      },
    ],
  },
  {
    id: "bs-7",
    title: "Search Performance Optimization",
    lastMessage:
      "Optimize index configuration, implement caching, and use sharding strategies to improve search performance.",
    timestamp: "2024-04-04T11:30:00Z",
    messages: [
      { role: "user", content: "How can we make our search faster?" },
      {
        role: "assistant",
        content:
          "Optimize index configuration, implement caching, and use sharding strategies to improve search performance. Specific techniques include: 1) Proper index design with appropriate mappings and settings, 2) Implementing result caching for common queries, 3) Using filter caching for repetitive filters, 4) Optimizing hardware with sufficient memory and fast storage, 5) Implementing pagination limits and scroll APIs for large result sets, 6) Using appropriate sharding strategies based on data size, and 7) Monitoring and tuning JVM settings for Elasticsearch. Consider denormalizing data to reduce the need for joins or complex aggregations.",
      },
    ],
  },
  {
    id: "bs-8",
    title: "Autocomplete and Suggestions",
    lastMessage:
      "Use specialized data structures like tries or n-gram indices for fast prefix matching and suggestion generation.",
    timestamp: "2024-04-03T09:45:00Z",
    messages: [
      {
        role: "user",
        content: "What's the best way to implement search autocomplete?",
      },
      {
        role: "assistant",
        content:
          "Use specialized data structures like tries or n-gram indices for fast prefix matching and suggestion generation. Implementation approaches include: 1) Using completion suggester in Elasticsearch, 2) Implementing n-gram tokenization for partial matching, 3) Building a custom trie data structure for very fast lookups, 4) Using prefix queries with edge n-grams, and 5) Incorporating popularity signals to rank suggestions. For best user experience, implement type-ahead search that shows results as users type, not just suggestions. Consider context-aware suggestions based on user history or current category.",
      },
    ],
  },
  {
    id: "bs-9",
    title: "Search Analytics Implementation",
    lastMessage:
      "Track queries, clicks, and user journeys to identify opportunities for search improvement.",
    timestamp: "2024-04-02T14:15:00Z",
    messages: [
      { role: "user", content: "What search metrics should we be tracking?" },
      {
        role: "assistant",
        content:
          "Track queries, clicks, and user journeys to identify opportunities for search improvement. Key metrics include: 1) Zero-result rate (% of searches with no results), 2) Click-through rate (% of searches leading to clicks), 3) Mean reciprocal rank (how high clicked results appear), 4) Time to click (how long users take to find relevant results), 5) Search refinements (how often users modify queries), 6) Search exit rate (% of users who leave after searching), and 7) Search conversion rate (% of searches leading to desired actions). Segment metrics by query type, user type, and device for deeper insights.",
      },
    ],
  },
  {
    id: "bs-10",
    title: "Semantic Search Implementation",
    lastMessage:
      "Use transformer models to generate embeddings that capture meaning rather than just keywords.",
    timestamp: "2024-04-01T10:30:00Z",
    messages: [
      {
        role: "user",
        content: "How can we implement semantic search capabilities?",
      },
      {
        role: "assistant",
        content:
          "Use transformer models to generate embeddings that capture meaning rather than just keywords. Implementation steps include: 1) Choose an embedding model (e.g., sentence-transformers/all-MiniLM-L6-v2 or OpenAI embeddings), 2) Process your documents to create vector representations, 3) Store these vectors in a vector database or dense vector fields in Elasticsearch, 4) At query time, convert the query to a vector and perform similarity search, 5) Consider hybrid approaches that combine semantic and keyword search. For production systems, implement batching, caching, and potentially model quantization to improve performance.",
      },
    ],
  },
];
