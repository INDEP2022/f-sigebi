import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { PreviousRouteService } from 'src/app/common/services/previous-route.service';
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
    private goodService: GoodService,
    private previousRouteService: PreviousRouteService,
    private fb: FormBuilder,
    private router: Router
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
          console.log(window.history);
          if (this.previousRouteService.getHistory().length > 1) {
            this.origin = 1;
          }
          this.searchGood();
        } else {
          this.origin = 0;
        }
      },
    });

    const derivationGoodId = localStorage.getItem('derivationGoodId');
    if (derivationGoodId) {
      this.loading = true;
      this.noBienControl.setValue(derivationGoodId);
      this.origin = 1;
      this.searchGood();
    }
  }

  clear() {
    this.good = null;
    this.actualGoodNumber = null;
    this.form.reset();
  }

  searchGood() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { numberGood: this.noBienControl.value },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
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
    const derivationGoodId = localStorage.getItem('derivationGoodId');
    if (derivationGoodId) {
      this.router.navigate([
        `/pages/administrative-processes/derivation-goods`,
      ]);
      localStorage.setItem('derivationGoodId', '');
    } else {
      this.location.back();
    }
  }
}
