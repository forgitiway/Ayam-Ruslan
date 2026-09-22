const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const PROJECT = process.env.NEXT_PUBLIC_PROJECT_ID;
const KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function apiFetch(
  path,
  { method = "GET", body, token } = {}
) {
  const headers = {
    Accept: "application/json",
    "X-API-Key": KEY,
  };

  if (token) {
    headers.Authorization = "Bearer " + token;
  }

  let verb = method.toUpperCase();
  let suffix = "";

  if (verb === "PUT" || verb === "DELETE") {
    headers["X-HTTP-Method-Override"] = verb;

    suffix =
      (path.indexOf("?") === -1 ? "?" : "&") +
      "_method=" +
      verb;

    verb = "POST";
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(
    BASE + "/" + PROJECT + path + suffix,
    {
      method: verb,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }
  );

 const text = await res.text();

console.log("STATUS API:", res.status);
console.log("RESPONSE API:", text);

let data = {};

try {
  data = text ? JSON.parse(text) : {};
} catch {
  throw new Error(
    `API mengembalikan response bukan JSON. Status: ${res.status}. Response: ${text.substring(
      0,
      300
    )}`
  );
}

if (!res.ok) {
  throw new Error(data.message || res.statusText);
}

return data;
}