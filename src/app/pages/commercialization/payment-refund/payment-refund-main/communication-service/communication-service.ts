import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private changeValSelectSource = new Subject<boolean>();
  changeValSelect$ = this.changeValSelectSource.asObservable();

  async changeValSelect(val: boolean) {
    return this.changeValSelectSource.next(val);
  }
}
