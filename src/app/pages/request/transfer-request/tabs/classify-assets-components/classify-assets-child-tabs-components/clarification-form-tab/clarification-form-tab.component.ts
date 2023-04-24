import { Component, EventEmitter, OnInit } from '@angular/core';
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
import { IPostGoodResDev } from 'src/app/core/models/ms-rejectedgood/get-good-goodresdev';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ClarificationService } from 'src/app/core/services/catalogs/clarification.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GetGoodResVeService } from 'src/app/core/services/ms-rejected-good/goods-res-dev.service';
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
  public event: EventEmitter<any> = new EventEmitter();
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
  request: any;
  haveGoodResDevRegister: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private readonly clarificationService: ClarificationService,
    private readonly rejectedGoodService: RejectedGoodService,
    private readonly authService: AuthService,
    private readonly goodService: GoodService,
    private readonly goodResDevService: GetGoodResVeService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('good', this.goodTransfer);
    this.getGoodResDev(Number(this.goodTransfer.id));
    this.initForm();
    this.clarificationForm.get('clarificationType').valueChanges.subscribe({
      next: val => {
        let type = this.clarificationTypes.find(type => type.value == val);
        let params = new BehaviorSubject<FilterParams>(new FilterParams());
        params.value.addFilter('type', type.id);
        //params.value.addFilter('type', Number(val));
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
      let params = new BehaviorSubject<FilterParams>(new FilterParams());
      params.value.limit = 100;
      const filter = params.getValue().getParams();
      this.getClarification(filter);

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

  async confirm() {
    this.loader.load = true;
    const user: any = this.authService.decodeToken();
    let clarification = this.clarificationForm.getRawValue();
    clarification.creationUser = user.username;
    clarification.rejectionDate = new Date().toISOString();
    clarification['answered'] = 'NUEVA';
    clarification.goodId = this.goodTransfer.id;
    //clarification.clarificationId = this.clarificationId;

    if (this.edit === true) {
      this.update(clarification);
    } else {
      await this.save(clarification);
      if (this.haveGoodResDevRegister === false) {
        await this.createGoodResDev();
        await this.updateGood();
      }
    }
  }

  private save(clarification: ClarificationGoodRejectNotification) {
    return new Promise((resolve, reject) => {
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
          resolve(true);
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
            `Se actualizó la aclaración correctamente`
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

  createGoodResDev() {
    return new Promise((resolve, reject) => {
      let good = this.goodTransfer;
      let goodResDev: IPostGoodResDev = {};
      goodResDev.goodId = Number(good.id);
      goodResDev.unitExtent = good.ligieUnit;
      goodResDev.statePhysical = good.physicalStatus.toString();
      goodResDev.stateConservation = good.stateConservation;
      goodResDev.descriptionGood = good.descriptionGoodSae
        ? good.descriptionGoodSae
        : good.goodDescription;
      goodResDev.statusProcess = '9'; //SOLICITAR_ACLARACION
      goodResDev.applicationId = good.requestId;
      goodResDev.amount = good.quantity;
      goodResDev.fractionId = good.fractionId.toString();
      goodResDev.delegationRegionalId = Number(
        this.request.regionalDelegationId
      );
      goodResDev.transfereeId = this.request.transferenceId;
      goodResDev.stationId = this.request.stationId;
      goodResDev.authorityId = this.request.authorityId;
      goodResDev.cveState = this.request.keyStateOfRepublic;
      goodResDev.meetsArticle28 = 'N';
      goodResDev.inventoryNumber = null;
      goodResDev.uniqueKey = null;
      goodResDev.destination = null;
      goodResDev.proceedingsType = null;
      goodResDev.origin = null;

      this.goodResDevService.create(goodResDev).subscribe({
        next: resp => {
          console.log('good-res-dev', resp);
          resolve(true);
          //this.updateGood(resp.goodresdevId)
        },
        error: error => {
          console.log('good-res-dec no creado', error);
          reject(true);
        },
      });
    });
  }

  getGoodResDev(goodId: number) {
    if (goodId) {
      let params = new FilterParams();
      params.addFilter('goodId', goodId);
      let filter = params.getParams();
      this.goodResDevService.getAllGoodResDev(filter).subscribe({
        next: (resp: any) => {
          if (resp.data.length > 0) {
            this.haveGoodResDevRegister = true;
          }
        },
        error: error => {},
      });
    }
  }

  updateGood() {
    return new Promise((resolve, reject) => {
      let good = this.goodTransfer;
      let body: any = {};
      body.id = good.id;
      body.goodId = good.goodId;
      //body.goodResdevId = Number(id);
      body.processStatus = 'SOLICITAR_ACLARACION';
      body.goodStatus = 'SOLICITUD DE ACLARACION';
      this.goodService.update(body).subscribe({
        next: resp => {
          console.log('good updated', resp);
          resolve(true);
        },
        error: error => {
          console.log('good updated', error);
          reject(true);
          this.onLoadToast(
            'error',
            'Erro Interno',
            'No se actualizo el campo bien-res-dev en bien'
          );
        },
      });
    });
  }

  close(): void {
    this.modalRef.hide();
  }
}
