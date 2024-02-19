import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { BasePage } from 'src/app/core/shared';

@Component({
  template: `
    <div class="">
      <div
        *ngIf="value"
        (click)="onCellClick($event)"
        (contextmenu)="onContextMenu($event)"
        class="hoverBg"
        style="width: auto; height: 20px">
        {{ value }}
      </div>
    </div>
  `,
  styles: [
    `
      .hoverBg {
        font-weight: 600;
        text-decoration-line: underline;
      }
      .hoverBg:hover {
        font-weight: 700;
      }

      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class FComer084Component extends BasePage implements OnChanges, OnInit {
  @Output() funcionEjecutada = new EventEmitter<any>();
  @Input() value: any;
  @Input() rowData: any;
  constructor() {
    super();
  }
  ngOnInit(): void {}

  onChange($event: Event) {}

  ngOnChanges() {}

  onCellClick(event: any) {
    this.ejecutarFuncion();
  }

  onContextMenu(event: any) {}

  ejecutarFuncion() {
    this.funcionEjecutada.emit(this.rowData);
  }
}
