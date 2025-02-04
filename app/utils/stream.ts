export const handleTreatStream = async (
  url: string,
  fetchOptions: any,
  onChunk?: (chunks: Uint8Array[], str: string, oneStream: string) => void
) => {
  const response = await fetch(url, fetchOptions);
  const reader = response.body?.getReader();
  const chunks = [];
  let blob = "";
  while (true) {
    const { done, value } = await reader?.read()!;
    if (done) break;
    chunks.push(value);
    const toText = await Promise.all([
      new Blob(chunks).text(),
      new Blob([value]).text(),
    ]);
    blob = toText[0];
    onChunk?.(chunks, blob, toText[1]);
  }
  return { chunks, blob };
};

export function parsePerStream(oneStream: string): any[] {
  let _oneStream = oneStream.replaceAll("[", "").replaceAll("]", "");
  if (!_oneStream) return [];
  if (_oneStream.startsWith(",")) {
    _oneStream = _oneStream.slice(1);
  }
  _oneStream = `[${_oneStream}]`;
  const item = JSON.parse(_oneStream);
  return item
}



