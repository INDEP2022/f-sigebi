import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRAsuntDic } from 'src/app/core/models/catalogs/r-asunt-dic.model';
import { RAsuntDicService } from 'src/app/core/services/catalogs/r-asunt-dic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-rasunt-dic-form',
  templateUrl: './rasunt-dic-form.component.html',
  styles: [],
})
export class RAsuntDicFormComponent extends BasePage implements OnInit {
  form: ModelForm<IRAsuntDic>;
  title: string = 'R Asunt Dic';
  edit: boolean = false;
  rAsuntDic: IRAsuntDic;
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
      code: [null],
      dictum: [null, [Validators.required]],
      flyerType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      doc: [null, [Validators.pattern(STRING_PATTERN)]],
      property: [null, [Validators.pattern(STRING_PATTERN)]],
      g_of: [null, [Validators.pattern(STRING_PATTERN)]],
      i: [null, [Validators.pattern(STRING_PATTERN)]],
      e: [null, [Validators.pattern(STRING_PATTERN)]],
      registryNumber: [null],
    });
    if (this.rAsuntDic != null) {
      this.edit = true;
      this.form.patchValue(this.rAsuntDic);
    }
  }

  getData(params: ListParams) {
    this.rAsuntDicService.getAll(params).subscribe(data => {
      this.rAsuntDics = new DefaultSelect(data.data, data.count);
    });
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
