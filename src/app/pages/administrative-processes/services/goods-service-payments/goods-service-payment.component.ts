import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-goods-service-payment',
  templateUrl: './goods-service-payment.component.html',
  styles: [],
})
export class GoodsServicePaymentComponent extends BasePage implements OnInit {
  @Output() data = new EventEmitter<any>();

  form: FormGroup = new FormGroup({});

  dateI: string = '';
  dateF: string = '';

  modData: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodprocessService: GoodprocessService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('dataModal-> ', this.modData);
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      applicationDate: [null, [Validators.required]],
      record: [null, [Validators.required]],
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    console.log('Confirm');
    const { applicationDate, record, type, subtype, ssubtype, sssubtype } =
      this.form.value;

    let body = {
      screen: 'FACTADBSOLICSERVI',
      noAssociatedExp: Number(record),
      noType: Number(type),
      noSubType: Number(subtype),
      noSSubType: Number(ssubtype),
      noSSSubType: Number(sssubtype),
      limit: 2,
      page: 2,
    };
    console.log('Body-> ', body);
    this.pupInsertaBienesAux(body);
  }

  pupInsertaBienesAux(body: any) {
    this.goodprocessService.postPupInsertGoodsAux(body).subscribe({
      next: resp => {
        if (resp != null && resp != undefined) {
          this.alert('success', 'Bien agregado correctamente', '');
          console.log('Resp InsertGood-> ', resp);

          if (this.modData[0].goodNumber != null) {
            /*let newDate = {
              no_bien: resp.data[0].,
              di_bien: resp.data[0].,
              fec_solicitud: Viene de el modal de Nuevo,
              costo: 1,
              di_estatus_bien: resp.data[0].,
              cve_servicio: ,
            };
            Update(newDate)*/
          }
        }
      },
      error: err => {
        this.alert('error', 'Error al agregar el Bien', '');
        console.log('Error InsertGoods-> ', err);
      },
    });
  }
}
