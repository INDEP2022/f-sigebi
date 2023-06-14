import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'input[bsDatepicker]',
  host: {
    '(input)': '$event',
  },
})
export class DatePickerDirective {
  constructor(public ref: ElementRef<HTMLInputElement>) {
    this.ref.nativeElement.readOnly = true;
    this.ref.nativeElement.style.backgroundColor = 'white';
  }

  //   @HostListener('input', ['$event']) onInput($event: InputEvent) {
  //     ($event.target as HTMLInputElement).readOnly = true;
  //   }
}
