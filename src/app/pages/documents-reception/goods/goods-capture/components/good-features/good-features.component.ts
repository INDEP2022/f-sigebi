import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'good-features',
  templateUrl: './good-features.component.html',
  styles: [],
})
export class GoodFeaturesComponent implements OnInit, OnChanges {
  @Input() goodForm: FormGroup;
  @Input() goodFeatures: any[] = [];
  @Input() good: any = {};
  constructor() {}

  ngOnInit(): void {
    // this.checkRequiredFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.goodForm.reset();
    this.checkRequiredFields();
    this.goodForm.patchValue(this.good);
  }

  checkRequiredFields() {
    this.goodFeatures.forEach(feature => {
      const field = this.goodForm.get(`val${feature.no_columna}`);
      if (feature.requerido == 'S') {
        field.addValidators(Validators.required);
      } else {
        field.removeValidators(Validators.required);
      }
      field.updateValueAndValidity();
    });
  }

  save() {
    console.log(this.goodForm.value);
  }
}
