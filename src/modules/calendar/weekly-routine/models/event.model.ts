export class EventModel {

    title: string;
    date: Date;
    duration: {start: string; end: string};
    startHour: string;
    startMinute: string;
    meridian: 'am' | 'pm' | 'AM' | 'PM';

}
