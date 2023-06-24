import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
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
  siabClasificationform: FormGroup;
  title: string = 'Clasificación SIAB';
  edit: boolean = false;
  siabClasification: ISiabClasification;
  clasification: any;
  types = new DefaultSelect<IGoodType>();
  subTypes = new DefaultSelect<IGoodSubType>();
  ssubTypes = new DefaultSelect<IGoodSsubType>();
  sssubTypes = new DefaultSelect<IGoodSssubtype>();
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
    if (this.siabClasification != null) {
      this.edit = true;
      this.siabClasificationform.patchValue(this.siabClasification);
    }
  }

  prepareForm() {
    this.siabClasificationform = this.fb.group({
      id: [null, [Validators.pattern(STRING_PATTERN)]],
      typeId: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      typeDescription: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subtypeId: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      subtypeDescription: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ssubtypeId: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      ssubtypeDescription: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      sssubtypeId: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      sssubtypeDescription: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      creationUser: [null, [Validators.pattern(STRING_PATTERN)]],
      editionUser: [null, [Validators.pattern(STRING_PATTERN)]],
      version: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    if (this.clasification != null) {
      this.edit = true;
      this.createForm = false;
      console.log(this.clasification);
      this.siabClasificationform.patchValue(this.clasification);
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
    }
    setTimeout(() => {
      this.getTypes(new ListParams());
    }, 1000);

    //this.getSubtypes(new ListParams());
    //this.getSsubtypes(new ListParams());
    //this.getSssubtypes(new ListParams());
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
    if (data === null || data === undefined) {
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
      if (this.createForm === false) {
        if (this.idType != this.clasification.typeId) {
          console.log(this.idType, this.clasification.typeId);
          this.siabClasificationform.controls['subtypeId'].setValue(null);
          this.siabClasificationform.controls['ssubtypeId'].setValue(null);
          this.siabClasificationform.controls['sssubtypeId'].setValue(null);
        }
      }
    }
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
    if (data === null || data === undefined) {
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
      /*console.log(this.idSubType, this.clasification.subtypeId);
      if (this.idSubType != this.clasification.subtypeId) {
        
        this.siabClasificationform.controls['ssubtypeId'].setValue(null);
        this.siabClasificationform.controls['sssubtypeId'].setValue(null);
      }*/
    }
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

  getChangeSssutype(data: any) {
    if (data === null || data === undefined) {
      //this.siabClasificationform.controls['subtypeId'].setValue(null);
      //this.siabClasificationform.controls['ssubtypeId'].setValue(null);
      this.siabClasificationform.controls['sssubtypeId'].setValue(null);
    } else {
      this.idSsubType = data.id;
      console.log(data);
      if (this.idSsubType != null) {
        this.siabClasificationform.controls['sssubtypeId'].enable();
        this.getSssubtypes(new ListParams());
      }
      /*console.log(this.idSsubType, this.clasification.ssubtypeId);
      if (this.idSsubType != this.clasification.ssubtypeId) {
        
        this.siabClasificationform.controls['sssubtypeId'].setValue(null);
      }*/
    }
  }

  getSssubtypes(params: ListParams) {
    if (this.idSsubType) {
      params['filter.numSsubType'] = `$eq:${this.idSsubType}`;
    }
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

  getSssubtypesUpdate(
    params: ListParams,
    value: string,
    valuessubType: string
  ) {
    if (value && valuessubType) {
      console.log(value);
      params['filter.id'] = `$eq:${value}`;
      params['filter.numSsubType'] = `$eq:${valuessubType}`;
    }
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

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.sIABClasificationService
      .create(this.siabClasificationform.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
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

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
