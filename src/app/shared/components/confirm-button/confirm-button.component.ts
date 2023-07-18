import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'confirm-button',
  template: `
    <button
      type="submit"
      [className]="changeClass()"
      (click)="onConfirm()"
      [disabled]="disabled || loading">
      {{ loading ? loadingText : text }}
      <i *ngIf="icon && !loading" aria-hidden="true" [class]="icon"></i
      ><i
        *ngIf="!loading && text.toLowerCase() == 'guardar' && !icon"
        aria-hidden="true"
        class="fa fa-save"></i
      ><i
        *ngIf="!loading && text.toLowerCase() == 'siguiente' && !icon"
        aria-hidden="true"
        class="fas fa-arrow-circle-right"></i>
      <img
        *ngIf="loading"
        src="assets/images/loader-button.gif"
        alt="loading" />
    </button>
  `,
  styles: [
    `
      img {
        width: 20px;
      }
    `,
  ],
})
export class ConfirmButtonComponent implements OnInit {
  @Input() loading: boolean = false;
  @Input() text: string = 'Guardar';
  @Input() loadingText: string = 'Guardando';
  @Input() disabled: boolean = false;
  @Input() btnSmall?: boolean = false;
  @Input() type: 'button' | 'submit' = 'submit';
  @Input() className: string = 'btn-primary';
  @Input() icon: string = null;
  @Output() confirm = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onConfirm() {
    this.confirm.emit();
  }

  changeClass() {
    if (this.btnSmall) {
      return `btn ${this.className} btn-sm active`;
    } else {
      return `btn ${this.className} active`;
    }
  }
}
