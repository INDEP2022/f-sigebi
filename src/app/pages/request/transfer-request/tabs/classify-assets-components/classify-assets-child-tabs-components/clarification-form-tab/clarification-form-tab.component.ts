import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ClarificationTypes } from 'src/app/common/constants/clarification-type';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/good/good.model';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { ClarificationService } from 'src/app/core/services/catalogs/clarification.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-clarification-form-tab',
  templateUrl: './clarification-form-tab.component.html',
  styles: [],
})
export class ClarificationFormTabComponent extends BasePage implements OnInit {
  clarificationForm: ModelForm<ClarificationGoodRejectNotification>;
  title: string = 'Aclaración';
  edit: boolean = false;
  // selectTypeClarification = new DefaultSelect<any>();
  clarificationTypes = ClarificationTypes;
  selectClarification = new DefaultSelect<any>();
  docClarification: any;
  goodTransfer: IGood;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private readonly clarificationService: ClarificationService,
    private readonly rejectedGoodService: RejectedGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    //si tipo de aclaracion es Aclaracion se muestra este input
    // this.edit = true;
    //verificar si se puede seleccionar muchas aclaraciones para editar y si es a si, que pasa
    // si son diferentes tipos de aplaracioens
    console.log(this.goodTransfer);

    this.initForm();
    this.clarificationForm.get('clarificationType').valueChanges.subscribe({
      next: val => {
        let type = this.clarificationTypes.find(type => type.value == val);
        let params = new BehaviorSubject<FilterParams>(new FilterParams());
        params.value.addFilter('type', type.id);
        const filter = params.getValue().getParams();
        this.getClarification(filter);
      },
    });
    console.log(this.docClarification);
  }

  initForm(): void {
    this.clarificationForm = this.fb.group({
      goodId: [null, [Validators.required]],
      clarificationType: [null, [Validators.required]],
      clarification: [null, [Validators.required]],
      reason: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    if (this.goodTransfer) {
      this.clarificationForm.get('goodId').patchValue(this.goodTransfer.id);
    }
    if (this.docClarification != undefined) {
      this.edit = true;
      //bloquear tipo de claracion cuando se edite

      this.clarificationForm.patchValue({
        ...this.clarificationForm,
        clarificationType: this.docClarification.clarificationType,
        reason: this.docClarification.reason,
      });
      this.clarificationForm.controls['clarificationType'].disable();
      this.clarificationForm.updateValueAndValidity();
    }
  }

  getTypeClarification(event: any): void {}

  getClarification(params: ListParams | string): void {
    this.clarificationService.getAll(params).subscribe({
      next: data => {
        this.selectClarification = new DefaultSelect(data.data, data.count);
      },
    });
  }

  confirm(): void {
    console.log(JSON.stringify(this.clarificationForm.getRawValue()));
    // this.rejectedGoodService
    //   .create(this.clarificationForm.getRawValue())
    //   .subscribe({
    //     next: val => {
    //       console.log(val);
    //     },
    //   });
  }

  close(): void {
    this.modalRef.hide();
  }
}
