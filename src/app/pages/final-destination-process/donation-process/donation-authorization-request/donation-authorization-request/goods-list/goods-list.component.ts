import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import {
  catchError,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  takeUntil,
  tap,
} from 'rxjs';
import { first, take } from 'rxjs/operators';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { COLUMNS } from '../columns-goods';
import { DonAuthorizaService, IDs } from '../service/don-authoriza.service';

interface NotData {
  id: number;
  reason: string;
}

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
  changeSettings: number = 0;
  chargedByExcelOrRastrer = false;
  _changeDescription: string;
  goodsTotals: number = 0;
  goods: any[];
  availableToUpdate: any[] = [];
  idsNotExist: NotData[] = [];
  showError: boolean = false;
  $trackedGoods = this.store.select(getTrackedGoods);
  ngGlobal: any;
  @Input() changeDescription: string;
  @Input() set files(files: any[]) {
    // debugger;
    if (files.length === 0) return;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  @ViewChild('table') table: Ng2SmartTableComponent;
  constructor(
    private donAuthorizaService: DonAuthorizaService,
    private procedureManagement: ProcedureManagementService,
    private excelService: ExcelService,
    private store: Store,
    private globalVarService: GlobalVarsService,
    private goodTrackerService: GoodTrackerService,
    private readonly goodServices: GoodService
  ) {
    super();
    this.ilikeFilters = ['description', 'goodDescription', 'status'];
    this.haveInitialCharge = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      selectMode: 'multi',
      columns: {
        ...COLUMNS,
      },
      rowClassFunction: (row: any) => {
        return row.data.notSelect ? 'notSelect' : '';
      },
    };
  }

  get ids() {
    return this.donAuthorizaService.ids;
  }

  set ids(value) {
    this.donAuthorizaService.ids = value;
  }

  get selectedGooods() {
    return this.donAuthorizaService.selectedGooods;
  }

  set selectedGooods(value) {
    this.donAuthorizaService.selectedGooods = value;
  }

  get form() {
    return this.donAuthorizaService.form;
  }

  // get goodStatus() {
  //   return this.form.get('goodStatus');
  // }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      // debugger;
      this.data.load([]);
      this.totalItems = 0;
      this.availableToUpdate = [];
      this.idsNotExist = [];
      this.showError = false;

      this.ids = this.excelService.getData(binaryExcel);
      if (this.ids[0].no_bien === undefined) {
        this.alert(
          'error',
          'Ocurrio un error al leer el archivo',
          'El archivo no cuenta con la estructura requerida'
        );
        return;
      } else {
        // this.loadGood(this.ids);
        this.fillData(this.ids);
        this.alert('success', 'Se ha cargado el archivo', '');
      }
    } catch (error) {
      this.alert('error', 'Ocurrio un error al leer el archivo', '');
    }
  }

  private fillSelectedRows() {
    setTimeout(() => {
      // debugger;
      console.log(this.selectedGooods, this.table);
      const currentPage = this.params.getValue().page;
      const selectedPage = this.pageSelecteds.find(
        page => page === currentPage
      );
      this.table.isAllSelected = false;
      let allSelected = true;
      if (this.selectedGooods && this.selectedGooods.length > 0) {
        this.table.grid.getRows().forEach(row => {
          // console.log(row);

          if (
            this.selectedGooods.find(item => row.getData()['id'] === item.id)
          ) {
            this.table.grid.multipleSelectRow(row);
            allSelected = allSelected && true;
          } else {
            allSelected = allSelected && false;
          }
          // if(row.getData())
          // this.table.grid.multipleSelectRow(row)
        });
        this.table.isAllSelected = allSelected;
      }
    }, 300);
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
      } else {
        this.removeGood(event.data);
      }
    }
    console.log(this.selectedGooods);
    this.previousSelecteds = [...selecteds];
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
    this.donAuthorizaService.loadGoods.subscribe({
      next: response => {
        if (response) {
          this.selectedGooods = [];
          this.fillData(this.ids);
        } else {
          this.ids = null;
          this.data.load([]);
          this.selectedGooods = [];
          this.totalItems = 0;
        }
      },
    });
    this.$trackedGoods.pipe(first(), takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        if (response && response.length > 0) {
          this.ids = response.map(x => {
            return {
              no_bien: +x.goodNumber,
            };
          });
          this.fillData(this.ids);
        }
      },
    });
    this.globalVarService
      .getGlobalVars$()
      .pipe(first(), takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          if (this.ngGlobal.REL_BIENES) {
            this.loader.load = true;
            const paramsF = new FilterParams();
            paramsF.addFilter('identificator', this.ngGlobal.REL_BIENES);
            paramsF.addFilter('status', 'DON' || 'ADA');
            paramsF.limit = 100000000;
            this.goodTrackerService
              .getAllTmpTracker(paramsF.getParams())
              .subscribe({
                next: res => {
                  this.loader.load = false;
                  if (res.data && res.data.length > 0) {
                    this.ids = res.data.map(x => {
                      return {
                        no_bien: +x.goodNumber,
                      };
                    });
                    this.fillData(this.ids);
                  }
                },
                error: err => {
                  this.loader.load = false;
                },
              });
          }
        },
      });
  }

  private validationObs(obs: Observable<any>[]) {
    return obs ? (obs.length > 0 ? forkJoin(obs) : of([])) : of([]);
  }

  private fillData(ids: IDs[] = null) {
    this.loading = true;
    // console.log(this.goodStatus.value);
    const filterParams = new FilterParams();

    // if (this.goodStatus.value && (this.goodStatus.value + '').trim() !== '') {
    //   filterParams.addFilter(
    //     'status',
    //     String(this.goodStatus.value),
    //     SearchFilter.IN
    //   );
    // }
    if (ids) {
      filterParams.addFilter(
        'id',
        String(ids.map(row => row.no_bien)),
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
    // console.log(this.goodStatus.value);
    this.subscription.unsubscribe();
    this.subscription = this.goodServices
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
            if (good.status + 'DON' || 'ADA') {
              return of({
                ...good,
                notSelect: false,
              });
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
          if (response.length > 0 && ids) {
            this.chargedByExcelOrRastrer = true;
          }
          this.data.load(response);
          this.data.refresh();
          this.fillSelectedRows();
          this.goods = response;
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
  formatNumber(amount: string) {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount)) {
      return numericAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return amount;
    }
  }

  override getData() {
    this.fillData();
  }
}