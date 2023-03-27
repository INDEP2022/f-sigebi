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
import { IClarification } from 'src/app/core/models/catalogs/clarification.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
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
  clarificationId: number = 0;
  idGood: number = 0;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private readonly clarificationService: ClarificationService,
    private readonly rejectedGoodService: RejectedGoodService,
    private readonly authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
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
    this.getClarification(new ListParams());
  }

  initForm(): void {
    this.clarificationForm = this.fb.group({
      rejectNotificationId: [null], //id
      goodId: [null, [Validators.required]],
      clarificationType: [null, [Validators.required]],
      clarificationId: [null, [Validators.required]],
      reason: [null, [Validators.pattern(STRING_PATTERN)]],
      creationUser: [null],
      rejectionDate: [null],
    });
    if (this.goodTransfer) {
      this.clarificationForm.get('goodId').patchValue(this.goodTransfer.id);
    }
    if (this.docClarification != undefined) {
      this.edit = true;

      //bloquear tipo de claracion cuando se edite
      this.clarificationForm.patchValue({
        ...this.clarificationForm,
        rejectNotificationId: this.docClarification.rejectNotificationId,
        clarificationType: this.docClarification.clarificationType,
        clarificationId: this.docClarification.clarificationId,
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

  clasificationSelect(clarification: IClarification) {
    this.clarificationId = clarification.id;
  }

  confirm(): void {
    const user: any = this.authService.decodeToken();
    let clarification = this.clarificationForm.getRawValue();
    clarification.creationUser = user.username;
    clarification.rejectionDate = new Date().toISOString();
    clarification['answered'] = 'NUEVA ACLARACION';
    clarification.goodId = this.idGood;
    clarification.clarificationId = this.clarificationId;
    if (this.edit === true) {
      this.update(clarification);
    } else {
      this.save(clarification);
    }
  }
  private save(clarification: ClarificationGoodRejectNotification) {
    console.log('clarification', clarification);
    this.rejectedGoodService.create(clarification).subscribe({
      next: val => {
        this.onLoadToast(
          'success',
          `Aclaracion guardada`,
          `Se guardo la aclaracion correctamente`
        );
      },
      complete: () => {
        this.modalRef.hide();
        this.modalRef.content.callback(true);
      },
    });
  }

  private update(clarification: ClarificationGoodRejectNotification) {
    console.log('se manda', clarification);
    this.rejectedGoodService
      .update(clarification.rejectNotificationId, clarification)
      .subscribe({
        next: val => {
          this.onLoadToast(
            'success',
            `Aclaracion actualizada`,
            `Se actualizo la aclaracion correctamente`
          );
        },
        complete: () => {
          this.modalRef.hide();
          this.modalRef.content.callback(true);
        },
      });
  }
  close(): void {
    this.modalRef.hide();
  }
}
