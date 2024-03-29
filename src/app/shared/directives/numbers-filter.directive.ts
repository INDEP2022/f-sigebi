import { Directive, ElementRef, HostListener } from '@angular/core';
const INVALID_CHARS = ['+', '-', 'e', 'E'];
@Directive({
  selector: 'input[type=number]',
  host: {
    '(keydown)': '$event',
  },
})
export class NumbersFilterDirective {
  constructor(public ref: ElementRef) {
    (this.ref.nativeElement as HTMLInputElement).min = '0';
  }

  @HostListener('keydown', ['$event']) onInput($event: KeyboardEvent) {
    if (this.ref.nativeElement)
      if (INVALID_CHARS.includes($event.key)) {
        $event.preventDefault();
      }
  }
}
