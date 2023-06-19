import { Component, OnInit } from '@angular/core';
import {
  catchError,
  distinctUntilChanged,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs';
import { take } from 'rxjs/operators';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { COLUMNS } from '../massive-reclassification-goods/columns';
import { MassiveReclassificationGoodsService } from '../services/massive-reclassification-goods.service';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss'],
})
export class GoodsListComponent
  extends BasePageWidhtDinamicFiltersExtra<IGood>
  implements OnInit {
  constructor(
    private massiveService: MassiveReclassificationGoodsService,
    private procedureManagement: ProcedureManagementService,
    private readonly goodServices: GoodService
  ) {
    super();
    this.ilikeFilters = ['description', 'goodDescription'];
    this.haveInitialCharge = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        name: {
          title: 'Reclasificar',
          sort: false,
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: IGood) =>
            this.isGoodSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodSelect(instance),
        },
        ...COLUMNS,
      },
      rowClassFunction: (row: any) => {
        return row.data.notSelect ? 'notSelect' : '';
      },
    };
  }

  get selectedGooods() {
    return this.massiveService.selectedGooods;
  }

  set selectedGooods(value) {
    this.massiveService.selectedGooods = value;
  }

  get form() {
    return this.massiveService.form;
  }

  get classificationOfGoods() {
    return this.form.get('classificationOfGoods');
  }

  get goodStatus() {
    return this.form.get('goodStatus');
  }

  get mode() {
    return this.form.get('mode');
  }

  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }

  goodSelectedChange(good: IGood, selected: boolean) {
    if (selected) {
      this.selectedGooods.push(good);
      console.log(
        this.selectedGooods.length === 0,
        this.form.valid,
        this.selectedGooods.length === 0 || this.form.invalid
      );
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.id
      );
    }
  }

  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  override ngOnInit() {
    this.dinamicFilterUpdate();
    this.searchParams();
    this.massiveService.loadGoods.subscribe({
      next: response => {
        if (response) {
          this.getData();
        } else {
          this.data.load([]);
          this.totalItems = 0;
        }
      },
    });
    this.mode.valueChanges
      .pipe(
        distinctUntilChanged(),
        throttleTime(500),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(x => {
        console.log(x);
        if (this.totalItems > 0 && x !== null && x + ''.trim() !== '') {
          this.getData();
        }
      });
  }

  private validationObs(obs: Observable<any>[]) {
    return obs ? (obs.length > 0 ? forkJoin(obs) : of([])) : of([]);
  }

  override getData() {
    this.selectedGooods = [];
    this.loading = true;
    console.log(this.classificationOfGoods.value);
    const filterParams = new FilterParams();
    if (
      this.classificationOfGoods.value &&
      (this.classificationOfGoods.value + '').trim() !== ''
    ) {
      filterParams.addFilter(
        'goodClassNumber',
        this.classificationOfGoods.value,
        this.mode.value === 'E' ? SearchFilter.NOTIN : SearchFilter.EQ
      );
    }
    if (this.goodStatus.value && (this.goodStatus.value + '').trim() !== '') {
      filterParams.addFilter(
        'status',
        String(this.goodStatus.value.map((item: any) => item.status)),
        SearchFilter.IN
      );
    }
    const params = this.params.getValue();
    filterParams.limit = params.limit;
    filterParams.page = params.page;
    for (var filter in this.columnFilters) {
      if (this.columnFilters.hasOwnProperty(filter)) {
        console.log(this.columnFilters[filter]);
        filterParams.addFilter3(filter, this.columnFilters[filter]);
      }
    }
    console.log(this.goodStatus.value);

    this.goodServices
      .getAll(filterParams.getParams())
      .pipe(
        takeUntil(this.$unSubscribe),
        take(1),
        catchError(error => {
          return of({ data: [], count: 0 });
        }),
        tap(response => {
          this.totalItems = response.count;
        }),
        map(response =>
          response.data.map(good => {
            if (good.goodClassNumber + '' !== '1575') {
              return of({ ...good, notSelect: false });
            } else {
              const filterParams = new FilterParams();
              filterParams.addFilter('typeManagement', 2);
              filterParams.addFilter2(
                'filter.expedient=' +
                (good.fileNumber ? '$eq:' + good.fileNumber : '$null')
              );
              filterParams.addFilter2(
                'filter.flierNumber=' +
                (good.flyerNumber ? '$eq:' + good.flyerNumber : '$null')
              );
              return this.procedureManagement
                .getAllFiltered(filterParams.getParams())
                .pipe(
                  catchError(x => of({ data: [] })),
                  map(x => (x.data ? x.data.length : 0)),
                  map(gestionTramite => {
                    return {
                      ...good,
                      notSelect: gestionTramite > 0,
                    };
                  })
                );
            }
          })
        ),
        mergeMap(array => this.validationObs(array))
      )
      .subscribe({
        next: response => {
          console.log(response);
          this.data.load(response);
          this.data.refresh();
          // if (response.data && response.data.length > 0) {
          //   this.listGood = response.data;
          //   this.totalItems = response.count;
          // } else {
          //   this.totalItems = 0;
          //   this.listGood = [];
          // }
          this.loading = false;
        },
        error: err => {
          console.log(err);
          this.totalItems = 0;
          this.data.load([]);
          this.data.refresh();
          this.loading = false;
        },
      });
  }
}
