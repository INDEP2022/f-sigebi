import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
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
import { first, take } from 'rxjs/operators';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { COLUMNS } from '../massive-reclassification-goods/columns';
import {
  IDs,
  MassiveReclassificationGoodsService,
} from '../services/massive-reclassification-goods.service';

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

  availableToUpdate: any[] = [];
  idsNotExist: NotData[] = [];
  showError: boolean = false;
  $trackedGoods = this.store.select(getTrackedGoods);
  @Input() changeDescription: string;
  @Input() set files(files: any[]) {
    if (files.length === 0) return;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }
  @Input()
  set changeMode(value: 'I' | 'E') {
    if (!value) return;
    if (value === 'E') {
      let columns = { ...COLUMNS };
      delete columns.changeDescription;
      this.settings = {
        ...this.settings,
        columns,
      };
      this.changeSettings++;
    } else {
      this.settings = {
        ...this.settings,
        columns: COLUMNS,
      };
      this.changeSettings++;
    }
  }
  @ViewChild('table') table: Ng2SmartTableComponent;
  constructor(
    private massiveService: MassiveReclassificationGoodsService,
    private procedureManagement: ProcedureManagementService,
    private excelService: ExcelService,
    private store: Store,
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

  get ids() {
    return this.massiveService.ids;
  }

  set ids(value) {
    this.massiveService.ids = value;
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data.load([]);
      this.availableToUpdate = [];
      this.idsNotExist = [];
      this.showError = false;

      this.ids = this.excelService.getData(binaryExcel);
      if (this.ids[0].No_bien === undefined) {
        this.alert(
          'error',
          'Ocurrio un error al leer el archivo',
          'El archivo no cuenta con la estructura requerida'
        );
        return;
      } else {
        // this.loadGood(this.ids);
        this.fillData(this.ids);
        this.alert('success', 'Archivo subido', '');
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
              No_bien: +x.goodNumber,
            };
          });
          this.fillData(this.ids);
        }
      },
    });
    this.classificationOfGoods.valueChanges
      .pipe(
        distinctUntilChanged(),
        throttleTime(500),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(x => {
        if (!x) {
          if (!this.ids) {
            this.selectedGooods = [];
            this.data.load([]);
            this.data.refresh();
            this.totalItems = 0;
          }
        }
      });
    this.mode.valueChanges
      .pipe(
        distinctUntilChanged(),
        throttleTime(500),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(x => {
        console.log(x);
        if (
          this.totalItems > 0 &&
          x !== null &&
          x + ''.trim() !== '' &&
          this.classificationOfGoods.value &&
          this.ids
        ) {
          this.selectedGooods = [];
          this.getData();
        }
      });
  }

  private validationObs(obs: Observable<any>[]) {
    return obs ? (obs.length > 0 ? forkJoin(obs) : of([])) : of([]);
  }

  private fillData(ids: IDs[] = null) {
    this.loading = true;
    console.log(this.classificationOfGoods.value, this.goodStatus.value);
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
        String(this.goodStatus.value),
        SearchFilter.IN
      );
    }
    if (ids) {
      filterParams.addFilter(
        'id',
        String(ids.map(row => row.No_bien)),
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
            if (good.goodClassNumber + '' !== '1575') {
              return of({
                ...good,
                changeDescription: this.changeDescription,
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
                      changeDescription: this.changeDescription,
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

  override getData() {
    this.fillData();
  }
}
