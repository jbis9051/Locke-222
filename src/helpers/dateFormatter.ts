import formatRelative from 'date-fns/formatRelative';

export default function format(date: Date): string {
    const formatted = formatRelative(date, new Date());
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
