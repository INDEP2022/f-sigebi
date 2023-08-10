import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISiabClasification } from 'src/app/core/models/catalogs/siab-clasification.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { SIABClasificationService } from 'src/app/core/services/catalogs/siab-clasification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-siab-clasification-detail',
  templateUrl: './siab-clasification-detail.component.html',
  styles: [],
})
export class SiabClasificationDetailComponent
  extends BasePage
  implements OnInit
{
  siabClasificationform: ModelForm<ISiabClasification>;

  //siabClasificationform: FormGroup;
  title: string = 'Clasificación SIAB';
  edit: boolean = false;
  siabClasification: ISiabClasification;
  clasification: ISiabClasification;
  /*types = new DefaultSelect<IGoodType>();
  subTypes = new DefaultSelect<IGoodSubType>();
  ssubTypes = new DefaultSelect<IGoodSsubType>();
  sssubTypes = new DefaultSelect<IGoodSssubtype>();*/
  types = new DefaultSelect();
  subTypes = new DefaultSelect();
  ssubTypes = new DefaultSelect();
  sssubTypes = new DefaultSelect();
  idType: string = '';
  idSubType: string = '';
  idSsubType: string = '';
  idSssbType: string = '';
  createForm: boolean = true;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private sIABClasificationService: SIABClasificationService,
    private goodTypeService: GoodTypeService,
    private goodSubtypeService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.siabClasificationform = this.fb.group({
      id: [null],
      typeId: [null, [Validators.required]],
      typeDescription: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      subtypeId: [null, [Validators.required]],
      subtypeDescription: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      ssubtypeId: [null, [Validators.required]],
      ssubtypeDescription: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      sssubtypeId: [null, [Validators.required]],
      sssubtypeDescription: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      creationUser: [null],
      creationDate: [null],
      editionUser: [null],
      editionDate: [null],
      version: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
    });

    if (this.clasification != null) {
      this.edit = true;
      this.createForm = false;
      console.log(this.clasification);
      console.log(
        this.clasification.subtypeId,
        this.clasification.typeId,
        this.clasification.ssubtypeId,
        this.clasification.sssubtypeId
      );
      this.getTypesUpdate(new ListParams(), this.clasification.typeId);
      this.getSubtypesUpdate(
        new ListParams(),
        this.clasification.subtypeId,
        this.clasification.typeId
      );
      this.getSsubtypesUpdate(
        new ListParams(),
        this.clasification.ssubtypeId,
        this.clasification.subtypeId
      );
      this.getSssubtypesUpdate(
        new ListParams(),
        this.clasification.sssubtypeId,
        this.clasification.ssubtypeId
      );
      this.siabClasificationform.controls['subtypeId'].disable();
      this.siabClasificationform.controls['ssubtypeId'].disable();
      this.siabClasificationform.controls['sssubtypeId'].disable();

      this.siabClasificationform.patchValue(this.clasification);
    }
    setTimeout(() => {
      this.getTypes(new ListParams());
    }, 1000);
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

  getTypesUpdate(params: ListParams, value: string | number) {
    if (value) {
      console.log(value);
      params['filter.id'] = `$eq:${value}`;
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
  }

  getChangeSutype(data: any) {
    if (data) {
      this.idType = data.id;
      console.log(data);
      if (this.idType != null) {
        this.siabClasificationform.controls['subtypeId'].enable();
        this.getSubtypes(new ListParams());
      }
    } else {
      this.siabClasificationform.controls['subtypeId'].setValue(null);
      this.siabClasificationform.controls['ssubtypeId'].setValue(null);
      this.siabClasificationform.controls['sssubtypeId'].setValue(null);
    }
    /*if (data === null || data === undefined) {
      this.siabClasificationform.controls['subtypeId'].setValue(null);
      this.siabClasificationform.controls['ssubtypeId'].setValue(null);
      this.siabClasificationform.controls['sssubtypeId'].setValue(null);
    } else {
      this.idType = data.id;
      console.log(data);
      if (this.idType != null) {
        this.siabClasificationform.controls['subtypeId'].enable();
        this.getSubtypes(new ListParams());
      }
      /*if (this.createForm === false) {
        if (this.idType != this.clasification.typeId) {
          console.log(this.idType, this.clasification.typeId);
          this.siabClasificationform.controls['subtypeId'].setValue(null);
          this.siabClasificationform.controls['ssubtypeId'].setValue(null);
          this.siabClasificationform.controls['sssubtypeId'].setValue(null);
        }
      }
    }*/
    //console.log(data.id);
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

  getSubtypesUpdate(
    params: ListParams,
    value?: string | number,
    valueType?: string | number
  ) {
    if (value && valueType) {
      console.log(value, valueType);
      params['filter.id'] = `$eq:${value}`;
      params['filter.idTypeGood'] = `$eq:${valueType}`;
      this.goodSubtypeService.getAll(params).subscribe({
        next: data => {
          console.log(data.data);
          this.subTypes = new DefaultSelect(data.data, data.count);
        },
        error: error => {
          console.log(error);
          this.subTypes = new DefaultSelect();
          this.loading = false;
        },
      });
    }
  }

  getChangeSsutype(data: any) {
    if (data) {
      this.idSubType = data.id;
      console.log(data);
      if (this.idSubType != null) {
        this.siabClasificationform.controls['ssubtypeId'].enable();
        this.getSsubtypes(new ListParams());
      }
    } else {
      this.siabClasificationform.controls['ssubtypeId'].setValue(null);
      this.siabClasificationform.controls['sssubtypeId'].setValue(null);
    }

    /*if (data === null || data === undefined) {
      //this.siabClasificationform.controls['subtypeId'].setValue(null);
      this.siabClasificationform.controls['ssubtypeId'].setValue(null);
      this.siabClasificationform.controls['sssubtypeId'].setValue(null);
    } else {
      this.idSubType = data.id;
      console.log(data);
      if (this.idSubType != null) {
        this.siabClasificationform.controls['ssubtypeId'].enable();
        this.getSsubtypes(new ListParams());
      }
      console.log(this.idSubType, this.clasification.subtypeId);
      if (this.idSubType != this.clasification.subtypeId) {

        this.siabClasificationform.controls['ssubtypeId'].setValue(null);
        this.siabClasificationform.controls['sssubtypeId'].setValue(null);
      }
    }*/
  }

  getSsubtypes(params: ListParams) {
    if (this.idSubType) {
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

  getSsubtypesUpdate(
    params: ListParams,
    value?: string | number,
    valuesubType?: string | number
  ) {
    if (value && valuesubType) {
      console.log(value, valuesubType);
      params['filter.id'] = `$eq:${value}`;
      params['filter.noSubType'] = `$eq:${valuesubType}`;
      this.goodSsubtypeService.getAll(params).subscribe({
        next: data => {
          console.log(data.data);
          this.ssubTypes = new DefaultSelect(data.data, data.count);
        },
        error: error => {
          console.log(error);
          this.ssubTypes = new DefaultSelect();
          this.loading = false;
        },
      });
    }
  }

  getChangeSssutype(data: any) {
    if (data) {
      this.idSsubType = data.id;
      console.log(data);
      if (this.idSsubType != null) {
        this.siabClasificationform.controls['sssubtypeId'].enable();
        this.getSssubtypes(new ListParams());
      }
    } else {
      this.siabClasificationform.controls['sssubtypeId'].setValue(null);
    }

    /*if (data === null || data === undefined) {
      //this.siabClasificationform.controls['subtypeId'].setValue(null);
      //this.siabClasificationform.controls['ssubtypeId'].setValue(null);
      
    } else {
      
      /*console.log(this.idSsubType, this.clasification.ssubtypeId);
      if (this.idSsubType != this.clasification.ssubtypeId) {
        
        this.siabClasificationform.controls['sssubtypeId'].setValue(null);
      }
    }*/
  }

  getSssubtypes(params: ListParams) {
    if (this.idSsubType) {
      params['filter.numSsubType'] = `$eq:${this.idSsubType}`;
    }
    this.goodSssubtypeService.getAll(params).subscribe({
      next: data => {
        console.log(data.data);
        this.sssubTypes = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.sssubTypes = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getSssubtypesUpdate(
    params: ListParams,
    value?: string | number,
    valuessubType?: string | number
  ) {
    if (value && valuessubType) {
      console.log(value, valuessubType);
      params['filter.id'] = `$eq:${value}`;
      params['filter.numSsubType'] = `$eq:${valuessubType}`;
      this.goodSssubtypeService.getAll(params).subscribe({
        next: data => {
          this.sssubTypes = new DefaultSelect(data.data, data.count);
        },
        error: error => {
          console.log(error);
          this.sssubTypes = new DefaultSelect();
          this.loading = false;
        },
      });
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    if (
      this.siabClasificationform.controls['typeDescription'].value.trim() ==
        '' ||
      this.siabClasificationform.controls['subtypeDescription'].value.trim() ==
        '' ||
      this.siabClasificationform.controls['ssubtypeDescription'].value.trim() ==
        '' ||
      this.siabClasificationform.controls[
        'sssubtypeDescription'
      ].value.trim() == '' ||
      (this.siabClasificationform.controls['typeDescription'].value.trim() ==
        '' &&
        this.siabClasificationform.controls[
          'subtypeDescription'
        ].value.trim() == '' &&
        this.siabClasificationform.controls[
          'ssubtypeDescription'
        ].value.trim() == '' &&
        this.siabClasificationform.controls[
          'sssubtypeDescription'
        ].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.sIABClasificationService
        .create(this.siabClasificationform.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (
      this.siabClasificationform.controls['typeDescription'].value.trim() ==
        '' ||
      this.siabClasificationform.controls['subtypeDescription'].value.trim() ==
        '' ||
      this.siabClasificationform.controls['ssubtypeDescription'].value.trim() ==
        '' ||
      this.siabClasificationform.controls[
        'sssubtypeDescription'
      ].value.trim() == '' ||
      (this.siabClasificationform.controls['typeDescription'].value.trim() ==
        '' &&
        this.siabClasificationform.controls[
          'subtypeDescription'
        ].value.trim() == '' &&
        this.siabClasificationform.controls[
          'ssubtypeDescription'
        ].value.trim() == '' &&
        this.siabClasificationform.controls[
          'sssubtypeDescription'
        ].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.sIABClasificationService
        .updateCatalogSiabClasification(
          this.clasification.id,
          this.siabClasificationform.value
        )
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
