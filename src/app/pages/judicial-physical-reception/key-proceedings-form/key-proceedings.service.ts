import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyProceedingsService {
  changeType = new Subject<string>();
  detail: any;
  transfers: any[] = [];
  constructor() {}
}
