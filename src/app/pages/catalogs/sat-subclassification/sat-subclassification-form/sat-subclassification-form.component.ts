import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISatClassification } from 'src/app/core/models/catalogs/sat-classification.model';
import { ISatSubclassification } from 'src/app/core/models/catalogs/sat-subclassification.model';
import { ISiabClasification } from 'src/app/core/models/catalogs/siab-clasification.model';
import { SATSubclassificationService } from 'src/app/core/services/catalogs/sat-subclassification.service';
import { SIABClasificationService } from 'src/app/core/services/catalogs/siab-clasification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-sat-subclassification-form',
  templateUrl: './sat-subclassification-form.component.html',
  styles: [],
})
export class SatSubclassificationFormComponent
  extends BasePage
  implements OnInit
{
  satSubclassificationForm: ModelForm<ISatSubclassification>;
  title: string = 'SAT Subclasificacion';
  edit: boolean = false;
  satSubclassification: ISatSubclassification;
  classifications = new DefaultSelect<ISiabClasification>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private satSubclassificationService: SATSubclassificationService,
    private satClassificationService: SIABClasificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.satSubclassificationForm = this.fb.group({
      id: [null],
      nameSubClasification: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      idClasification: [null, [Validators.required]],
    });
    if (this.satSubclassification != null) {
      this.edit = true;
      let satClassification: ISatClassification = this.satSubclassification
        .idClasification as ISatClassification;
      this.satSubclassificationForm.patchValue({
        ...this.satSubclassification,
        idClasification: satClassification.id,
      });
      this.satSubclassificationForm.controls['idClasification'].setValue(
        this.satSubclassification.idClasification
      );

      this.classifications = new DefaultSelect([satClassification], 1);
    } else {
      this.getClassifications({ page: 1 });
    }
  }

  getClassifications(params: ListParams) {
    console.log('params:', params);
    var dddd = 'cat';
    //params['filter.text'] = `$ilike:${dddd}`;
    this.satClassificationService.getAll(params).subscribe(data => {
      this.classifications = new DefaultSelect(data.data, data.count);
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
    this.satSubclassificationService
      .create(this.satSubclassificationForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.satSubclassificationService
      .update(
        this.satSubclassification.id,
        this.satSubclassificationForm.getRawValue()
      )
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
