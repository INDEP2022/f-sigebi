import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-good-ssubtypes-form',
  templateUrl: './good-ssubtypes-form.component.html',
  styles: [],
})
export class GoodSsubtypesFormComponent extends BasePage implements OnInit {
  goodSsubtypeForm: ModelForm<IGoodSsubType>;
  title: string = 'Subtipo Bien';
  edit: boolean = false;
  goodSsubtype: IGoodSsubType;
  types = new DefaultSelect<IGoodType>();
  subTypes = new DefaultSelect<IGoodSubType>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private goodTypeService: GoodTypeService,
    private goodSubtypeService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.goodSsubtypeForm = this.fb.group({
      id: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      noType: [null, [Validators.required]],
      noSubType: [null, [Validators.required]],
      noRegister: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.goodSsubtype != null) {
      this.edit = true;
      let goodType: IGoodType = this.goodSsubtype.noType as IGoodType;
      let goodSubtype: IGoodSubType = this.goodSsubtype
        .noSubType as IGoodSubType;
      this.goodSsubtypeForm.patchValue({
        ...this.goodSsubtype,
        noType: goodType.id,
        noSubType: goodSubtype.id,
      });
      this.goodSsubtypeForm.get('id').disable();
      this.goodSsubtypeForm.get('noType').disable();
      this.goodSsubtypeForm.get('noSubType').disable();
      this.subTypes = new DefaultSelect([goodSubtype], 1);
      this.types = new DefaultSelect([goodType], 1);
    } else {
      this.getTypes({ page: 1, text: '' });
      this.getSubtypes({ page: 1, text: '' });
    }
  }

  getTypes(params: ListParams) {
    this.goodTypeService.getAll(params).subscribe(data => {
      this.types = new DefaultSelect(data.data, data.count);
    });
  }
  getSubtypes(params: ListParams) {
    this.goodSubtypeService.getAll(params).subscribe(data => {
      this.subTypes = new DefaultSelect(data.data, data.count);
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
    this.goodSsubtypeService.create(this.goodSsubtypeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.goodSsubtypeService
      .update(this.goodSsubtype.id, this.goodSsubtypeForm.value)
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
