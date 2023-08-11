import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
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
      id: [null],
      idTypeGood: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
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
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      noRegister: [null],
      version: [null],
    });
    if (this.goodSubtype != null) {
      this.edit = true;
      let goodType: IGoodType = this.goodSubtype.idTypeGood as IGoodType;
      this.types = new DefaultSelect([goodType], 1);
      this.goodSubtypeForm.patchValue(this.goodSubtype);
      this.goodSubtypeForm.controls['idTypeGood'].disable();

      /*this.goodSubtypeForm.patchValue({
        ...this.goodSubtype,
        idTypeGood: goodType.id,
      });*/
      this.goodSubtypeForm.controls['idTypeGood'].disable();
    } else {
      this.getTypes({ page: 1, text: '' });
    }
    setTimeout(() => {
      this.getTypes(new ListParams());
    }, 1000);
  }

  getTypes(params: ListParams) {
    this.goodSubtypeService.getTypes(params).subscribe({
      next: data => {
        this.types = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.types = new DefaultSelect();
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.goodSubtypeForm.controls['nameSubtypeGood'].value.trim() == '' ||
      this.goodSubtypeForm.controls['descriptionPhotography'].value.trim() ==
        '' ||
      (this.goodSubtypeForm.controls['nameSubtypeGood'].value.trim() == '' &&
        this.goodSubtypeForm.controls['descriptionPhotography'].value.trim() ==
          '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.goodSubtypeService.create(this.goodSubtypeForm.value).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (
      this.goodSubtypeForm.controls['nameSubtypeGood'].value.trim() == '' ||
      this.goodSubtypeForm.controls['descriptionPhotography'].value.trim() ==
        '' ||
      (this.goodSubtypeForm.controls['nameSubtypeGood'].value.trim() == '' &&
        this.goodSubtypeForm.controls['descriptionPhotography'].value.trim() ==
          '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      const ids = {
        id: this.goodSubtypeForm.controls['id'].value,
        idTypeGood: this.goodSubtypeForm.controls['idTypeGood'].value,
      };
      this.goodSubtypeService
        .updateByIds(ids, this.goodSubtypeForm.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
