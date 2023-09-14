import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IOpinion } from 'src/app/core/models/catalogs/opinion.model';
import { OpinionService } from 'src/app/core/services/catalogs/opinion.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-opinion-form',
  templateUrl: './opinion-form.component.html',
  styles: [],
})
export class OpinionFormComponent extends BasePage implements OnInit {
  opinionForm: ModelForm<IOpinion>;
  title: string = 'Dictamen';
  edit: boolean = false;
  opinion: IOpinion;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private opinionService: OpinionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.opinionForm = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      dict_ofi: [
        null,
        [Validators.maxLength(1), Validators.pattern(STRING_PATTERN)],
      ],
      areaProcess: [
        null,
        [Validators.maxLength(2), Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.opinion != null) {
      this.edit = true;
      this.opinionForm.patchValue(this.opinion);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.opinionForm.controls['description'].value.trim() == '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.opinionService.create(this.opinionForm.value).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (this.opinionForm.controls['description'].value.trim() == '') {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.opinionService
        .updateCatalogOpinions(this.opinion.id, this.opinionForm.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
