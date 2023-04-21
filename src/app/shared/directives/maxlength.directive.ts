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
    const target = $event.target as HTMLInputElement;
    const { value, type } = target;
    if (!this.maxLenght) {
      return;
    }

    if (!value) {
      return;
    }
    if (type == 'text') {
      this.validateString($event, value);
      return;
    }

    if (type == 'number') {
      this.validateNumbers(target, value, $event);
      return;
    }
  }

  validateString($event: InputEvent, value: string) {
    if (value.length > this.maxLenght) {
      ($event.target as HTMLInputElement).value = value.slice(
        0,
        this.maxLenght
      );
    }
  }

  validateNumbers(target: HTMLInputElement, value: string, $event: InputEvent) {
    ($event.target as HTMLInputElement).setAttribute(
      'max',
      `${this.maxLenght}`
    );
    const intPart = `${value}`.split('.')[0];
    if (!intPart.length) {
      return;
    }

    if (intPart.length > this.maxLenght) {
      const _intPart = intPart.slice(0, this.maxLenght);
      const val: string = `${Number(_intPart)}${value.slice(intPart.length)}`;
      ($event.target as HTMLInputElement).value = val;
    }

    if (value.length > 1 && value.startsWith('0') && !value.includes('.')) {
      ($event.target as HTMLInputElement).value = value.slice(1);
    }
  }
}
