import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, map, switchMap, throwError } from 'rxjs';

import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { AddDocsComponent } from '../add-docs/add-docs.component';
import { MarketingRecordsForm } from '../utils/marketing-records-form';
import { COLUMNS, COLUMNS2 } from './columns';
//Provisional Data
import { takeUntil } from 'rxjs';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { DocsData, GoodsData } from './data';

@Component({
  selector: 'app-marketing-records',
  templateUrl: './marketing-records.component.html',
  styles: [],
})
export class MarketingRecordsComponent extends BasePage implements OnInit {
  form = new FormGroup(new MarketingRecordsForm());
  formCcp: FormGroup = new FormGroup({});
  /**
   * Goods
   * */
  data: LocalDataSource = new LocalDataSource();
  goodsData: any[] = GoodsData;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  /**
   * Docs
   * */
  settings2;
  data2: LocalDataSource = new LocalDataSource();
  docsData: any[] = DocsData;
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  usersCcp: any = [];

  get formType() {
    return this.form.controls.recordCommerType.value;
  }

  get controls() {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsJobManagementService: GoodsJobManagementService,
    private mJobManagement: MJobManagementService,
    private showHide: showHideErrorInterceptorService,
    private goodService: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };

    this.settings2 = {
      ...this.settings,
      actions: { add: false, delete: true, edit: false },
      columns: COLUMNS2,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.onTypeFormChange();
    this.data.load(this.goodsData);
  }

  goodNumChange() {
    const goodId = this.controls.goodId.value;
    if (!goodId) {
      return;
    }
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('goodNumber', goodId);
    this.showHide.showHideError(false);
    this.goodService
      .getById(goodId)
      .pipe(
        catchError(error => {
          this.onLoadToast('error', 'Error', 'El bien no existe');
          return throwError(() => error);
        }),
        switchMap(() => {
          this.showHide.showHideError(false);
          return this.goodsJobManagementService
            .getAllFiltered(params.getParams())
            .pipe(
              map(response => response.data.map(row => row.managementNumber)),
              switchMap(ids => this.getMGoods(ids))
            );
        })
      )
      .subscribe({
        next: response => {
          console.log(response.count);
        },
      });
  }

  getMGoods(ids: string[] | number[]) {
    const params = new FilterParams();
    params.addFilter('managementNumber', ids.join(','), SearchFilter.IN);
    params.addFilter('refersTo', 'OFCOMER', SearchFilter.ILIKE);
    this.showHide.showHideError(false);
    return this.mJobManagement.getAllFiltered(params.getParams()).pipe();
  }

  onTypeFormChange() {
    this.form.controls.recordCommerType.valueChanges
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: value => (value == 'bie' ? this.isGood() : this.isPortfolio()),
      });
  }

  isGood() {
    const { event, portfolio, lot, goodId } = this.controls;
    this.setControlNullAndOptional([event, portfolio, lot]);
    this.setControlRequired([goodId]);
  }

  isPortfolio() {
    const { event, portfolio, lot, goodId } = this.controls;
    this.setControlNullAndOptional([goodId]);
    this.setControlRequired([event, portfolio, lot]);
  }

  setControlNullAndOptional(controls: FormControl[]) {
    controls.forEach(control => {
      control.reset();
      control.removeValidators(Validators.required);
      control.updateValueAndValidity();
    });
  }

  setControlRequired(controls: FormControl[]) {
    controls.forEach(control => {
      control.addValidators(Validators.required);
      control.updateValueAndValidity();
    });
  }

  private prepareForm(): void {
    this.formCcp = this.fb.group({
      userId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      scannerFolio: [null],
    });

    this.formCcp.valueChanges.subscribe(value => {
      let includeId = this.usersCcp.some(
        (us: any) => us.userId == value.userId
      );
      let includeName = this.usersCcp.some((us: any) => us.name == value.name);
      if (!includeId && !includeName && this.formCcp.valid) {
        this.usersCcp.push(value);
      }
    });
  }

  openModal(context?: Partial<AddDocsComponent>): void {
    const modalRef = this.modalService.show(AddDocsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.refresh.subscribe((data: any) => {
      if (data) this.data2.load(data);
    });
  }

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este documento?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.data2.remove(event.data);
        this.data2.refresh();
      }
    });
  }

  removeItem(index: number): void {
    this.usersCcp.splice(index, 1);
  }

  resetForm(): void {
    this.alertQuestion(
      'warning',
      'Borrar',
      'Desea borrar los datos ingresados?'
    ).then(question => {
      if (question.isConfirmed) {
        this.form.reset();
        this.formCcp.reset();
        /***
         * Users CCopy
         * */
        this.usersCcp = [];
        this.data2.load([]);
        this.data2.refresh();
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }
}
