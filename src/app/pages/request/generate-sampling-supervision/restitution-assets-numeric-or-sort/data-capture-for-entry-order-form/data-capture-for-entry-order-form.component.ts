import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';

@Component({
  selector: 'app-data-capture-for-entry-order-form',
  templateUrl: './data-capture-for-entry-order-form.component.html',
  styles: [],
})
export class DataCaptureForEntryOrderFormComponent implements OnInit {
  dataForm: ModelForm<any>;
  typeUnitAdminSelected = new DefaultSelect();

  constructor(private fb: FormBuilder, private bsModelRef: BsModalRef) {}

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.dataForm = this.fb.group({
      concept: [null], //required
      wayPay: [null], //required
      import: [null], //required
      reference: [null], //requierd
      specializedThird: [null], //required
      bank: [null], //required
      unitAdministrative: [null], //required
    });
  }

  getUniAdminSelect(event: any) {}

  close() {
    this.bsModelRef.hide();
  }

  save() {
    let message =
      'Ha concluido con la generación de la Orden de ingreso.\n¿Esta de acuerdo que los datos son correctos?';
    Swal.fire({
      title: 'Confirmación orden ingreso',
      text: message,
      icon: undefined,
      width: 450,
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        console.log('Guardar solicitud');
      }
    });
  }
}
