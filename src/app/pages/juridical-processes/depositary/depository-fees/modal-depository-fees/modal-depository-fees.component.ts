import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-modal-depository-fees',
  templateUrl: './modal-depository-fees.component.html',
  styles: [],
})
export class ModalDepositoryFeesComponent extends BasePage implements OnInit {
  title: string = 'Notificación de abandono por aseguramiento';
  status: string = 'Actualizar';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  pay: any;
  statusList = [
    {
      label: 'A',
      value: 'A',
    },
    {
      label: 'P',
      value: 'P',
    },
    {
      label: 'C',
      value: 'C',
    },
  ];
  coveredPaymentList = [
    {
      label: '0',
      value: '0',
    },
    {
      label: '1',
      value: '1',
    },
  ];
  statusListSelect = new DefaultSelect(this.statusList, this.statusList.length);
  coveredPaymentSelect = new DefaultSelect(
    this.coveredPaymentList,
    this.coveredPaymentList.length
  );
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private depositaryPaymentService: MsDepositaryPaymentService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.pay);
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      no_appointment: [null, [Validators.required]],
      noGoods: [
        null,
        /* [
          Validators.required,
        ] */
        ,
      ],
      payId: [null, Validators.required],
      amount: [null],
      iva: [null],
      ivaAmount: [null],
      payment: [null],
      actPay: [null],
      impWithoutIva: [null],
      payIdGens: [null, Validators.required],
      status: [null],
      cubrioPayId: [null],
      coveredPayment: [null],
      processDate: [null],
      payObserv: [null],
      reference: [null],
      not_transferring: [null],
    });
    if (this.pay) {
      this.form.patchValue(this.pay);
      this.form.controls['processDate'].setValue(
        this.formatDate(this.pay.processDate)
      );
      this.form.controls['no_appointment'].disable();
      this.form.controls['payIdGens'].disable();
      this.form.controls['payId'].disable();
    }
  }

  confirm() {
    this.update();
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = 'Registro actualizado';
    this.alert('success', this.title, `${message} correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    if (this.esTipoFecha(this.form.controls['processDate'].value)) {
      this.form.controls['processDate'].setValue(
        this.obtenerFecha(this.form.controls['processDate'].value)
      );
    } else {
      this.form.controls['processDate'].setValue(
        this.revertFormatDate(this.form.controls['processDate'].value)
      );
    }
    console.log(this.form.getRawValue());
    this.depositaryPaymentService
      .putPaymentsGensDepositories(this.form.getRawValue())
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
  }

  formatDate(fechaOriginal: string) {
    const partesFecha = fechaOriginal.split('-'); // Separar la fecha en partes: [2022, 06, 20]
    const dia = partesFecha[2];
    const mes = partesFecha[1];
    const anio = partesFecha[0];
    return `${dia}/${mes}/${anio}`;
  }

  revertFormatDate(fechaFormateada: string) {
    const partesFecha = fechaFormateada.split('/'); // Separar la fecha en partes: [20, 06, 2022]
    const dia = partesFecha[0];
    const mes = partesFecha[1];
    const anio = partesFecha[2];
    return `${anio}-${mes}-${dia}`;
  }

  esTipoFecha(variable: any): boolean {
    return variable instanceof Date;
  }

  obtenerFecha(fecha: string): string {
    const fechaActual = new Date(fecha);
    const year = fechaActual.getFullYear();
    const month = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaActual.getDate().toString().padStart(2, '0');
    const fechaFormateada = `${year}-${month}-${day}`;
    return fechaFormateada;
  }
}
