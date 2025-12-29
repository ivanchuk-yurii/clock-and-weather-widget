import {
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  signal,
} from '@angular/core';
import { Clock } from './clock/clock';
import { Weather } from './weather/weather';
import { Timezone } from './timezone/timezone';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Clock, Weather, Timezone],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private frameId = 0;

  now = signal(new Date());
  timezone = signal('');

  ngOnInit() {
    this.updateNow();
  }

  ngOnDestroy() {
    this.document.defaultView?.cancelAnimationFrame(this.frameId);
  }

  private updateNow() {
    if (!this.document.defaultView) return;

    this.now.set(new Date());
    this.frameId = this.document.defaultView.requestAnimationFrame(() => this.updateNow());
  }
}
