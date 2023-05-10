import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IFraction } from 'src/app/core/models/catalogs/fraction.model';
import { INorm } from 'src/app/core/models/catalogs/norm.model';
import { ISiabClasification } from 'src/app/core/models/catalogs/siab-clasification.model';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { NormService } from 'src/app/core/services/catalogs/norm.service';
import { SIABClasificationService } from 'src/app/core/services/catalogs/siab-clasification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-fractions-form',
  templateUrl: './fractions-form.component.html',
  styles: [],
})
export class FractionsFormComponent extends BasePage implements OnInit {
  fraction: IFraction;
  fractionForm: ModelForm<IFraction>;
  norms = new DefaultSelect<INorm>();
  clasifications = new DefaultSelect<ISiabClasification>();
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private fractionService: FractionService,
    private normService: NormService,
    private clasificationService: SIABClasificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.fractionForm = this.fb.group({
      id: [null, [Validators.required]],
      code: [null, [Validators.required]],
      level: ['0', [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      normId: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      unit: [null, [Validators.required]],
      clasificationId: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      version: [1, [Validators.required]],
      relevantTypeId: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      codeErp1: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      codeErp2: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      codeErp3: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      decimalAmount: [
        null,
        [
          Validators.required,
          Validators.pattern(DOUBLE_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      status: [null],
      fractionCode: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      parentId: [null],
    });

    if (this.fraction != null) {
      this.edit = true;
      let classification: ISiabClasification = this.fraction
        .siabClasification as ISiabClasification;
      let norm: INorm = this.fraction.normId as INorm;
      this.fractionForm.patchValue({
        normId: norm?.id,
        clasificationId: classification?.id,
      });

      this.fractionForm
        .get('level')
        .setValue(parseInt(this.fraction.level) + 1);

      this.fractionForm.get('parentId').setValue(this.fraction.id);

      this.clasifications = new DefaultSelect(
        [classification ? classification : []],
        1
      );
      this.norms = new DefaultSelect([norm ? norm : []], 1);

      this.getClasificationSelect({ page: 1, text: '' });
      this.getFractionSelect({ page: 1, text: '' });
    } else {
      this.getClasificationSelect({ page: 1, text: '' });
      this.getFractionSelect({ page: 1, text: '' });
    }
  }

  getFractionSelect(params: ListParams) {
    this.normService.getAll(params).subscribe(data => {
      this.norms = new DefaultSelect(data.data, data.count);
    });
  }

  getClasificationSelect(params: ListParams) {
    this.clasificationService.getAll(params).subscribe(data => {
      this.clasifications = new DefaultSelect(data.data, data.count);
    });
  }

  confirm() {
    /* this.edit ? this.update() : this.create(); */
    this.create();
  }

  create() {
    this.loading = true;
    console.log(this.fractionForm.value);
    this.fractionService.create(this.fractionForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    console.log(this.fractionForm.value);
    this.fractionService.newUpdate(this.fractionForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  //Actions
  codeFraction() {
    this.fractionForm
      .get('fractionCode')
      .setValue(this.fractionForm.get('code').value.replace(/\./g, ''));
  }
}
