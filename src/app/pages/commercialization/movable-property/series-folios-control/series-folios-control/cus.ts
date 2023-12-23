import { Component } from '@angular/core';

@Component({
  template: `
    <div class="two-line-title">
      <div class="line">Id</div>
      <div class="line">Folio</div>
    </div>
  `,
  styles: [
    `
      .two-line-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .line {
        line-height: 1;
      }
    `,
  ],
})
export class CustomTitleComponent {}
