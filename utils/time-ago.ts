export interface TimeData {
  seconds: number;
  nanoseconds: number;
}

export function timeAgo(data: TimeData): string {
  const dateInSeconds = data.seconds;
  const nowInSeconds = Math.floor(Date.now() / 1000); // Current time in seconds

  const diffInSeconds = nowInSeconds - dateInSeconds;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else {
    return `${diffInDays} days ago`;
  }
}
