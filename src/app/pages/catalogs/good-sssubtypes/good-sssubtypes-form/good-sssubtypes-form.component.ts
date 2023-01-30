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
  title: string = 'Subtipo Bien';
  edit: boolean = false;
  goodSssubtype: IGoodSssubtype;
  types = new DefaultSelect<IGoodType>();
  subTypes = new DefaultSelect<IGoodSubType>();
  ssubTypes = new DefaultSelect<IGoodSsubType>();

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
    this.prepareForm();
  }

  private prepareForm(): void {
    this.goodSssubtypeForm = this.fb.group({
      id: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
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
      numRegister: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      numClasifAlterna: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      numClasifGoods: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.goodSssubtype != null) {
      this.edit = true;
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
    } else {
      this.getTypes({ inicio: 1, text: '' });
      //this.getSubtypes({ inicio: 1, text: '' });
      //this.getSsubtypes({ inicio: 1, text: '' });
    }
  }

  getTypes(params: ListParams) {
    this.goodTypeService.getAll(params).subscribe(data => {
      this.types = new DefaultSelect(data.data, data.count);
    });
  }
  getSubtypes(params: ListParams) {
    console.log(this.goodSssubtypeForm.controls.numType);
    this.goodSubtypeService
      .getAll({
        ...params,
        type: this.goodSssubtypeForm.controls.numType.value as any,
      })
      .subscribe(data => {
        this.subTypes = new DefaultSelect(data.data, data.count);
      });
  }
  getSsubtypes(params: ListParams) {
    this.goodSsubtypeService.getAll(params).subscribe(data => {
      this.ssubTypes = new DefaultSelect(data.data, data.count);
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
    this.goodSssubtypeService.create(this.goodSssubtypeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    const ids = {
      id: this.goodSssubtype.id,
      numSsubType: (this.goodSssubtype.numSsubType as IGoodSsubType).id,
      numSubType: (this.goodSssubtype.numSubType as IGoodSubType).id,
      numType: (this.goodSssubtype.numType as IGoodType).id,
    };

    this.goodSssubtypeService
      .updateByIds(ids, this.goodSssubtypeForm.value)
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
