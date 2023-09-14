import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  DELEGATION_COLUMNS_REPORT,
  GOODS_COLUMNS,
  HISTORY_COLUMNS_REPORT,
  HISTORY_EVENT_COLUMNS_REPORT,
  STATUS_COLUMNS_REPORT,
  SUBTYPE_COLUMNS_REPORT,
} from './columns';

@Component({
  selector: 'app-report-unsold-goods',
  templateUrl: './report-unsold-goods.component.html',
  styles: [],
})
export class ReportUnsoldGoodsComponent extends BasePage implements OnInit {
  //

  //#region Vars
  // Modal
  @ViewChild('myModalSubtype', { static: true })
  miModalTemplate: TemplateRef<any>;

  //Class Variables
  dataSubtypesGood: any;
  dataDelegation: any;
  dataStatusText: any;
  dataGoods: any;

  //Form
  form: FormGroup = new FormGroup({});
  formTwo: FormGroup;

  // Tables
  data: any;
  dataTwo: LocalDataSource = new LocalDataSource();
  dataThree: LocalDataSource = new LocalDataSource();
  dataFour: LocalDataSource = new LocalDataSource();
  dataFive: any;
  dataSix: any;
  // - Columns
  settingsOne: any;
  settingsTwo: any;
  settingsThree: any;
  settingsFour: any;
  settingsFive: any;

  // Boolean
  // SubTypeGoods
  isSubTypeGoodsVisible: boolean = true;

  // GoodsStatus
  isGoodsStatusVisible: boolean = true;

  // Delegations
  isDelegationsVisible: boolean = true;

  // Any
  fullGoods: any;
  fullDelegations: any;

  //Array
  columns: any[] = [];

  // show: boolean = false;

  // Paginator
  paramsDelegation = new BehaviorSubject(new ListParams());
  totalItemsDelegation: number = 0;
  //
  paramsStatusGood = new BehaviorSubject(new ListParams());
  totalItemsStatusGood: number = 0;
  //
  paramsSubtype = new BehaviorSubject(new ListParams());
  totalItemsSubtype: number = 0;
  //#endregion

  //#region Constructor & NgOnInit

