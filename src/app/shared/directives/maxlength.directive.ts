import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[max-length],textarea[max-length]',
  host: {
    '(input)': '$event',
  },
})
export class MaxLengthDirective {
  lastValue: string;
  @Input('max-length') maxLenght: number = null;

  constructor(public ref: ElementRef) {}

  @HostListener('input', ['$event']) onInput($event: InputEvent) {
    console.log($event.target as HTMLInputElement);
    const value = ($event.target as HTMLInputElement).value;
    if (!this.maxLenght) {
      return;
    }

    if (!value) {
      return;
    }

    if (value.length > this.maxLenght) {
      ($event.target as HTMLInputElement).value = value.slice(
        0,
        this.maxLenght
      );
    }
  }
}
