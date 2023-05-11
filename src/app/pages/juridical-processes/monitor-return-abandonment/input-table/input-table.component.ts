import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewCell } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';

import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-input-table',
  templateUrl: './input-table.component.html',
  styles: [],
})
export class InputTableComponent extends BasePage implements ViewCell, OnInit {
  status: string = 'Agregar';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  good: any;

  string_PTRN: `[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]`;
  @Output() refresh = new EventEmitter<true>();

  inputClass: string = '';

  constructor(
    private goodService: GoodService,
    private fb: FormBuilder,
    private modalRef: BsModalRef
  ) {
    super();
  }
  value: string | number;
  rowData: any;

  ngOnInit(): void {
    console.log('GO', this.good);

    this.prepareForm();
  }

  prepareForm(): void {
    const fechaOriginal: any = new Date(this.good.judicialLeaveDate);

    this.form = this.fb.group({
      goodId: [this.good.id],
      description: [this.good.description],
      leaveObservations: [
        this.good.leaveObservations == '' || this.good.leaveObservations == null
          ? ''
          : this.good.leaveObservations,
        [Validators.pattern(this.string_PTRN), Validators.required],
      ],
      judicialLeaveDate: [
        this.good.judicialLeaveDate == '' || this.good.judicialLeaveDate == null
          ? ''
          : fechaOriginal,
        [Validators.required],
      ],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.update();
  }

  update() {
    const judicialLeaveDate = new Date(
      this.form.get('judicialLeaveDate').value
    );
    const sysdate = new Date();
    let complianceLeaveDate = null;
    if (this.good.complianceLeaveDate) {
      complianceLeaveDate = new Date(this.good.complianceLeaveDate);
    }

    if (
      judicialLeaveDate >= complianceLeaveDate &&
      judicialLeaveDate <= sysdate
    ) {
      let params = {
        id: this.good.id,
        goodId: this.good.goodId,
        leaveObservations: this.form.get('leaveObservations').value,
        judicialLeaveDate: this.form.get('judicialLeaveDate').value,
      };

      this.goodService.updateWithParams(params).subscribe(
        response => {
          this.handleSuccess();
        },
        error => (
          this.onLoadToast(
            'error',
            'MONITOR DE ABANDONO POR DEVOLUCIÓN',
            `Error`
          ),
          (this.loading = false)
        )
      );
    } else {
      this.alertInfo(
        'info',
        'Ingrese una fecha válida',
        `La fecha no puede ser menor a la del cumplimiento de abandono ni mayor a la actual`
      );
    }
  }

  handleSuccess() {
    this.onLoadToast(
      'success',
      'MONITOR DE ABANDONO POR DEVOLUCIÓN',
      `Se han actualizado valores correctamente`
    );
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
