import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IDictationXGood1 } from 'src/app/core/models/ms-dictation/dictation-x-good1.model';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-goods-dialog',
  templateUrl: './goods-dialog.component.html',
  styles: [],
})
export class GoodsDialogComponent extends BasePage implements OnInit {
  dictationXGoodForm: ModelForm<IDictationXGood1>;
  dictationXGood: IDictationXGood1;

  title: string = 'Bien';
  edit: boolean = false;
  selectDictNumber = new DefaultSelect();
  selectExpedient = new DefaultSelect();
  selectGood = new DefaultSelect();

  dictations: IDictation[] = [];
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private dictationXGoodService: DictationXGood1Service,
    private dictationService: DictationService,
    private expedientService: ExpedientService,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getDictNumbers(new ListParams());
    this.getExpedients(new ListParams());
    this.getGoods(new ListParams());
  }

  getDictNumbers(params: ListParams) {
    this.dictationService.getAll(params).subscribe({
      next: data =>
        (this.selectDictNumber = new DefaultSelect(data.data, data.count)),
    });
  }

  getGoods(params: ListParams) {
    this.goodService.getAll(params).subscribe({
      next: data =>
        (this.selectGood = new DefaultSelect(data.data, data.count)),
    });
  }

  getExpedients(params: ListParams) {
    this.expedientService.getAll(params).subscribe({
      next: data =>
        (this.selectExpedient = new DefaultSelect(data.data, data.count)),
    });
  }

  private prepareForm() {
    this.dictationXGoodForm = this.fb.group({
      amountDict: [null],
      descriptionDict: ['', Validators.required],
      id: [null, Validators.required],
      ofDictNumber: [null, Validators.required],
      proceedingsNumber: [null, Validators.required],
      typeDict: ['', Validators.required],
    });

    if (this.dictationXGood != null) {
      this.edit = true;
      this.dictationXGoodForm.patchValue(this.dictationXGood);
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
    this.dictationXGoodService.create(this.dictationXGoodForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.dictationXGoodService.update(this.dictationXGoodForm.value).subscribe({
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
