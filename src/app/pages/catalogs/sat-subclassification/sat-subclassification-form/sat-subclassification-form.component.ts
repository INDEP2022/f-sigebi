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
  title: string = 'Subclasificación SAT';
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
    this.getClassifications(new ListParams());
    this.prepareForm();
  }

  private prepareForm() {
    this.satSubclassificationForm = this.fb.group({
      id: [null],
      nameSubClasification: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      idClasification: [null, [Validators.required]],
      idClasificationCode: [null],
      clasificationDetails: [null],
    });
    if (this.satSubclassification != null) {
      console.log('this.satSubclassification', this.satSubclassification);
      this.edit = true;
      let satClassification: ISatClassification = this.satSubclassification
        .idClasification as ISatClassification;
      this.satSubclassificationForm.patchValue({
        ...this.satSubclassification,
      });
      this.satSubclassificationForm.controls['idClasification'].setValue(
        this.satSubclassification.clasificationDetails.id
      );

      this.satSubclassificationForm.controls['idClasificationCode'].setValue(
        this.satSubclassification.clasificationDetails.id
      );

      console.log(
        'this.satSubclassification.nameSubClasification',
        this.satSubclassification.clasificationDetails.typeDescription
      );
      this.getClassifications1Update(
        new ListParams(),
        this.satSubclassification.clasificationDetails.id
      );

      this.classifications = new DefaultSelect(
        [this.satSubclassification.clasificationDetails.typeDescription],
        1
      );
    }
    setTimeout(() => {
      this.getClassifications(new ListParams());
    }, 1000);
  }

  getClassifications(params: ListParams) {
    console.log('params:', params);
    var dddd = 'cat';
    //params['filter.text'] = `$ilike:${dddd}`;
    this.satClassificationService.getAll(params).subscribe(data => {
      console.log(data.data);
      this.classifications = new DefaultSelect(data.data, data.count);
    });
  }

  getClassifications1Update(params: ListParams, id?: string | number) {
    //console.log('params:', params);
    var dddd = 'cat';
    //params['filter.text'] = `$ilike:${dddd}`;
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.satClassificationService.getAll(params).subscribe(data => {
      console.log(data.data);
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
    if (
      this.satSubclassificationForm.controls[
        'nameSubClasification'
      ].value.trim() == ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.satSubclassificationService
        .create(this.satSubclassificationForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (
      this.satSubclassificationForm.controls[
        'nameSubClasification'
      ].value.trim() == ''
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      console.log(
        'idClasificationCode:',
        this.satSubclassificationForm.get('idClasificationCode').value
      );

      console.log(
        'idClasification:',
        this.satSubclassificationForm.get('idClasification').value
      );

      let idClasi =
        this.satSubclassification.clasificationDetails.idClasification !=
        this.satSubclassificationForm.get('idClasification').value
          ? this.satSubclassificationForm.get('idClasification').value
          : this.satSubclassificationForm.get('idClasificationCode').value;
      console.log('idClasi:', idClasi);
      this.satSubclassificationForm.controls['idClasification'].setValue(
        idClasi
      );

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
