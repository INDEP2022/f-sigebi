import {
  Directive,
  ElementRef,
  HostListener,
  Optional,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[bsDatepicker]',
  host: {
    '(change)': '$event',
  },
})
export class DatePickerDirective {
  constructor(
    public ref: ElementRef<HTMLInputElement>,
    @Optional()
    @Self()
    private model: NgControl
  ) {}

  @HostListener('change', ['$event']) keyDown($event: InputEvent) {
    const value = ($event.target as HTMLInputElement).value;
    const validDate = new Date(value);
    if (validDate.getTime()) {
      return;
    }
    ($event.target as HTMLInputElement).value = '';
    if (this.model) {
      this.model.control.setErrors(null);
    }
  }
}
