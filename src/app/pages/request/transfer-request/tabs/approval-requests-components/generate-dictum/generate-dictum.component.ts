import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModelForm } from '../../../../../../core/interfaces/model-form';
import { PrintReportModalComponent } from '../../notify-clarifications-impropriety-tabs-component/print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-generate-dictum',
  templateUrl: './generate-dictum.component.html',
  styles: [],
})
export class GenerateDictumComponent extends BasePage implements OnInit {
  idDoc: any; //ID de solicitud, viene desde el componente principal
  idTypeDoc: any;
  response: IRequest;

  title: string = 'Generar Dictamen';
  edit: boolean = false;

  pdfurl: string = '';
  public event: EventEmitter<any> = new EventEmitter();
  dictumForm: ModelForm<IRequest>;

  constructor(
    private bsModelRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private requestService: RequestService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('Data del formulario: ', this.response);

    this.initForm();
  }

  initForm(): void {
    this.dictumForm = this.fb.group({
      id: [null],
      idRecord: [null],
      applicationDate: [null],
      receptionDate: [null],
      nameOfOwner: [null],
      holderCharge: [null],
      phoneOfOwner: [null],
      emailOfOwner: [null],
      transferenceId: [null],
      transferent: [null],
      stationId: [null],
      emisora: [null],
      authorityId: [null],
      regionalDelegationId: [null],
      regionalDelegation: [null],
      sender: [null],
      observations: [null],
      targetUser: [null],
      urgentPriority: [null],
      indicatedTaxpayer: [null],
      transferenceFile: [null],
      transferEntNotes: [null],
      idAddress: [null],
      originInfo: [null],
      circumstantialRecord: [null],
      previousInquiry: [null],
      lawsuit: [null],
      protectNumber: [null],
      tocaPenal: [null],
      paperNumber: [null],
      paperDate: [null],
      indicated: [null],
      publicMinistry: [null],
      court: [null],
      crime: [null],
      receiptRoute: [null],
      destinationManagement: [null],
      affair: [null],
      satDeterminant: [null],
      satDirectory: [null],
      authority: [null],
      satZoneCoordinator: [null],
      userCreated: [null],
      creationDate: [null],
      userModification: [null],
      modificationDate: [null],
      typeOfTransfer: [null],
      domainExtinction: [null],
      version: [null],
      targetUserType: [null],
      trialType: [null],
      typeRecord: [null],
      requestStatus: [null],
      fileLeagueType: [null],
      fileLeagueDate: [null],
      rejectionComment: [null],
      authorityOrdering: [null],
      instanceBpm: [null],
      trial: [null],
      compensationType: [null],
      stateRequestId: [null],
      searchSiab: [null],
      priorityDate: [null],
      ofRejectionsNumber: [null],
      rulingDocumentId: [null],
      nameRecipientRuling: [null],
      postRecipientRuling: [null],
      paragraphOneRuling: [null],
      paragraphTwoRuling: [null],
      nameSignatoryRuling: [null],
      postSignatoryRuling: [null],
      ccpRuling: [null],
      rulingCreatorName: [null],
      rulingSheetNumber: [null],
      registrationCoordinatorSae: [null],
      emailNotification: [null],
      keyStateOfRepublic: [null],
      instanceBpel: [null],
      verificationDateCump: [null],
      recordTmpId: [null],
      coordregsae_ktl: [null],
    });
    if (this.response != null) {
      this.dictumForm.patchValue(this.response);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.requestService.create(this.dictumForm.value).subscribe({
      next: data => (this.handleSuccess(), this.signDictum()),
      error: error => (this.loading = false),
    });
  }

  update() {
    const idDoc = this.idDoc;
    this.requestService.update(idDoc, this.dictumForm.value).subscribe({
      next: data => (this.handleSuccess(), this.signDictum()),
      error: error => (this.loading = false),
    });
  }

  signDictum(): void {
    const idDoc = this.idDoc;
    const typeAnnex = 'approval-request';
    const idTypeDoc = this.idTypeDoc;

    let config: ModalOptions = {
      initialState: {
        idDoc,
        idTypeDoc,
        typeAnnex,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PrintReportModalComponent, config);
    //this.modalService.show(PrintReportModalComponent,  config);
  }

  close(): void {
    this.bsModelRef.hide();
  }

  openModal(component: any, data?: any, typeAnnex?: String): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);

    /*this.bsModelRef.content.event.subscribe((res: any) => {
      // cargarlos en el formulario
      console.log(res);
    });*/
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
