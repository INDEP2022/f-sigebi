import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoodsManagementService {
  selectedGoodSubject = new Subject<number>();
  constructor() {}
}
