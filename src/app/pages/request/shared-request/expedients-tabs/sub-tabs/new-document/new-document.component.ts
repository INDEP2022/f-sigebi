import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.scss'],
})
export class NewDocumentComponent extends BasePage implements OnInit {
  title: string = 'Información General';
  newDocForm: ModelForm<IRequest>;
  selectTypeDoc = new DefaultSelect<IRequest>();
  request: any;
  idrequest: number = 0;
  idExpedient: number = 0;
  idGood: number = 0;
  typeDoc: string = '';
  selectedFile: File;
  toggleSearch: boolean = true;
  regDelName: string = '';
  stateName: string = '';
  nameTransferent: string = '';
  idTransferent: number = 0;
  regionalDelId: number = 0;
  stateId: number = 0;
  userLogName: string = '';
  date: string = '';
  paramsDocTypes = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    public fb: FormBuilder,
    public modalRef: BsModalRef,
    private requestService: RequestService,
    private regionalDelService: RegionalDelegationService,
    private stateOfrepublic: StateOfRepublicService,
    private transferentService: TransferenteService,
    private wContentService: WContentService,
    private programmingService: ProgrammingRequestService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.getInfoUserLog();
    this.initForm();
    this.getInfoRequest();
    this.typedocuments();
    this.obtainDate();
    //console.log('NEW DOC TIPO');
    //console.log(this.typeDoc);
  }

  obtainDate() {
    const date = new Date();
    this.date = this.datePipe.transform(date, 'yyyy_MM_dd');
  }

  getInfoUserLog() {
    this.programmingService.getUserInfo().subscribe((data: any) => {
      this.userLogName = data.preferred_username;
      console.log('usuario logeado', this.userLogName);
    });
  }

  initForm(): void {
    this.newDocForm = this.fb.group({
      id: [null],
      docType: [null],
      docFile: [null],
      docTit: [null, [Validators.pattern(STRING_PATTERN)]],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      noOfi: [null],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      returnOpinionFolio: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getInfoRequest() {
    this.requestService.getById(this.idrequest).subscribe(data => {
      console.log('tipo documento', data);
      this.idTransferent = data.transferenceId;
      this.regionalDelId = data.regionalDelegationId;
      this.stateId = data.keyStateOfRepublic;

      this.request = data;
      this.getRegionalDelegation(data.regionalDelegationId);
      this.getstate(data.keyStateOfRepublic);
      this.getTransferent(data.transferenceId);
    });
  }

  typedocuments() {
    this.wContentService
      .getDocumentTypes(this.paramsDocTypes.getValue())
      .subscribe(data => {
        console.log('tp', data);
        this.selectTypeDoc = new DefaultSelect(data.data, data.count);
      });
  }

  getRegionalDelegation(id: number) {
    this.regionalDelService.getById(id).subscribe(data => {
      this.regDelName = data.description;
    });
  }

  getstate(id: number) {
    this.stateOfrepublic.getById(id).subscribe(data => {
      this.stateName = data.descCondition;
    });
  }

  getTransferent(id: number) {
    this.transferentService.getById(id).subscribe(data => {
      this.nameTransferent = data.nameTransferent;
    });
  }

  getTypeDoc(event: any) {}

  selectFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  confirm() {
    this.loading = true;
    if (this.typeDoc == 'good') {
      const formData = {
        dInDate: new Date(),
        dDocAuthor: this.userLogName,
        dSecurityGroup: 'Public',
        xidExpediente: this.idExpedient,
        ddocCreator: this.userLogName,
        xidcProfile: 'NSBDB_Gral',
        xidSolicitud: this.idrequest,
        xidTransferente: this.idTransferent,
        xdelegacionRegional: this.regionalDelId,
        xnivelRegistroNSBDB: 'bien',
        xidBien: this.idGood,
        xestado: this.stateId,
        xtipoDocumento: this.newDocForm.get('docType').value,
        dDocTitle: this.newDocForm.get('docTit').value,
        xremitente: this.newDocForm.get('sender').value,
        xcargoRemitente: this.newDocForm.get('senderCharge').value,
        xresponsable: this.newDocForm.get('responsible').value,
        xComments: this.newDocForm.get('observations').value,
        xNombreProceso: 'Clasificar Bien',
        xnoOficio: this.newDocForm.get('noOfi').value,
        xfolioDictamenDevolucion:
          this.newDocForm.get('returnOpinionFolio').value,
        xcontribuyente: this.newDocForm.get('contributor').value,
      };

      this.modalRef.content.callback(true);
      const extension = '.pdf';
      const docName = `DOC_${this.date}${extension}`;
      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: resp => {
            this.onLoadToast('success', 'Documento Guardado correctamente', '');
            this.loading = false;
            this.close();
            this.modalRef.content.callback(true);
          },
          error: error => {
            console.log(error);
          },
        });
    }

    if (this.typeDoc == 'doc-request') {
      const formData = {
        dDocAuthor: this.userLogName,
        dInDate: new Date(),
        dSecurityGroup: 'Public',
        ddocCreator: this.userLogName,
        xidcProfile: 'NSBDB_Gral',
        xnombreProceso: 'Clasificar Bien',
        xidSolicitud: this.idrequest,
        xnivelRegistroNSBDB: 'solicitud',
        xidTransferente: this.idTransferent,
        xdelegacionRegional: this.regionalDelId,
        xestado: this.stateId,
        xtipoDocumento: this.newDocForm.get('docType').value,
        dDocTitle: this.newDocForm.get('docTit').value,
        xremitente: this.newDocForm.get('sender').value,
        xcargoRemitente: this.newDocForm.get('senderCharge').value,
        xresponsable: this.newDocForm.get('responsible').value,
        xComments: this.newDocForm.get('observations').value,
        xnoOficio: this.newDocForm.get('noOfi').value,
        xfolioDictamenDevolucion:
          this.newDocForm.get('returnOpinionFolio').value,
        xcontribuyente: this.newDocForm.get('contributor').value,
      };

      const extension = '.pdf';
      const docName = `DOC_${this.date}${extension}`;
      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe(data => {
          console.log('documento guardado', data);
          this.loading = false;
          this.modalRef.content.callback(true);
          this.close();
        });

      /*
        .subscribe({
          next: resp => {
            console.log('documento guardado', resp);
            this.onLoadToast('success', 'Documento Guardado correctamente', '');
            this.loading = false;
            this.modalRef.content.callback(true);
            this.close();
          },
          error: error => {
            console.log(error);
          },
        }); */
    }

    if (this.typeDoc == 'doc-expedient') {
      const formData = {
        dInDate: new Date(),
        dSecurityGroup: 'Public',
        xidcProfile: 'NSBDB_Gral',
        xNombreProceso: 'Clasificar Bien',
        xnivelRegistroNSBDB: 'expediente',
        xestado: this.stateId,
        dDocAuthor: this.userLogName,
        xidExpediente: this.idExpedient,
        ddocCreator: this.userLogName,
        xidSolicitud: this.idrequest,
        xidTransferente: this.idTransferent,
        xdelegacionRegional: this.regionalDelId,
        xtipoDocumento: this.newDocForm.get('docType').value,
        dDocTitle: this.newDocForm.get('docTit').value,
        xremitente: this.newDocForm.get('sender').value,
        xcargoRemitente: this.newDocForm.get('senderCharge').value,
        xresponsable: this.newDocForm.get('responsible').value,
        xComments: this.newDocForm.get('observations').value,
        xnoOficio: this.newDocForm.get('noOfi').value,
        xfolioDictamenDevolucion:
          this.newDocForm.get('returnOpinionFolio').value,
        xcontribuyente: this.newDocForm.get('contributor').value,
      };

      const extension = '.pdf';
      const docName = `DOC_${this.date}${extension}`;
      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: resp => {
            console.log('documento', resp);
            this.onLoadToast('success', 'Documento Guardado correctamente', '');
            this.loading = false;
            this.modalRef.content.callback(true);
            this.close();
          },
          error: error => {
            console.log(error);
          },
        });
    }
  }

  close() {
    this.modalRef.hide();
  }
}