  constructor(
    private fb: FormBuilder,
    private serviceGoods: GoodprocessService,
    private serviceDelegations: DelegationService,
    private serviceGood: GoodService,
    private serviceParameterComer: ParameterModService,
    private servicePipe: DatePipe,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...GOODS_COLUMNS },
    };

    this.settingsFive = {
      ...this.settings,
      actions: false,
      columns: { ...HISTORY_EVENT_COLUMNS_REPORT },
    };

    this.settingsFour = {
      ...this.settings,
      actions: false,
      columns: { ...HISTORY_COLUMNS_REPORT },
    };

    this.settingsTwo = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...DELEGATION_COLUMNS_REPORT },
    };

    this.settingsThree = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...STATUS_COLUMNS_REPORT },
    };

    this.settingsOne = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...SUBTYPE_COLUMNS_REPORT },
    };
    this.paramsStatusGood = this.pageFilter(this.paramsStatusGood);
  }

  ngOnInit(): void {
    this.prepareForm();

    this.queryTypeGoods();

    this.queryDelegation();

    this.paramsDelegation.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.queryDelegation();
    });

    this.paramsStatusGood.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.queryStatusGoods();
    });

    this.paramsSubtype.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.querySubtypeGoods();
    });

    this.queryDateMainReform();
  }

  //#endregion

  //#region PrepareForm
  private prepareForm() {
    this.form = this.fb.group({
      typeGood: [null],
      subtype: [null],
      delegation: [null],
      status: [null],
      startDate: [null],
      filterGoods: [null],
      filterText: [null],
    });
    this.formTwo = this.fb.group({
      radioOne: [null],
      radioTwo: [null],
      file: [null],
    });
  }
  //#endregion

  chargeFile(event: any) {}

  //#region Services
  queryTypeGoods(params?: ListParams) {
    let paramsLocal = new HttpParams();
    paramsLocal = paramsLocal.append('onlyType', 1);
    paramsLocal = paramsLocal.append('pType', 0);
    this.serviceGoods.getTypesGoods(paramsLocal).subscribe({
      next: response => {
        this.fullGoods = new DefaultSelect(response.data, response.count || 0);
      },
      error: data => {
        this.fullGoods = new DefaultSelect([], 0);
      },
    });
  }

  //Table
  queryDelegation() {
    let params = {
      ...this.paramsDelegation.getValue(),
    };
    this.serviceDelegations.getAllTwo(params).subscribe({
      next: response => {
        if (Array.isArray(response.data)) {
          this.dataThree.load(response.data);
          this.totalItemsDelegation = response.count || 0;
          this.dataThree.refresh();
        }
      },
      error: error => (this.loading = false),
    });
  }

  queryStatusGoods() {
    let params = {
      ...this.paramsStatusGood.getValue(),
    };
    this.serviceGood.getAllStatusGood(params).subscribe({
      next: response => {
        this.columns = [];
        this.columns = response.data;
        this.dataFour.load(this.columns);
        this.dataFour.refresh();
        this.totalItemsStatusGood = response.count || 0;
      },
      error: error => {
        this.dataFour.load([]);
        this.dataFour.refresh();
      },
    });
  }

  querySubtypeGoods(type?: number) {
    if (this.form.controls['typeGood'].value !== null) {
      let paramsPaginated = {
        ...this.paramsStatusGood.getValue(),
      };
      let params = new HttpParams();
      params = params.append('onlyType', 2);
      params = params.append(
        'pType',
        this.form.controls['typeGood'].value?.no_tipo
      );
      this.serviceGoods.getTypesGoods(params, paramsPaginated).subscribe({
        next: response => {
          this.columns = [];
          this.columns = response.data;
          this.dataTwo?.load(this.columns);
          this.dataTwo?.refresh();
          this.totalItemsSubtype = response.count || 0;
        },
        error: error => {
          this.dataTwo?.load([]);
          this.dataTwo?.refresh();
        },
      });
    }
  }

  queryDateMainReform() {
    let params = new HttpParams().set(
      'filter.parameter',
      '$eq:FEC_REFORMA_540'
    );
    this.serviceParameterComer.getParamterMod(params).subscribe({
      next: response => {
        this.form.controls['startDate'].setValue(
          this.servicePipe.transform(response?.data[0]?.value, 'dd/MM/yyyy')
        );
      },
      error: data => {
        this.form.controls['startDate'].setValue('');
      },
    });
  }
  //#endregion

  //#region Modals

  openModalSubtype(id: string) {
    if (id === 'S') {
      this.isSubTypeGoodsVisible = true;
      this.isGoodsStatusVisible = false;
      this.isDelegationsVisible = false;
    } else if (id === 'D') {
      this.isSubTypeGoodsVisible = false;
      this.isGoodsStatusVisible = false;
      this.isDelegationsVisible = true;
    } else if (id === 'G') {
      this.isSubTypeGoodsVisible = false;
      this.isGoodsStatusVisible = true;
      this.isDelegationsVisible = false;
    }
    // gvSubTipoBien.Visible = true;
    // btnAceptarSubTipoBien.Visible = true;
    // H4SubTipoBien.Visible = true;
    // gvEstatusBien.Visible = false;
    // btnAceptarEstatus.Visible = false;
    // H4Estatusbienes.Visible = false;
    // gvDelegaciones.Visible = false;
    // btnAceptarDelegaciones.Visible = false;
    // H4Delegaciones.Visible = false;
    this.modalService.show(this.miModalTemplate, {
      ...MODAL_CONFIG,
      class: 'modal-xl modal-dialog-centered',
    });
  }

  closeModalSubtype() {
    this.modalService.hide();
  }
  //#endregion

  //
}
