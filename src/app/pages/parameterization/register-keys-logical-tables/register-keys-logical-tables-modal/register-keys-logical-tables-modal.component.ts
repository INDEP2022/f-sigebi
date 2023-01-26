import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITdescCve } from 'src/app/core/models/ms-parametergood/tdesccve-model';
import { TdescCveService } from 'src/app/core/services/ms-parametergood/tdesccve.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-register-keys-logical-tables-modal',
  templateUrl: './register-keys-logical-tables-modal.component.html',
  styles: [],
})
export class RegisterKeysLogicalTablesModalComponent
  extends BasePage
  implements OnInit
{
  tdescCveForm: ModelForm<ITdescCve>;
  tdescCve: ITdescCve;
  title: string = 'Registro de claves para tablas logicas';
  edit: boolean = false;

  get type1() {
    return this.tdescCveForm.get('type1');
  }

  get type5() {
    return this.tdescCveForm.get('type5');
  }

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private tdescCveService: TdescCveService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForom();
  }

  private prepareForom() {
    this.tdescCveForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],

      type1: [{ value: true, disabled: true }],
      type5: [null, [Validators.required]],

      dsKey1: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      swFormat1: [null, [Validators.pattern(STRING_PATTERN)]],
      longMin1: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      longMax1: [null, [Validators.pattern(NUMBERS_PATTERN)]],

      dsKey2: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      swFormat2: [null, [Validators.pattern(STRING_PATTERN)]],
      longMin2: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      longMax2: [null, [Validators.pattern(NUMBERS_PATTERN)]],

      dsKey3: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      swFormat3: [null, [Validators.pattern(STRING_PATTERN)]],
      longMin3: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      longMax3: [null, [Validators.pattern(NUMBERS_PATTERN)]],

      dsKey4: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      swFormat4: [null, [Validators.pattern(STRING_PATTERN)]],
      longMin4: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      longMax4: [null, [Validators.pattern(NUMBERS_PATTERN)]],

      dsKey5: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      swFormat5: [null, [Validators.pattern(STRING_PATTERN)]],
      longMin5: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      longMax5: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
    if (this.tdescCve != null) {
      this.edit = true;
      console.log(this.tdescCve);
      this.tdescCveForm.patchValue(this.tdescCve);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.update();
  }

  // create() {
  //   this.loading = true;
  //   this.tdescCveService.create(this.tdescCveForm.value).subscribe({
  //     next: data => this.handleSuccess(),
  //     error: error => (this.loading = false),
  //   });
  // }

  update() {
    this.loading = true;
    this.tdescCveService
      .update(this.tdescCve.id, this.tdescCveForm.value)
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
