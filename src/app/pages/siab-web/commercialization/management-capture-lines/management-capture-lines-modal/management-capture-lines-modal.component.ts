import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { BasePage } from 'src/app/core/shared';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-management-capture-lines-modal',
  templateUrl: './management-capture-lines-modal.component.html',
  styles: [],
})
export class managementCaptureLinesModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Línea de captura';
  edit: boolean = true;
  form: FormGroup = new FormGroup({});

  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private capturelineService: CapturelineService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      lc: [null, [Validators.required]],
      lote_publico: [null, [Validators.required]],
      importe: [null, [Validators.required]],
      estatus: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      referencia: [null, [Validators.required]],
      fec_vigencia: [null, [Validators.required]],
      rfc: [null, [Validators.required]],
      idClient: [null],
      cliente: [null, [Validators.required]],
      monto_pena: [null, [Validators.required]],
      note: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
  }
  update() {
    this.loading = true;
    let data = {
      status: this.form.controls['estatus'].value,
      captureLine: this.form.controls['lc'].value,
      flag: this.form.controls['note'].value,
    };
    this.capturelineService.getPaUpdateUniqueKey(data).subscribe({
      next: resp => {
        this.alert('success', 'Se actualizo el estatus', '');
        this.loading = false;
        this.close();
      },
      error: eror => {
        this.alert(
          'warning',
          'Error al actualizar estado volver a intentarlo.',
          ''
        );
        this.loading = false;
        this.close();
      },
    });
  }
}
