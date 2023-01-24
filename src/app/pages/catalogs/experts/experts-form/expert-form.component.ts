import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IProficient } from 'src/app/core/models/catalogs/proficient.model';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-expert-form',
  templateUrl: './expert-form.component.html',
  styles: [],
})
export class ExpertFormComponent extends BasePage implements OnInit {
  form: ModelForm<IProficient>;
  title: string = 'Perito';
  edit: boolean = false;
  proficient: IProficient;
  proficients = new DefaultSelect<IProficient>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private proeficientService: ProeficientService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      position: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      registryNumber: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.proficient != null) {
      this.edit = true;
      this.form.patchValue(this.proficient);
    }
  }

  getData(params: ListParams) {
    this.proeficientService.getAll(params).subscribe(data => {
      this.proficients = new DefaultSelect(data.data, data.count);
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
    this.proeficientService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.proeficientService
      .update(this.proficient.id, this.form.getRawValue())
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
