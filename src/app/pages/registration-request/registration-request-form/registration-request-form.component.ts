import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentsListComponent } from '../../request/programming-request-components/execute-reception/documents-list/documents-list.component';
import { AssociateFileComponent } from '../associate-file/associate-file.component';
import {
  EXPEDIENT_DOC_GEN_COLUMNS,
  EXPEDIENT_DOC_REQ_COLUMNS,
  EXPEDIENT_DOC_EST_COLUMNS,
  EXPEDIENT_DOC_SEA_COLUMNS,
} from './expedient-doc-columns';

@Component({
  selector: 'app-registration-request-form',
  templateUrl: './registration-request-form.component.html',
  styles: [],
})
export class RegistrationRequestFormComponent implements OnInit {
  settingsDocGen = { ...TABLE_SETTINGS, actions: false };
  settingsDocReq = { ...TABLE_SETTINGS, actions: false };
  settingsDocEst = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
  settingsDocSea = { ...TABLE_SETTINGS };
  searchFileForm: FormGroup = new FormGroup({});
  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  transferents = new DefaultSelect();
  stations = new DefaultSelect();
  authorities = new DefaultSelect();
  goodTypes = new DefaultSelect();
  typeDocuments = new DefaultSelect();

  showForm: boolean = false;
  documentsGenData: any[] = [];
  documentsReqData: any[] = [];
  documentsEstData: any[] = [];
  documentsSeaData: any[] = [];

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    this.settingsDocGen.columns = EXPEDIENT_DOC_GEN_COLUMNS;
    this.settingsDocReq.columns = EXPEDIENT_DOC_REQ_COLUMNS;
    this.settingsDocEst.columns = EXPEDIENT_DOC_EST_COLUMNS;
    this.settingsDocSea.columns = EXPEDIENT_DOC_SEA_COLUMNS;

    this.settingsDocSea.edit.editButtonContent =
      '<i class="fa fa-eye text-primary mx-2"></i>';

    this.settingsDocSea.actions.delete = true;

    this.settingsDocSea.delete.deleteButtonContent =
      '<i class="fa fa-file text-success mx-2"></i>';
    this.documentsEstData = [
      {
        numberGestion: 234232,
        uniqueKey: 2342342,
        numExpTransferent: 'EXP-34534',
        numberRequest: 3423432,
        descriptionTransferent: 'Descripción transferente',
        message: 'Mensaje',
        conditionPhysical: 'Estado fisico',
        transerUnit: 'Unidad',
        quantityTransferent: 'Cantidad transferente',
        destinityLigie: 'Prueba',
        fraction: 'Fracción',
      },
    ];

    this.documentsSeaData = [
      {
        noDocument: '4353533',
        noExpedient: '3455333',
        noRequest: '34534534',
        titleDocument: 'Documento',
        typeDocument: 'Tipo de documento',
        author: 'Autor',
        createDate: '24/10/2022',
      },
    ];
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.searchFileForm = this.fb.group({
      requestNumber: [null],
      expedientNumber: [null],
      regionalDelegation: [null],
      goodType: [null],
      gestionNumber: [null],
      descriptionGoodTransferent: [null],
      state: [null],
      transferent: [null],
      station: [null],
      authority: [null],
      indicated: [null],
      transferFile: [null],
      inquiryPreliminary: [null],
      casePenal: [null],
      protectionNumber: [null],
      typeTransference: [null],
      domainExtinction: [null],
      judgmentType: [null],
      judment: [null],
      text: [null],
      typeDocument: [null],
      titleDocument: [null],
      siabNumber: [null],
      senderCharge: [null],
      author: [null],
      responsible: [null],
      documentNumber: [null],
      contributor: [null],
      officeNumber: [null],
      comments: [null],
      goodNumber: [null],
      sender: [null],
    });
  }

  newExpedient() {
    const newExpedient = this.modalService.show(AssociateFileComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  getRegionalDelegationSelect(regionalDelegation: ListParams) {}

  getStateSelect(state: ListParams) {}

  getTransferentSelect(transferent: ListParams) {}

  getStationSelect(station: ListParams) {}

  getAuthoritySelect(authority: ListParams) {}

  getGoodTypeSelect(goodType: ListParams) {}

  getTypeDocumentSelect(typeDocument: ListParams) {}

  showDocsEst() {
    const showDoctsEst = this.modalService.show(DocumentsListComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}
