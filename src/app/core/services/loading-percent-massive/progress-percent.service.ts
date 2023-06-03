import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProgressPercentService extends HttpService {
  constructor(private http: HttpClient) {
    super();
  }

  getPercent() {
    let route = `https://indep-c6124-default-rtdb.firebaseio.com/massive-charge.json`;
    return this.http.get(`${route}`, {
      headers: { 'content-type': 'application/json' },
    });
  }
}
