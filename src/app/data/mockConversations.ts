export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
}

export const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Design System Component Library",
    lastMessage:
      "I recommend using Radix UI primitives as the foundation, then building your custom components on top of that.",
    timestamp: "2024-03-10T10:00:00Z",
    messages: [
      {
        role: "user",
        content:
          "We're starting a new design system. Should we build everything from scratch or use existing component libraries?",
      },
      {
        role: "assistant",
        content:
          "I recommend using Radix UI primitives as the foundation, then building your custom components on top of that. Radix provides accessible, unstyled components that handle complex interactions (dropdowns, modals, etc.). You can then add your styling using Tailwind or CSS-in-JS. This gives you the best of both worlds - battle-tested accessibility and behavior, with full visual customization. For icons, consider using a consistent set like Phosphor or Lucide. Document everything in Storybook and set up visual regression testing with Chromatic.",
      },
    ],
  },
  {
    id: "2",
    title: "Service Mesh Implementation",
    lastMessage:
      "For your scale, I'd start with Istio in evaluation mode. Here's how to gradually roll it out...",
    timestamp: "2024-03-09T15:30:00Z",
    messages: [
      {
        role: "user",
        content:
          "Our microservices are getting complex to manage. Would implementing a service mesh help? We have about 20 services in production.",
      },
      {
        role: "assistant",
        content:
          "For your scale, I'd start with Istio in evaluation mode. Here's how to gradually roll it out: 1) First, deploy Istio to your staging environment and inject it into a few non-critical services, 2) Monitor the overhead - you'll see some latency increase but it should be < 10ms, 3) Use the built-in Kiali dashboard to visualize service dependencies, 4) Gradually enable features like mutual TLS, circuit breaking, and traffic splitting, 5) Once comfortable, roll out to production using the canary pattern, starting with newer services first. The operational complexity is worth it if you need features like advanced load balancing, detailed metrics, or security policies.",
      },
    ],
  },
  {
    id: "3",
    title: "LLM API Integration",
    lastMessage:
      "Here's a pattern for handling streaming responses with proper error handling and retry logic...",
    timestamp: "2024-03-09T13:15:00Z",
    messages: [
      {
        role: "user",
        content:
          "What's the best way to integrate OpenAI's API for streaming chat completions? We need proper error handling and retry logic.",
      },
      {
        role: "assistant",
        content:
          "Here's a pattern for handling streaming responses with proper error handling and retry logic: 1) Use exponential backoff for retries with max attempts, 2) Implement proper stream handling with AsyncIterators, 3) Add timeout handling for both the initial response and stream chunks, 4) Use a token buffer to handle partial tokens in streaming responses, 5) Implement proper cleanup on client disconnect. Here's a code example with TypeScript:\n\n```typescript\nconst MAX_RETRIES = 3;\nconst TIMEOUT = 30000;\n\nasync function* streamCompletion(prompt: string) {\n  let attempt = 0;\n  while (attempt < MAX_RETRIES) {\n    try {\n      const stream = await openai.chat.completions.create({\n        model: 'gpt-4',\n        messages: [{ role: 'user', content: prompt }],\n        stream: true,\n        timeout: TIMEOUT\n      });\n      \n      for await (const chunk of stream) {\n        yield chunk.choices[0]?.delta?.content || '';\n      }\n      return;\n    } catch (error) {\n      if (!isRetryableError(error) || attempt === MAX_RETRIES - 1) {\n        throw error;\n      }\n      await sleep(Math.pow(2, attempt) * 1000);\n      attempt++;\n    }\n  }\n}```",
      },
    ],
  },
  {
    id: "4",
    title: "React Server Components Migration",
    lastMessage:
      "Start by identifying components that don't need client interactivity...",
    timestamp: "2024-03-08T16:45:00Z",
    messages: [
      {
        role: "user",
        content:
          "We're migrating our Next.js app to use more RSC. What's a good strategy for identifying which components should be server vs client?",
      },
      {
        role: "assistant",
        content:
          "Start by identifying components that don't need client interactivity. Good candidates for server components are: 1) Data fetching components - move API calls to the server, 2) Static UI like headers, footers, and navigation, 3) Content-heavy components like blog posts or product descriptions. Keep as client components: 1) Anything with useState/useEffect, 2) Components using browser APIs, 3) Interactive UI like forms, modals, etc. Use the 'use client' directive sparingly. For data mutations, consider the new Server Actions API instead of client-side API calls. This can significantly reduce your client-side JavaScript.",
      },
    ],
  },
  {
    id: "5",
    title: "Database Query Optimization",
    lastMessage:
      "The EXPLAIN ANALYZE shows a sequential scan. Here's how to optimize it...",
    timestamp: "2024-03-08T11:20:00Z",
    messages: [
      {
        role: "user",
        content:
          "This query is taking 5+ seconds: SELECT * FROM orders WHERE status = 'pending' AND created_at > NOW() - INTERVAL '24 hours' ORDER BY total_amount DESC",
      },
      {
        role: "assistant",
        content:
          "The EXPLAIN ANALYZE shows a sequential scan. Here's how to optimize it: 1) First, create a composite index: CREATE INDEX idx_orders_status_created_at ON orders (status, created_at DESC); 2) Consider adding total_amount to the index to make it covering: CREATE INDEX idx_orders_status_created_amount ON orders (status, created_at DESC, total_amount DESC); 3) If you don't need all columns, specify them explicitly instead of using SELECT *. 4) If this is for a dashboard, consider materializing the results periodically or caching them with a 5-minute TTL since this is recent data. The optimized query should run in < 100ms.",
      },
    ],
  },
  {
    id: "6",
    title: "Kubernetes Resource Planning",
    lastMessage:
      "Based on your metrics, I'd recommend setting the following resource limits...",
    timestamp: "2024-03-07T14:30:00Z",
    messages: [
      {
        role: "user",
        content:
          "Our Node.js API pods keep getting OOMKilled. Current limits are 512Mi memory, 500m CPU. Average load is 100 req/s with spikes to 500 req/s.",
      },
      {
        role: "assistant",
        content:
          "Based on your metrics, I'd recommend setting the following resource limits: 1) Memory: requests=512Mi, limits=1Gi - Node.js has a default heap limit of 512MB, plus you need overhead for the V8 engine and your app, 2) CPU: requests=500m, limits=1000m - this allows for CPU bursting during traffic spikes. Also: 1) Enable Node.js flags: --max-old-space-size=512 to prevent unbounded growth, 2) Implement horizontal pod autoscaling based on CPU utilization (target 70%), 3) Consider using Vertical Pod Autoscaling in recommendation mode to get data-driven resource suggestions. Monitor garbage collection metrics to ensure you're not hitting memory pressure.",
      },
    ],
  },
  {
    id: "7",
    title: "Image Optimization Pipeline",
    lastMessage:
      "Here's an automated pipeline using Sharp and CloudFront for responsive images...",
    timestamp: "2024-03-07T09:15:00Z",
    messages: [
      {
        role: "user",
        content:
          "We need to serve responsive images for our e-commerce product pages. Requirements: multiple sizes, WebP support, fast delivery, and automated processing.",
      },
      {
        role: "assistant",
        content:
          "Here's an automated pipeline using Sharp and CloudFront for responsive images: 1) Upload original images to S3, 2) Trigger Lambda function on upload to generate variants: thumbnail (200w), mobile (640w), tablet (1024w), desktop (1600w), 3) Use Sharp to convert to WebP with quality=80, 4) Generate picture element markup with srcset and sizes, 5) Serve via CloudFront with Cache-Control: max-age=31536000. Example implementation:\n\n```typescript\nimport sharp from 'sharp';\n\nconst SIZES = [200, 640, 1024, 1600];\n\nasync function processImage(buffer: Buffer, filename: string) {\n  const variants = await Promise.all(\n    SIZES.map(async width => {\n      const webp = await sharp(buffer)\n        .resize(width, null, { fit: 'inside' })\n        .webp({ quality: 80 })\n        .toBuffer();\n      return uploadToS3(webp, `${filename}-${width}.webp`);\n    })\n  );\n  return generatePictureMarkup(filename, variants);\n}```",
      },
    ],
  },
  {
    id: "8",
    title: "GraphQL Schema Design",
    lastMessage:
      "For the product catalog, I'd structure the schema like this to optimize for common queries...",
    timestamp: "2024-03-06T16:40:00Z",
    messages: [
      {
        role: "user",
        content:
          "How should we structure our GraphQL schema for a product catalog? Need to support: categories, variants, inventory, pricing, and related products.",
      },
      {
        role: "assistant",
        content:
          "For the product catalog, I'd structure the schema like this to optimize for common queries:\n\n```graphql\ntype Product {\n  id: ID!\n  slug: String!\n  name: String!\n  description: String\n  category: Category!\n  variants: [ProductVariant!]!\n  pricing: ProductPricing!\n  inventory: ProductInventory!\n  relatedProducts(limit: Int = 5): [Product!]!\n  specifications: [ProductSpecification!]!\n  createdAt: DateTime!\n  updatedAt: DateTime!\n}\n\ntype ProductVariant {\n  id: ID!\n  sku: String!\n  attributes: [ProductAttribute!]!\n  pricing: ProductPricing!\n  inventory: ProductInventory!\n}\n\ntype ProductPricing {\n  basePrice: Money!\n  discountedPrice: Money\n  discount: ProductDiscount\n  currency: String!\n}\n\ntype ProductInventory {\n  inStock: Boolean!\n  quantity: Int!\n  availableAt: DateTime\n}\n```\n\nImplement dataloaders for related products and categories to prevent N+1 queries. Use cursor-based pagination for product lists. Consider implementing field-level caching with Redis for frequently accessed fields like pricing and inventory.",
      },
    ],
  },
  {
    id: "9",
    title: "CI Pipeline Optimization",
    lastMessage:
      "Your tests are running sequentially. Here's how to parallelize them...",
    timestamp: "2024-03-06T11:25:00Z",
    messages: [
      {
        role: "user",
        content:
          "Our CI pipeline is taking 45 minutes to run. Stack: Next.js, Jest, Playwright. Main bottlenecks seem to be unit tests (2000 tests) and E2E tests (200 tests).",
      },
      {
        role: "assistant",
        content:
          "Your tests are running sequentially. Here's how to parallelize them: 1) Split Jest tests across multiple runners: jest --shard=1/4 for 4 shards, 2) Run Playwright tests in parallel: playwright test --workers=5, 3) Implement proper test isolation to avoid state conflicts, 4) Cache node_modules and Next.js build output, 5) Run unit and E2E tests in parallel jobs. Here's a GitHub Actions workflow:\n\n```yaml\njobs:\n  unit-tests:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        shard: [1, 2, 3, 4]\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n      - run: npm ci\n      - run: npm test -- --shard=${{matrix.shard}}/4\n\n  e2e-tests:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n      - run: npm ci\n      - run: npx playwright install --with-deps\n      - run: npm run test:e2e -- --workers=5\n```\n\nThis should reduce the pipeline time to ~15 minutes.",
      },
    ],
  },
  {
    id: "10",
    title: "AWS Cost Optimization",
    lastMessage:
      "Your RDS instances are oversized. Here's a right-sizing analysis...",
    timestamp: "2024-03-05T15:50:00Z",
    messages: [
      {
        role: "user",
        content:
          "Our AWS bill jumped 40% last month. Current setup: 10 t3.large EC2, 3 r6g.xlarge RDS, 2 elasticache.r6g.large. Average CPU: EC2 30%, RDS 20%, Redis 25%.",
      },
      {
        role: "assistant",
        content:
          "Your RDS instances are oversized. Here's a right-sizing analysis: 1) RDS: Switch to r6g.large, saving $500/month. CPU headroom is excessive, 2) EC2: Move to t3.medium with unlimited credits. At 30% CPU, t3.medium is more cost-effective, saving $300/month, 3) ElastiCache: Current size is good for memory requirements. Recommendations: 1) Implement auto-scaling for EC2 based on CPU utilization (target 70%), 2) Use RDS multi-AZ only for prod, 3) Enable detailed monitoring and set up AWS Budget alerts, 4) Tag all resources for cost allocation, 5) Consider savings plans for EC2 and RDS. Total potential savings: ~$800/month.",
      },
    ],
  },
  {
    id: "11",
    title: "OAuth2 Implementation",
    lastMessage:
      "For mobile apps, use PKCE flow. Here's a secure implementation...",
    timestamp: "2024-03-05T10:20:00Z",
    messages: [
      {
        role: "user",
        content:
          "We're adding OAuth2 to our mobile app. Need to support Google, Apple, and email/password. What's the most secure approach?",
      },
      {
        role: "assistant",
        content:
          'For mobile apps, use PKCE flow. Here\'s a secure implementation: 1) Generate code verifier: random 32-byte string base64URL encoded, 2) Generate code challenge: SHA256 hash of verifier, 3) Store tokens in secure keychain/keystore, not SharedPreferences/UserDefaults, 4) Implement proper token rotation and refresh flow. Example native implementation:\n\n```swift\nclass OAuth2Manager {\n  func generateCodeVerifier() -> String {\n    var buffer = [UInt8](repeating: 0, count: 32)\n    _ = SecRandomCopyBytes(kSecRandomDefault, buffer.count, &buffer)\n    return Data(buffer).base64EncodedString()\n      .replacingOccurrences(of: "+", with: "-")\n      .replacingOccurrences(of: "/", with: "_")\n      .replacingOccurrences(of: "=", with: "")\n  }\n  \n  func generateCodeChallenge(verifier: String) -> String {\n    guard let data = verifier.data(using: .utf8) else { return "" }\n    var buffer = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))\n    data.withUnsafeBytes {\n      _ = CC_SHA256($0.baseAddress, CC_LONG(data.count), &buffer)\n    }\n    return Data(buffer).base64EncodedString()\n      .replacingOccurrences(of: "+", with: "-")\n      .replacingOccurrences(of: "/", with: "_")\n      .replacingOccurrences(of: "=", with: "")\n  }\n}```\n\nAlso implement proper scope handling and token revocation on logout.',
      },
    ],
  },
  {
    id: "12",
    title: "React Native Architecture",
    lastMessage: "For your requirements, I'd structure the app like this...",
    timestamp: "2024-03-04T14:10:00Z",
    messages: [
      {
        role: "user",
        content:
          "Planning a new React Native app. Need offline support, push notifications, deep linking, and analytics. What's a good architecture?",
      },
      {
        role: "assistant",
        content:
          "For your requirements, I'd structure the app like this: 1) State Management: Use Zustand for global state, React Query for server state with offline persistence, 2) Navigation: React Navigation with deep link configuration, 3) Storage: Watermelon DB for offline-first data sync, 4) Notifications: React Native Firebase for push notifications, 5) Analytics: Segment for event tracking with offline queue. Project structure:\n\n```\nsrc/\n  ├── api/           # API client and endpoints\n  ├── components/    # Reusable UI components\n  ├── features/      # Feature-based modules\n  ├── navigation/    # Navigation configuration\n  ├── stores/        # Zustand stores\n  ├── theme/         # Design tokens and styles\n  ├── utils/         # Helper functions\n  └── App.tsx        # Root component\n```\n\nImplement proper error boundaries and loading states. Use CodePush for OTA updates. Consider using Detox for E2E testing.",
      },
    ],
  },
];
