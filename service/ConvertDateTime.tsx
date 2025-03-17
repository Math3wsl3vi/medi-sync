import moment from 'moment';

export const FormatDate = (timestamp: string | number | Date): number => {
    return new Date(timestamp).setHours(0, 0, 0, 0);
}

export const formatDateForText = (date: moment.Moment | Date): string => {
    return moment(date).format('L');
}
