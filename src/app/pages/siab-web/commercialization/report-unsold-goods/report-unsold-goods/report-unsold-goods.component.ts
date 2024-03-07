import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ButtonColumnComponent } from 'src/app/shared/components/button-column/button-column.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  DELEGATION_COLUMNS_REPORT,
  GOODS_COLUMNS,
  HISTORY_COLUMNS_REPORT,
  HISTORY_EVENT_COLUMNS_REPORT,
  STATUS_COLUMNS_REPORT,
  SUBTYPE_COLUMNS_REPORT,
} from './columns';

interface IExcelToJson {
  NO_BIEN: number;
}

@Component({
  selector: 'app-report-unsold-goods',
  templateUrl: './report-unsold-goods.component.html',
  styles: [
    `
      input[type='file']::file-selector-button {
        margin-right: 20px;
        border: none;
        background: #9d2449;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        /* transition: background.2s ease-in-out; */
      }
    `,
  ],
})
export class ReportUnsoldGoodsComponent extends BasePage implements OnInit {
  //

  //#region Vars
  // Modal
  @ViewChild('myModalSubtype', { static: true })
  miModalTemplate: TemplateRef<any>;
  @ViewChild('myModalHistory', { static: true })
  miModalHistory: TemplateRef<any>;

  //Class Variables
  dataSubtypesGood: any;
  dataDelegation: any;
  dataStatusText: any;
  dataGoods: any;

  //Form
  form: FormGroup = new FormGroup({});
  formTwo: FormGroup;

  // Tables
  data: LocalDataSource = new LocalDataSource();
  dataTwo: LocalDataSource = new LocalDataSource();
  dataThree: LocalDataSource = new LocalDataSource();
  dataFour: LocalDataSource = new LocalDataSource();
  dataFive: LocalDataSource = new LocalDataSource();
  dataSix: LocalDataSource = new LocalDataSource();
  // - Columns
  settingsOne: any;
  settingsTwo: any;
  settingsThree: any;
  settingsFour: any;
  settingsFive: any;

  // Boolean
  // SubTypeGoods
  isSubTypeGoodsVisible: boolean = true;
  isStatus: boolean = false;

  // GoodsStatus
  isGoodsStatusVisible: boolean = true;

  // Delegations
  isDelegationsVisible: boolean = true;

  // Events
  isEvents: boolean = false;

  // Any
  fullGoods: any;
  fullDelegations: any;
  // Arreglos Check Filter
  dataCheckSubtypeGood: any[] = [];
  dataCheckDelegation: any[] = [];
  dataCheckStatusGood: any[] = [];

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

  fileReader = new FileReader();
  dataExcel: any = [];
  propertyValues: string[] = [];
  commaSeparatedString: string = '';
  fileName: string;
  bienTxt: boolean = false;
  bienExcel: boolean = false;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  noBien: string;

  //#endregion

  //#region Constructor & NgOnInit

