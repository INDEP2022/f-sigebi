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
import { showToast } from 'src/app/common/helpers/helpers';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/good/good.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MassiveNumeraryChangeModalComponent } from '../massive-numerary-change-modal/massive-numerary-change-modal.component';
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
    private accountMovementService: AccountMovementService
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

    const arr = Object.keys(MASSIVE_NUMERARY_CHANGE_COLUMNS).map(key => key);
    console.log(arr);
  }
  getAttributes() {
    this.loading = true;
    // this.attributesInfoFinancialService
    //   .getAll(this.params.getValue())
    //   .subscribe({
    //     next: response => {
    //       this.attributes = response.data;
    //       this.totalItems = response.count;
    //       this.loading = false;
    //     },
    //     error: error => (this.loading = false),
    //   });
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
  }

  //#region On click Button Process Extraction
  onClickBtnProcessExtraction() {
    // _onClickBtnProcessExtraction(this.columns, this.formTips, this.formGas);
    let colB = 0;
    let banB = 0;

    let colI = 0;
    let banI = 0;

    let colG = '';
    let banG = false;
    let colV = 0;
    let banV = 0;
    this.columns.forEach((_column, index) => {
      index++;
      console.log(`TIP${index}`);
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
    // console.log(colB);
    if (ban) return;

    const params = new ListParams();
    params.limit = 10000000000000;
    // this.service.getDataExcel(params).subscribe(res: any) => {
    //   if (!Array.isArray(res)){
    //     showAlert({
    //       icon: 'error',
    //       text: 'Ups! ocurrió un error al procesar los datos vuelve a intentarlo'
    //     })
    //     return;
    //   }
    //   this.processExtraction(res, colB)
    // });
  }

  async processExtraction(res: any[], colB: number) {
    let indNume;
    let contm = 0;
    let cveProcess;
    res.map(async item => {
      const typeValue = item[`F${colB}`];
      if (typeValue) {
        const good = await this.getGoodById([
          { filter: 'filter.id', value: typeValue },
        ]);
        cveProcess = null;
        const goodStatus = await this.getGoodById([
          { filter: 'filter.goodReferenceNumber', value: typeValue },
          { filter: 'filter.id', value: `${SearchFilter.NEQ}:${typeValue}` },
        ]);

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
      }
    });
  }

  pufSearchEvent(goodNumber: number | string) {}

  async getGoodById(
    paramsValues: { filter: string; value: any }[]
  ): Promise<any> {
    const params = new ListParams();
    paramsValues.forEach(item => {
      params[item.filter] = item.value;
    });
    params.limit = 1;
    const good = await firstValueFrom(
      this.goodService.getAll(params).pipe(
        map((res: any) => {
          if (Array.isArray(res) && res.length > 0) {
            return res[0];
          }
          return null;
        })
      )
    );
    return good;
  }
  //#endregion On click Button Process Extraction

  onClickBtnFileExcel() {
    _onClickBtnFileExcel();
  }

  loadTablePreviewData(params: ListParams): void {}
}

function _onClickBtnFileExcel() {
  const newWindow = window.open('file:///C:/siabexcelpath.pth');
  console.log({ newWindow });
  if (newWindow) {
    newWindow.opener = null;
    newWindow.close();
  }

  // if (newWindow.opener)
}

function _onClickBtnProcessExtraction(
  columns: string[],
  formTips: FormGroup,
  formGas: FormGroup
) {
  let colB = 0;
  let banB = 0;

  let colI = 0;
  let banI = 0;

  let colG = '';
  let banG = false;
  let colV = 0;
  let banV = 0;
  columns.forEach((column, index) => {
    index++;
    console.log(`TIP${index}`);
    const control = formTips.get(`TIP${index}`);
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
        const controlGas = formGas.get(`GAS${index}`);
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
  // console.log(colB);
  if (ban) return;

  //TODO: CONTINUAR CON EL PROCESO DEL LOOP

  const params = new ListParams();
  params.limit = 10000000000000;
  // this.service.getDataExcel(params).subscribe(res: any) => {
  //   if (!Array.isArray(res)){
  //     showAlert({
  //       icon: 'error',
  //       text: 'Ups! ocurrió un error al procesar los datos vuelve a intentarlo'
  //     })
  //     return;
  //   }
  //   processExtraction(res, colB)
  // });
}

// function processExtraction(res: any[], colB: number) {
//   res.map((item) => {
//     const typeValue = item[`F${colB}`];
//     if (typeValue) {

//     }
//   })
// }
