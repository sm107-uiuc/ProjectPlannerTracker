import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  urlOrOptions: string | { url: string, method: string, body?: any, headers?: Record<string, string> },
  options?: { method: string, body?: any, headers?: Record<string, string> }
): Promise<any> {
  let url: string;
  let fetchOptions: RequestInit = { credentials: "include" };

  // Handle overloaded function signature
  if (typeof urlOrOptions === 'string') {
    url = urlOrOptions;
    if (options) {
      fetchOptions.method = options.method;
      if (options.body) {
        fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
        fetchOptions.headers = { 
          'Content-Type': 'application/json',
          ...(options.headers || {})
        };
      } else if (options.headers) {
        fetchOptions.headers = options.headers;
      }
    } else {
      fetchOptions.method = 'GET';
    }
  } else {
    url = urlOrOptions.url;
    fetchOptions.method = urlOrOptions.method || 'GET';
    if (urlOrOptions.body) {
      fetchOptions.body = typeof urlOrOptions.body === 'string' ? urlOrOptions.body : JSON.stringify(urlOrOptions.body);
      fetchOptions.headers = { 
        'Content-Type': 'application/json',
        ...(urlOrOptions.headers || {})
      };
    } else if (urlOrOptions.headers) {
      fetchOptions.headers = urlOrOptions.headers;
    }
  }

  const res = await fetch(url, fetchOptions);
  await throwIfResNotOk(res);
  
  // Try to parse as JSON if possible
  try {
    return await res.json();
  } catch (e) {
    return res;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