  constructor(
    private fb: FormBuilder,
    private serviceGoods: GoodprocessService,
    private serviceDelegations: DelegationService,
    private serviceGood: GoodService,
    private serviceParameterComer: ParameterModService,
    private servicePipe: DatePipe,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private comerEventosService: ComerEventosService
  ) {
    super();
    this.settings = {
      ...this.settings,
      // selectMode: 'multi',
      actions: false,
      columns: {
        detailStatus: {
          title: 'Detalle Estatus',
          width: '5%',
          type: 'custom',
          sort: false,
          renderComponent: ButtonColumnComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              console.log(row.no_bien);
              this.noBien = row.no_bien;
              this.lnkView(row.no_bien);
            });
          },
        },
        detailEvents: {
          title: 'Detalle  Eventos',
          width: '5%',
          type: 'custom',
          sort: false,
          renderComponent: ButtonColumnComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              console.log(row);
              this.lnkView2(row.no_bien);
            });
          },
        },
        ...GOODS_COLUMNS,
      },
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
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.lnkView();
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
      startDate: [null, [Validators.required]],
      filterGoods: [null],
      filterText: [null],
    });
    this.formTwo = this.fb.group({
      radioOne: [null],
      txtBien: [null],
      file: [null],
    });
  }
  //#endregion
  chargeFile(event: Event) {
    try {
      const files = (event.target as HTMLInputElement).files;

      if (!files || files.length !== 1)
        throw new Error('Please select one file.');
      this.fileName = files[0].name;
      console.log(this.fileName);
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(files[0]);
      fileReader.onload = () => this.readExcel(fileReader.result);

      // Lee el contenido binario del archivo
    } catch (error) {
      console.error('Error:', error);
      // Maneja el error de acuerdo a tus necesidades
    }
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.dataExcel = this.excelService.getData<IExcelToJson>(binaryExcel);
      this.propertyValues = this.dataExcel.map((item: any) => item.NO_BIEN);
      console.log(this.propertyValues);
      this.commaSeparatedString = this.propertyValues.join(',');
      console.log(this.commaSeparatedString);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }
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
        ...this.paramsSubtype.getValue(),
      };
      let params = new HttpParams();
      params = params.append('onlyType', 2);
      params = params.append('pType', this.form.controls['typeGood'].value);
      this.serviceGoods.getTypesGoods(params, paramsPaginated).subscribe({
        next: response => {
          this.columns = [];
          this.columns = response.data;
          console.log(this.columns);
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
          this.servicePipe.transform(response?.data[0]?.valor, 'dd/MM/yyyy')
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
    this.modalService.show(this.miModalTemplate, {
      ...MODAL_CONFIG,
      class: 'modal-xl modal-dialog-centered',
    });
  }

  openModalHistory(id: any) {
    if (id === 'S') {
      this.isEvents = false;
      this.isStatus = true;
    } else {
      this.isStatus = false;
      this.isEvents = true;
    }
    this.modalService.show(this.miModalHistory, {
      ...MODAL_CONFIG,
      class: 'modal-xl modal-dialog-centered',
    });
  }

  closeModalSubtype() {
    this.modalService.hide();
  }
  //#endregion

  //#region Valid check or not check
  checkAcceptSubtypeGood(event: any) {
    console.log(event);
    if (event.isSelected) {
      this.dataCheckSubtypeGood.push(event.data);
    } else {
      const index = this.dataCheckSubtypeGood.findIndex(
        x => x.subtypeNumber == event.data.subtypeNumber
      );
      this.dataCheckSubtypeGood.splice(index, 1);
    }
    console.log('El array actualmente: ', this.dataCheckSubtypeGood);
  }
  //
  checkAcceptDelegations(event: any) {
    console.log('Arreglo status: ', event.data);

    if (event.isSelected) {
      this.dataCheckDelegation.push(event.data);
    } else {
      const index = this.dataCheckDelegation.findIndex(
        x => x.id == event.data.id
      );
      this.dataCheckDelegation.splice(index, 1);
      console.log('El array actualmente: ', this.dataCheckDelegation);
    }
  }
  //
  checkAcceptStatusGood(event: any) {
    console.log('Arreglo status: ', event.data);
    if (event.isSelected) {
      this.dataCheckStatusGood.push(event.data);
    } else {
      const index = this.dataCheckStatusGood.findIndex(
        x => x.status == event.data.status
      );
      this.dataCheckStatusGood.splice(index, 1);
      console.log('El array actualmente: ', this.dataCheckStatusGood);
    }
  }
  //#endregion

  //#region Utils
  removeRow(array: any[], register: any, id: any) {
    console.log('El array aca abajo: ', array[0]?.data);
    return array.filter(item => item?.data[id] !== register?.data[id]);
  }
  consult() {
    var valueSTG = this.dataCheckSubtypeGood.map(
      (item: any) => item.subtypeNumber
    );
    var resultSTG = valueSTG.join(',');
    console.log(resultSTG);

    var valueD = this.dataCheckDelegation.map((item: any) => item.id);
    var resultD = valueD.join(',');
    console.log(resultD);

    var valueSG = this.dataCheckStatusGood.map((item: any) => item.status);
    var resultSG = valueSG.join(',');
    console.log(resultSG);

    let data = {
      subtypes: resultSTG,
      type: this.form.controls['typeGood'].value,
      delegation: resultD,
      status: resultSG,
      date: this.form.controls['startDate'].value,
    };
    console.log(data);
    this.serviceGoods.getGoods540(data).subscribe({
      next: response => {
        console.log(response);
        this.data.load(response.data);
        this.data.refresh();
        this.clean();
      },
      error: error => {
        this.clean();
        this.data.load([]);
        this.data.refresh();
        this.onLoadToast('warning', 'No se encontraron registros', '');
      },
    });
  }
  searchBien() {
    // getGoods540XGood;
    var array = [];
    array.push(this.formTwo.controls['txtBien'].value);
    let data = {
      goodNumbers: array,
      date: this.form.controls['startDate'].value,
    };
    this.serviceGoods.getGoods540XGood(data).subscribe({
      next: response => {
        console.log(response);
        this.data.load(response.data);
        this.data.refresh();
        this.clean();
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.clean();
        this.onLoadToast('warning', 'No se encontraron registros', '');
      },
    });
  }
  searchBienExcel() {
    let data = {
      goodNumbers: [this.commaSeparatedString],
      date: this.form.controls['startDate'].value,
    };
    this.serviceGoods.getGoods540XGood(data).subscribe({
      next: response => {
        console.log(response);
        this.data.load(response.data);
        this.data.refresh();
        this.clean();
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.clean();
        this.onLoadToast('warning', 'No se encontraron registros', '');
      },
    });
  }
  lnkView(noBien?: string) {
    if (noBien) {
      this.openModalHistory('S');
    }
    let data = {
      pOption: 8,
      pEvent: this.noBien,
      pLot: 0,
      pTypeGood: '',
      pEventKey: 0,
      pTrans: 0,
    };
    let params = {
      ...this.params.getValue(),
    };
    this.comerEventosService.getLoteExport(data, params).subscribe({
      next: resp => {
        console.log(resp);
        this.dataFive.load(resp.data);
        this.dataFive.refresh();
        this.totalItems = resp.count;
      },
      error: err => {
        console.log(err);
        this.dataFive.load([]);
        this.dataFive.refresh();
      },
    });
  }
  lnkView2(noBien: string) {
    this.openModalHistory('E');
    let data = {
      pIdGood: noBien,
    };
    this.comerEventosService.spObtnEventXgood540(data).subscribe({
      next: resp => {
        console.log(resp);
        this.dataSix.load([resp]);
        this.dataSix.refresh();
        this.totalItems = resp.count;
      },
      error: err => {
        console.log(err);
        this.dataSix.load([]);
        this.dataSix.refresh();
      },
    });
  }
  viewRadio(res: string) {
    console.log(res);
    if (res == 'radioTwo') {
      this.bienTxt = true;
      this.bienExcel = false;
    } else {
      this.bienTxt = false;
      this.bienExcel = true;
    }
  }
  clean() {
    this.form.reset();
    this.formTwo.reset();
    this.bienTxt = false;
    this.bienExcel = false;
  }
}
