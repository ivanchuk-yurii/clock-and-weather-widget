import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.html',
  styleUrl: './clock.scss',
  imports: [CommonModule],
})
export class Clock {
  readonly date = input<Date>(new Date());
  readonly timezone = input<string>();

  dateParts = computed(() => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: this.timezone() || undefined,
      year: 'numeric',
      month: 'short',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).formatToParts(this.date());

    return parts.reduce(
      (acc, part) => {
        acc[part.type] = part.value;
        return acc;
      },
      {} as Record<Intl.DateTimeFormatPartTypes, string>,
    );
  });

  displayDate = computed(() => {
    const parts = this.dateParts();
    return `${parts.weekday}, ${parts.month} ${parts.year}`;
  });

  secondDeg = computed(() => {
    const now = this.date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    return seconds * 6;
  });

  minuteDeg = computed(() => {
    const parts = this.dateParts();
    const minutes = +parts.minute + +parts.second / 60;
    return minutes * 6;
  });

  hourDeg = computed(() => {
    const parts = this.dateParts();
    const hours = +parts.hour + +parts.minute / 60;
    return hours * 30;
  });

  readonly smallMarkers = this.createMarkers(60);
  readonly mediumMarkers = this.createMarkers(12);
  readonly largeMarkers = this.createMarkers(4);

  private createMarkers(count: number): number[] {
    return Array.from({ length: count }, (_, i) => (360 / count) * i);
  }
}
