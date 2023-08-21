import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { PreviousRouteService } from 'src/app/common/services/previous-route.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { BasePage } from 'src/app/core/shared';
import { GoodPhotosService } from './services/good-photos.service';

@Component({
  selector: 'app-good-photos',
  templateUrl: './good-photos.component.html',
  styleUrls: ['./good-photos.component.scss'],
})
export class GoodPhotosComponent extends BasePage implements OnInit {
  origin: string = null;
  selectedGoodsByQueryParams: number[] = [];
  showTable = true;
  resetTable = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private goodService: GoodFinderService,
    private dataService: GoodPhotosService,
    private previousRouteService: PreviousRouteService
  ) {
    super();
  }

  cleanFilters() {
    this.good = null;
    this.selectedGoods = [];
    this.resetTable++;
    this.dataService.showEvent.next(true);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        this.origin = null;
        this.showTable = true;
        this.selectedGoodsByQueryParams = [];
        this.cleanFilters();
        if (localStorage.getItem('selectedGoodsForPhotos')) {
          this.selectedGoodsByQueryParams = JSON.parse(
            localStorage.getItem('selectedGoodsForPhotos')
          );
        }
        if (param['origin']) {
          this.origin = param['origin'];
        }
        if (param['numberGood']) {
          this.selectedGoodsByQueryParams = [param['numberGood']];
          this.showTable = false;
          this.searchGood();
        }
      },
    });
  }

  get good() {
    return this.dataService.selectedGood;
  }

  set good(value) {
    this.dataService.selectedGood = value;
  }

  get selectedGoods() {
    return this.dataService.selectedGoods;
  }

  set selectedGoods(value) {
    this.dataService.selectedGoods = value;
  }

  private searchGood() {
    // this.router.navigate([], {
    //   relativeTo: this.activatedRoute,
    //   queryParams: { numberGood: this.noBienControl.value },
    //   queryParamsHandling: 'merge', // remove to replace all query params by provided
    // });
    this.loader.load = true;
    this.goodService
      .getByGoodNumber(this.selectedGoodsByQueryParams[0])
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);
          if (response && response.data && response.data.length > 0) {
            this.good = {
              ...response.data[0],
              id: this.selectedGoodsByQueryParams[0] + '',
            };
            this.loader.load = false;
            this.dataService.showEvent.next(true);
          } else {
            this.goodNotLoaded(this.selectedGoodsByQueryParams[0] + '');
          }
        },
        error: err => {
          this.goodNotLoaded(this.selectedGoodsByQueryParams[0] + '');
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
