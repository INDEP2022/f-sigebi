import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/good/good.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DepositAccountStatementModalComponent } from '../deposit-account-statement-modal/deposit-account-statement-modal.component';

@Component({
  selector: 'app-deposit-account-statement',
  templateUrl: './deposit-account-statement.component.html',
  styles: [],
})
export class DepositAccountStatementComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  goodSelect = new DefaultSelect();
  anualBassis: string;
  anual: number;
  vfDate: Date;
  vb_valid: boolean = false;
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private goodService: GoodService,
    private goodParametersService: GoodParametersService,
    private screenStatusService: ScreenStatusService,
    private accountMovementService: AccountMovementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    //this.getGood(new ListParams());
    this.getParameters();
  }
  prepareForm() {
    this.form = this.fb.group({
      account: [null, Validators.required, Validators.maxLength(40)],
      bank: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      amount: [null, Validators.nullValidator],
      depositDate: [null, Validators.nullValidator],
      transfDate: [null, Validators.nullValidator],
      proceedings: [null, Validators.nullValidator],
      good: [null, Validators.nullValidator],
      status: [null, Validators.nullValidator],
      indicated: [null, Validators.nullValidator],
      avPrevious: [null, Validators.nullValidator],
      criminalCase: [null, Validators.nullValidator],

      transferDate: [null, Validators.required],
      cutoffDate: [null, Validators.required],
      toReturn: [null, Validators.nullValidator],
      interestCredited: [null, Validators.nullValidator],
      subTotal: [null, Validators.nullValidator],
      costsAdmon: [null, Validators.nullValidator],
      associatedCosts: [null, Validators.nullValidator],
      checkAmount: [null, Validators.nullValidator],

      checkType: [null, Validators.nullValidator],
      bankAccount: [null, Validators.required],
      check: [null, Validators.required],
      beneficiary: [null, Validators.nullValidator],
      bankCheck: [null, Validators.nullValidator],
      expeditionDate: [null, Validators.required],
      collectionDate: [null, Validators.required],
    });
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
    this.modalService.show(DepositAccountStatementModalComponent, modalConfig);
  }

  getGood(params: ListParams) {
    this.goodService.getAll(params).subscribe({
      next: data => {
        console.log(data.data);
        this.goodSelect = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.goodSelect = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  changeGood(event: any) {
    console.log(event.scheduledDateDecoDev, event.status);
  }

  getParameters() {
    this.goodParametersService.getById('DIASCALINT').subscribe(data => {
      this.anualBassis = data.initialValue;
      this.anual = Number(this.anualBassis);
      if (this.anual === null) {
        //NO SE PUEDE OPERAR LA PANTALLA
        this.alert(
          'error',
          'No se tiene definido el parametro de dias x año',
          'no es posible operar la pantalla'
        );
      } else if (this.anual === 0) {
        //NO SE PUEDE OPERAR LA PANTALLA
        this.alert(
          'error',
          'El parametro de dias x año',
          'para calculo de intereses estimados no puede ser cero'
        );
      }
    });
  }

  preInsert() {
    const statusBien = this.form.get('status').value;
    if (statusBien) {
      const params = { estatus: statusBien, vc_pantalla: 'FCONADBEDOCTAXIND' };
      this.screenStatusService.getAllFiltro(params).subscribe({
        next: data => {
          if (data.data) {
            this.vb_valid = true;
          }
        },
        error: error => {},
      });
    } else {
      this.alert(
        'warning',
        'No tiene definido un bien estatus',
        'El cual es necesario para registrar la devolución'
      );
    }
    if (this.vb_valid === false) {
      this.alert(
        'warning',
        'El bien se encuentra en un estatus',
        'En el cual no se permite registrar la devolucion'
      );
    }
  }
}
