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
  //se pasa las aclaraciones del padres
  docClarification: any;
  //se pasa todo el bien
  goodTransfer: IGood;
  //clarificationId: number = 0; ya no
  //idGood: number = 0;
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
        //let type = this.clarificationTypes.find(type => type.value == val);
        let params = new BehaviorSubject<FilterParams>(new FilterParams());
        //params.value.addFilter('type', type.id);
        params.value.addFilter('type', Number(val));
        const filter = params.getValue().getParams();
        this.getClarification(filter);
      },
    });
    //this.getClarification(new ListParams());
  }

  initForm(): void {
    this.clarificationForm = this.fb.group({
      rejectNotificationId: [null], //id
      goodId: [null, [Validators.required]],
      clarificationType: [null, [Validators.required]],
      clarificationId: [null, [Validators.required]],
      reason: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(255)],
      ],
      creationUser: [null],
      rejectionDate: [null],
    });
    if (this.goodTransfer) {
      this.clarificationForm.get('goodId').patchValue(this.goodTransfer.id);
    }
    if (this.docClarification != undefined) {
      this.edit = true;
      this.getClarification(new ListParams());

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

  confirm(): void {
    this.loader.load = true;
    const user: any = this.authService.decodeToken();
    let clarification = this.clarificationForm.getRawValue();
    clarification.creationUser = user.username;
    clarification.rejectionDate = new Date().toISOString();
    clarification['answered'] = 'NUEVA ACLARACIÓN';
    clarification.goodId = this.goodTransfer.id;
    //clarification.clarificationId = this.clarificationId;
    if (this.edit === true) {
      this.update(clarification);
    } else {
      this.save(clarification);
    }
  }

  private save(clarification: ClarificationGoodRejectNotification) {
    this.rejectedGoodService.create(clarification).subscribe({
      next: val => {
        this.loader.load = false;
        this.onLoadToast(
          'success',
          `Aclaración guardada`,
          `Se guardó la aclaración correctamente`
        );
      },
      complete: () => {
        this.modalRef.hide();
        this.modalRef.content.callback(true);
      },
      error: error => {
        this.loader.load = false;
        console.log(error);
        this.onLoadToast(
          'error',
          'Error',
          `Error al guardar la aclaracion ${error.error.message}`
        );
      },
    });
  }

  private update(clarification: ClarificationGoodRejectNotification) {
    this.rejectedGoodService
      .update(clarification.rejectNotificationId, clarification)
      .subscribe({
        next: val => {
          this.loader.load = false;
          this.onLoadToast(
            'success',
            `Aclaración actualizada`,
            `Se actualizo la aclaración correctamente`
          );
        },
        complete: () => {
          this.modalRef.hide();
          this.modalRef.content.callback(true);
        },
        error: error => {
          this.loader.load = false;
          console.log(error);
          this.onLoadToast(
            'error',
            'Error',
            `Error al guardar la aclaracion ${error.error.message}`
          );
        },
      });
  }
  close(): void {
    this.modalRef.hide();
  }
}
