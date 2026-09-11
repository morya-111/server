import axios from "axios";
import crypto from "crypto";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET = "" } = process.env;

const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "images";

const authHeaders = () => ({
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
});

// Uploads a file to the public storage bucket and returns its public URL.
export const uploadToStorage = async (
  buffer: Buffer,
  contentType: string,
  extension: string
) => {
  const path = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${extension}`;

  await axios.post(
    `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`,
    buffer,
    {
      headers: { ...authHeaders(), "Content-Type": contentType },
      maxBodyLength: Infinity,
    }
  );

  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
};

// Unguessable per-user Realtime topic. Only the logged-in user is told theirs
// (via /v1/chats/channel), so knowing someone's id isn't enough to listen in.
export const userTopic = (userId: number) => {
  const sig = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`chat:${userId}`)
    .digest("hex")
    .slice(0, 32);
  return `chat-${userId}-${sig}`;
};

// Pushes an event to the given users' Realtime topics over the REST API.
export const broadcastToUsers = async (
  userIds: number[],
  event: string,
  payload: unknown
) => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;

  await axios.post(
    `${SUPABASE_URL}/realtime/v1/api/broadcast`,
    {
      messages: userIds.map((id) => ({
        topic: userTopic(id),
        event,
        payload: { data: payload },
      })),
    },
    { headers: authHeaders() }
  );
};
