import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-radio',
  template: `
    <div class="form-group">
      <div class="radio radio-inline">
        <label>
          <ng-content></ng-content>
          <i class="helper"></i>{{ label }}
        </label>
      </div>
    </div>
  `,
})
export class FormRadioComponent {
  @Input() label: string;
}
