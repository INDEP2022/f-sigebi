import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  invokeFirstComponentFunction = new EventEmitter();
  invokeSecondComponentFunction = new EventEmitter();
  subsVar: Subscription;
  subsCheck: Subscription;

  constructor() {}

  onFirstComponentButtonClick(data: any) {
    this.invokeFirstComponentFunction.emit(data);
  }

  onFirstComponentCheckClick(data: any) {
    this.invokeSecondComponentFunction.emit(data);
  }
}
