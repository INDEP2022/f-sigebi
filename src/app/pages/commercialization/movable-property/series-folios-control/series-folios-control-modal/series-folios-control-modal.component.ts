import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-series-folios-control-modal',
  templateUrl: './series-folios-control-modal.component.html',
  styles: [],
})
export class SeriesFoliosControlModalComponent
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
      coord: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      regional: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      serie: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      foInicial: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      foFinal: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      validez: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      tipo: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      estatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      totalFolios: [null, [Validators.required]],
      folRegistrados: [null, [Validators.required]],
      folUtilizados: [null, [Validators.required]],
      fecUsuario: [null, [Validators.required]],
      fecRegistro: [null, [Validators.required]],
      direccion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
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
