import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICopiesOfficialOpinion } from 'src/app/core/models/ms-dictation/copies-official-opinion.model';
import { CopiesOfficialOpinionService } from 'src/app/core/services/catalogs/copies-official-opinion.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-copy-documentation-goods-dialog',
  templateUrl: './copy-documentation-goods-dialog.component.html',
  styles: [],
})
export class CopyDocumentationGoodsDialogComponent
  extends BasePage
  implements OnInit
{
  copiesOfficialForm: ModelForm<ICopiesOfficialOpinion>;
  copiesOfficial: ICopiesOfficialOpinion;

  title: string = 'Copia de Oficio';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private copiesOfficialService: CopiesOfficialOpinionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.copiesOfficialForm = this.fb.group({
      numberOfDicta: [null, Validators.required],
      typeDictamination: ['', Validators.required],
      copyDestinationNumber: [null],
      recipientCopy: [''],
      namePersonExt: [''],
      personExtInt: ['', Validators.required],
    });

    if (this.copiesOfficial != null) {
      this.edit = true;
      this.copiesOfficialForm.patchValue(this.copiesOfficial);
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

    this.copiesOfficialService.create(this.copiesOfficialForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;

    this.copiesOfficialService.update(this.copiesOfficialForm.value).subscribe({
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
