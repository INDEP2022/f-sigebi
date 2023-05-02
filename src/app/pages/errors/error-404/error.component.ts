import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  constructor(private location: Location) {}

  ngOnInit(): void {}

  return(): void {
    this.location.back();
  }
}
