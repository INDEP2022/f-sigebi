import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoodPhotosService {
  deleteEvent = new Subject<boolean>();
  constructor() {}
}
