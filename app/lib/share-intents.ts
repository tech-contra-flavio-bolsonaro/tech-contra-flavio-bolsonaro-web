function shareText(title: string, description?: string) {
  return description?.trim() ? `${title}\n\n${description.trim()}` : title;
}

function createIntentUrl(endpoint: string, title: string, url: string, description?: string) {
  const intent = new URL(endpoint);
  intent.searchParams.set("text", shareText(title, description));
  intent.searchParams.set("url", url);
  return intent.toString();
}

export function xShareIntent(title: string, url: string, description?: string) {
  return createIntentUrl("https://twitter.com/intent/tweet", title, url, description);
}

export function threadsShareIntent(title: string, url: string, description?: string) {
  return createIntentUrl("https://www.threads.com/intent/post", title, url, description);
}
