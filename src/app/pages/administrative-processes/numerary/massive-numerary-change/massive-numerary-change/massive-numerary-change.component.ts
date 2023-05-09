import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom, map, skip } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { readFile, showAlert, showToast } from 'src/app/common/helpers/helpers';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ISpentConcept } from 'src/app/core/models/ms-spent/spent.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { UtilComerV1Service } from 'src/app/core/services/ms-prepareevent/util-comer-v1.service';
import { SpentService } from 'src/app/core/services/ms-spent/spent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SelectConceptSpentDialogComponent } from '../components/select-concept-spent-dialog/select-concept-spent-dialog.component';
import { MassiveNumeraryChangeModalComponent } from '../massive-numerary-change-modal/massive-numerary-change-modal.component';
import {
  IMassiveNumeraryChangeSpent,
  IMassiveNumeraryTableSmall,
} from '../types/massive-numerary.type';
import {
  HELP_ARR,
  MASSIVE_NUMERARY_CHANGE_COLUMNS,
} from './massive-numerary-change-columns';

@Component({
  selector: 'app-massive-numerary-change',
  templateUrl: './massive-numerary-change.component.html',
  styles: [
    `
      .selects-origin-data select {
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
      }
    `,
  ],
})
export class MassiveNumeraryChangeComponent extends BasePage implements OnInit {
  form: FormGroup;
  dataPrevious = new LocalDataSource();
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
    private prepareEventService: UtilComerV1Service
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: MASSIVE_NUMERARY_CHANGE_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.onInit();
    this.params.pipe(skip(1)).subscribe((res: any) => {
      this.loadTablePreviewData(res);
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

  onDobleClickInputGas(num: number) {
    console.log('onDobleClickInputGas');
    this.formGas.get(`GAS${num}`).setValue('');
    this.modalService.show(SelectConceptSpentDialogComponent, {
      class: 'modal-lg',
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
  formGad = new FormGroup({});
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

  //#region On click Button Process Extraction
  isLoadingProcessExtraction = false;
  async onClickBtnProcessExtraction() {
    this.isLoadingProcessExtraction = true;
    let colB = 0;
    let banB = 0;

    let colI = 0;
    let banI = 0;

    let colG: any = null;
    let banG = false;
    let colV = 0;
    let banV = 0;
    this.columns.forEach((_column, index) => {
      index++;
      const control = this.formTips.get(`TIP${index}`);
      const controlValue = control?.value;
      switch (controlValue) {
        case 'B':
          colB = index;
          banB++;
          break;
        case 'I':
          colI = index;
          banI++;
          break;
        case 'G':
          const controlGas = this.formGas.get(`GAS${index}`);
          if (!controlGas?.value) {
            banG = true;
          } else {
            colG = colG + index + ',';
          }
          break;
        case 'V':
          colV = index;
          banV++;
      }
    });
    const messages = [];
    let ban = false;
    if (banB === 0 || banB > 1) {
      messages.push(
        banB === 0
          ? 'Se debe especificar la columna del No. de Bien'
          : 'Se especificó más de una columna del No. de Bien'
      );
      ban = true;
    }

    if (banI === 0 || banI > 1) {
      messages.push(
        banI === 0
          ? 'Se debe especificar la columna del Ingreso neto'
          : 'Se especificó más de una columna del Ingreso neto'
      );
      ban = true;
    }

    if (banG) {
      messages.push(
        'No se especificó el Concepto de Gasto en al menos una columna'
      );
      ban = true;
    }

    if (banV === 0 || banV > 1) {
      messages.push(
        banV === 0
          ? 'Se debe especificar la columna del IVA'
          : 'Se especificó más de una columna del IVA'
      );
      ban = true;
    }
    if (messages.length > 0) {
      showToast({
        icon: 'warning',
        title: 'Advertencia',
        text: messages.join('\n'),
      });
    }
    if (ban) {
      this.isLoadingProcessExtraction = false;
      return;
    }

    /*TODO: limpiar tablas 
        GO_BLOCK('BLK_BIENES');
        CLEAR_BLOCK;
        GO_BLOCK('BLK_GASTOS');
        CLEAR_BLOCK;
        GO_BLOCK('BLK_PREVIEW');
        FIRST_RECORD;
    */

    const dataTablePreview = await this.dataPrevious.getAll();
    console.log({ dataTablePreview });
    this.processExtraction(dataTablePreview, colB, colI, colV, colG);
  }

  async processExtraction(
    dataTablePreview: any[],
    colB: number,
    colI: number,
    colV: number,
    colG: string
  ) {
    let dataTableSpent: IMassiveNumeraryChangeSpent[] = [];
    let dataTableSmall: IMassiveNumeraryTableSmall[] = [];
    // let indNume;
    // let contm = 0;
    let cont = 0;
    // let cveProcess: string | null = null;
    // let actaOk = false;
    let vItem = null;

    let vType = null;
    let vnoGood;
    let vContm = 0;

    let vGood = null;
    let vGoodStatus = null;

    let vnoGoodn = null;
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
    // /** @replace vno_bienn */
    // let numberGoodn = null;

    /** @replace vestatusn */
    // let status = null;

    // dataTablePreview.map(
    const test = async (item: any) => {
      vItem = 'COL' + colB;
      vType = item[vItem];

      if (vType) {
        try {
          vnoGood = Number(vType.replace(',', '.'));
          try {
            vGood = await this.selectGoodForId(vnoGood);
            vnoGoodn = null;
            vcveProcess = null;
            try {
              vGoodStatus = await this.selectGoodFilterNoGoodReferenceAndNoGood(
                vnoGood
              );
              vnoGoodn = vGoodStatus?.id;
              if (vGoodStatus?.status !== 'ADM') {
                vIndNume = 0;
                vContm++;
                vcveProcess = 'Numerario <> ADM.';
              } else {
                try {
                  const accountMovement = await this.selectMovementAccount(
                    vnoGoodn
                  );
                  vIndNume = 3;
                  vContm++;
                  vcveProcess = 'Numerario conciliado.';
                } catch (ex) {
                  vContm++;
                }
              }
              vcveProcess = await this.pufSearchEvent(vnoGood);
            } catch (ex: any) {
              console.log({ ex: ex.message });
              if (ex?.message === 'Más de una ref.') {
                vIndNume = 0;
                vContm++;
                vcveProcess = ex?.message;
              } else {
                if (
                  vGood.identifier == 'TRANS' &&
                  ['CNE', 'CBD', 'CDS', 'CNS', 'CNR'].includes(vGood.status)
                ) {
                  vIndNume = 2;
                  vcveProcess = await this.pufSearchEvent(vnoGood);
                } else {
                  vIndNume = 1;
                  if (vGood.identifier == 'TRANS') {
                    vIndNume = 4;
                  }
                  vActaOk = await this.pufValidActaReception(vnoGood);
                  if (
                    !vActaOk &&
                    this.nvl(vGood.goodsPartializationFatherNumber) > 0
                  ) {
                    vActaOk = await this.pufValidActaReception(
                      vGood.goodsPartializationFatherNumber
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
                  Math.round(parseFloat((vType as string).replace(',', '.')))
                ).toFixed(2);
                vItem = 'COL' + colV;
                vType = item[vItem];
                if (vType) {
                  try {
                    vTax = Number(
                      Math.round(
                        parseFloat((vType as string).replace(',', '.'))
                      )
                    ).toFixed(2);
                    vColg1 = colG;
                    vTotalSpent = 0;
                    while (vColg1) {
                      vColgu = vColg1.substring(0, vColg1.indexOf(','));
                      vItem = 'COL' + vColgu;
                      vType = item[vItem];
                      try {
                        vdSpent = Number(
                          Math.round(
                            parseFloat((vType as string).replace(',', '.'))
                          )
                        ).toFixed(2);
                        vItem = 'GAS' + vColgu;
                        vdSpent = this.formGas.get(vItem)?.value;
                        vTotalSpent =
                          vTotalSpent + Number(this.nvl(vdSpent, 0));
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
                          noGood: vnoGood,
                          cveie: vdSpent,
                          amount: vdSpent,
                          description: vDescription,
                          status: vGood.status,
                          type: 'E',
                        };
                        dataTableSmall.push(blkSpent);
                      } catch (ex) {
                        null;
                      }
                      vColg1 = vColg1.substring(vColg1.indexOf(',') + 1);
                    }

                    // IF :BLK_GASTOS.NO_BIEN IS NOT NULL THEN
                    //           CREATE_RECORD;
                    //        END IF;
                    dataTableSmall.push({
                      noGood: vnoGood,
                      cveie: 0,
                      amount: vTax.toString(),
                      description: 'I.V.A',
                      status: vGood.status,
                      type: 'I',
                    });

                    const prevDataTableSpent: IMassiveNumeraryChangeSpent = {
                      noGood: vnoGood,
                      description: vGood.description,
                      status: vGood.status,
                      entry: vIncome + vTotalSpent - vTax,
                      costs: vTotalSpent,
                      tax: vTax,
                      impNumerary: vIncome,
                      noExpAssociated: vGood.associatedFileNumber,
                      noExpedient: vGood.fileeNumber,
                      quantity: vGood.quantity,
                      noDelegation: (vGood.delegationNumber as any)?.id,
                      noSubDelegation: (vGood.subDelegationNumber as any)?.id,
                      identifier: vGood.identifier,
                      noFlier: vGood.flyerNumber,
                      indNume: vIndNume,
                      cveEvent: vcveProcess,
                      npNUm: vnoGoodn,
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
                    dataTableSpent.push(prevDataTableSpent);
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
    };

    await test({ COL1: '7349', COL2: '10', COL3: '10', COL4: '10' });
    this.isLoadingProcessExtraction = false;
    this.modalService.show(MassiveNumeraryChangeModalComponent, {
      initialState: {
        BLK_BIENES: new LocalDataSource(dataTableSpent),
        BLK_GASTOS: new LocalDataSource(dataTableSmall),
      },
      class: 'modal-lg',
    });
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
    const file = (e.target as HTMLInputElement).files[0];
    try {
      readFile(file).then(data => {
        const dataExcel = this.excelService.getData(data.result);
        if (dataExcel.length < 1 || !this.validatorFileExcel()) {
          showAlert({
            text:
              dataExcel.length < 1
                ? 'El archivo no contiene datos.'
                : 'El archivo no es valido verifique su cabecera.',
            icon: 'error',
          });
          return;
        }
        //ERROR: por implentar la validacion del archivo;
        const dataPreviewTable = dataExcel.map(item => {
          const data: any = {};
          const itemValues = Object.values(item);
          this.columns.forEach((column, index) => {
            const key = `COL${index + 1}`;
            data[key] = itemValues?.[index] || '';
          });
          return data;
        });
        this.registerReads = dataPreviewTable.length;

        this.dataPrevious.load(dataPreviewTable);

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

  // getIndexForNameColumn(name: string): number {

  // }

  //#endregion On click Button File Excel

  loadTablePreviewData(params: ListParams): void {}
}

// function _onClickBtnProcessExtraction(
//   columns: string[],
//   formTips: FormGroup,
//   formGas: FormGroup
// ) {
//   let colB = 0;
//   let banB = 0;

//   let colI = 0;
//   let banI = 0;

//   let colG = '';
//   let banG = false;
//   let colV = 0;
//   let banV = 0;
//   columns.forEach((column, index) => {
//     index++;
//     console.log(`TIP${index}`);
//     const control = formTips.get(`TIP${index}`);
//     const controlValue = control?.value;
//     switch (controlValue) {
//       case 'B':
//         colB = index;
//         banB++;
//         break;
//       case 'I':
//         colI = index;
//         banI++;
//         break;
//       case 'G':
//         const controlGas = formGas.get(`GAS${index}`);
//         controlGas?.value ? (banG = true) : (colG = `${colG}${index},`);
//         break;
//       case 'V':
//         colV = index;
//         banV++;
//     }
//   });
//   const messages = [];
//   let ban = false;
//   if (banB === 0 || banB > 1) {
//     messages.push(
//       banB === 0
//         ? 'Se debe especificar la columna del No. de Bien'
//         : 'Se especificó más de una columna del No. de Bien'
//     );
//     ban = true;
//   }

//   if (banI === 0 || banI > 1) {
//     messages.push(
//       banI === 0
//         ? 'Se debe especificar la columna del Ingreso neto'
//         : 'Se especificó más de una columna del Ingreso neto'
//     );
//     ban = true;
//   }

//   if (banG) {
//     messages.push(
//       'No se especificó el Concepto de Gasto en al menos una columna'
//     );
//     ban = true;
//   }

//   if (banV === 0 || banV > 1) {
//     messages.push(
//       banV === 0
//         ? 'Se debe especificar la columna del IVA'
//         : 'Se especificó más de una columna del IVA'
//     );
//     ban = true;
//   }
//   if (messages.length > 0) {
//     showToast({
//       icon: 'warning',
//       title: 'Advertencia',
//       text: messages.join('\n'),
//     });
//   }
//   // console.log(colB);
//   if (ban) return;

//   //TODO: CONTINUAR CON EL PROCESO DEL LOOP

//   const params = new ListParams();
//   params.limit = 10000000000000;
//   // this.service.getDataExcel(params).subscribe(res: any) => {
//   //   if (!Array.isArray(res)){
//   //     showAlert({
//   //       icon: 'error',
//   //       text: 'Ups! ocurrió un error al procesar los datos vuelve a intentarlo'
//   //     })
//   //     return;
//   //   }
//   //   processExtraction(res, colB)
//   // });
// }

// function processExtraction(res: any[], colB: number) {
//   res.map((item) => {
//     const typeValue = item[`F${colB}`];
//     if (typeValue) {

//     }
//   })
// }
