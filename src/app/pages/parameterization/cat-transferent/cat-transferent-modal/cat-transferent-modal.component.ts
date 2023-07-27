import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
//models
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
//Services
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-cat-transferent-modal',
  templateUrl: './cat-transferent-modal.component.html',
  styles: [],
})
export class CatTransferentModalComponent extends BasePage implements OnInit {
  title: string = 'Transferente';
  edit: boolean = false;

  transferentForm: ModelForm<ITransferente>;
  transferent: ITransferente;

  today: Date;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private transferenteService: TransferenteService,
    private datePipe: DatePipe
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.transferentForm = this.fb.group({
      id: [{ value: null, disabled: true }, []],
      nameTransferent: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      keyTransferent: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      userCreation: [{ value: null, disabled: true }, []],
      dateCreation: [{ value: null, disabled: true }, []],
      userUpdate: [{ value: null, disabled: true }, []],
      dateUpdate: [{ value: null, disabled: true }, []],
      typeTransferent: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      version: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(80)],
      ],
      status: [null, [Validators.required]],
      dateBegOperation: [null, []],
      dateFinalOperation: [{ value: null, disabled: true }, []],
      assignor: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      objectCharge: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      sector: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      formalization: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      dateFormalization: [null, []],
      entity: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      amedingAgree: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      dateAmeding: [null, []],
      typeGoods: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      custodyGuardGoods: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      destinyGoods: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      daysAdminGoods: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      /*cvman: [null, [Validators.pattern(STRING_PATTERN)]],
      indcap: [null, [Validators.pattern(STRING_PATTERN)]],
      active: [null, [Validators.pattern(STRING_PATTERN)]],
      risk: [null, [Validators.pattern(STRING_PATTERN)]],*/
    });
    if (this.transferent != null) {
      this.edit = true;
      console.log(this.transferent);
      this.transferentForm.patchValue(this.transferent);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.transferentForm.controls['nameTransferent'].value.trim() === '' ||
      this.transferentForm.controls['keyTransferent'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', '');
      return;
    }
    this.loading = true;
    this.transferenteService.create(this.transferentForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.transferenteService
      .update(this.transferent.id, this.transferentForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
