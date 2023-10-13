import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-annex-k-form',
  templateUrl: './annex-k-form.component.html',
  styleUrls: ['./annex-k-form.component.scss'],
})
export class AnnexKFormComponent extends BasePage implements OnInit {
  detailForm: ModelForm<any>;
  participantDataForm: ModelForm<any>;
  detailAnnexForm: ModelForm<any>;
  typeAnnex: string = '';
  idSample: number = 0;
  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeAnnex);
    this.initDetailForm();
    this.initParicipantForm();
    this.initAnnexDetailForm();
  }

  initDetailForm(): void {
    this.detailForm = this.fb.group({
      saeResponsibleK: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      positionSaeK: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeSign: [null],
    });
  }

  initParicipantForm(): void {
    this.participantDataForm = this.fb.group({
      competitorOne: [null, [Validators.pattern(STRING_PATTERN)]],
      positionCompetitorOne: [null, [Validators.pattern(STRING_PATTERN)]],
      competitorTwo: [null, [Validators.pattern(STRING_PATTERN)]],
      positionCompetitorTwo: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  initAnnexDetailForm(): void {
    this.detailAnnexForm = this.fb.group({
      managerNameAlm: [null, [Validators.pattern(STRING_PATTERN)]],
      relevantFacts: [null, [Validators.pattern(STRING_PATTERN)]],
      agreements: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  displayDetailAnnex(): boolean {
    if (
      this.typeAnnex === 'annexK-restitution-of-assets' ||
      this.typeAnnex === 'annex-k-review-results'
    ) {
      return false;
    } else {
      return true;
    }
  }

  signAnnex(): void {
    const infoSample: ISample = {
      sampleId: this.idSample,
      saeResponsibleK: this.detailForm.get('saeResponsibleK').value,
      positionSaeK: this.detailForm.get('positionSaeK').value,
      competitorOne: this.detailForm.get('competitorOne').value,
      positionCompetitorOne: this.detailForm.get('positionCompetitorOne').value,
      competitorTwo: this.detailForm.get('competitorTwo').value,
      positionCompetitorTwo: this.detailForm.get('positionCompetitorTwo').value,
      managerNameAlm: this.detailForm.get('managerNameAlm').value,
      relevantFacts: this.detailForm.get('relevantFacts').value,
      agreements: this.detailForm.get('agreements').value,
    };

    /* if (
      this.typeAnnex === 'annexK-restitution-of-assets' ||
      this.typeAnnex === 'annex-k-review-results'
    ) {
      this.openModal(PrintReportRestitutionModalComponent, '', this.typeAnnex);
    } else {
      this.openModal(PrintReportModalComponent, '', this.typeAnnex);
    }
    this.close(); */
  }

  close(): void {
    this.bsModalRef.hide();
  }

  openModal(component: any, data?: any, typeReport?: String): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeReport: typeReport,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);

    //this.bsModalRef.content.event.subscribe((res: any) => {
    //cargarlos en el formulario
    //console.log(res);
    //this.assetsForm.controls['address'].get('longitud').enable();
    //this.requestForm.get('receiUser').patchValue(res.user);
    //});
  }
}
