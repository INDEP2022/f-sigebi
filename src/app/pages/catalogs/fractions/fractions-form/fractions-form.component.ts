import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IFraction } from 'src/app/core/models/catalogs/fraction.model';
import { INorm } from 'src/app/core/models/catalogs/norm.model';
import { ISiabClasification } from 'src/app/core/models/catalogs/siab-clasification.model';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { NormService } from 'src/app/core/services/catalogs/norm.service';
import { SIABClasificationService } from 'src/app/core/services/catalogs/siab-clasification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
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
    private clasificationService:SIABClasificationService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.fractionForm = this.fb.group({
      code: [null, [Validators.required]],
      level: [null, [Validators.required]],
      description: [null, [Validators.required]],
      normId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      unit: [null, [Validators.required]],
      clasificationId: [null, [Validators.required]],
      version: [null, [Validators.required]],
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ],
      status: [null],
      fractionCode: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });

    if (this.fraction != null) {
      this.edit = true;
      let classification: ISiabClasification = this.fraction
        .clasificationId as ISiabClasification;
      let norm: INorm = this.fraction.normId as INorm;
      this.fractionForm.patchValue({
        ...this.fraction,
        normId: norm?.id,
        clasificationId: classification?.id,
      });

      this.clasifications = new DefaultSelect(
        [classification ? classification : []],
        1
      );
      this.norms = new DefaultSelect([norm ? norm : []], 1);
    } else {
      this.getClasificationSelect({ inicio: 1, text: '' });
      this.getFractionSelect({ inicio: 1, text: '' });
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
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.fractionService.create(this.fractionForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.fractionService
      .update(this.fraction.id, this.fractionForm.value)
      .subscribe({
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
}
