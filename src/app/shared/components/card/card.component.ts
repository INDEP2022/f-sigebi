import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <div class="card-header mb-3" *ngIf="header">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="card-block">
        <ng-content select="[body]"></ng-content>
      </div>
      <div class="card-footer" *ngIf="footer">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        box-shadow: 0 3px 10px rgb(0 0 0 / 0.2) !important;
        border-radius: 7px;
      }
    `,
  ],
})
export class CardComponent implements OnInit {
  @Input() header: boolean = false;
  @Input() footer: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
