const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function sendChatMessage(message, history = []) {
  if (!API_URL) throw new Error("EXPO_PUBLIC_API_URL missing in .env");

  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
  const details = data?.details ? `\n${data.details}` : "";
  throw new Error((data?.error || "Chat request failed") + details);
}

  return data.reply;
}