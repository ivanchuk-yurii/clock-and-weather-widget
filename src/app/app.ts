import {
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Weather } from './weather/weather';
import { Timezone } from './timezone/timezone';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [CommonModule, Weather, Timezone],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private frameId = 0;

  readonly smallMarkers = this.createMarkers(60);
  readonly mediumMarkers = this.createMarkers(12);
  readonly largeMarkers = this.createMarkers(4);

  now = signal(new Date());
  timezone = signal('');

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
    }).formatToParts(this.now());

    return parts.reduce(
      (acc, part) => {
        acc[part.type] = part.value;
        return acc;
      },
      {} as Record<Intl.DateTimeFormatPartTypes, string>,
    );
  });

  date = computed(() => {
    const parts = this.dateParts();
    return `${parts.weekday}, ${parts.month} ${parts.year}`;
  });

  secondDeg = computed(() => {
    const now = this.now();
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

  ngOnInit() {
    this.updateNow();
  }

  ngOnDestroy() {
    this.document.defaultView?.cancelAnimationFrame(this.frameId);
  }

  private createMarkers(count: number): number[] {
    return Array.from({ length: count }, (_, i) => (360 / count) * i);
  }

  private updateNow() {
    if (!this.document.defaultView) return;

    this.now.set(new Date());
    this.frameId = this.document.defaultView.requestAnimationFrame(() => this.updateNow());
  }
}
