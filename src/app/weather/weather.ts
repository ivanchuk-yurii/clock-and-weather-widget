import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherResponse } from './weather.interface';
import { Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.html',
  styleUrl: './weather.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Weather {
  private readonly document = inject(DOCUMENT);
  private readonly httpClient = inject(HttpClient);
  readonly iconUrl = environment.iconUrl;

  private readonly coordinates$ = new Observable<GeolocationCoordinates>((subscriber) => {
    this.document.defaultView?.navigator.geolocation.getCurrentPosition(
      (position) => {
        subscriber.next(position.coords);
        subscriber.complete();
      },
      (error) => {
        alert('Location is not available');
        subscriber.error(error);
      },
      { enableHighAccuracy: true },
    );
  });
  readonly weather$ = this.coordinates$.pipe(
    switchMap(({ latitude, longitude }) => this.getWeather(latitude, longitude)),
  );

  private getWeather(lat: number, lon: number): Observable<WeatherResponse> {
    return this.httpClient.get<WeatherResponse>(environment.apiUrl, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: environment.apiKey,
      },
    });
  }
}
