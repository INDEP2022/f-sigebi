import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { SamplingOrderService } from 'src/app/core/services/ms-sampling-order/sampling-order-service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ElectronicSignatureListComponent } from '../../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowProgrammingComponent } from '../../../shared-request/show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from '../../../shared-request/show-signature-programming/show-signature-programming.component';

@Component({
  selector: 'app-annex-w-form',
  templateUrl: './annex-w-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class AnnexWFormComponent extends BasePage implements OnInit {
  showInformationW: boolean = true;
  showSigner: boolean = true;
  form: FormGroup = new FormGroup({});
  idExhibitW: number = 0;
  orderServiceId: number = 0;
  anexoW: any = {};
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private orderService: SamplingOrderService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    this.orderService.getAnnexesW(this.idExhibitW).subscribe(response => {
      if (response) {
        this.anexoW = response;
        this.setInformationW();
      }
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      presentationDate: [null, [Validators.required]],
      presentationPlace: [null, [Validators.pattern(STRING_PATTERN)]],
      testerName: [null, [Validators.pattern(STRING_PATTERN)]],
      renderingProcess: [null, [Validators.pattern(STRING_PATTERN)]],
      descriptionService: [null, [Validators.pattern(STRING_PATTERN)]],
      regionalRepresent: [null, [Validators.pattern(STRING_PATTERN)]],
      dateRepresentRep: [null, [Validators.required]],
      dateNotification: [null, [Validators.required]],
      dateElaboration: [null, [Validators.required]],
      descriptionCumpliment: [null, [Validators.pattern(STRING_PATTERN)]],
      nameSignerSae: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      chargeSae: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  setInformationW() {
    this.form.patchValue({
      presentationDate: moment(this.anexoW.dateBenefit).format('DD/MM/YYYY'),
      presentationPlace: this.anexoW.placeBenefit,
      testerName: this.anexoW.nameSupplier,
      renderingProcess: this.anexoW.processBenefit,
      descriptionService: this.anexoW.descriptionServices,
      regionalRepresent: this.anexoW.representativeRegional,
      dateRepresentRep: moment(this.anexoW.dateCommitmentrep).format(
        'DD/MM/YYYY'
      ),
      dateNotification: moment(this.anexoW.dateNotification).format(
        'DD/MM/YYYY'
      ),
      dateElaboration: moment(this.anexoW.dateElaboration).format('DD/MM/YYYY'),
      descriptionCumpliment: this.anexoW.descriptionBreach,
      nameSignerSae: this.anexoW.nameSignatorysae,
      chargeSae: this.anexoW.postsae,
    });
  }

  confirm() {
    if (!this.form.valid) {
      return;
    }

    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea crear el anexo W?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        //this.onLoadToast('success', 'Anexo W creado correctamente', '');
        let request: any = {
          idOrderService: this.orderServiceId,
          idExhibitW: this.idExhibitW,
          placeBenefit: this.form.get('presentationPlace')?.value,
          nameSupplier: this.form.get('testerName')?.value,
          processBenefit: this.form.get('renderingProcess')?.value,
          representativeRegional: this.form.get('regionalRepresent')?.value,
          descriptionServices: this.form.get('descriptionService')?.value,
          descriptionBreach: this.form.get('descriptionCumpliment')?.value,
          dateBenefit: this.form.get('presentationDate')?.value,
          dateCommitmentrep: this.form.get('dateRepresentRep')?.value,
          dateNotification: this.form.get('dateNotification')?.value,
          dateElaboration: this.form.get('dateElaboration')?.value,
          nameSignatorysae: this.form.get('nameSignerSae')?.value,
          postsae: this.form.get('chargeSae')?.value,
        };

        if (request.dateBenefit && moment(request.dateBenefit).isValid()) {
          request.dateBenefit = moment(request.dateBenefit).format(
            'YYYY-MM-DD'
          );
        }

        if (
          request.dateCommitmentrep &&
          moment(request.dateCommitmentrep).isValid()
        ) {
          request.dateCommitmentrep = moment(request.dateCommitmentrep).format(
            'YYYY-MM-DD'
          );
        }

        if (
          request.dateNotification &&
          moment(request.dateNotification).isValid()
        ) {
          request.dateNotification = moment(request.dateNotification).format(
            'YYYY-MM-DD'
          );
        }

        if (
          request.dateElaboration &&
          moment(request.dateElaboration).isValid()
        ) {
          request.dateElaboration = moment(request.dateElaboration).format(
            'YYYY-MM-DD'
          );
        }

        if (request.dateBenefit && request.dateBenefit.includes('/')) {
          request.dateBenefit = request.dateBenefit
            .split('/')
            .reverse()
            .join('-');
        }

        if (
          request.dateCommitmentrep &&
          request.dateCommitmentrep.includes('/')
        ) {
          request.dateCommitmentrep = request.dateCommitmentrep
            .split('/')
            .reverse()
            .join('-');
        }

        if (
          request.dateNotification &&
          request.dateNotification.includes('/')
        ) {
          request.dateNotification = request.dateNotification
            .split('/')
            .reverse()
            .join('-');
        }

        if (request.dateElaboration && request.dateElaboration.includes('/')) {
          request.dateElaboration = request.dateElaboration
            .split('/')
            .reverse()
            .join('-');
        }

        this.orderService
          .saveAnnexesW(this.idExhibitW > 0, request)
          .subscribe(response => {
            if (response.idExhibitW) {
              request.idExhibitW = response.idExhibitW;
            }

            request.next = true;
            this.modalRef.content.callback(request);
            this.close();
          });

        //this.ShowReport();
      }
    });
  }

  ShowReport() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          this.electronicSignture();
        }
      },
    };

    const showReport = this.modalService.show(ShowProgrammingComponent, config);
  }

  electronicSignture() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          this.showSignProg();
        }
      },
    };

    const showReport = this.modalService.show(
      ElectronicSignatureListComponent,
      config
    );
  }

  showSignProg() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const showReport = this.modalService.show(
      ShowSignatureProgrammingComponent,
      config
    );
  }

  close() {
    this.modalRef.hide();
  }
}
