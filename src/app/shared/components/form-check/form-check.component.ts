import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'form-check',
  template: `
    <div class="form-group">
      <div class="checkbox-color checkbox-primary">
        <ng-content></ng-content>
        <label [for]="for">
          {{ label }}
        </label>
      </div>
    </div>
  `,
})
export class FormCheckComponent implements OnInit {
  @Input() for: string;
  @Input() label: string;
  constructor() {}

  ngOnInit(): void {}
}
