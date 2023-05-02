import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  WAREHOUSESUBSUBSUBTYPE_COLUMNS,
  WAREHOUSESUBSUBTYPE_COLUMNS,
  WAREHOUSESUBTYPE_COLUMNS,
  WAREHOUSETYPE_COLUMNS,
} from '../warehouse-type-modal/warehouse-type-columns';

@Component({
  selector: 'app-type-good',
  templateUrl: './type-good.component.html',
  styles: [],
})
export class TypeGoodComponent extends BasePage implements OnInit {
  @ViewChild('goodType') goodType: Ng2SmartTableComponent;
  @Output() refresh = new EventEmitter<true>();
  value: any;
  settings2 = { ...this.settings, actions: false };
  settings3 = { ...this.settings, actions: false };
  settings4 = { ...this.settings, actions: false };
  data1: any[] = [];
  paragraphs: IGoodType[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  goodSubType: IGoodSubType[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  goodSsubType: IGoodSsubType[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  goodSssubType: IGoodSssubtype[] = [];
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems3: number = 0;
  classifGood: IGoodSssubtype[] = [];
  rowSelected: boolean = false;
  selectedRow: any = null;
  constructor(
    private modalRef: BsModalRef,
    private goodTypesService: GoodTypeService,
    private goodSubTypesService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...WAREHOUSETYPE_COLUMNS },
    };
    this.settings2.columns = WAREHOUSESUBTYPE_COLUMNS;
    this.settings3.columns = WAREHOUSESUBSUBTYPE_COLUMNS;
    this.settings4.columns = WAREHOUSESUBSUBSUBTYPE_COLUMNS;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodTypeAll());
    console.log(this.value);
  }

  getGoodTypeAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
    };
    this.goodTypesService.getAll(params).subscribe({
      next: response => {
        console.log(response.data);
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
  selectRow(row: any) {
    console.log(row);
    let index: number = 7;
    // this.goodType.grid.selectRow(index);
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.goodSubTypes(row.data.id));
  }
  goodSubTypes(id: string) {
    this.params1.getValue()['filter.idTypeGood'] = `$eq:${id}`;
    this.goodSubTypesService.getAll(this.params1.getValue()).subscribe({
      next: response => {
        console.log(response.data);
        this.goodSubType = response.data;
        this.totalItems1 = response.count;

        this.loading = false;
        this.goodSsubType = [];
        this.totalItems2 = 0;
        this.goodSssubType = [];
        this.totalItems3 = 0;
      },
      error: error => {
        console.log(error);
        this.goodSubType = [];
        this.totalItems1 = 0;
        this.goodSsubType = [];
        this.totalItems2 = 0;
        this.goodSssubType = [];
        this.totalItems3 = 0;
        this.loading = false;
      },
    });
  }
  selectRow1(row: any) {
    console.log(row.data.id);
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.goodSsubTypes(row.data.id));
  }
  goodSsubTypes(id: string) {
    this.params2.getValue()['filter.noSubType'] = `$eq:${id}`;
    this.goodSsubtypeService.getAll(this.params2.getValue()).subscribe({
      next: response => {
        console.log(response.data);
        this.goodSsubType = response.data;
        this.totalItems2 = response.count;
        this.loading = false;
        this.goodSssubType = [];
        this.totalItems3 = 0;
      },
      error: error => {
        console.log(error);
        this.goodSsubType = [];
        this.totalItems2 = 0;
        this.goodSssubType = [];
        this.totalItems3 = 0;
        this.loading = false;
      },
    });
  }
  selectRow2(row: any) {
    console.log(row.data.id);
    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.goodSssubTypes(row.data.id));
  }
  goodSssubTypes(id: string) {
    this.params3.getValue()['filter.numSsubType'] = `$eq:${id}`;
    this.goodSssubtypeService.getAll(this.params3.getValue()).subscribe({
      next: response => {
        console.log(response.data);
        this.goodSssubType = response.data;
        this.totalItems3 = response.count;
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.goodSssubType = [];
        this.totalItems3 = 0;
        this.loading = false;
      },
    });
  }
  selectRow3(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }
  confirm() {
    if (!this.rowSelected) return;
    this.refresh.emit(this.selectedRow);
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }
}
