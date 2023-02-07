import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
  @Input() loading: boolean = false;
  @Input() good: any = {};
  @Output() onSave = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {
    // this.checkRequiredFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.goodForm.reset();
    this.checkRequiredFields();
    this.goodForm.patchValue(this.good);
  }

  checkRequiredFields() {
    this.goodFeatures.forEach(feature => {
      const field = this.goodForm.get(`val${feature.columnNumber}`);
      if (feature.requested == 'S') {
        field.addValidators(Validators.required);
      } else {
        field.removeValidators(Validators.required);
      }
      field.updateValueAndValidity();
    });
  }

  save() {
    this.onSave.emit();
  }
}
