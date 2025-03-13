import { Conversation } from "../mockConversations";

export const securityPracticesConversations: Conversation[] = [
  {
    id: "sp-1",
    title: "OWASP Top 10 Vulnerabilities",
    lastMessage:
      "The most critical web application security risks include injection, broken authentication, and sensitive data exposure.",
    timestamp: "2025-04-10T16:45:00Z",
    messages: [
      {
        role: "user",
        content:
          "What are the OWASP Top 10 vulnerabilities we should be aware of?",
      },
      {
        role: "assistant",
        content:
          "The most critical web application security risks include injection, broken authentication, and sensitive data exposure. The current OWASP Top 10 also includes broken access control, security misconfiguration, vulnerable components, identification and authentication failures, software and data integrity failures, security logging and monitoring failures, and server-side request forgery. Each of these represents a significant risk that should be addressed in your security strategy.",
      },
    ],
  },
  {
    id: "sp-2",
    title: "Implementing MFA",
    lastMessage:
      "Use time-based one-time passwords (TOTP), SMS verification, or hardware security keys for stronger authentication.",
    timestamp: "2024-04-09T13:30:00Z",
    messages: [
      {
        role: "user",
        content:
          "What's the best way to implement multi-factor authentication in our application?",
      },
      {
        role: "assistant",
        content:
          "Use time-based one-time passwords (TOTP), SMS verification, or hardware security keys for stronger authentication. TOTP apps like Google Authenticator or Authy are generally more secure than SMS. Consider using WebAuthn for the most secure option with biometrics or security keys. Make sure to provide recovery options and clear user guidance. Libraries like Passport.js (Node.js) or django-mfa (Python) can help with implementation.",
      },
    ],
  },
  {
    id: "sp-3",
    title: "API Security Best Practices",
    lastMessage:
      "Use OAuth 2.0 with proper scopes, implement rate limiting, and validate all inputs thoroughly.",
    timestamp: "2024-04-08T11:15:00Z",
    messages: [
      { role: "user", content: "How can we secure our REST APIs?" },
      {
        role: "assistant",
        content:
          "Use OAuth 2.0 with proper scopes, implement rate limiting, and validate all inputs thoroughly. Always use HTTPS and consider using API keys for service-to-service communication. Implement proper error handling that doesn't leak sensitive information. Use security headers like Content-Security-Policy and consider using an API gateway for centralized security controls. Regularly audit API access and implement logging for security events.",
      },
    ],
  },
  {
    id: "sp-4",
    title: "Secure Password Storage",
    lastMessage:
      "Use a strong hashing algorithm like bcrypt, Argon2, or PBKDF2 with appropriate work factors.",
    timestamp: "2024-04-07T15:20:00Z",
    messages: [
      {
        role: "user",
        content: "What's the most secure way to store user passwords?",
      },
      {
        role: "assistant",
        content:
          "Use a strong hashing algorithm like bcrypt, Argon2, or PBKDF2 with appropriate work factors. Never store passwords in plaintext or use weak algorithms like MD5 or SHA-1. Include a unique salt for each password and consider using a pepper (server-side secret). Regularly update your hashing algorithm as computing power increases. Most modern frameworks provide secure password handling libraries - use them instead of implementing your own.",
      },
    ],
  },
  {
    id: "sp-5",
    title: "Container Security",
    lastMessage:
      "Use minimal base images, scan for vulnerabilities, and implement proper access controls for your container registry.",
    timestamp: "2024-04-06T09:45:00Z",
    messages: [
      {
        role: "user",
        content: "How do we secure our Docker containers in production?",
      },
      {
        role: "assistant",
        content:
          "Use minimal base images, scan for vulnerabilities, and implement proper access controls for your container registry. Run containers with non-root users and read-only file systems where possible. Use tools like Trivy or Clair for vulnerability scanning in your CI/CD pipeline. Implement network policies to restrict container communication and use secrets management solutions instead of environment variables for sensitive data. Consider using a container security platform for runtime protection.",
      },
    ],
  },
  {
    id: "sp-6",
    title: "Security Headers Implementation",
    lastMessage:
      "Implement Content-Security-Policy, Strict-Transport-Security, and X-Content-Type-Options headers for better web security.",
    timestamp: "2024-04-05T14:10:00Z",
    messages: [
      {
        role: "user",
        content: "Which security headers should we add to our web application?",
      },
      {
        role: "assistant",
        content:
          "Implement Content-Security-Policy, Strict-Transport-Security, and X-Content-Type-Options headers for better web security. Also consider X-Frame-Options to prevent clickjacking, Referrer-Policy to control information leakage, and Permissions-Policy to limit browser features. Start with a restrictive CSP and adjust as needed. Use tools like securityheaders.com to validate your implementation. Most web frameworks have middleware or plugins to help set these headers correctly.",
      },
    ],
  },
  {
    id: "sp-7",
    title: "CSRF Protection Strategies",
    lastMessage:
      "Use anti-CSRF tokens in forms and implement the SameSite cookie attribute to prevent cross-site request forgery.",
    timestamp: "2024-04-04T10:30:00Z",
    messages: [
      {
        role: "user",
        content: "What's the best approach to prevent CSRF attacks?",
      },
      {
        role: "assistant",
        content:
          "Use anti-CSRF tokens in forms and implement the SameSite cookie attribute to prevent cross-site request forgery. The SameSite attribute should be set to 'Lax' or 'Strict' for session cookies. For APIs, consider using custom request headers that are blocked by CORS for cross-origin requests. Most modern frameworks include CSRF protection middleware - use it consistently across your application. Also implement proper CORS policies to restrict which domains can make requests to your API.",
      },
    ],
  },
  {
    id: "sp-8",
    title: "Security Code Review Process",
    lastMessage:
      "Establish a checklist of common vulnerabilities, use automated tools, and have dedicated security champions on each team.",
    timestamp: "2024-04-03T16:15:00Z",
    messages: [
      {
        role: "user",
        content:
          "How should we approach security code reviews in our development process?",
      },
      {
        role: "assistant",
        content:
          "Establish a checklist of common vulnerabilities, use automated tools, and have dedicated security champions on each team. Integrate static application security testing (SAST) tools into your CI/CD pipeline. Focus reviews on authentication, authorization, input validation, and data handling code. Create a security knowledge base for common issues and solutions. Consider periodic external security audits for critical components. Make security reviews a standard part of your pull request process.",
      },
    ],
  },
  {
    id: "sp-9",
    title: "Secure Coding Practices",
    lastMessage:
      "Validate all inputs, use parameterized queries, and follow the principle of least privilege in your code.",
    timestamp: "2024-04-02T11:45:00Z",
    messages: [
      {
        role: "user",
        content: "What secure coding practices should our developers follow?",
      },
      {
        role: "assistant",
        content:
          "Validate all inputs, use parameterized queries, and follow the principle of least privilege in your code. Never trust user input and always encode output to prevent XSS. Use secure defaults and fail securely. Keep dependencies updated and avoid using deprecated or vulnerable libraries. Implement proper error handling that doesn't expose sensitive information. Document security assumptions and requirements. Consider using a secure coding standard like OWASP ASVS as a reference.",
      },
    ],
  },
];
