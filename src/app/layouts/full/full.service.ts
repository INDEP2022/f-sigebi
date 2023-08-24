import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FullService {
  generatingFileFlag = new Subject<{
    progress: number;
    showText: boolean;
    text?: string;
  }>();
}
