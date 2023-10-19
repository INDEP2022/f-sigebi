import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IComerLayouts,
  IL,
} from 'src/app/core/models/ms-parametercomer/parameter';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
import { LayoutsConfigService } from 'src/app/core/services/ms-parametercomer/layouts-config.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_POSITIVE_PATTERN,
  NUMBERS_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-data-configuration-modal',
  templateUrl: './data-configuration-modal.component.html',
  styles: [],
})
export class DataConfigurationModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Pago Generado';
  provider: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  edit: boolean = false;
  P_CONTRA: number = 0;
  structureLayoutSelected: any;
  providerForm: FormGroup = new FormGroup({});
  id: number = 0;
  layoutsT: IComerLayouts;
  layout: IL;
  layoutList: IComerLayouts[] = [];
  @Output() onConfirm = new EventEmitter<any>();
  @Input()
  structureLayout: IComerLayouts;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private layoutsConfigService: LayoutsConfigService,
    private msMsDepositaryPaymentService: MsDepositaryPaymentService
  ) {
    super();
  }
  ngOnInit(): void {
    console.log(this.provider, this.id);
    this.prepareForm();
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      payGensId: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
      ],
      // payId: [
      //   null,
      //   [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
      // ],
      // noGood: [
      //   null,
      //   [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(40)],
      // ],
      // amount: [
      //   null,
      //   [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(17)],
      // ],
      // reference: [
      //   null,
      //   [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(30)],
      // ],
      // payment: [
      //   null,
      //   [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      // ],

      // payCoverId: [null],
      // typeInput: [null],
      // noTransferable: [null],
      // iva: [null],
      // amountIva: [null],
      paymentAct: [null],
      // deduxcent: [null],
      // deduValue: [null],
      status: [null],
      // noAppointment: [null],
      // dateProcess: [null],
      // type: [null],
      // insert: [null],
      xcentdedu: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      valuededu: [
        null,
        [Validators.pattern(DOUBLE_POSITIVE_PATTERN), Validators.maxLength(17)],
      ],
      // xCover: [null],
      // impWithoutIva: [null],
      // chkDedu: [null],
      origin: [null],
      paymentObserv: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ],
      deduObserv: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ],
      P_CONTRA: [
        { value: '0.00', disabled: false },
        [Validators.pattern(DOUBLE_POSITIVE_PATTERN), Validators.maxLength(30)],
      ],
    });
    if (this.provider != undefined) {
      this.provider = {
        ...this.provider,
        P_CONTRA: this.P_CONTRA,
      };
      this.edit = true;
      this.providerForm.patchValue(this.provider);
    } else {
      this.edit = false;
    }
  }

  changeXcent() {
    if (this.providerForm.get('xcentdedu').value) {
      this.providerForm
        .get('valuededu')
        .setValue(
          this.providerForm.get('paymentAct').value *
            (this.providerForm.get('xcentdedu').value / 100)
        );
    } else {
      this.providerForm.get('valuededu').reset();
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    console.log(this.providerForm.value);
    if (this.provider.xcentdedu && this.provider.xcentdedu > 0) {
      this.alert('warning', 'No se puede tener un reconocimiento más', '');
      return;
    } else if (this.provider.status == 'C') {
      this.alert(
        'warning',
        'No se pueden agregar reconocimientos a los complementos',
        ''
      );
      return;
    } else if (this.provider.status == 'A' && this.provider.origin == 'DB') {
      this.alert(
        'warning',
        'No se pueden agregar reconocimientos a los abonos parciales',
        ''
      );
      return;
    }
    if (this.providerForm.value.xcentdedu > 50) {
      this.alert(
        'warning',
        'No se puede tener un reconocimiento mayor al 50%',
        ''
      );
      this.providerForm.get('xcentdedu').reset();
      this.providerForm.get('valuededu').reset();
      return;
    } else {
      this.providerForm
        .get('valuededu')
        .setValue(
          this.providerForm.get('paymentAct').value *
            (this.providerForm.get('xcentdedu').value / 100)
        );
    }

    this.edit ? this.update() : this.create();
  }

  create() {}
  update() {
    this.alertQuestion(
      'warning',
      'Actualizar pago generado',
      '¿Desea actualizar el pago generado?'
    ).then(question => {
      if (question.isConfirmed) {
        delete this.providerForm.value.P_CONTRA;
        // this.providerForm.value.paymentAct =
        //   this.providerForm.value.paymentAct -
        //   this.providerForm.get('valuededu').value;
        // delete this.providerForm.value.payGensId;
        this.msMsDepositaryPaymentService
          .updateTmpPagosGensDep(
            this.providerForm.value.payGensId,
            this.providerForm.value
          )
          .subscribe({
            next: data => this.handleSuccess(),
            error: error => {
              this.alert(
                'error',
                'Error al Actualizar',
                'Ocurrió un error al actualizar el pago generado'
              );
              this.loading = false;
            },
          });
      }
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    // setTimeout(() => {
    //   this.alert('success', this.title, `${message} Correctamente`);
    // }, 2000);
    this.alert('success', `${message} Correctamente`, '');
    this.loading = false;
    this.onConfirm.emit(true);
    // this.modalRef.content.callback(true);
    this.close();
  }
}
