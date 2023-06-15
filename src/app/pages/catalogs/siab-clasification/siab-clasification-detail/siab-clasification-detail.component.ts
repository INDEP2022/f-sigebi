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
  title: string = 'CLASIFICACIÓN SIAB';
  edit: boolean = false;
  siabClasification: ISiabClasification;
  clasification: any;
  types = new DefaultSelect<IGoodType>();
  subTypes = new DefaultSelect<IGoodSubType>();
  ssubTypes = new DefaultSelect<IGoodSsubType>();
  sssubTypes = new DefaultSelect<IGoodSssubtype>();

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
      typeId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      typeDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      subtypeId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      subtypeDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      ssubtypeId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ssubtypeDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      sssubtypeId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      sssubtypeDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      creationUser: [null, [Validators.pattern(STRING_PATTERN)]],
      editionUser: [null, [Validators.pattern(STRING_PATTERN)]],
      version: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    if (this.clasification != null) {
      this.edit = true;
      this.siabClasificationform.patchValue(this.clasification);
    }
    this.getTypes(new ListParams());
    this.getSubtypes(new ListParams());
    this.getSsubtypes(new ListParams());
    this.getSssubtypes(new ListParams());
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

  getSubtypes(params: ListParams) {
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

  getSsubtypes(params: ListParams) {
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

  getSssubtypes(params: ListParams) {
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
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
