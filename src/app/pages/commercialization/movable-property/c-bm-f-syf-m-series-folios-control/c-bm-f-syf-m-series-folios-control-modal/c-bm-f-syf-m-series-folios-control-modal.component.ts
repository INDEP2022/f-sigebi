import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-c-bm-f-syf-m-series-folios-control-modal',
  templateUrl: './c-bm-f-syf-m-series-folios-control-modal.component.html',
  styles: [],
})
export class CBmFSyfMSeriesFoliosControlModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  allotment: any;
  title: string = 'Series y folios';
  edit: boolean = false;

  @Output() refresh = new EventEmitter<true>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      coord: [null, [Validators.required]],
      regional: [null, [Validators.required]],
      serie: [null, [Validators.required]],
      foInicial: [null, [Validators.required]],
      foFinal: [null, [Validators.required]],
      validez: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      estatus: [null, [Validators.required]],
      totalFolios: [null, [Validators.required]],
      folRegistrados: [null, [Validators.required]],
      folUtilizados: [null, [Validators.required]],
      fecUsuario: [null, [Validators.required]],
      fecRegistro: [null, [Validators.required]],
      direccion: [null, [Validators.required]],
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

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.handleSuccess();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
