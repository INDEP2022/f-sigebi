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
import { ActivatedRoute, Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { HOME_DEFAULT } from 'src/app/utils/constants/main-routes';
import { FLYERS_REGISTRATION_CODE } from '../../utils/good-capture-constants';

@Component({
  selector: 'good-features',
  templateUrl: './good-features.component.html',
  styles: [],
})
export class GoodFeaturesComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() goodForm: FormGroup;
  @Input() goodFeatures: any[] = [];
  @Input() override loading: boolean = false;
  @Input() good: any = {};
  @Output() onSave = new EventEmitter<void>();
  origin: string = null;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    super();
    const paramsMap = this.activatedRoute.snapshot.queryParamMap;

    this.origin = paramsMap.get('origin');
  }

  ngOnInit(): void {
    // this.checkRequiredFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.goodForm.reset();
    this.checkRequiredFields();
    this.goodForm.patchValue(this.good);
  }

  checkRequiredFields() {
    // console.log(this.goodFeatures);
    this.goodFeatures.forEach(feature => {
      const field = this.goodForm.get(`val${feature.columnNumber}`);
      if (feature.dataType == 'V') {
        field.addValidators(Validators.pattern(STRING_PATTERN));
      }
      if (feature.requested == 'S') {
        field.addValidators(Validators.required);
      } else {
        field.removeValidators(Validators.required);
      }
      if (feature?.length > 0) {
        field.addValidators(Validators.maxLength(80));
      }
      field.updateValueAndValidity();
    });
  }

  save() {
    if (!this.goodForm.valid) {
      this.goodForm.markAllAsTouched();
      this.onLoadToast('error', 'Error', 'El formulario no es válido');
      return;
    }
    this.onSave.emit();
  }

  cancel() {
    if (this.origin == FLYERS_REGISTRATION_CODE) {
      this.router.navigate(['/pages/documents-reception/flyers-registration']);
    } else {
      this.router.navigate([HOME_DEFAULT]);
    }
  }
}
