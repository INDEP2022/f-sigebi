import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared';
import { GoodPhotosService } from '../services/good-photos.service';

@Component({
  selector: 'app-photos-by-good',
  templateUrl: './photos-by-good.component.html',
  styleUrls: ['./photos-by-good.component.scss'],
})
export class PhotosByGoodComponent extends BasePage implements OnInit {
  form: FormGroup;
  actualGoodNumber: string = null;
  toggleInformation = true;
  changes = 0;
  constructor(private fb: FormBuilder, private service: GoodPhotosService) {
    super();
    this.form = this.fb.group({
      // noBien: [null, [Validators.required, Validators.pattern(NUM_POSITIVE)]],
      description: [null],
    });
    this.service.showEvent.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        if (response) {
          this.description.setValue(this.good ? this.good.description : null);
        }
      },
    });
  }

  ngOnInit() {}

  get good() {
    return this.service.selectedGood;
  }

  get description() {
    return this.form.get('description');
  }

  get goodNumber() {
    return this.good ? this.good.id : null;
  }
}
