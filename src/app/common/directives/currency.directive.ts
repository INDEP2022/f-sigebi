import { CurrencyPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[currencyFz]',
})
export default class CurrencyDirective {
  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CurrencyPipe
  ) {
    this.el = this.elementRef.nativeElement;
    this.setRegex();
  }

  @Input()
  set maxDigits(maxDigits: number) {
    this.setRegex(maxDigits);
  }

  ngOnInit() {
    this.el.value = this.currencyPipe.transform(this.el.value, 'USD');
  }

  private setRegex(maxDigits?: number) {
    this.digitRegex = new RegExp(this.regexString(maxDigits), 'g');
  }

  private regexString(max?: number) {
    const maxStr = max ? `{0,${max}}` : `+`;
    return `^(\\d${maxStr}(\\.\\d{0,2})?|\\.\\d{0,2})$`;
  }

  private el: HTMLInputElement;

  @Input() locale = 'en-US';

  private digitRegex: RegExp;

  private lastValid = '';
  @HostListener('input', ['$event'])
  onInput(event: any) {
    const cleanValue = (event.target.value.match(this.digitRegex) || []).join(
      ''
    );
    if (cleanValue || !event.target.value) this.lastValid = cleanValue;
    this.el.value = cleanValue || this.lastValid;
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: any) {
    // on focus remove currency formatting
    this.el.value = value.replace(/[^0-9.]+/g, '');
    this.el.select();
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: any) {
    // on blur, add currency formatting
    this.el.value = this.currencyPipe.transform(value, 'USD');
  }

  @HostListener('keydown.control.z', ['$event.target.value'])
  onUndo(_value: any) {
    this.el.value = '';
  }
}
