import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShowHideAuthErrorInterceptorService {
  showError = true;
  constructor() {}
}
