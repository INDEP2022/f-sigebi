import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[uppercase],textarea[uppercase],',
  host: {
    '(input)': '$event',
  },
})
export class UppercaseDirective {
  constructor(public ref: ElementRef) {}

  @HostListener('input', ['$event']) onInput($event: InputEvent) {
    const value = ($event.target as HTMLInputElement).value;

    if (!value) {
      return;
    }

    ($event.target as HTMLInputElement).value = value.toLocaleUpperCase();
  }
}
