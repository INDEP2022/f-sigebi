import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-good-sssubtypes-form',
  templateUrl: './good-sssubtypes-form.component.html',
  styles: [],
})
export class GoodSssubtypesFormComponent extends BasePage implements OnInit {
  goodSssubtypeForm: ModelForm<IGoodSssubtype>;
  title: string = 'Subsubsubtipo Bien';
  edit: boolean = false;
  goodSssubtype: IGoodSssubtype;
  types = new DefaultSelect<IGoodType>();
  subTypes = new DefaultSelect<IGoodSubType>();
  ssubTypes = new DefaultSelect<IGoodSsubType>();
  createForm: boolean = true;
  idType: string = '';
  idSubType: string = '';

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private goodTypeService: GoodTypeService,
    private goodSubtypeService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService
  ) {
    super();
  }

  ngOnInit(): void {
    /* this.getTypes(new ListParams());
     this.getSubtypes(new ListParams());
     this.getSsubtypes(new ListParams());*/

    this.prepareForm();
  }

  private prepareForm(): void {
    this.goodSssubtypeForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      numSubType: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      numSsubType: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      numType: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      numRegister: [null],
      numClasifGoods: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(5),
        ],
      ],
    });
    if (this.goodSssubtype != null) {
      this.edit = true;
      this.createForm = false;
      console.log(this.goodSssubtype);
      let goodType: IGoodType = this.goodSssubtype.numType as IGoodType;
      let goodSubtype: IGoodSubType = this.goodSssubtype
        .numSubType as IGoodSubType;
      let goodSsubtype: IGoodSsubType = this.goodSssubtype
        .numSsubType as IGoodSsubType;
      this.goodSssubtypeForm.patchValue({
        ...this.goodSssubtype,
        numType: goodType.id,
        numSubType: goodSubtype.id,
        numSsubType: goodSsubtype.id,
      });
      this.goodSssubtypeForm.get('id').disable();
      this.goodSssubtypeForm.get('numType').disable();
      this.goodSssubtypeForm.get('numSubType').disable();
      this.goodSssubtypeForm.get('numSsubType').disable();

      this.types = new DefaultSelect([goodType], 1);
      this.subTypes = new DefaultSelect([goodSubtype], 1);
      this.ssubTypes = new DefaultSelect([goodSsubtype], 1);
      this.idType = this.goodSssubtypeForm.controls['numType'].value.toString();
      this.idSubType =
        this.goodSssubtypeForm.controls['numSubType'].value.toString();
      this.getSubtypes(new ListParams());
      this.getSsubtypes(new ListParams());
    }
    this.goodSssubtypeForm.get('numClasifGoods').disable();
    setTimeout(() => {
      this.getTypes(new ListParams());
    }, 1000);
    //this.getSubtypes({ inicio: 1, text: '' });
    //this.getSsubtypes({ inicio: 1, text: '' });
  }

  getTypes(params: ListParams) {
    this.goodTypeService.getAll(params).subscribe({
      next: data => {
        this.types = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.types = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getTypesUpdate(params: ListParams, value: string) {
    if (value) {
      console.log(value);
      params['filter.id'] = `$eq:${value}`;
    }
    this.goodTypeService.getAll(params).subscribe({
      next: data => {
        this.types = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.types = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getChangeSutype(data: any) {
    console.log(data);
    this.idType = data.id;
    console.log(data);
    if (this.idType != null) {
      // this.goodSssubtypeForm.controls['numSubType'].enable();
      this.getSubtypes(new ListParams());
    }
    this.ssubTypes = new DefaultSelect([], 0, true);
    this.goodSssubtypeForm.controls['numSubType'].setValue('');
    this.goodSssubtypeForm.controls['numSsubType'].setValue('');
    /*if (this.createForm === false) {
      if (this.idType != this.goodSssubtype.typeId) {
        console.log(this.idType, this.goodSssubtype.typeId);
        this.goodSssubtypeForm.controls['subtypeId'].setValue(null);
        this.goodSssubtypeForm.controls['ssubtypeId'].setValue(null);
      }
    }*/
  }

  getSubtypes(params: ListParams) {
    if (this.idType) {
      params['filter.idTypeGood'] = `$eq:${this.idType}`;
    }
    this.goodSubtypeService.getAll(params).subscribe({
      next: data => {
        this.subTypes = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.subTypes = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getSubtypesUpdate(params: ListParams, value: string, valueType: string) {
    if (value && valueType) {
      console.log(value);
      params['filter.id'] = `$eq:${value}`;
      params['filter.idTypeGood'] = `$eq:${valueType}`;
    }
    this.goodSubtypeService.getAll(params).subscribe({
      next: data => {
        this.subTypes = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.subTypes = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getChangeSsutype(data: any) {
    console.log(data);
    this.idSubType = data.id;
    console.log(data);
    if (this.idSubType != null) {
      this.getSsubtypes(new ListParams());
    }
    this.goodSssubtypeForm.controls['numSsubType'].setValue('');
    /*console.log(this.idSubType, this.clasification.subtypeId);
    if (this.idSubType != this.clasification.subtypeId) {

      this.siabClasificationform.controls['ssubtypeId'].setValue(null);
      this.siabClasificationform.controls['sssubtypeId'].setValue(null);
    }*/
  }

  getSsubtypes(params: ListParams) {
    if (this.idSubType) {
      params['filter.noType'] = `$eq:${this.idType}`;
      params['filter.noSubType'] = `$eq:${this.idSubType}`;
    }
    this.goodSsubtypeService.getAll(params).subscribe({
      next: data => {
        this.ssubTypes = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.ssubTypes = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getSsubtypesUpdate(params: ListParams, value: string, valuesubType: string) {
    if (value && valuesubType) {
      console.log(value);
      params['filter.id'] = `$eq:${value}`;
      params['filter.noSubType'] = `$eq:${valuesubType}`;
    }
    this.goodSsubtypeService.getAll(params).subscribe({
      next: data => {
        this.ssubTypes = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.ssubTypes = new DefaultSelect();
        this.loading = false;
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
    if (this.goodSssubtypeForm.controls['description'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.goodSssubtypeService.create(this.goodSssubtypeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        this.alert(
          'error',
          'El Codigo de Subsubsubtipo de Bien ya fue registrado',
          ''
        );
      },
    });
  }

  update() {
    this.loading = true;
    console.log(this.goodSssubtype.numClasifGoods);
    const ids = {
      numClasifGoods: this.goodSssubtype.numClasifGoods,
      id: this.goodSssubtype.id,
      numSsubType: (this.goodSssubtype.numSsubType as IGoodSsubType).id,
      numSubType: (this.goodSssubtype.numSubType as IGoodSubType).id,
      numType: (this.goodSssubtype.numType as IGoodType).id,
    };

    this.goodSssubtypeService
      .updateByIds(ids, this.goodSssubtypeForm.getRawValue())
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
