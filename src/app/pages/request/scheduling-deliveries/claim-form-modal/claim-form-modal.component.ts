import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-claim-form-modal',
  templateUrl: './claim-form-modal.component.html',
  styles: [],
})
export class ClaimFormModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  screenWidth: number = null;

  private fb = inject(FormBuilder);
  private bsModelService = inject(BsModalRef);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      incharge: [null],
      position: [null],
    });
  }

  confirm() {
    /**
     * No se tiene la logica del firmado
     * Se tiene que seleccionar bienes para generar firma o afecta a todos
     * mostrarFormatoRec()
     */

    //window.alert('No se tiene el reporte');
    this.close;
  }

  close() {
    this.bsModelService.hide();
  }
}
