import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom, map, skip, take } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { readFile } from 'src/app/common/helpers/helpers';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ISpentConcept } from 'src/app/core/models/ms-spent/spent.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { UtilComerV1Service } from 'src/app/core/services/ms-prepareevent/util-comer-v1.service';
import { SpentService } from 'src/app/core/services/ms-spent/spent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SelectConceptSpentDialogComponent } from '../components/select-concept-spent-dialog/select-concept-spent-dialog.component';
import { MassiveNumeraryChangeModalComponent } from '../massive-numerary-change-modal/massive-numerary-change-modal.component';
import { IMassiveNumeraryGood } from '../types/massive-numerary.type';
import {
  HELP_ARR,
  MASSIVE_NUMERARY_CHANGE_COLUMNS,
} from './massive-numerary-change-columns';

@Component({
  selector: 'app-massive-numerary-change',
  templateUrl: './massive-numerary-change.component.html',
  styles: [
    `
      /* .selects-origin-data select {
        border: none;
        border-bottom: 1px solid black;
        margin-left: 5px;
        margin-right: 5px;
        padding: 3px;
        outline: none;
        font-weight: 500;
      }
      .spent-inputs input {
        border: none;
        border-bottom: 1px solid black;
        margin: 0 5px 15px 0;
        outline: none;
      }

      .spent-inputs > div {
        display: flex;
        flex-direction: column;
      } */
      .spent-container {
        width: 250px;
      }
      .spent-container input {
        width: 150px;
      }
      select.selects-origin-data {
        width: 105px;
        min-height: auto !important;
      }
      .btn-custom-search {
        position: absolute;
        right: 3px;
        top: 8px;
      }
    `,
  ],
})
export class MassiveNumeraryChangeComponent extends BasePage implements OnInit {
  form: FormGroup;
  dataPrevious: any[] = [];
  dataPreviousTable = new LocalDataSource([]);
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  columns = HELP_ARR;

  registerReads: number = 0;
  registerProcessed: number = 0;
  registerCorrect: number = 0;
  registerIncorrect: number = 0;

  BLK_BIENES = new LocalDataSource();
  BLK_GASTOS = new LocalDataSource();

