import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  requestData: IRequest;
  response: IRequest;

  title: string = 'Reporte Dictamen Procedencia';
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
    this.initForm();
  }

  initForm(): void {
    this.dictumForm = this.fb.group({
      id: [null],
      /*recordId: [null],
      applicationDate: [null],
      receptionDate: [null],
      nameOfOwner: [null],
      holderCharge: [null],
      phoneOfOwner: [null],
      emailOfOwner: [null],
      transferenceId: [null],
      stationId: [null],
      authorityId: [null],
      regionalDelegationId: [null],
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
      rejectionNumber: [null],
      rulingDocumentId: [null],
      reportSheet: [null],*/
      nameRecipientRuling: [null, [Validators.maxLength(100)]],
      postRecipientRuling: [null, [Validators.maxLength(100)]],
      paragraphOneRuling: [null, [Validators.maxLength(4000)]],
      paragraphTwoRuling: [null, [Validators.maxLength(4000)]],
      nameSignatoryRuling: [null],
      postSignatoryRuling: [null],
      ccpRuling: [null, [Validators.maxLength(200)]],
      /*rulingCreatorName: [null],
      rulingSheetNumber: [null],
      registrationCoordinatorSae: [null],
      emailNotification: [null],
      keyStateOfRepublic: [null],
      instanceBpel: [null],
      verificationDateCump: [null],
      recordTmpId: [null],
      coordregsae_ktl: [null],*/
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
      next: data => {
        this.handleSuccess(), (this.requestData = data), this.signDictum();
      },
      error: error => (this.loading = false),
    });
  }

  signDictum(): void {
    const requestInfo = this.requestData;
    const idDoc = this.idDoc;
    const typeAnnex = 'approval-request';
    const idTypeDoc = this.idTypeDoc;
    const nameTypeDoc = 'DictamenProcendecia';

    let config: ModalOptions = {
      initialState: {
        idDoc,
        idTypeDoc,
        typeAnnex,
        requestInfo,
        nameTypeDoc,
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
    const message: string = this.edit ? 'Generado' : 'Generado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
