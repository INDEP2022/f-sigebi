import { Component, OnInit, Renderer2 } from '@angular/core';
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
    private rAsuntDicService: RAsuntDicService,
    private render: Renderer2
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
      dictum: [
        null,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ],
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
    this.getData(new ListParams());
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
