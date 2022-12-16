import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-good-type-form',
  templateUrl: './good-type-form.component.html',
  styles: [],
})
export class GoodTypeFormComponent extends BasePage implements OnInit {
  goodTypeForm: FormGroup = new FormGroup({});
  title: string = 'Tipo Bien';
  edit: boolean = false;
  goodType: IGoodType;
  items = new DefaultSelect<IGoodType>();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private goodTypeService: GoodTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.goodTypeForm = this.fb.group({
      id: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      nameGoodType: [null, [Validators.required, Validators.maxLength(70)]],
      maxAsseguranceTime: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      maxFractionTime: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      maxExtensionTime: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      maxStatementTime: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      maxLimitTime1: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      maxLimitTime2: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      maxLimitTime3: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      noRegister: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      version: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.goodType != null) {
      this.edit = true;
      this.goodTypeForm.patchValue(this.goodType);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.goodTypeService.create(this.goodTypeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.goodTypeService
      .update(this.goodType.id, this.goodTypeForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
