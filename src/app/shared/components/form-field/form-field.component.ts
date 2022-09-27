import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationService } from 'src/app/common/services/validation.service';
@Component({
  selector: 'form-field',
  templateUrl: './form-field.component.html',
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
