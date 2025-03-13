import { redirect } from "next/navigation";

export default function ConversationsPage() {
  // Redirect to home page if someone tries to access /conversations directly
  redirect("/");
}
