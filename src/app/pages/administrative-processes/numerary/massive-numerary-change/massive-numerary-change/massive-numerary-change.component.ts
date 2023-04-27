import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { showToast } from 'src/app/common/helpers/helpers';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
    `,
  ],
})
export class MassiveNumeraryChangeComponent extends BasePage implements OnInit {
  form: FormGroup;
  dataPrevious = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  columns = HELP_ARR;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
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
  onInit(): void {
    this.columns.forEach((column, index) => {
      this.formTips.addControl(`TIP${index}`, new FormControl(''));
      this.formGas.addControl(`GAS${index}`, new FormControl(''));
      this.formGas.addControl(`GAD${index}`, new FormControl(''));
    });
  }
}

function onClickBtnProcessExtraction(
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
  // if (banB == 0) {
  //   messages.push('Se debe especificar la columna del No. de Bien');
  //   // showToast({
  //   //   icon: 'warning',
  //   //   text: 'Se debe especificar la columna del No. de Bien'
  //   // })
  // }
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
  showToast({
    icon: 'warning',
    text: messages.join('<br>'),
  });
  if (ban) return;
}
