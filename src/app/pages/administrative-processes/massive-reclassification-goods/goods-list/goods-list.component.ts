import { Component, OnInit, ViewChild } from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
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
import { COLUMNS } from '../massive-reclassification-goods/columns';
import { MassiveReclassificationGoodsService } from '../services/massive-reclassification-goods.service';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss'],
})
export class GoodsListComponent
  extends BasePageWidhtDinamicFiltersExtra<IGood>
  implements OnInit
{
  previousSelecteds: IGood[] = [];
  pageSelecteds: number[] = [];
  @ViewChild('table') table: Ng2SmartTableComponent;
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
      selectMode: 'multi',
      columns: {
        // name: {
        //   title: 'Reclasificar',
        //   sort: false,
        //   type: 'custom',
        //   showAlways: true,
        //   valuePrepareFunction: (isSelected: boolean, row: IGood) =>
        //     this.isGoodSelected(row),
        //   renderComponent: CheckboxElementComponent,
        //   onComponentInitFunction: (instance: CheckboxElementComponent) =>
        //     this.onGoodSelect(instance),
        // },
        ...COLUMNS,
      },
      rowClassFunction: (row: any) => {
        return row.data.notSelect ? 'notSelect' : '';
      },
    };
  }

  private fillSelectedRows(byPage: boolean) {
    setTimeout(() => {
      console.log(this.selectedGooods, this.table);
      const currentPage = this.params.getValue().page;
      const selectedPage = this.pageSelecteds.find(
        page => page === currentPage
      );
      if (!selectedPage || byPage === false) {
        this.table.isAllSelected = false;
      } else {
        this.table.isAllSelected = true;
      }
      if (this.selectedGooods && this.selectedGooods.length > 0) {
        this.table.grid.getRows().forEach(row => {
          console.log(row);

          if (
            this.selectedGooods.find(item => row.getData()['id'] === item.id)
          ) {
            this.table.grid.multipleSelectRow(row);
          }
          // if(row.getData())
          // this.table.grid.multipleSelectRow(row)
        });
      }
    }, 300);
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

  // onGoodSelect(instance: CheckboxElementComponent) {
  //   instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
  //     next: data => this.goodSelectedChange(data.row, data.toggle),
  //   });
  // }

  private removeGood(item: IGood) {
    const good = this.selectedGooods.find(x => x.id === item.id);
    if (good) {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.id
      );
    }
  }
  selectGood(event: { selected: IGood[]; isSelected: boolean; data: IGood }) {
    console.log(event);
    const selecteds = event.selected;

    if (selecteds.length === 0) {
      if (this.previousSelecteds.length > 0 && event.isSelected === null) {
        this.previousSelecteds.forEach(selected => {
          this.removeGood(selected);
        });
      }
      if (event.isSelected === false) {
        this.removeGood(event.data);
      }
    } else {
      if (event.isSelected === null) {
        const currentPage = this.params.getValue().page;
        const selectedPage = this.pageSelecteds.find(
          page => page === currentPage
        );
        if (!selectedPage) {
          this.pageSelecteds.push(currentPage);
        }
        selecteds.forEach(selected => {
          const item = this.selectedGooods.find(x => x.id === selected.id);
          if (!item) {
            this.selectedGooods.push(selected);
          }
        });
      } else if (event.isSelected === true) {
        // this.addGood(event.data);
      } else {
        this.removeGood(event.data);
      }
    }
    console.log(this.selectedGooods);
    this.previousSelecteds = [...selecteds];
  }

  // goodSelectedChange(good: IGood, selected: boolean) {
  //   if (selected) {
  //     this.selectedGooods.push(good);
  //   } else {
  //     this.selectedGooods = this.selectedGooods.filter(
  //       _good => _good.id != good.id
  //     );
  //   }
  // }

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
          this.selectedGooods = [];
          this.getData(false);
        } else {
          this.data.load([]);
          this.selectedGooods = [];
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
          this.selectedGooods = [];
          this.getData(false);
        }
      });
  }

  private validationObs(obs: Observable<any>[]) {
    return obs ? (obs.length > 0 ? forkJoin(obs) : of([])) : of([]);
  }

  override getData(byPage: boolean = true) {
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
          this.totalItems = response.count ?? 0; //> 100 ? 100 : response.count;
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
          this.fillSelectedRows(byPage);
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
