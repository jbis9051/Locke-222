export function isNotNullish<T>(item: T | null | undefined): item is T {
    return item !== null && item !== undefined;
}

export async function fetchJsonAsType<T>(...args: Parameters<typeof fetch>): Promise<T> {
    const response = await fetch(...args);
    return (await response.json()) as T;
}
