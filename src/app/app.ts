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

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [CommonModule, Weather],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private frameId = 0;

  readonly smallMarkers = this.createMarkers(60);
  readonly mediumMarkers = this.createMarkers(12);
  readonly largeMarkers = this.createMarkers(4);

  now = signal(new Date());

  date = computed(() => {
    const now = this.now();
    const weekday = now.toLocaleDateString(undefined, { weekday: 'short' });
    const date = now.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
    });

    return `${weekday}, ${date}`;
  });

  secondDeg = computed(() => {
    const now = this.now();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    return seconds * 6;
  });

  minuteDeg = computed(() => {
    const now = this.now();
    const minutes = now.getMinutes() + now.getSeconds() / 60;
    return minutes * 6;
  });

  hourDeg = computed(() => {
    const now = this.now();
    const hours = (now.getHours() % 12) + now.getMinutes() / 60;
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
