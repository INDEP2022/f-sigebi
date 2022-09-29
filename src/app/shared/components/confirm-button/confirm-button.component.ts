import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'confirm-button',
  template: `
    <button
      type="submit"
      class="btn btn-primary active"
      (click)="onConfirm()"
      [disabled]="disabled || loading"
    >
      {{ loading ? loadingText : text }}
      <img
        *ngIf="loading"
        src="assets/images/loader-button.gif"
        alt="loading"
      />
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
  @Input() type: 'button' | 'submit' = 'submit';
  @Output() confirm = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}

  onConfirm() {
    this.confirm.emit();
  }
}
