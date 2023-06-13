import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRAsuntDic } from 'src/app/core/models/catalogs/r-asunt-dic.model';
import { RAsuntDicService } from 'src/app/core/services/catalogs/r-asunt-dic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-modal-cat-identifier-uni-dbs',
  templateUrl: './modal-cat-identifier-uni-dbs.component.html',
  styles: [],
})
export class ModalIdentifierUnivDbs extends BasePage implements OnInit {
  form: ModelForm<IRAsuntDic>;
  title: string = 'ASUNTO DICTAMEN';
  edit: boolean = false;
  rAsuntDic: IRAsuntDic;
  itemDictamen = new DefaultSelect();
  itemType = new DefaultSelect();
  rAsuntDics = new DefaultSelect<IRAsuntDic>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private rAsuntDicService: RAsuntDicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      code: [
        null,
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ],
      dictum: [null, []],
      flyerType: [
        null,
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      doc: [
        null,
        [Validators.maxLength(1), Validators.pattern(STRING_PATTERN)],
      ],
      property: [null, [Validators.pattern(STRING_PATTERN)]],
      g_of: [
        null,
        [Validators.maxLength(1), Validators.pattern(STRING_PATTERN)],
      ],
      i: [null, [Validators.maxLength(1), Validators.pattern(STRING_PATTERN)]],
      e: [null, [Validators.maxLength(1), Validators.pattern(STRING_PATTERN)]],
      // registryNumber: [null],
    });

    if (this.rAsuntDic != null) {
      this.edit = true;
      this.form.patchValue(this.rAsuntDic);
      this.form.get('flyerType').disable();
      this.form.get('dictum').disable();
      this.form.get('code').disable();
    }
    this.getFromSelectDictamen(new ListParams());
    this.getFromSelectType(new ListParams());
  }

  getFromSelectDictamen(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.rAsuntDicService.getDictamen(params).subscribe((data: any) => {
      this.itemDictamen = new DefaultSelect(data.data, data.count);
    });
  }

  getFromSelectType(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.rAsuntDicService.getType(params).subscribe((data: any) => {
      this.itemType = new DefaultSelect(data.data, data.count);
    });
  }

  onEventsChange(event: any) {
    this.form.controls['flyerType'].setValue(event.referralNoteType);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.rAsuntDicService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    console.log(this.form.getRawValue());
    this.rAsuntDicService
      .update(this.rAsuntDic.code, this.form.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),

        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
