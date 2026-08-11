import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { County, Locality } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly apiUrl = 'http://localhost:8080/location';

  constructor(private readonly httpClient: HttpClient) {}

  getCounties(): Observable<County[]> {
    return this.httpClient.get<County[]>(`${this.apiUrl}/counties`, {
      withCredentials: true,
    });
  }

  getLocalities(countyCode: string): Observable<Locality[]> {
    return this.httpClient.get<Locality[]>(
      `${this.apiUrl}/counties/${countyCode}/localities`,
      {
        withCredentials: true,
      },
    );
  }
}
