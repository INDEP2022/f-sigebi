import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICopiesOfficialOpinion } from 'src/app/core/models/ms-dictation/copies-official-opinion.model';
import { CopiesOfficialOpinionService } from 'src/app/core/services/catalogs/copies-official-opinion.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

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

  selectDictNumber = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private copiesOfficialService: CopiesOfficialOpinionService,
    private dictationService: DictationService
  ) {
    super();
  }

  getDictNumbers(params: ListParams) {
    this.dictationService.getAll(params).subscribe({
      next: data =>
        (this.selectDictNumber = new DefaultSelect(data.data, data.count)),
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getDictNumbers(new ListParams());
  }

  private prepareForm() {
    this.copiesOfficialForm = this.fb.group({
      numberOfDicta: [null, Validators.required],
      typeDictamination: ['', Validators.required],
      copyDestinationNumber: [null],
      recipientCopy: [''],
      namePersonExt: [''],
      personExtInt: ['', Validators.required],
      id: [null],
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
    console.log(this.copiesOfficialForm.value);
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
