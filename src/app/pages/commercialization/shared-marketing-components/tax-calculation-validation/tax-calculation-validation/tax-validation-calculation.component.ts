import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { InconsistenciesComponent } from '../inconsistencies/inconsistencies.component';
import { RateChangeComponent } from '../rate-change/rate-change.component';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { ComerUsuauTxEventService } from 'src/app/core/services/ms-event/comer-usuautxevento.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ComerGoodsRejectedService } from 'src/app/core/services/ms-prepareevent/comer-goods-rejected.service';
import { OfficeManagementService } from 'src/app/core/services/office-management/officeManagement.service';
import { ERROR_EXPORT } from 'src/app/pages/documents-reception/goods-bulk-load/utils/goods-bulk-load.message';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import * as XLSX from 'xlsx';
import { ExpenseParametercomerService } from '../../expense-capture/services/expense-parametercomer.service';
import { COLUMNS, COLUMNS2, COLUMNS3 } from './columns';

@Component({
  selector: 'app-tax-validation-calculation',
  templateUrl: './tax-validation-calculation.component.html',
  styles: [],
})
export class TaxValidationCalculationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  avaluos: any[] = [];

  DIRECCION: 'I';

  TIPO_PROCESO: any;
  V_WHERE_IDAVALUO: any;

  V_IVA: any;
  V_NO_COLUM: any;

  V_TMPBIENES_ERROR: any;
  V_TMPAVALUO_ERROR: any;

  columnFilters: any = [];

  settings2 = { ...this.settings, actions: false };
  data2: LocalDataSource = new LocalDataSource();
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  Detavaluos: any[] = [];

  appraisal: any;
  V_VRI: number;

  v_valor: any;

  selectedRows: any[] = [];
  countParamaterGood: number = 0;
  dataDet: any;
  dataDetArr: any[] = [];
  headerString: string =
    'NO., NO._BIEN, DESCRIPCION, ESTATUS, CLASIF,  TIPO, FECHA, FECHA_VIG, NOMBRE_VAL., TIPO_REF, SUPERFICIE_TERRENO,  SUPERFICIE_CONSTRUCCION, %_TERRENO,   %_CONSTR_HAB, %_CONSTR_COMER, %_INST_ESP, %_OTROS, %_TOTAL, VALOR_REF_CALCULADO, VALOR_TERRENO,  VALOR_CONSTR_HAB, VALOR_CONSTR_COMER, VALOR_INST_ESP, VALOR_OTROS, DIFERENCIA,   TASA_IVA_TERRENO,  TASA_IVA_CONSTR_HAB,  TASA_IVA_CONSTR_COMERCIAL,  TASA_IVA_INSTALACIONES_ESP,  TASA_IVA_OTROS, IVA_TERRENO,  IVA_CONSTR_HAB,  IVA_CONST_COMERCIAL,  IVA_INSTALACIONES_ESP,  IVA_OTROS,  VALOR_TOTAL_IVA_CALCULADO, VALOR_CON_IVA_INCLUIDO,  OBSERVACIONES,  VALIDACION_IVA, CONFIRMADO';

  flagDetail: boolean = true;

  flagCount: boolean = false;

  settings3 = { ...this.settings, actions: false };
  data3: LocalDataSource = new LocalDataSource();
  totalItems3: number = 0;
  params3 = new BehaviorSubject<ListParams>(new ListParams());

  flagTotal: boolean = false;
  flagCambio: boolean = false;

  rateCommercial: number;
  rateHousing: number;
  rateOthers: number;
  rateSpecials: number;
  terrainRate: number;

  IVA_CONSTRUCION: number;
  IVA_CONS_HABITACIONAL: number;
  IVA_INSTALACIONES_ESP: number;
  IVA_OTROS: number;
  IVA_TERRENO: number;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private expenseParametercomerService: ExpenseParametercomerService,
    private authService: AuthService,
    private comerGoodsRejectedService: ComerGoodsRejectedService,
    private comerUsuauTxEventService: ComerUsuauTxEventService,
    private officeManagementService: OfficeManagementService,
    private appraiseService: AppraiseService,
    private goodProcessService: GoodProcessService,
    private excelService: ExcelService,
    private goodService: GoodService
  ) {
    super();
    let objBase = this;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...COLUMNS },
    };
    this.settings2 = {
      ...this.settings2,
      hideSubHeader: false,
      actions: false,
      //columns: { ...COLUMNS2 },
      columns: {
        ...COLUMNS2,
        validIVA: {
          title: 'Validación IVA',
          type: 'custom',
          sort: false,
          renderComponent: CheckboxElementComponent,
          valuePrepareFunction: (isSelected: any, row: any) => {
            console.log('valuePrepareFunction -> ', row);
            return row.validIVA == 'S' ? true : false;
          },
          onComponentInitFunction(instance: any) {
            instance.toggle.subscribe((dataIva: any) => {
              objBase.accionIva(dataIva);
            });
          },
        },
        check: {
          title: 'Confirmado',
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          valuePrepareFunction: (isSelected: any, row: any) => {
            console.log('valuePrepareFunction -> ', row);
            return row.check == 'S' ? true : false;
          },
          onComponentInitFunction(instance: any) {
            instance.toggle.subscribe((data: any) => {
              objBase.accion(data);
              /*
              this.enviarDocumento(data);
              
              if (data.toggle) {
                goodCheck.push(data);
              } else {
                goodCheck = goodCheck.filter(valor => valor.row.id != data.row.id);
              }
              */
            });
          },
          sort: false,
        },
      },
    };
    this.settings3 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...COLUMNS3 },
    };
  }

  accion(data: any) {
    console.log('Data -> ', data.row);
    console.log('Data2 -> ', data.toggle);
    if (data.row.check == 'N') {
      if (data.row.validIVA == 'N') {
        this.alert(
          'warning',
          '',
          'Debe estar marcado la Validación IVA  para poder confirmar el registro.'
        );
        data.toggle = false;
      }
      this.alertQuestion(
        'question',
        '',
        '¿Está seguro de confirmar el registro?'
      ).then(question => {
        if (question.isConfirmed) {
          let params = {
            idAppraisal: Number(this.appraisal),
            idDetAppraisal: Number(data.row.idDetAppraisal1),
            noGood: Number(data.row.goodId),
            approved: 'S',
          };
          console.log('Params Update S->', params);
          this.updateDetailEval(params);
          data.toggle = true;
        } else {
          data.toggle = false;
        }
      });
    } else {
      this.alertQuestion(
        'question',
        '',
        '¿Está seguro de que no desea que el registro esté confirmado?'
      ).then(question => {
        if (question.isConfirmed) {
          data.toggle = false;
          let body = {
            idAppraisal: Number(this.appraisal),
            idDetAppraisal: Number(data.row.idDetAppraisal1),
            noGood: Number(data.row.goodId),
            approved: 'N',
          };
          console.log('Params Update N->', body);
          this.updateDetailEval(body);
        } else {
          data.toggle = true;
        }
      });
    }
  }

  accionIva(dataIva: any) {
    console.log('Data -> ', dataIva.row);
    if (dataIva.row.check == 'S') {
      this.alert(
        'error',
        '',
        'El registro ya está confirmado, sólo el administrador puede liberarlo'
      );
      this.getComerDetAvaluo(this.appraisal);
      return;
    } else if (dataIva.row.validIVA == 'N' && dataIva.row.observation != null) {
      this.alert(
        'error',
        '',
        'El registro ya tiene inconsistencias no puede desmarcar hasta no quitar las inconsistencias.'
      );
      this.getComerDetAvaluo(this.appraisal);
      return;
    } else {
      this.getParametersGood(this.appraisal, dataIva.row.goodId, dataIva);
    }
  }

  getParametersGood(appraisal: number, value: number, dataIva: any) {
    const params = new ListParams();
    params['filter.parameter'] = appraisal;
    params['filter.value'] = value;
    console.log('params ', params);
    this.expenseParametercomerService.getParameterModParam(params).subscribe({
      next: resp => {
        console.log('data getParametersGood ', resp);
        this.countParamaterGood = resp.data.length;
        console.log('countParamaterGood -> ', this.countParamaterGood);
        if (this.countParamaterGood != 0) {
          let body = {
            parameter: appraisal,
            value: value,
            address: 'I',
          };
          console.log('delete getParametersGood -> ', this.countParamaterGood);
          this.deleteParametersGood(body);
          this.getComerDetAvaluo(this.appraisal);
        }
      },
      error: err => {
        console.log('data getParametersGood err ', err);
        this.countParamaterGood = 0;
        let body = {
          parameter: this.appraisal,
          value: dataIva.row.goodId,
          description: 'S',
          //typeEventId: Number(this.form.get('eventId').value),
          address: 'I',
        };
        this.createParameterGood(body);
      },
    });
  }

  deleteParametersGood(body: any) {
    this.expenseParametercomerService.deleteParametersMod(body).subscribe({
      next: resp => {
        console.log('registro eliminado');
      },
      error: err => {
        console.log('registro no eliminado');
      },
    });
  }

  createParameterGood(body: any) {
    this.expenseParametercomerService.postParametersMod(body).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp postParametersMod-> ', resp);
          this.alert(
            'success',
            '',
            'El Registro ha sido Insertado Correctamente'
          );
        }
      },
      error => {
        this.alert('error', '', 'El Registro no ha sido insertado');
      }
    );
  }

  updateDetailEval(valor: any) {
    console.log('Body updateDetailEval-> ', valor);
    this.appraiseService.updateEatDetAppraisal(valor).subscribe({
      next: resp => {
        console.log('Resp updateDetailEval-> ', resp);
        this.getComerDetAvaluo(this.appraisal);
        this.alert(
          'success',
          '',
          'El Registro ha sido actualizado correctamente!'
        );
      },
      error: err => {
        this.alert('error', '', 'El Registro no ha sido actualizado!');
      },
    });
  }

  ngOnInit(): void {
    let text = 'Esto es un ejemplo de "cadena" para CSV';
    console.log(this.escaparComillas(text));
    //this.getParametersGood();
    //console.log('RespSubstr ->', this.Substr('14.6'));
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
    this.getValueIva();

    this.filterTable();

    //this.filterTable2();
    //let token = this.authService.decodeToken();
    let token = 'JBUSTOS';
    if (token == 'JBUSTOS') {
      //Activar botón Confirmar
    }
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      eventId: [null, [Validators.required]],
      processKey: [null],
      eventDate: [null],
      observations: [null],
      requestDate: [null],
      requestType: [null],
      status: [null],
      reference: [null],
    });
  }

  openModalRateChange(context?: Partial<RateChangeComponent>): void {
    const modalRef = this.modalService.show(RateChangeComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe((data: any) => {
      //if (data){}
    });
  }

  openModalRate(context?: Partial<RateChangeComponent>) {
    let config: ModalOptions = {
      initialState: {
        dataDet: this.dataDet,
        callback: (next: boolean, data: any) => {
          if (next) {
            console.log('DataCallBack->', data);
            console.log('DataPASAR-> ', data.rateCommercial);
            this.rateCommercial = data.rateCommercial;
            this.rateHousing = data.rateHousing;
            this.rateOthers = data.rateOthers;
            this.rateSpecials = data.rateSpecials;
            this.terrainRate = data.terrainRate;

            this.IVA_TERRENO = data.IVA_TERRENO;

            this.data2.load([]);
            this.data2.refresh();
            this.getallCondition();
          }
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    // console.log('Config: ', config);
    this.modalService.show(RateChangeComponent, config);
  }

  openModalInconsistencies(context?: Partial<InconsistenciesComponent>): void {
    let config: ModalOptions = {
      initialState: {
        dataDet: this.dataDet,
        callback: (next: boolean) => {
          //if (next) this.find();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    // console.log('Config: ', config);
    this.modalService.show(InconsistenciesComponent, config);
  }

  openModalInconsistencies2(context?: Partial<InconsistenciesComponent>): void {
    const modalRef = this.modalService.show(InconsistenciesComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.selected.subscribe((data: any) => {
      //console.log(data)
      //if (data)
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }

  settingsChange3($event: any): void {
    this.settings3 = $event;
  }

  getValueIva() {
    this.expenseParametercomerService.getParameterMod().subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getValueIva-> ', resp);
          this.V_IVA = '0.' + resp.data[0].value;
          console.log('this.V_IVA-> ', this.V_IVA);
        }
      },
      error => {
        console.log('Error al obtener el valor del IVA. ');
      }
    );
  }

  search() {
    this.getComerAvaluo();

    this.getComerEvent(this.form.get('eventId').value);

    this.form.get('processKey').patchValue(null);
    this.form.get('eventDate').patchValue(null);
    this.form.get('observations').patchValue(null);
    this.form.get('requestDate').patchValue(null);
    this.form.get('requestType').patchValue(null);
    this.form.get('status').patchValue(null);
    this.form.get('reference').patchValue(null);
  }

  getComerEvent(idEvent: number) {
    this.comerGoodsRejectedService.getComerEvent('I', idEvent).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getComerEvent-> ', resp);
          this.getComerTpEvent(idEvent);
          this.getComerStatusVta(resp.data[0].statusVtaId);
          this.getComerParameterMod(
            idEvent,
            resp.data[0].address,
            resp.data[0].tpsolavalId
          );
          this.getComerJobs(idEvent);
        }
      },
      error => {
        console.log('Error getComerEvent-> ', error);
      }
    );
  }

  getComerTpEvent(idEvent: number) {
    this.comerUsuauTxEventService.getComerTpEvent(idEvent).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getComerTpEvent-> ', resp);
          this.form.get('requestType').patchValue(resp.data[0].description);
        } else {
          this.form.get('requestType').setValue(null);
        }
      },
      error => {
        console.log('Error getComerTpEvent-> ', error);
      }
    );
  }

  getComerStatusVta(statusVta: string) {
    this.expenseParametercomerService.getComerStatusVta(statusVta).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getComerStatusVta-> ', resp);
          this.form.get('status').patchValue(resp.data[0].description);
        } else {
          this.form.get('status').setValue(null);
        }
      },
      error => {
        console.log('Error getComerStatusVta-> ', error);
      }
    );
  }

  getComerParameterMod(idEvent: number, address: string, tpsolavalId: any) {
    this.expenseParametercomerService
      .getComerParameterMod(idEvent, address, tpsolavalId, 'TP_SOL_AVAL')
      .subscribe(
        resp => {
          if (resp != null && resp != undefined) {
            console.log('Resp ComerParameterMod-> ', resp);
            this.form.get('reference').patchValue(resp.data[0].description);
          } else {
            this.form.get('reference').setValue(null);
          }
        },
        error => {
          console.log('Error ComerParameterMod-> ', error);
        }
      );
  }

  getComerJobs(idEvent: number) {
    this.officeManagementService.getComerJobs(1, idEvent).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp ComerJobs', resp);
          this.form
            .get('requestDate')
            .patchValue(this.formatDate(new Date(resp.data[0].sendDate)));
        } else {
          this.form.get('requestDate').setValue(null);
        }
      },
      error => {
        console.log('error ComerJobs-> ', error);
      }
    );
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  getComerAvaluo() {
    this.avaluos = [];
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    //?filter.type=$eq:${type}
    //params['filter.type'] = `$eq:I`;
    console.log('params 1 -> ', params);
    this.appraiseService
      .getComerAvaluoWhere(this.form.get('eventId').value, 'I', params)
      .subscribe(
        resp => {
          console.log('Resp comerAvaluo', resp);
          for (let i = 0; i < resp.count; i++) {
            if (resp.data[i] != null && resp.data[i] != undefined) {
              let params = {
                id: resp.data[i].avaluoId,
                appraisalKey: resp.data[i].avaluoCve,
                cveOffice: resp.data[i].jobCve,
                insertDate: this.formatDate(new Date(resp.data[i].insertDate)),
                idEvent: resp.data[i].eventId,
                noDelegation: resp.data[i].delegationNumber,
                noRegister: resp.data[i].registerNumber,
                type: resp.data[i].type,
                userInsert: resp.data[i].insertUser,
              };
              this.avaluos.push(params);
              this.data.load(this.avaluos);
              this.data.refresh();
              this.totalItems = resp.count;
            }
          }
        },
        error => {
          console.log('Error comerAvaluo-> ', error);
        }
      );
  }

  selectRows(rows: any[]) {
    this.dataDetArr = [];
    console.log('row ', rows);
    if (rows.length > 0) {
      //this.flagDetail = false;
      this.flagCambio = true;
      this.selectedRows = rows;
      console.log('Rows Selected->', this.selectedRows);
      console.log('SelectRows', this.selectedRows[0].id);
      this.appraisal = this.selectedRows[0].id;
      this.getComerDetAvaluo(this.appraisal);
    } else {
      this.flagCambio = false;
      this.selectedRows = [];
      //this.flagDetail = true;
    }
  }

  selectRows2(rows: any[]) {
    this.dataDetArr = [];
    this.selectedRows = null;
    console.log('row ', rows);
    if (rows.length > 0) {
      this.flagTotal = true;
      this.flagDetail = false;
      this.selectedRows = rows;
      console.log('Rows Selected->', this.selectedRows);
      //console.log('SelectRows', this.selectedRows[0].id);
      //.appraisal = this.selectedRows[0].id;
      //this.getComerDetAvaluo(this.appraisal);
      let push3 = {
        totalRecords: this.selectedRows.length,
        totalAppraisal: this.selectedRows[0].vri,
        totalTerrain: this.selectedRows[0].vTerrain,
        totalHousing: this.selectedRows[0].vConstruction,
        totalCommercial: this.selectedRows[0].vConstructionEat,
        totalSpecial: this.selectedRows[0].vInstallationsEsp,
        totalOthers: this.selectedRows[0].vOthers,
        totalDifference: this.selectedRows[0].difference,
        valueCalculated: this.selectedRows[0].valueIvaTotalCalculated,
        calueIncluding: this.selectedRows[0].totalAccount,
      };
      let aux: any[] = [];
      aux.push(push3);
      this.data3.load(aux);
      this.data3.refresh;
    } else {
      this.flagTotal = false;
      console.log('row ', this.selectedRows);
      this.selectedRows = [];
      this.flagDetail = true;
      let aux: any[] = [];
      this.data3.load(aux);
      this.data3.refresh;
    }
  }

  filterTable() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                field = 'filter.avaluoId';
                searchFilter = SearchFilter.EQ;
                break;
              case 'valueKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'fileKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'dateInsert':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.listAppraisal(this.flagCount);
          let i = 0;
          console.log('entra ', i++);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.listAppraisal(this.flagCount));
  }

  getallCondition() {
    this.flagCount = true;
    this.listAppraisal(this.flagCount);
    this.flagCambio = false;
  }

  listAppraisal(flagCount: boolean) {
    if (flagCount != true) {
      return;
    }
    this.search();
  }

  getComerDetAvaluo(appraisal: number) {
    this.Detavaluos = [];
    this.data2.load(this.Detavaluos);
    this.data2.refresh();
    this.totalItems2 = 0;
    console.log('this.appraisal', this.appraisal);
    let params2 = {
      ...this.params2.getValue(),
      ...this.columnFilters,
    };
    let v_porcen_aux: any;
    let v_proc_a: number = 0;
    let v_proc_b: number = 0;
    let v_proc_c: number = 0;
    let v_proc_d: number = 0;
    let v_proc_e: number = 0;
    let v_proc_aux: number = 0;

    let terrainRate: any;
    let terrainIva: any;

    let v_mascara_terreno: string;

    let rateHousing: any;
    let ivaHousing: any;
    let v_mascara_habit: string;

    let rateCommercial: any;
    let ivaCommercial: any;
    let v_mascara_comer: string;

    let rateSpecials: any;
    let ivaSpecial: any;
    let v_mascara_especiales: string;

    let rateOthers: any;
    let ivaOthers: any;
    let v_mascara_otros: string;

    let V_SUMA_IVA_TERRENO: number = 0;
    let V_SUMA_IVA_HABITACIONAL: number = 0;
    let V_SUMA_IVA_CONSTRUCION: number = 0;
    let V_SUMA_IVA_INSTALACIONES_ESP: number = 0;
    let V_SUMA_IVA_OTROS: number = 0;
    let valueIvaTotalCalculated: number = 0;

    let product: number = 0;

    let totalAccount: number = 0;

    let difference: number = 0;

    let observation: any;
    console.log('parmas2 -> ', params2);
    this.appraiseService.getComerDetAvaluo(appraisal, 'CPV', params2).subscribe(
      resp => {
        console.log('Resp ComerDetAvaluo-> ', resp);
        this.totalItems2 += resp.count;
        if (resp != null && resp != undefined) {
          /**INICIO pupValidaReg */
          this.V_VRI =
            Number(this.nvl(resp.data[0].vTerrain)) +
            Number(this.nvl(resp.data[0].vConstruction)) +
            Number(this.nvl(resp.data[0].vConstructionEat)) +
            Number(this.nvl(resp.data[0].vInstallationsEsp)) +
            Number(this.nvl(resp.data[0].vOthers));
          /** Mapeo de campos operacion servicio Tabla */
          let porcentTerrain = this.roundPercentage(
            (resp.data[0].vTerrain * 100) / resp.data[0].vri
          );

          let porcentHousing = this.roundPercentage(
            (resp.data[0].vConstruction * 100) / resp.data[0].vri
          );

          let porcentCommercial = this.roundPercentage(
            (resp.data[0].vConstructionEat * 100) / resp.data[0].vri
          );

          let porcentSpecial = this.roundPercentage(
            (resp.data[0].vInstallationsEsp * 100) / resp.data[0].vri
          );

          let porcentOthers = this.roundPercentage(
            (resp.data[0].vOthers * 100) / resp.data[0].vri
          );

          console.log('Params SalidaRound-> ', porcentTerrain);
          console.log('Params SalidaRound2-> ', porcentHousing);
          console.log('Params SalidaRound3-> ', porcentCommercial);

          /**------------------ */
          let porcentTotal =
            porcentTerrain +
            porcentHousing +
            porcentCommercial +
            porcentSpecial +
            porcentOthers;

          if (porcentTotal > 100) {
            v_porcen_aux = porcentTotal - 100;
            if (this.nvl(porcentCommercial) > 0) {
              v_proc_a = porcentCommercial;
            }
            if (this.nvl(porcentHousing) > 0) {
              v_proc_b = porcentHousing;
            }
            if (this.nvl(porcentSpecial)) {
              v_proc_c = porcentSpecial;
            }
            if (this.nvl(porcentOthers)) {
              v_proc_d = porcentOthers;
            }
            if (this.nvl(porcentTerrain)) {
              v_proc_e = porcentTerrain;
            }

            v_proc_aux = v_proc_a;

            if (v_proc_b >= v_proc_aux) {
              v_proc_aux = v_proc_b;
            } else if (v_proc_c >= v_proc_aux) {
              v_proc_aux = v_proc_c;
            } else if (v_proc_d >= v_proc_aux) {
              v_proc_aux = v_proc_d;
            } else if (v_proc_e >= v_proc_aux) {
              v_proc_aux = v_proc_e;
            }

            /**Asignación porcentual del de mayor peso porcentual,  según la siguiente secuencia  (comercial, habitacional, especial, otros, terreno) */
            if (porcentCommercial == v_proc_aux) {
              porcentCommercial = porcentCommercial - v_porcen_aux;
            } else if (porcentSpecial == v_proc_aux) {
              porcentSpecial = porcentSpecial - v_porcen_aux;
            } else if (porcentOthers == v_proc_aux) {
              porcentOthers = porcentOthers - v_porcen_aux;
            } else if (porcentHousing == v_proc_aux) {
              porcentHousing = porcentHousing - v_porcen_aux;
            } else {
              porcentTerrain = porcentTerrain - v_porcen_aux;
            }

            porcentOthers =
              porcentTerrain +
              porcentCommercial +
              porcentHousing +
              porcentSpecial +
              porcentOthers;
          } else if (porcentTotal < 100) {
            v_porcen_aux = 100 - porcentTotal;
            if (porcentCommercial == 0) {
              if (porcentSpecial == 0) {
                if (porcentOthers == 0) {
                  if (porcentOthers == 0) {
                    porcentTerrain = porcentTerrain + v_porcen_aux;
                  } else {
                    porcentHousing = porcentHousing + v_porcen_aux;
                  }
                } else {
                  porcentOthers = porcentOthers + v_porcen_aux;
                }
              } else {
                porcentSpecial = porcentSpecial + v_porcen_aux;
              }
            } else {
              porcentCommercial = porcentCommercial + v_porcen_aux;
            }
            porcentOthers =
              porcentTerrain +
              porcentHousing +
              porcentCommercial +
              porcentSpecial +
              porcentOthers;
          }

          /**Información convertida a caracter por incluir en su caso leyenda (Para terreno). */
          console.log('rateIvaTerrain-> ', resp.data[0].rateIvaTerrain);
          if (resp.data[0].rateIvaTerrain == null) {
            terrainRate = 'EXENTO';
            terrainIva = 'N/A';
            console.log('terrainIva-> ', terrainIva);
          } else {
            terrainRate = String(resp.data[0].rateIvaTerrain * 100);
            v_mascara_terreno = String(
              this.roundPercentage(
                this.nvl(
                  (porcentTerrain / 100) *
                    resp.data[0].rateIvaTerrain *
                    this.V_VRI
                )
              )
            );
            //console.log('v_mascara_terreno-> ', v_mascara_terreno);
            //console.log('terrainIva-> ', terrainIva);
            let terreno = this.Substr(v_mascara_terreno);
            if (terreno) {
              //console.log('PRueba ---> ', terreno);
              terrainIva = terreno;
            } else {
              terrainIva = v_mascara_terreno;
            }
          }
          //console.log('Resp terrainIva FInal-> ', terrainIva);

          /**Información convertida a caracter por incluir en su caso leyenda (Para habitacional). */
          if (resp.data[0].rateIvaConstrHab == null) {
            rateHousing = 'EXENTO';
            ivaHousing = 'N/A';
          } else {
            rateHousing = String(resp.data[0].rateIvaConstrHab * 100);
            v_mascara_habit = String(
              this.roundPercentage(
                this.nvl(porcentHousing / 100) *
                  resp.data[0].rateIvaConstrHab *
                  this.V_VRI
              )
            );
            let habitacion = this.Substr(v_mascara_habit);
            if (habitacion) {
              ivaHousing = habitacion;
            } else {
              ivaHousing = v_mascara_habit;
            }
          }

          /**Información convertida a caracter por incluir en su caso leyenda (Para construción comercial). */
          if (resp.data[0].rateIvaConstrEat == null) {
            rateCommercial = 'EXENTO';
            ivaCommercial = 'N/A';
          } else {
            rateCommercial = String(resp.data[0].rateIvaConstrEat * 100);
            v_mascara_comer = String(
              this.roundPercentage(
                this.nvl(porcentCommercial / 100) *
                  resp.data[0].rateIvaConstrEat *
                  this.V_VRI
              )
            );
            let comercial = this.Substr(v_mascara_comer);
            if (comercial) {
              ivaCommercial = comercial;
            } else {
              ivaCommercial = v_mascara_comer;
            }
          }

          /**Información convertida a caracter por incluir en su caso leyenda (Para instalaciones especiales). */
          if (resp.data[0].rateIvaInstEsp == null) {
            rateSpecials = 'EXENTO';
            ivaSpecial = 'N/A';
          } else {
            rateSpecials = String(resp.data[0].rateIvaInstEsp * 100);
            v_mascara_especiales = String(
              this.roundPercentage(
                this.nvl(porcentSpecial / 100) *
                  resp.data[0].rateIvaInstEsp *
                  this.V_VRI
              )
            );
            let especial = this.Substr(v_mascara_especiales);
            if (especial) {
              ivaSpecial = especial;
            } else {
              ivaSpecial = v_mascara_especiales;
            }
          }

          /**Información convertida a caracter por incluir en su caso leyenda (Para otros). */
          if (resp.data[0].rateIvaOtros == null) {
            rateOthers = 'EXENTO';
            ivaOthers = 'N/A';
          } else {
            rateOthers = String(resp.data[0].rateIvaOtros * 100);
            v_mascara_otros = String(
              this.roundPercentage(
                this.nvl(porcentOthers / 100) *
                  resp.data[0].rateIvaOtros *
                  this.V_VRI
              )
            );
            let otros = this.Substr(v_mascara_otros);
            if (otros) {
              ivaOthers = otros;
            } else {
              ivaOthers = v_mascara_otros;
            }
          }

          if (terrainIva == 'N/A') {
            V_SUMA_IVA_TERRENO = 0;
          } else {
            V_SUMA_IVA_TERRENO = Number(terrainIva);
          }
          if (ivaHousing == 'N/A') {
            V_SUMA_IVA_HABITACIONAL = 0;
          } else {
            V_SUMA_IVA_HABITACIONAL = Number(ivaHousing);
          }

          if (ivaCommercial == 'N/A') {
            V_SUMA_IVA_CONSTRUCION = 0;
          } else {
            V_SUMA_IVA_CONSTRUCION = Number(ivaCommercial);
          }

          if (ivaSpecial == 'N/A') {
            V_SUMA_IVA_INSTALACIONES_ESP = 0;
          } else {
            V_SUMA_IVA_INSTALACIONES_ESP = Number(ivaSpecial);
          }

          if (ivaOthers == 'N/A') {
            V_SUMA_IVA_OTROS = 0;
          } else {
            V_SUMA_IVA_OTROS = Number(ivaOthers);
          }

          valueIvaTotalCalculated =
            V_SUMA_IVA_TERRENO +
            V_SUMA_IVA_HABITACIONAL +
            V_SUMA_IVA_CONSTRUCION +
            V_SUMA_IVA_INSTALACIONES_ESP +
            V_SUMA_IVA_OTROS;

          product =
            (this.nvl(porcentTerrain) / 100) * this.V_VRI +
            (this.nvl(porcentHousing) / 100) * this.V_VRI +
            (this.nvl(porcentCommercial) / 100) * this.V_VRI +
            (this.nvl(porcentSpecial) / 100) * this.V_VRI +
            (this.nvl(porcentOthers) / 100) * this.V_VRI;

          totalAccount = this.V_VRI + this.nvl(valueIvaTotalCalculated);

          difference = this.V_VRI - resp.data[0].vri;

          if (observation != null && !observation.includes('Tasa 0')) {
            porcentTerrain = null;
            porcentCommercial = null;
            porcentHousing = null;
            porcentSpecial = null;
            porcentOthers = null;
            porcentTotal = null;
            difference = null;
            terrainIva = '';
            terrainRate = '';
            ivaCommercial = '';
            rateCommercial = '';
            ivaHousing = '';
            rateHousing = '';
            ivaSpecial = '';
            rateSpecials = '';
            ivaOthers = '';
            rateOthers = '';
            totalAccount = null;
          }
          /**Falta Servicio comer_parametrosmod Para botón tabla VALIDACION */
          let bodyAux = {
            avaluoNumber: this.appraisal,
            goodNumber: resp.data[0].good.goodId,
          };
          let body = {
            avaluoNumber: this.appraisal,
            goodNumber: resp.data[0].good.goodId,
          };
          const params = new ListParams();
          params['filter.parameter'] = this.appraisal;
          params['filter.value'] = resp.data[0].good.goodId;
          params['filter.address'] = 'I';
          console.log('params qqq', params);
          // this.expenseParametercomerService
          //   .postComerParametersMod(body)
          //   .subscribe(valid => {
          //     if (valid != null && valid != undefined) {
          //       this.v_valor = valid.descripcion;
          //       console.log('CheckBox-> ', this.v_valor);
          //     }
          //   });
          this.expenseParametercomerService
            .getParameterModParam(params)
            .subscribe(valid => {
              if (valid != null && valid != undefined) {
                this.v_valor = valid.data[0].description;
                console.log('CheckBox-> ', valid);
              }
            });
          /**FINAL pupValidaReg */
          this.goodProcessService
            .getComerDetAvaluoAll(resp.data[0].noGood)
            .subscribe(response => {
              console.log('Resp getComerDetAvaluoAll-> ', response);

              let params2 = {
                idDetAppraisal1: resp.data[0].idDetAppraisal,
                idDetAppraisal: resp.data[0].idAppraisal,
                goodId: resp.data[0].good.goodId,
                description: response.data[0].descripcion,
                status: response.data[0].estatus,
                goodClassNumber: response.data[0].no_clasif_bien,
                descSssubtipo: response.data[0].desc_sssubtipo,
                descSsubtipo: response.data[0].desc_ssubtipo,
                descSubtipo: response.data[0].desc_subtipo,
                desc_tipo: response.data[0].desc_tipo,
                appraisalDate: this.formatDate(
                  new Date(resp.data[0].appraisalDate)
                ),
                vigAppraisalDate: this.formatDate(
                  new Date(resp.data[0].good.appraisalVigDate)
                ),
                nameAppraiser: resp.data[0].nameAppraiser,
                refAppraisal: resp.data[0].refAppraisal,
                terrainSurface: this.split(resp.data[0].good.val5),
                surfaceConstru: this.split(resp.data[0].good.val5),
                terrainPorcentage: porcentTerrain,
                porcentageHousing: porcentHousing,
                porcentageCommercial: porcentCommercial,
                porcentageSpecials: porcentSpecial,
                porcentageOthers: porcentOthers,
                porcentageTotal: porcentTotal,
                vri: resp.data[0].vri,
                vTerrain: resp.data[0].vTerrain,
                vConstruction: resp.data[0].vConstruction,
                vConstructionEat: resp.data[0].vConstructionEat,
                vInstallationsEsp: resp.data[0].vInstallationsEsp,
                vOthers: resp.data[0].vOthers,
                product: product,
                difference: difference,
                terrainRate:
                  this.terrainRate != null
                    ? this.rateCommercial
                    : this.deletDecim(rateCommercial),
                rateHousing:
                  this.rateHousing != null
                    ? this.rateCommercial
                    : this.deletDecim(rateCommercial),
                rateCommercial:
                  this.rateCommercial != null
                    ? this.rateCommercial
                    : this.deletDecim(terrainRate),
                rateSpecials:
                  this.rateSpecials != null
                    ? this.rateCommercial
                    : this.deletDecim(rateCommercial),
                rateOthers:
                  this.rateOthers != null
                    ? this.rateCommercial
                    : this.deletDecim(rateCommercial),
                terrainIva:
                  this.IVA_TERRENO != null ? this.IVA_TERRENO : terrainIva,
                ivaHousing:
                  this.IVA_CONS_HABITACIONAL != null
                    ? this.IVA_CONS_HABITACIONAL
                    : ivaHousing,
                ivaCommercial:
                  this.IVA_CONSTRUCION != null
                    ? this.IVA_CONSTRUCION
                    : ivaCommercial,
                ivaSpecial:
                  this.IVA_INSTALACIONES_ESP != null
                    ? this.IVA_INSTALACIONES_ESP
                    : ivaSpecial,
                ivaOthers: this.IVA_OTROS != null ? this.IVA_OTROS : ivaOthers,
                valueIvaTotalCalculated: valueIvaTotalCalculated,
                totalAccount: totalAccount,
                observation: resp.data[0].observations,
                validIVA: this.v_valor,
                check: resp.data[0].approved,
                goodDescription: resp.data[0].good.description,
                auxTasaIvaTerren: terrainRate,
                auxTerrainIva: terrainIva,
                vriIva: resp.data[0].vriIva,
                //auxObservations:
              };
              this.dataDet = params2;
              this.dataDetArr.push(params2);
              this.Detavaluos.push(params2);
              this.data2.load(this.Detavaluos);
              this.data2.refresh();
              //this.totalItems2 = resp.count;
              console.log('Avaluos -->', this.Detavaluos);
              console.log('this.data2 -->', this.data2);
            });
        }
      },
      error => {
        console.log('Error ComerDetAvaluo-> ', error);
      }
    );
  }

  roundPercentage(percentage: number): number {
    return parseFloat(percentage.toFixed(2));
  }

  nvl(valor?: number): number {
    if (valor != null) {
      return valor;
    } else {
      return 0;
    }
  }

  Substr(cadena: string) {
    // Obtener los dos últimos caracteres de la cadena
    let ultimosDosCaracteres = cadena.slice(-2);
    let cadenaSinUltimosDos = cadena.slice(0, -2);
    // Verificar si los dos últimos caracteres son un número del 1 al 9
    console.log('SUBSTR-> ', ultimosDosCaracteres);

    //return {ultimosDosCaracteres, cadenaSinUltimosDos};
    if (ultimosDosCaracteres == '.1') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.2') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.3') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.4') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.5') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.6') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.7') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.8') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.9') {
      cadenaSinUltimosDos + '0';
      console.log('Else if-> ', cadenaSinUltimosDos + '0');
      return cadenaSinUltimosDos;
    } else {
      return cadena;
    }
  }

  escaparComillas(cadena: string): string {
    if (cadena.length > 0) {
      cadena = cadena.replace(/"/g, '""'); // Escapar comillas dobles
      cadena = '"' + cadena + '"'; // Agregar comillas dobles al principio y al final
    } else {
      cadena = '';
    }
    return cadena;
  }

  generateExcel() {
    this.alertQuestion(
      'question',
      '¿Descargar el Formato de Avaluo? ',
      '¿Está de acuerdo?'
    ).then(q => {
      if (q.isConfirmed) {
        const headerArray = this.headerString.split(',');
        console.log('Const headerArray-> ', headerArray);
        let aux: any[] = [];
        //aux.push(headerArray);
        //aux.push({ name: 'John', city: 'Seattle' });
        //aux.push({ name: 'Mike', city: 'Los Angeles' });
        //aux.push({ name: 'Zach', city: 'New York' });
        //aux.push(headerArray);
        let item = {
          'NO.': 12,
          'NO._BIEN': 150,
        };

        //aux.push(item);
        console.log('selected impr ', this.selectedRows[0]);
        aux = [
          {
            'NO.': this.selectedRows[0].idDetAppraisal,
            'NO._BIEN': this.selectedRows[0].goodId,
            DESCRIPCION: this.selectedRows[0].description,
            ESTATUS: this.selectedRows[0].status,
            CLASIF: this.selectedRows[0].goodClassNumber,
            TIPO: this.selectedRows[0].desc_tipo,
            FECHA: this.selectedRows[0].appraisalDate,
            FECHA_VIG: this.selectedRows[0].vigAppraisalDate,
            'NOMBRE_VAL.': this.selectedRows[0].nameAppraiser,
            TIPO_REF: this.selectedRows[0].refAppraisal,
            SUPERFICIE_TERRENO: this.selectedRows[0].terrainSurface,
            SUPERFICIE_CONSTRUCCION: this.selectedRows[0].surfaceConstru,
            '%_TERRENO': this.selectedRows[0].terrainPorcentage,
            '%_CONSTR_HAB': this.selectedRows[0].porcentageHousing,
            '%_CONSTR_COMER': this.selectedRows[0].porcentageCommercial,
            '%_INST_ESP': this.selectedRows[0].porcentageSpecials,
            '%_OTROS': this.selectedRows[0].porcentageOthers,
            '%_TOTAL': this.selectedRows[0].porcentageTotal,
            VALOR_REF_CALCULADO: this.selectedRows[0].vri,
            VALOR_TERRENO: this.selectedRows[0].vTerrain,
            VALOR_CONSTR_HAB: this.selectedRows[0].vConstruction,
            VALOR_CONSTR_COMER: this.selectedRows[0].vConstructionEat,
            VALOR_INST_ESP: this.selectedRows[0].vInstallationsEsp,
            VALOR_OTROS: this.selectedRows[0].vOthers,
            DIFERENCIA: this.selectedRows[0].difference,
            TASA_IVA_TERRENO: this.selectedRows[0].terrainRate,
            TASA_IVA_CONSTR_HAB: this.selectedRows[0].rateHousing,
            TASA_IVA_CONSTR_COMERCIAL: this.selectedRows[0].rateCommercial,
            TASA_IVA_INSTALACIONES_ESP: this.selectedRows[0].rateSpecials,
            TASA_IVA_OTROS: this.selectedRows[0].rateOthers,
            IVA_TERRENO: this.selectedRows[0].terrainIva,
            IVA_CONSTR_HAB: this.selectedRows[0].ivaHousing,
            IVA_CONST_COMERCIAL: this.selectedRows[0].ivaCommercial,
            IVA_INSTALACIONES_ESP: this.selectedRows[0].ivaSpecial,
            IVA_OTROS: this.selectedRows[0].ivaOthers,
            VALOR_TOTAL_IVA_CALCULADO:
              this.selectedRows[0].valueIvaTotalCalculated,
            VALOR_CON_IVA_INCLUIDO: this.selectedRows[0].totalAccount,
            OBSERVACIONES: this.selectedRows[0].dataDetobservation,
            VALIDACION_IVA:
              this.selectedRows[0].validIVA != null
                ? this.dataDet.validIVA
                : 'N',
            CONFIRMADO:
              this.selectedRows[0].check != null ? this.dataDet.check : 'N',
          },
        ];
        console.log('Data let Aux-> ', aux);
        console.log('Data let Aux-> ', this.dataDet);
        this.exportXlsx('export', aux);
      } else {
        return;
      }
    });
  }

  exportXlsx(opcion: string, data: any[]) {
    console.log('exportXlsx Data-> ', data);
    if (data.length == 0) {
      this.onLoadToast('warning', 'Archivo', ERROR_EXPORT);
    } else {
      //this.excelService.export(data, {
      // filename: opcion,
      // });

      //this.getFilterProceedings();

      const workSheet = XLSX.utils.json_to_sheet(data, {
        skipHeader: false,
      });
      const workBook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Hoja1');
      let aux = 'Avalúos' + '.xlsx';
      XLSX.writeFile(workBook, aux);
    }
  }

  deletDecim(numero: number): number {
    console.log('deletDecim-> ', Math.floor(numero));
    return numero / 100;
  }

  split(cadena: string): number | null {
    console.log('Split sin proc-> ', cadena);
    const cadenaSinGuiones = cadena.replace(/-/g, '');

    // Convierte la cadena en un número decimal
    const numero: number = parseFloat(cadenaSinGuiones);
    console.log('Split Numero-> ', numero);
    // Verifica si la conversión fue exitosa
    if (!isNaN(numero)) {
      return numero;
    } else {
      return null; // Devuelve null si no se pudo convertir
    }
  }

  cleanForm() {
    this.form.reset();
    this.data.load([]);
    this.data.refresh();
    this.data2.load([]);
    this.data2.refresh();
    this.data3.load([]);
    this.data3.refresh();
  }
}
