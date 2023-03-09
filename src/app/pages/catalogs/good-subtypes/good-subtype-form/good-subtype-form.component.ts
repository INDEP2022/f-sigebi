import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-good-subtype-form',
  templateUrl: './good-subtype-form.component.html',
  styles: [],
})
export class GoodSubtypeFormComponent extends BasePage implements OnInit {
  goodSubtypeForm: ModelForm<IGoodSubType>;
  title: string = 'Subtipo Bien';
  edit: boolean = false;
  goodSubtype: IGoodSubType;
  types = new DefaultSelect<IGoodType>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private goodSubtypeService: GoodSubtypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.goodSubtypeForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      idTypeGood: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      nameSubtypeGood: [
        null,
        [
          Validators.required,
          Validators.maxLength(70),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      descriptionPhotography: [
        null,
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      noPhotography: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      noRegister: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      version: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.goodSubtype != null) {
      this.edit = true;
      let goodType: IGoodType = this.goodSubtype.idTypeGood as IGoodType;
      this.goodSubtypeForm.patchValue({
        ...this.goodSubtype,
        idTypeGood: goodType.id,
      });
      this.types = new DefaultSelect([goodType], 1);
    } else {
      this.getTypes({ page: 1, text: '' });
    }
  }

  getTypes(params: ListParams) {
    this.goodSubtypeService.getTypes(params).subscribe(data => {
      this.types = new DefaultSelect(data.data, data.count);
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
    this.goodSubtypeService.create(this.goodSubtypeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    console.log(this.goodSubtypeForm.value);
    this.goodSubtypeService.newUpdate(this.goodSubtypeForm.value).subscribe({
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
