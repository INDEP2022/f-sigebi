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
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-good-ssubtypes-form',
  templateUrl: './good-ssubtypes-form.component.html',
  styles: [],
})
export class GoodSsubtypesFormComponent extends BasePage implements OnInit {
  goodSsubtypeForm: ModelForm<IGoodSsubType>;
  title: string = 'Subsubtipo Bien';
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
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ],
      noType: [null, [Validators.required]],
      noSubType: [null, [Validators.required]],
      noRegister: [null],
    });
    if (this.goodSsubtype != null) {
      console.log(this.goodSsubtype);
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
      this.subTypes = new DefaultSelect([goodSubtype], 1);
      this.types = new DefaultSelect([goodType], 1);
    }
    this.getTypes({ page: 1, text: '' });
    this.getSubtypes({ page: 1, text: '' });
  }

  getTypes(params: ListParams) {
    this.goodTypeService.getAll(params).subscribe(data => {
      this.types = new DefaultSelect(data.data, data.count);
    });
  }
  getSubtypes(params: ListParams, id?: string) {
    if (id) {
      params['filter.idTypeGood'] = id;
    }
    this.goodSubtypeService.getAll(params).subscribe(
      data => {
        this.subTypes = new DefaultSelect(data.data, data.count);
      },
      error => {
        this.subTypes = new DefaultSelect([], 0, true);
      }
    );
  }
  getAllSubtypes(data: any) {
    this.getSubtypes(new ListParams(), data.id);
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.goodSsubtypeForm.controls['description'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.goodSsubtypeService.create(this.goodSsubtypeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    const ids = {
      id: this.goodSsubtype.id,
      numSubType: (this.goodSsubtype.noSubType as IGoodSubType).id,
      numType: (this.goodSsubtype.noType as IGoodType).id,
    };
    this.goodSsubtypeService
      .updateByIds(ids, this.goodSsubtypeForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
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
