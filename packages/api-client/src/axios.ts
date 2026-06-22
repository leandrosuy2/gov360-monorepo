import axios, { type AxiosInstance } from "axios";

export interface ApiClientConfig {
  baseURL: string;
  getToken?: () => string | null | undefined;
}

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((req) => {
    const token = config.getToken?.();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  client.interceptors.response.use((res) => {
    res.data = fixMojibakeDeep(res.data);
    return res;
  });

  return client;
}

const MOJIBAKE_MARKERS = [u(0x00c3), u(0x00c2), `${u(0x00e2)}${u(0x20ac)}`];

function u(code: number) {
  return String.fromCharCode(code);
}

function fixMojibake(value: string) {
  if (!MOJIBAKE_MARKERS.some((marker) => value.includes(marker))) return value;
  const replacements = new Map<string, string>([
    [u(0x00c3) + u(0x0080), "À"],
    [u(0x00c3) + u(0x0081), "Á"],
    [u(0x00c3) + u(0x0082), u(0x00c2)],
    [u(0x00c3) + u(0x0083), u(0x00c3)],
    [u(0x00c3) + u(0x0087), "Ç"],
    [u(0x00c3) + u(0x0089), "É"],
    [u(0x00c3) + u(0x008a), "Ê"],
    [u(0x00c3) + u(0x008d), "Í"],
    [u(0x00c3) + u(0x0093), "Ó"],
    [u(0x00c3) + u(0x0094), "Ô"],
    [u(0x00c3) + u(0x0095), "Õ"],
    [u(0x00c3) + u(0x009a), "Ú"],
    [u(0x00c3) + u(0x00a0), "à"],
    [u(0x00c3) + u(0x00a1), "á"],
    [u(0x00c3) + u(0x00a2), "â"],
    [u(0x00c3) + u(0x00a3), "ã"],
    [u(0x00c3) + u(0x00a7), "ç"],
    [u(0x00c3) + u(0x00a9), "é"],
    [u(0x00c3) + u(0x00aa), "ê"],
    [u(0x00c3) + u(0x00ad), "í"],
    [u(0x00c3) + u(0x00b3), "ó"],
    [u(0x00c3) + u(0x00b4), "ô"],
    [u(0x00c3) + u(0x00b5), "õ"],
    [u(0x00c3) + u(0x00ba), "ú"],
    [u(0x00c3) + u(0x00bc), "ü"],
    [u(0x00c2) + u(0x00b7), "·"],
    [u(0x00c2) + u(0x00ba), "º"],
    [u(0x00c2) + u(0x00aa), "ª"],
    [u(0x00e2) + u(0x20ac) + u(0x0153), "“"],
    [u(0x00e2) + u(0x20ac) + u(0x009d), "”"],
    [u(0x00e2) + u(0x20ac) + u(0x02dc), "‘"],
    [u(0x00e2) + u(0x20ac) + u(0x2122), "’"],
    [u(0x00e2) + u(0x20ac) + u(0x201c), "–"],
    [u(0x00e2) + u(0x20ac) + u(0x201d), "—"],
    [u(0x00e2) + u(0x20ac) + u(0x00a6), "…"],
  ]);
  return Array.from(replacements.entries()).reduce((text, [from, to]) => text.split(from).join(to), value);
}

function fixMojibakeDeep<T>(value: T): T {
  if (typeof value === "string") return fixMojibake(value) as T;
  if (Array.isArray(value)) return value.map((item) => fixMojibakeDeep(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, fixMojibakeDeep(item)]),
    ) as T;
  }
  return value;
}
