import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IGoodDesc } from 'src/app/core/models/ms-good/good-and-desc.model';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-photos-by-good',
  templateUrl: './photos-by-good.component.html',
  styleUrls: ['./photos-by-good.component.scss'],
})
export class PhotosByGoodComponent extends BasePage implements OnInit {
  @Input() get good() {
    return this._good;
  }
  set good(value) {
    this._good = value;
    this.description.setValue(value.description);
  }
  _good: IGoodDesc;
  form: FormGroup;
  actualGoodNumber: string = null;
  toggleInformation = true;
  changes = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      // noBien: [null, [Validators.required, Validators.pattern(NUM_POSITIVE)]],
      description: [null],
    });
  }

  ngOnInit() {}

  get description() {
    return this.form.get('description');
  }

  get goodNumber() {
    return this.good ? this.good.id : null;
  }
}
