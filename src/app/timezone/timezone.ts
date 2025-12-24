import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-timezone',
  templateUrl: './timezone.html',
  styleUrl: './timezone.scss',
})
export class Timezone {
  readonly value = input<string>();
  readonly valueChange = output<string>();

  readonly options = Intl.supportedValuesOf('timeZone');

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }
}
