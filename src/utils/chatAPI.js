const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function sendChatMessage(message, history = [], userId) {
  if (!API_URL) throw new Error("EXPO_PUBLIC_API_URL missing in .env");
  if (!userId) throw new Error("Please log in to chat.");

  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, userId }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const details = data?.details ? `\n${data.details}` : "";
    throw new Error((data?.error || "Chat request failed") + details);
  }

  return data.reply;
}