  isVisibleSpent: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodService: GoodService,
    private accountMovementService: AccountMovementService,
    private spentService: SpentService,
    private excelService: ExcelService,
    private prepareEventService: UtilComerV1Service,
    private authService: AuthService,
    private goodProcess: GoodprocessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideHeader: false,
      hideSubHeader: false,
      columns: MASSIVE_NUMERARY_CHANGE_COLUMNS,
      pager: {
        perPage: 10,
      },
    } as any;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.onInit();
    this.params.pipe(skip(1)).subscribe((res: ListParams) => {
      // this.loadTablePreviewData(res);
      // this.tableSpent.changePage(res.page);
      console.log(res);
      this.dataPreviousTable.setPaging(res.page, res.limit, true);
    });
    // this.changeValueFormTips();
  }
  changeTip(e: any, num: number) {
    const value = e.target.value;
    console.log(value, num);
    if (value === 'G') {
      this.formGad.get(`GAD${num}`).enable();
      this.formGas.get(`GAS${num}`).enable();
    } else {
      this.formGad.get(`GAD${num}`).disable();
      this.formGas.get(`GAS${num}`).disable();
    }
    this.isVisibleSpent = Object.values(this.formTips.value).some(
      value => value === 'G'
    );
  }

  clean() {
    this.form.reset();
    this.formGad.reset();
    this.formGad.disable();
    this.formGas.reset();
    this.formGas.disable();
    this.formTips.reset();

    this.BLK_BIENES.reset();
    this.BLK_GASTOS.reset();
    this.dataPrevious = [];
    this.dataPreviousTable = new LocalDataSource([]);
    this.registerReads = 0;
    this.registerProcessed = 0;
    this.registerCorrect = 0;
    this.registerIncorrect = 0;
  }

  prepareForm() {
    this.form = this.fb.group({
      recordsRead: [null, Validators.nullValidator],
      processed: [null, Validators.nullValidator],
      correct: [null, Validators.nullValidator],
      wrong: [null, Validators.nullValidator],
      data: [null, Validators.nullValidator],
      concept: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
    });
  }

  onClickInputGas(num: number) {
    console.log('onDobleClickInputGas');
    this.formGas.get(`GAS${num}`).setValue('');
    const modal = this.modalService.show(SelectConceptSpentDialogComponent, {
      class: 'modal-lg',
      ignoreBackdropClick: true,
    });
    modal.onHidden.pipe(take(1)).subscribe((res: any) => {
      console.log(res, modal.content);
      if (modal.content) {
        this.formGas.get(`GAS${num}`).setValue(modal.content.selectedItem.id);
        this.formGad
          .get(`GAD${num}`)
          .setValue(modal.content.selectedItem.description);
      }
    });
  }

  getAttributes() {
    this.loading = true;
  }
  openForm(data?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      callback: (next: boolean) => {
        if (next) this.getAttributes();
      },
    };
    this.modalService.show(MassiveNumeraryChangeModalComponent, modalConfig);
  }

  formTips = new FormGroup({});
  formGas = new FormGroup<any>({});
  formGad = new FormGroup<any>({});
  async onInit() {
    this.columns.forEach((column, index) => {
      this.formTips.addControl(`TIP${index + 1}`, new FormControl(''));
      this.formGas.addControl(
        `GAS${index + 1}`,
        new FormControl({ value: '', disabled: true })
      );
      this.formGad.addControl(
        `GAD${index + 1}`,
        new FormControl({ value: '', disabled: true })
      );
    });
  }

  isLoadingProcessExtraction = false;
  async onClickBtnProcessExtraction() {
    // this.registerReads = 0;
    this.registerProcessed = 0;
    this.registerCorrect = 0;
    this.registerIncorrect = 0;
    console.log('onClickBtnProcessExtraction');
    let vBanB = 0;
    let vBanI = 0;
    let vBanV = 0;
    let vBanG = false;

    let vColI = 0;
    let vColG: any = null;
    let vColV = 0;
    let vColB = 0;
    this.columns.forEach((_column, index) => {
      index++;
      const control = this.formTips.get(`TIP${index}`);
      const controlValue = control?.value;
      switch (controlValue) {
        case 'B':
          vColB = index;
          vBanB++;
          break;
        case 'I':
          vColI = index;
          vBanI++;
          break;
        case 'G':
          const controlGas = this.formGas.get(`GAS${index}`);
          if (!controlGas?.value) {
            vBanG = true;
          } else {
            vColG = vColG + index + ',';
          }
          break;
        case 'V':
          vColV = index;
          vBanV++;
      }
    });
    const messages = [];
    let vBan = false;
    if (vBanB === 0 || vBanB > 1) {
      messages.push(
        vBanB === 0
          ? 'Se Debe Especificar La Columna Del No. De Bien'
          : 'Se Especificó Más De Una Columna Del No. De Bien'
      );
      vBan = true;
    }

    if (vBanI === 0 || vBanI > 1) {
      messages.push(
        vBanI === 0
          ? 'Se Debe Especificar La Columna Del Ingreso Neto'
          : 'Se Especificó Más De Una Columna Del Ingreso Neto'
      );
      vBan = true;
    }

    if (vBanG) {
      messages.push(
        'No Se Especificó El Concepto De Gasto En Al Menos Una Columna'
      );
      vBan = true;
    }

    if (vBanV === 0 || vBanV > 1) {
      messages.push(
        vBanV === 0
          ? 'Se Debe Especificar La Columna Del IVA'
          : 'Se Especificó Más De Una Columna Del IVA'
      );
      vBan = true;
    }
    if (messages.length > 0) {
      this.alert(
        'warning',
        'Advertencia',
        'No puede Haber Más de Una Columna con el No. Bien, Ingreso Neto o IVA'
      );
    }
    if (vBan) {
      return;
    }

    const dataPreviousAux = await this.dataPreviousTable.getAll();
    console.log({ dataPreviousAux });
    dataPreviousAux.shift();
    const body = {
      colB: vColB,
      colI: vColI,
      colV: vColV,
      colG: vColG,
      bienes: dataPreviousAux,
      formG: this.formGas.value,
      formGad: this.formGad.value,
    };
    console.log({ body });
    this.isLoadingProcessExtraction = true;
    this.loader.load = true;
    this.goodProcess.postFMasInsNumerario(body).subscribe({
      next: (res: any) => {
        this.isLoadingProcessExtraction = false;
        this.loader.load = false;
        this.registerReads = res.T_REG.T_REG_PROCESADOS;
        this.registerProcessed = res.T_REG.T_REG_PROCESADOS;
        this.registerCorrect = res.T_REG.T_REG_CORRECTOS;
        this.registerIncorrect = res.T_REG.T_REG_ERRONEOS;
        console.log(res);
        this.dataTableSpent = res.BLK_BIENES.map((res: any) => {
          return {
            costs: res.GASTO,
            cveEvent: res.CVE_PROCESO,
            description: res.DESCRIPCION,
            entry: res.INGRESO,
            identifier: res.IDENTIFICADOR,
            impNumerary: res.VALOR_AVALUO,
            indNume: res.IND_NUME,
            noDelegation: res.NO_DELEGACION,
            noExpAssociated: res.NO_EXP_ASOCIADO,
            noExpedient: res.NO_EXPEDIENTE,
            noFlier: res.NO_VOLANTE,
            noGood: res.NO_BIEN,
            noSubDelegation: res.NO_SUBDELEGACION,
            npNUm: res.NO_BIEN_NUME as any,
            quantity: res.CANTIDAD as any,
            status: res.ESTATUS,
            tax: res.IVA as any,
            color: res.COLOR as any,
          };
        });

        this.dataTableSmall = res.BLK_GASTOS.map((res: any) => {
          return {
            amount: res.IMPORTE as any,
            cveie: res.NO_CONCEPTO_GASTO,
            noGood: res.NO_BIEN,
            description: res.DESCRIPCION,
            status: res.ESTATUS,
            type: res.TIPO,
          };
        });
        const modalRef = this.modalService.show(
          MassiveNumeraryChangeModalComponent,
          {
            initialState: {
              dataTableGoods: this.dataTableSpent,
              dataTableSpents: this.dataTableSmall,
              user: this.getUser().preferred_username.toUpperCase(),
            },
            class: 'modal-lg',
            ignoreBackdropClick: true,
          }
        );
        modalRef.content.refresh.subscribe((next: any) => {
          if (next) {
            this.clean();
            this.totalItems = 0;
          }
        });
      },
      error: err => {
        this.loader.load = false;
        this.isLoadingProcessExtraction = false;
      },
      complete: () => {},
    });
    // this.processExtraction(vColB, vColI, vColV, vColG);
  }

  dataTableSpent: any[] = [];
  dataTableSmall: any[] = [];
  async processExtraction(
    // dataTablePreview: any[],
    colB: number,
    colI: number,
    colV: number,
    colG: string
  ) {
    this.dataTableSpent = [];
    this.dataTableSmall = [];
    let cont = 0;
    let vItem = null;

    let vType = null;
    let vNoGood;
    let vContm = 0;

    /** @description vdescripcion, vestatus, vno_exp_asociado, vno_expediente, vcantidad,
                      vno_delegacion, vno_subdelegacion, videntificador, vno_volante, vno_clasif_bien, vno_bien_padre_parcializacion */
    let good: IGood | null = null;
    /** @description no_bien: vno_bienn, estatus: vestatusn */
    let vGoodStatus: IGood | null = null;

    // let vnoGoodN = null;
    let vSpent = null;
    let vcveProcess = null;
    let vIndNume: number;
    let vActaOk = null;
    let vIncome: any = null;
    let vTax: any = 0;
    let vColg1 = null;
    let vTotalSpent = null;
    let vColgu;
    let vdSpent = null;
    let vDescription = null;
    const mapAsync = await this.dataPrevious.map(async (item, index) => {
      if (index === 0) {
        return;
      }
      // const test = async (item: any) => {
      vItem = 'COL' + colB;
      vType = item[vItem];

      if (vType) {
        try {
          vNoGood = Number(String(vType).replace(',', '.'));
          try {
            /** @description no_bien */
            good = await this.selectGoodForId(vNoGood);
            // vnoGoodN = null;
            vcveProcess = null;
            try {
              vGoodStatus = await this.selectGoodFilterNoGoodReferenceAndNoGood(
                vNoGood
              );
              // vnoGoodN = vGoodStatus?.id;
              if (vGoodStatus?.status !== 'ADM') {
                vIndNume = 0;
                vContm++;
                vcveProcess = 'Numerario <> ADM.';
              } else {
                try {
                  const accountMovement = await this.selectMovementAccount(
                    vGoodStatus.id // vnoGoodN
                  );
                  vIndNume = 3;
                  vContm++;
                  vcveProcess = 'Numerario conciliado.';
                } catch (ex) {
                  // vContm++;
                  vIndNume = 2;
                }
              }
              vcveProcess = await this.pufSearchEvent(vNoGood);
            } catch (ex: any) {
              console.log({ ex: ex.message });
              if (ex?.message === 'Más de una ref.') {
                vIndNume = 0;
                vContm++;
                vcveProcess = ex?.message;
              } else {
                if (
                  good.identifier == 'TRANS' &&
                  ['CNE', 'CBD', 'CDS', 'CNS', 'CNR'].includes(good.status)
                ) {
                  vIndNume = 2;
                  vcveProcess = await this.pufSearchEvent(vNoGood);
                } else {
                  vIndNume = 1;
                  if (good.identifier == 'TRANS') {
                    vIndNume = 4;
                  }
                  vActaOk = await this.pufValidActaReception(vNoGood);
                  if (
                    !vActaOk &&
                    this.nvl(good.goodsPartializationFatherNumber) > 0
                  ) {
                    vActaOk = await this.pufValidActaReception(
                      good.goodsPartializationFatherNumber
                    );
                  }
                  if (!vActaOk) {
                    vIndNume = 5;
                    vContm++;
                    vcveProcess = 'Bien sin acta';
                  }
                }
              }
            }
            vItem = 'COL' + colI;
            vType = item[vItem];
            if (vType) {
              try {
                vIncome = Number(
                  Math.round(parseFloat(String(vType).replace(',', '.')))
                ).toFixed(2);
                vItem = 'COL' + colV;
                vType = item[vItem];
                if (vType) {
                  try {
                    vTax = Number(
                      Math.round(parseFloat(String(vType).replace(',', '.')))
                    ).toFixed(2);
                    vColg1 = colG;
                    vTotalSpent = 0;
                    while (vColg1) {
                      vColgu = vColg1.substring(0, vColg1.indexOf(',')); //TODO: verificar | v_colgu := SUBSTR(v_colg1,1,INSTR(v_colg1,',',1)-1);
                      vItem = 'COL' + vColgu;
                      vType = item[vItem];
                      try {
                        vSpent = Number(
                          Math.round(
                            parseFloat(String(vType).replace(',', '.'))
                          )
                        ).toFixed(2); //:TODO verificar | vgasto := NVL(ROUND(TO_NUMBER(REPLACE(v_tipo,',','.'),'99999999999999.9999999999'),2),0);
                        vItem = 'GAS' + vColgu;
                        vdSpent = this.formGas.get(vItem)?.value;
                        vTotalSpent = vTotalSpent + Number(this.nvl(vSpent, 0));
                        vItem = 'GAD' + vColgu;
                        vDescription = this.formGad.get(vItem)?.value;
                        if (!vDescription) {
                          try {
                            vDescription = (await this.getConceptSpend(vdSpent))
                              .description;
                          } catch (ex) {
                            vDescription = 'Gasto ' + vdSpent;
                          }
                        }
                        // GO_BLOCK('BLK_GASTOS');
                        //            IF NOT FORM_SUCCESS THEN
                        //               RAISE Form_Trigger_Failure;
                        //            END IF;
                        //            IF :BLK_GASTOS.NO_BIEN IS NOT NULL THEN
                        //               CREATE_RECORD;
                        //            END IF;

                        const blkSpent = {
                          noGood: vNoGood,
                          cveie: vdSpent,
                          amount: vSpent as any,
                          description: vDescription,
                          status: good.status,
                          type: 'E',
                        };
                        this.dataTableSmall.push(blkSpent);
                      } catch (ex) {
                        null;
                      }
                      vColg1 = vColg1.substring(vColg1.indexOf(',') + 1);
                    }
                    const blkSpent = {
                      noGood: vNoGood,
                      cveie: 0,
                      amount: vTax,
                      description: 'I.V.A.',
                      status: good.status,
                      type: 'i',
                    };
                    this.dataTableSmall.push(blkSpent);
                    console.log({
                      dataTableSmall: this.dataTableSmall,
                      blkSpent,
                    });

                    const prevDataTableSpent: IMassiveNumeraryGood = {
                      noGood: vNoGood,
                      description: good.description,
                      status: good.status,
                      entry: vIncome + vTotalSpent - vTax,
                      costs: vTotalSpent,
                      tax: vTax,
                      impNumerary: vIncome,
                      noExpAssociated: good.associatedFileNumber,
                      noExpedient: good.fileeNumber,
                      quantity: good.quantity,
                      noDelegation: (good.delegationNumber as any)?.id,
                      noSubDelegation: (good.subDelegationNumber as any)?.id,
                      identifier: good.identifier,
                      noFlier: good.flyerNumber,
                      indNume: vIndNume,
                      cveEvent: vcveProcess,
                      npNUm: vGoodStatus?.id,
                    };

                    if (vIndNume !== 1) {
                      switch (vIndNume) {
                        case 0:
                          prevDataTableSpent['color'] = 'bg-custom-red';
                          break;
                        case 2:
                          prevDataTableSpent['color'] = 'bg-custom-green';
                          break;
                        case 4:
                          prevDataTableSpent['color'] = 'bg-custom-cyan';
                          break;
                        case 5:
                          prevDataTableSpent['color'] = 'bg-custom-orange';
                          break;
                        default:
                          prevDataTableSpent['color'] = 'bg-custom-yellow';
                      }
                    }
                    this.dataTableSpent.push(prevDataTableSpent);
                    cont++;
                  } catch (ex) {
                    vContm++;
                  }
                }
              } catch (ex) {
                vContm++;
              }
            } else {
              vContm++;
            }
          } catch (ex) {
            vContm++;
          }
        } catch (ex) {
          vContm++;
        }
      } else {
        vContm++;
      }
      this.registerProcessed = cont + vContm;
      this.registerCorrect = cont;
      this.registerIncorrect = vContm;
    });

    await Promise.all(mapAsync);

    this.isLoadingProcessExtraction = false;
    this.modalService.show(MassiveNumeraryChangeModalComponent, {
      initialState: {
        dataTableGoods: this.dataTableSpent,
        dataTableSpents: this.dataTableSmall,
        user: this.getUser().preferred_username.toUpperCase(),
      },
      class: 'modal-lg',
    });
  }

  getUser() {
    return this.authService.decodeToken();
  }

  selectMovementAccount(numberGoodn: number): Promise<any> {
    return firstValueFrom(
      this.accountMovementService.getAllFiltered(
        `filter.numberGood=${numberGoodn}`
      )
    );
  }

  selectGoodForId(id: number): Promise<IGood> {
    return this.getGoodById([{ filter: 'filter.id', value: id }]);
  }

  async selectGoodFilterNoGoodReferenceAndNoGood(
    numberGood: number | string
  ): Promise<IGood> {
    try {
      const good = await this.getGoodById(
        [
          { filter: 'filter.goodReferenceNumber', value: numberGood },
          {
            filter: 'filter.id',
            value: `${SearchFilter.NOT}:${numberGood}`,
          },
        ],
        true
      );
      if (good?.length > 1) {
        throw new Error('Más de una ref.');
      }
      if (Array.isArray(good)) {
        return good[0];
      }
      return good;
    } catch (ex) {
      throw new Error('No se encontró el bien');
    }

    // return good;
  }

  nvl(valor: any, def: any = 0) {
    return valor || def;
  }

  async getConceptSpend(id: number): Promise<ISpentConcept> {
    //TODO: implementar PUF_CONCEPTO_GASTO
    const result = await firstValueFrom(
      this.spentService.getExpensesConceptById(id)
    );
    return result.data;
  }

  async pufSearchEvent(goodNumber: number | string): Promise<string> {
    try {
      const result = await firstValueFrom(
        this.prepareEventService.getPufSearchEvent(goodNumber as string)
      );
      return result.data.v_cve_proceso;
    } catch (ex) {
      return 'Evento no localizado';
    }
  }

  pufValidActaReception(goodNumber: number | string): Promise<boolean> {
    //TODO: implementar PUF_VALIDA_ACTA_RECEP
    return new Promise(resolve => {
      resolve(true);
    });
  }

  async getGoodById(
    paramsValues: { filter: string; value: any }[],
    returnAll = false
  ): Promise<any> {
    const params = new ListParams();
    paramsValues.forEach(item => {
      params[item.filter] = item.value;
    });
    params.limit = 1;
    const good = await firstValueFrom(
      this.goodService.getAll(params).pipe(
        map((res: any) => {
          if (returnAll) {
            return res?.data;
          }
          if (Array.isArray(res?.data) && res.data.length > 0) {
            return res.data[0];
          }
          return null;
        })
      )
    );
    return good;
  }
  //#endregion On click Button Process Extraction

  //#region On click Button File Excel
  onClickBtnFileExcel(e: Event) {
    this.loader.load = true;
    this.registerReads = 0;
    this.registerProcessed = 0;
    this.registerCorrect = 0;
    this.registerIncorrect = 0;
    const file = (e.target as HTMLInputElement).files[0];
    try {
      readFile(file, 'BinaryString').then(data => {
        const dataExcel = this.excelService.getData(data.result);
        if (dataExcel.length < 1 || !this.validatorFileExcel()) {
          this.alert(
            'error',
            '',
            dataExcel.length < 1
              ? 'El Archivo no Contiene Datos.'
              : 'El Archivo no es Valido Verifique su Cabecera.'
          );
          return;
        }
        //ERROR: por implentar la validacion del archivo;
        const dataPreviewTable = dataExcel.map(item => {
          const data: any = {};
          const itemValues = Object.values(item);
          this.columns.forEach((column, index) => {
            const key = `COL${index + 1}`;
            data[key] = itemValues?.[index];
          });
          return data;
        });
        this.registerReads = dataPreviewTable.length;
        const keys = Object.keys(dataExcel[0]);
        const header: { [key: string]: string } = {};
        keys.forEach((element, index) => {
          const key = `COL${index + 1}`;
          header[key] = element;
        });
        dataPreviewTable.unshift(header);

        // this.dataPrevious = dataPreviewTable;
        this.loader.load = false;
        console.log({ dataPreviewTable: this.dataPrevious });
        // this.tableSpent.changePage({ page: 1, perPage: 10 });
        this.dataPreviousTable.load(dataPreviewTable);

        this.totalItems = dataPreviewTable.length - 1;
        // console.log({ dataPreviewTable, dataExcel });
      });
    } catch (ex) {
      console.log({ ex });
    }
    // _onClickBtnFileExcel();
  }

  validatorFileExcel(): boolean {
    //TODO: por implementar la validacion del archivo excel
    return true;
  }

  loadTablePreviewData(params: ListParams): void {}
}
