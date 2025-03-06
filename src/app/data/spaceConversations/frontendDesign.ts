import { Conversation } from "../mockConversations";

export const frontendDesignConversations: Conversation[] = [
  {
    id: "fd-1",
    title: "CSS Grid vs Flexbox",
    lastMessage:
      "Grid is two-dimensional while Flexbox is one-dimensional. Use Grid for layouts and Flexbox for components.",
    timestamp: "2024-04-10T14:23:00Z",
    messages: [
      { role: "user", content: "When should I use CSS Grid vs Flexbox?" },
      {
        role: "assistant",
        content:
          "Grid is two-dimensional while Flexbox is one-dimensional. Use Grid for layouts and Flexbox for components. Grid is better for overall page layout, while Flexbox excels at arranging items in a row or column. You can also nest them - use Grid for the page structure and Flexbox for component alignment within Grid cells.",
      },
    ],
  },
  {
    id: "fd-2",
    title: "Responsive design best practices",
    lastMessage:
      "Start with mobile-first design, use relative units like rem, and implement breakpoints strategically.",
    timestamp: "2024-04-09T10:15:00Z",
    messages: [
      {
        role: "user",
        content:
          "What are the best practices for responsive web design in 2024?",
      },
      {
        role: "assistant",
        content:
          "Start with mobile-first design, use relative units like rem, and implement breakpoints strategically. Also consider using CSS Grid and container queries for more flexible layouts. Test on real devices and ensure touch targets are at least 44x44px for accessibility.",
      },
    ],
  },
  {
    id: "fd-3",
    title: "Optimizing React rendering",
    lastMessage:
      "Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders.",
    timestamp: "2024-04-08T16:45:00Z",
    messages: [
      {
        role: "user",
        content: "My React app is rendering too often. How can I optimize it?",
      },
      {
        role: "assistant",
        content:
          "Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders. Also consider using the React DevTools profiler to identify performance bottlenecks. For large lists, implement virtualization with libraries like react-window or react-virtualized.",
      },
    ],
  },
  {
    id: "fd-4",
    title: "Accessible form design",
    lastMessage:
      "Always use labels, provide clear error messages, and ensure keyboard navigation works properly.",
    timestamp: "2024-04-07T09:30:00Z",
    messages: [
      { role: "user", content: "How do I make my forms more accessible?" },
      {
        role: "assistant",
        content:
          "Always use labels, provide clear error messages, and ensure keyboard navigation works properly. Use ARIA attributes when necessary, but prefer semantic HTML. Test with screen readers and ensure sufficient color contrast. Group related fields with fieldset and legend elements.",
      },
    ],
  },
  {
    id: "fd-5",
    title: "CSS-in-JS vs CSS Modules",
    lastMessage:
      "CSS Modules offer better performance with less runtime overhead, while CSS-in-JS provides more dynamic styling capabilities.",
    timestamp: "2024-04-06T13:20:00Z",
    messages: [
      {
        role: "user",
        content: "What's better for a React project: CSS-in-JS or CSS Modules?",
      },
      {
        role: "assistant",
        content:
          "CSS Modules offer better performance with less runtime overhead, while CSS-in-JS provides more dynamic styling capabilities. CSS Modules are simpler and work well with SSR, while CSS-in-JS libraries like styled-components offer better developer experience for component-based architecture. Consider your project's specific needs and performance requirements.",
      },
    ],
  },
  {
    id: "fd-6",
    title: "Design system implementation",
    lastMessage:
      "Start with core components, establish naming conventions, and document everything thoroughly.",
    timestamp: "2024-04-05T11:10:00Z",
    messages: [
      {
        role: "user",
        content:
          "How should we approach implementing a design system for our product?",
      },
      {
        role: "assistant",
        content:
          "Start with core components, establish naming conventions, and document everything thoroughly. Use tools like Storybook for component documentation and testing. Involve both designers and developers from the beginning. Define tokens for colors, typography, spacing, etc. Consider using a monorepo structure if you need to support multiple platforms.",
      },
    ],
  },
  {
    id: "fd-7",
    title: "Animation performance tips",
    lastMessage:
      "Stick to animating transform and opacity properties, use will-change sparingly, and avoid layout thrashing.",
    timestamp: "2024-04-04T15:40:00Z",
    messages: [
      {
        role: "user",
        content: "How can I make my web animations more performant?",
      },
      {
        role: "assistant",
        content:
          "Stick to animating transform and opacity properties, use will-change sparingly, and avoid layout thrashing. Use requestAnimationFrame for JavaScript animations and consider using the Web Animations API for more complex sequences. Test performance with Chrome DevTools' Performance panel and aim for 60fps.",
      },
    ],
  },
  {
    id: "fd-8",
    title: "Next.js vs Remix",
    lastMessage:
      "Next.js has a larger ecosystem and more flexibility, while Remix offers a more opinionated approach to data loading and mutations.",
    timestamp: "2024-04-03T09:15:00Z",
    messages: [
      {
        role: "user",
        content: "Should I use Next.js or Remix for my new React project?",
      },
      {
        role: "assistant",
        content:
          "Next.js has a larger ecosystem and more flexibility, while Remix offers a more opinionated approach to data loading and mutations. Next.js is more established with better documentation and community support. Remix has excellent nested routing and error boundary handling. Consider your team's experience and specific project requirements when choosing.",
      },
    ],
  },
];
