
export const makeFirstLetterUpperCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatTimestampToReadableDate(timestamp: any) {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }