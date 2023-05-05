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
import { GoodService } from 'src/app/core/services/good/good.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { SpentService } from 'src/app/core/services/ms-spent/spent.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
      }
      .spent-inputs input {
        border: none;
        border-bottom: 1px solid black;
        padding: 3px;
        margin: 5px;
        outline: none;
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

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodService: GoodService,
    private accountMovementService: AccountMovementService,
    private spentService: SpentService,
    private excelService: ExcelService
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
  formGas = new FormGroup({});
  formGad = new FormGroup({});
  async onInit() {
    this.columns.forEach((column, index) => {
      this.formTips.addControl(`TIP${index + 1}`, new FormControl(''));
      this.formGas.addControl(`GAS${index + 1}`, new FormControl(''));
      this.formGad.addControl(`GAD${index + 1}`, new FormControl(''));
    });

    // let test = await this.getGoodById([{ value: 143503, filter: 'filter.id' }]);
    // console.log({ test });
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
          controlGas?.value ? (banG = true) : (colG = `${colG}${index},`);
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

    // declare service
    // const params = new ListParams();
    // params.limit = 10000000000000;

    // const excelData: any[] = /* await firstValueFrom(
    //   this.service.getDataExcel(params).pipe()
    // ); */ [];
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
    let dataTableTableSmall: IMassiveNumeraryTableSmall[] = [];
    let indNume;
    let contm = 0;
    let cveProcess: string | null = null;
    let actaOk = false;
    let vItem = null;
    // dataTablePreview.map(
    const test = async (item: any) => {
      vItem = 'COL' + colB;
      const numberGood = item[vItem];
      if (numberGood) {
        try {
          const good = await this.getGoodById([
            { filter: 'filter.id', value: numberGood },
          ]);
          console.log({ good });
          cveProcess = null;

          try {
            const goodStatus = await this.getGoodById(
              [
                { filter: 'filter.goodReferenceNumber', value: numberGood },
                {
                  filter: 'filter.id',
                  value: `${SearchFilter.NEQ}:${numberGood}`,
                },
              ],
              true
            );

            if (Array.isArray(goodStatus) && goodStatus.length > 1) {
              throw new Error('Más de una ref.');
            }

            if (goodStatus?.status !== 'ADM') {
              indNume = 0;
              contm++;
              cveProcess = 'Numerario <> ADM.';
            } else {
              try {
                const movement = await firstValueFrom(
                  this.accountMovementService.getAllFiltered(
                    `filter.numberGood=${goodStatus.id}`
                  )
                );
                indNume = 3;
                contm++;
                cveProcess = 'Numerario conciliado.';
              } catch (ex) {
                indNume = 2;
              }
            }
            cveProcess = await this.pufSearchEvent(numberGood);
          } catch (ex: any) {
            if (ex?.error?.message === 'Más de una ref.') {
              indNume = 0;
              contm++;
              cveProcess = 'Más de una ref.';
            } else {
              if (
                good.identifier === 'TRANS' &&
                ['CNE', 'CBD', 'CDS', 'CNS', 'CNR'].includes(good.status)
              ) {
                indNume = 2;
                cveProcess = await this.pufSearchEvent(numberGood);
              } else {
                indNume = 1;
                if (good.identifier === 'TRANS') {
                  indNume = 4;
                }
                actaOk = await this.pufValidActaReception(numberGood);
                if (
                  !actaOk &&
                  this.nvl(good?.goodsPartializationFatherNumber) > 0
                ) {
                  actaOk = await this.pufValidActaReception(
                    good.goodsPartializationFatherNumber
                  );
                }
                if (!actaOk) {
                  indNume = 5;
                  contm++;
                  cveProcess = 'Bien sin Acta.';
                }
              }
            }
          }
          vItem = 'COL' + colI;
          let vTipo = item[vItem];
          let income;
          let viva;
          let colG1;
          let totSpent;
          let colGu;
          let spent;
          let dSpent;
          let descriptionG;
          if (vTipo) {
            income = vTipo?.replace(',', '.');
            vItem = 'COL' + colV;
            vTipo = item[vItem];
            if (vTipo) {
              viva = vTipo?.replace(',', '.');
              colG1 = colG;
              totSpent = 0;
              while (colG1) {
                colGu = colG1.substring(0, colG1.indexOf(','));
                vItem = 'F' + colGu;
                vTipo = item[vItem];
                try {
                  spent = this.nvl(
                    parseFloat(vTipo?.replace(',', '.')).toFixed(2),
                    0
                  );
                  vItem = 'GAS' + colGu;
                  dSpent = this.formGas.get(vItem)?.value;
                  totSpent += spent;
                  vItem = 'GAD' + colGu;
                  descriptionG = this.formGad.get(vItem)?.value;
                  if (descriptionG) {
                    try {
                      const conceptSpent = await this.getConceptSpend(dSpent);
                      descriptionG = conceptSpent?.description;
                    } catch (e: any) {
                      descriptionG = 'Gasto: ' + dSpent;
                    }
                  }
                  dataTableTableSmall.push({
                    noGood: numberGood,
                    cveie: dSpent,
                    amount: spent,
                    description: descriptionG,
                    status: good.status,
                    type: 'E',
                  });
                } catch (e: any) {}
                colG1 = colG1.substring(colG1.indexOf(',') + 1);
              }

              dataTableTableSmall.push({
                noGood: numberGood,
                cveie: 0,
                amount: viva,
                description: 'I.V.A',
                status: good.status,
                type: 'I',
              });
              const prevDataTableSpent: IMassiveNumeraryChangeSpent = {
                noGood: numberGood,
                description: good.description,
                status: good.status,
                entry: income + totSpent - viva,
                costs: totSpent,
                tax: viva,
                impNumerary: income,
                noExpAssociated: good.associatedFileNumber,
                noExpedient: good.fileeNumber,
                quantity: good.quantity,
                noDelegation: good.delegationNumber?.id,
                noSubDelegation: good.subDelegationNumber?.id,
                identifier: good.identifier,
                noFlier: good.flyerNumber,
                indNume: indNume,
                cveEvent: cveProcess,
                npNUm: good.id,
              };

              if (indNume !== 1) {
                switch (indNume) {
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
                dataTableSpent.push(prevDataTableSpent);
              }
            }
          }
        } catch (e) {
          contm++;
        }
      } else {
        contm++;
      }
    };

    await test({ COL1: '2732892', COL2: '10', COL3: '10', COL4: '10' });
    this.isLoadingProcessExtraction = false;
    this.modalService.show(MassiveNumeraryChangeModalComponent, {
      initialState: {
        dataTableMain: new LocalDataSource(dataTableSpent),
        dataTableSecond: new LocalDataSource(dataTableTableSmall),
      },
      class: 'modal-lg',
    });
  }

  // async loopProcessExtraction(item) {

  // }

  nvl(valor: any, def: any = 0) {
    return valor || def;
  }

  getConceptSpend(id: number): Promise<any> {
    //TODO: implementar PUF_CONCEPTO_GASTO
    return firstValueFrom(this.spentService.getExpensesConceptById(id));
  }

  pufSearchEvent(goodNumber: number | string): Promise<string> {
    //TODO: implementar PUF_BUSCA_EVENTO
    return new Promise(resolve => {
      resolve('true');
    });
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
