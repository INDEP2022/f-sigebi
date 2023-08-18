import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { PreviousRouteService } from 'src/app/common/services/previous-route.service';
import { IGoodDesc } from 'src/app/core/models/ms-good/good-and-desc.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-good-photos',
  templateUrl: './good-photos.component.html',
  styleUrls: ['./good-photos.component.scss'],
})
export class GoodPhotosComponent extends BasePage implements OnInit {
  origin: string = null;
  selectedGoodsForPhotos: number[] = [];
  showTable = true;
  good: IGoodDesc;
  constructor(
    private activatedRoute: ActivatedRoute,
    private goodService: GoodService,
    private previousRouteService: PreviousRouteService
  ) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        console.log(param);
        if (this.previousRouteService.getHistory().length > 1) {
          this.selectedGoodsForPhotos = [];
          if (localStorage.getItem('selectedGoodsForPhotos')) {
            this.selectedGoodsForPhotos = JSON.parse(
              localStorage.getItem('selectedGoodsForPhotos')
            );
          }
          if (param['origin']) {
            this.origin = param['origin'];
          }
          if (param['numberGood']) {
            this.selectedGoodsForPhotos = [param['numberGood']];
            this.showTable = false;
            this.searchGood();
          }
        } else {
          this.origin = null;
        }
      },
    });
  }

  clear() {
    this.selectedGoodsForPhotos = [];
  }

  private searchGood() {
    // this.router.navigate([], {
    //   relativeTo: this.activatedRoute,
    //   queryParams: { numberGood: this.noBienControl.value },
    //   queryParamsHandling: 'merge', // remove to replace all query params by provided
    // });
    this.loading = true;
    this.goodService
      .getGoodAndDesc(this.selectedGoodsForPhotos[0])
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.good = {
              ...response,
              id: this.selectedGoodsForPhotos[0] + '',
            };
            this.loading = false;
          } else {
            this.goodNotLoaded(this.selectedGoodsForPhotos[0] + '');
          }
        },
        error: err => {
          this.goodNotLoaded(this.selectedGoodsForPhotos[0] + '');
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
