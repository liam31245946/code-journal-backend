export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

export async function readEntries(): Promise<Entry[]> {
  const response = await fetch('/api/entries');
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Entry[];
  return data;
}

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  const response = await fetch(`/api/entries/${entryId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Entry;
  return data;
}

export async function addEntry(entry: Entry): Promise<Entry> {
  const response = await fetch('/api/entries/', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Entry;
  return data;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const response = await fetch(`/api/entries/${entry.entryId}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = (await response.json()) as Entry;
  return data;
}

export async function removeEntry(entryId: number): Promise<void> {
  const response = await fetch(`/api/entries/${entryId}`, {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}
