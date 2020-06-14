import formatRelative from 'date-fns/formatRelative';
import formatAbsolute from 'date-fns/format';

type DateFormat = 'relative' | 'time';

export default function format(date: Date, format: DateFormat): string {
    switch (format) {
        case 'relative':
            const formatted = formatRelative(date, new Date());
            return formatted.charAt(0).toUpperCase() + formatted.slice(1);
        case 'time':
            return formatAbsolute(date, 'p');
        default:
            console.warn(`Format function was given invalid DateFormat: ${format}`);
            return formatAbsolute(date, 'P');
    }
}
