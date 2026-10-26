async function request<T>(path: string, body?: object): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, body ? {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    } : undefined);
  } catch {
    throw new Error('Unable to reach PaymentLab. Check that the API is running, then try again.');
  }

  if (!response.ok) {
    const error: unknown = await response.json().catch(() => null);
    if (typeof error === 'object' && error !== null) {
      for (const key of ['error', 'title'] as const) {
        if (key in error && typeof error[key as keyof typeof error] === 'string') {
          throw new Error(String(error[key as keyof typeof error]));
        }
      }
    }
    throw new Error(`Request failed (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export { request };
