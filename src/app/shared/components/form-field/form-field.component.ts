import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationService } from 'src/app/common/services/validation.service';
@Component({
  selector: 'form-field',
  template: `
    <div
      class="form-group form-static-label"
      [ngClass]="invalidClass(control)"
      #container>
      <!-- ? Trasnclusion con ng-content -->
      <ng-content></ng-content>
      <span class="form-bar"></span>
      <label *ngIf="label" class="float-label">{{ label }}</label>
      <div
        *ngIf="isInvalid(control)"
        class="invalid-feedback animated fadeInUp"
        style="display: block;">
        {{ getErrorMessage(control) }}
      </div>
    </div>
  `,
  styles: [],
})
export class FormFieldComponent implements OnInit {
  /**
   * @param {AbstractControl} control - elemento del from group del componente padre
   */
  @Input() control: AbstractControl;
  @Input() label: string = null;
  @Input() labelClass: string = '';
  constructor(private validationService: ValidationService) {}
  ngOnInit(): void {}

  isInvalid(control: AbstractControl): boolean {
    return this.validationService.isInvalid(control);
  }

  invalidClass(control: AbstractControl): string {
    return this.validationService.invalidClass(control);
  }

  getErrorMessage(control: AbstractControl): string {
    return this.validationService.handleError(control);
  }
}
