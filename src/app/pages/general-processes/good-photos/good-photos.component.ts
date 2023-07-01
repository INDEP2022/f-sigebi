import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems = 1;
  newLimit = new FormControl(1);
  selectedGoodsForPhotos: number[] = [];
  changes = 0;
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
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(params);
      console.log(params);
      params.limit = 1;
      // console.log(this.selectedGoodsOfRastrer[params.page - 1]);
      if (
        this.selectedGoodsForPhotos &&
        this.selectedGoodsForPhotos.length > 0
      ) {
        this.noBienControl = this.selectedGoodsForPhotos[params.page - 1];
        this.searchGood();
      }
    });
  }

  get noBienControl() {
    return this.form.get('noBien');
  }

  set noBienControl(value: any) {
    if (this.form.get('noBien')) this.form.get('noBien').setValue(value);
  }

  get description() {
    return this.form.get('description');
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        console.log(param);
        if (this.previousRouteService.getHistory().length > 1) {
          this.origin = 1;
        }
      },
    });
    if (localStorage.getItem('selectedGoodsForPhotos')) {
      this.selectedGoodsForPhotos = JSON.parse(
        localStorage.getItem('selectedGoodsForPhotos')
      );
    }
    if (this.selectedGoodsForPhotos && this.selectedGoodsForPhotos.length > 0) {
      this.totalItems = this.selectedGoodsForPhotos.length;
      this.noBienControl = this.selectedGoodsForPhotos[0];
      this.searchGood();
      return;
    }
  }

  clear() {
    this.good = null;
    this.actualGoodNumber = null;
    this.form.reset();
  }

  searchGood() {
    // this.router.navigate([], {
    //   relativeTo: this.activatedRoute,
    //   queryParams: { numberGood: this.noBienControl.value },
    //   queryParamsHandling: 'merge', // remove to replace all query params by provided
    // });
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
    this.previousRouteService.back();
  }
}
