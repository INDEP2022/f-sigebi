import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { IGoodDesc } from 'src/app/core/models/ms-good/good-and-desc.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import { NUM_POSITIVE } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-good-photos',
  templateUrl: './good-photos.component.html',
  styleUrls: ['./good-photos.component.scss'],
})
export class GoodPhotosComponent extends BasePage implements OnInit {
  origin: number = null;
  form: FormGroup;
  actualGoodNumber: string = null;
  good: IGoodDesc;
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private goodService: GoodService,
    private fb: FormBuilder
  ) {
    super();
    this.form = this.fb.group({
      noBien: [null, [Validators.required, Validators.pattern(NUM_POSITIVE)]],
      description: [null],
    });
  }

  get noBienControl() {
    return this.form.get('noBien');
  }

  set noBienControl(value) {
    if (this.form.get('noBien')) this.form.get('noBien').setValue(value);
  }

  get description() {
    return this.form.get('description');
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        if (param['numberGood']) {
          this.noBienControl = param['numberGood'];
          this.origin = 1;
          this.searchGood();
        } else {
          this.origin = 0;
        }
      },
    });
  }

  clear() {
    this.good = null;
    this.actualGoodNumber = null;
    this.form.reset();
  }

  searchGood() {
    this.loading = true;
    this.goodService
      .getGoodAndDesc(this.noBienControl.value)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.actualGoodNumber = this.noBienControl.value;
            this.description.setValue(response.description);
            this.good = response;
            this.loading = false;
          } else {
            this.goodNotLoaded(this.noBienControl.value);
          }
        },
        error: err => {
          this.goodNotLoaded(this.noBienControl.value);
        },
      });
  }

  private goodNotLoaded(goodNumber: string) {
    this.alert('error', 'ERROR', 'Bien ' + goodNumber + ' no encontrado');
    this.loading = false;
  }

  goBack() {
    this.location.back();
  }
}
