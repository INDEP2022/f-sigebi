import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-payload-form',
  templateUrl: './payload-form.component.html',
  styleUrls: [],
})
export class PayloadFormComponent extends BasePage implements OnInit {
  title: string = 'Carga de Pago';
  form: FormGroup = new FormGroup({});
  edit: boolean = true;
  maxDate: Date = new Date();
  paymentLoad: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private paymentService: PaymentService
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      NoMovimiento: [null, []],
      FechaMov: [null, []],
      Movimiento: [null, []],
      Cuenta: [null, []],
      Referencia: [null, []],
      ReferenciaOrdenIngreso: [null, []],
      Banco: [null, []],
      Sucursal: [null, []],
      Monto: [null, []],
      Resultado: [null, []],
      Valido: [null, []],
      idPago: [null, []],
      LotePublico: [null, []],
      Evento: [null, []],
      OrdenIngreso: [null, []],
      Fecha: [null, []],
      DescripcionSAT: [null, []],
    });
    if (this.paymentLoad != null) {
      this.edit = true;
      console.log(this.paymentLoad);
      this.form.patchValue(this.paymentLoad);
      //this.form.get('id_factura').setValue(this.factura);
      const formatDate = this.valuePrepareFunction(this.paymentLoad.FechaMov);
      //console.log(formatDate);
      this.form.get('FechaMov').setValue(formatDate);
      this.form.get('NoMovimiento').disable();
      this.form.get('FechaMov').disable();
      this.form.get('Movimiento').disable();
      this.form.get('Cuenta').disable();
      this.form.get('Referencia').disable();
      this.form.get('ReferenciaOrdenIngreso').disable();
      this.form.get('Banco').disable();
      this.form.get('Sucursal').disable();
      this.form.get('Monto').disable();
      this.form.get('Resultado').disable();
      this.form.get('idPago').disable();
    }
  }

  valuePrepareFunction(date: number): string {
    const fechaString = date.toString();
    const año = fechaString.substring(0, 4);
    const mes = fechaString.substring(4, 6);
    const dia = fechaString.substring(6, 8);
    const fecha = new Date(`${año}-${mes}-${dia}`);
    var formatted = new DatePipe('en-EN').transform(fecha, 'dd/MM/yyyy', 'UTC');
    return formatted;
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.update();
  }

  update() {
    this.paymentLoad.LotePublico = this.form.get('LotePublico').value;
    this.paymentLoad.Evento = this.form.get('Evento').value;
    this.paymentLoad.OrdenIngreso = this.form.get('OrdenIngreso').value;
    this.paymentLoad.Fecha = this.form.get('Fecha').value;
    this.paymentLoad.DescripcionSAT = this.form.get('DescripcionSAT').value;
    this.paymentLoad.Valido = this.form.get('Valido').value;
    switch (this.form.get('Valido').value) {
      case 'S':
        this.paymentLoad.ValidoText = 'Si';
        break;
      case 'R':
        this.paymentLoad.ValidoText = 'Rechazado';
        break;
      case 'N':
        this.paymentLoad.ValidoText = 'No Invalido';
        break;
      case 'A':
        this.paymentLoad.ValidoText = 'Aplicado';
        break;
      case 'B':
        this.paymentLoad.ValidoText = 'Pago de Bases';
        break;
      case 'D':
        this.paymentLoad.ValidoText = 'Devuelto';
        break;
      case 'C':
        this.paymentLoad.ValidoText = 'Contabilizado';
        break;
      case 'P':
        this.paymentLoad.ValidoText = 'Penalizado';
        break;
      default:
        this.paymentLoad.ValidoText = 'Devuelto al Cliente';
        break;
    }
    console.log(this.paymentLoad);

    let body = {
      pReference: this.paymentLoad.Referencia,
      pReferenceOri: this.paymentLoad.ReferenciaOrdenIngreso,
      pDateMov: this.paymentLoad.FechaMov,
      pvDate: this.paymentLoad.V_Fecha,
      pAmount: this.paymentLoad.Monto,
      pType: this.paymentLoad.Tipo,
      pDescPag: this.paymentLoad.DescPago,
      pNoMovime: this.paymentLoad.NoMovimiento,
      pCveBank: this.paymentLoad.Banco,
      pCode: this.paymentLoad.Codigo_Banco,
      pSucurs: this.paymentLoad.Sucursal,
      pResult: this.paymentLoad.Resultado,
      pVal: this.paymentLoad.Valido,
      pIdPag: this.paymentLoad.idPago,
      pIdLot: this.paymentLoad.Id_Lote,
      pIdOrdenIng: this.paymentLoad.OrdenIngreso,
      pEvent: this.paymentLoad.Evento,
      pLotPubl: this.paymentLoad.LotePublico,
      pCuenta: this.paymentLoad.Cuenta,
      pIdTypeSat: this.paymentLoad.Id_Tipo_SAT,
    };
    console.log(body, this.paymentLoad);
    this.paymentService.postComerpagrefweb(body).subscribe({
      next: resp => {
        this.handleSuccess();
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', 'Carga de Pago', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
