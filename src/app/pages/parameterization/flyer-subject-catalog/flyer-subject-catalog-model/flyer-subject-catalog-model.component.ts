import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Models
import { IAffairType } from 'src/app/core/models/catalogs/affair-type-model';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
//Services
import { AffairTypeService } from 'src/app/core/services/affair/affair-type.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';

@Component({
  selector: 'app-flyer-subject-catalog-model',
  templateUrl: './flyer-subject-catalog-model.component.html',
  styles: [],
})
export class FlyerSubjectCatalogModelComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Catálogo de asuntos para volantes';
  edit: boolean = false;

  affairTypeForm: ModelForm<IAffairType>;
  affairType: IAffairType;
  id: IAffair;

  affair = new DefaultSelect();
  idF: IAffair;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private affairTypeService: AffairTypeService,
    private affairService: AffairService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.affairTypeForm = this.fb.group({
      code: [null, []],
      relationPropertyKey: [null, [Validators.required]],
      referralNoteType: [null, [Validators.required]],
      versionUser: [null, [Validators.required]],
      idRegister: [null, []],
    });
    if (this.affairType != null) {
      this.id = this.affairType.code as unknown as IAffair;
      this.edit = true;
      console.log(this.affairType);
      this.affairTypeForm.patchValue(this.affairType);
      this.affairTypeForm.controls['code'].setValue(this.affairType.code);
    } else {
      console.log('Limpio', this.idF.id);
      this.affairTypeForm.controls['code'].setValue(this.idF.id);
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
    this.affairTypeService.create(this.affairTypeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.affairTypeForm;
    this.affairTypeService.newUpdate(this.affairTypeForm.value).subscribe({
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
