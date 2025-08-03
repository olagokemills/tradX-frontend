import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date, format: 'short' | 'medium' | 'long' = 'medium'): string {
    if (!value) return '';

    const date = new Date(value);

    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    let options: Intl.DateTimeFormatOptions;

    switch (format) {
      case 'short':
        options = {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        };
        break;
      case 'medium':
        options = {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        };
        break;
      case 'long':
        options = {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        };
        break;
      default:
        options = {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        };
    }

    return date.toLocaleDateString('en-US', options);
  }
}
