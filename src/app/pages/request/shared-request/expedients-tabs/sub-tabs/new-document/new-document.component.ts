import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IUploadEvent } from 'src/app/utils/file-upload/components/file-upload.component';
import { FileUploadEvent } from 'src/app/utils/file-upload/interfaces/file-event';

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
  paramsDocTypes = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    public fb: FormBuilder,
    public modalRef: BsModalRef,
    private requestService: RequestService,
    private regionalDelService: RegionalDelegationService,
    private stateOfrepublic: StateOfRepublicService,
    private transferentService: TransferenteService,
    private wContentService: WContentService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.idrequest);
    this.initForm();
    this.getInfoRequest();
    this.typedocuments();
    //console.log('NEW DOC TIPO');
    //console.log(this.typeDoc);
  }

  initForm(): void {
    this.newDocForm = this.fb.group({
      id: [null],
      docType: [null],
      docFile: [null],
      docTit: [null, [Validators.pattern(STRING_PATTERN)]],
      //noExpedient: [null],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      //regDelega: [],
      noOfi: [null],
      //state: [],
      //tranfe: [],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.newDocForm.addControl(
      'returnOpinionFolio',
      new FormControl('', [Validators.required])
    );
  }

  getInfoRequest() {
    this.requestService.getById(this.idrequest).subscribe(data => {
      console.log('data', data);
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
        console.log('data', data);
        this.selectTypeDoc = new DefaultSelect(data.data, data.count);
      });
  }

  getRegionalDelegation(id: number) {
    this.regionalDelService.getById(id).subscribe(data => {
      this.regDelName = data.description;
    });
  }

  getstate(id: number) {
    console.log('estado', id);
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

  loadDocument(uploadEvent: IUploadEvent) {
    const { index, fileEvents } = uploadEvent;
    fileEvents.forEach(fileEvent => {
      this.document(fileEvent);
    });
  }

  document(fileEvent: FileUploadEvent) {
    console.log('documento', fileEvent.file);
  }

  selectFile(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('documento', this.selectedFile);
  }

  confirm() {
    if (this.typeDoc == 'good') {
      const formData = {
        dDocAuthor: 'weblogic',
        dDocType: this.newDocForm.get('docType').value,
        dSecurityGroup: 'Public',
        dInDate: new Date(),
        xidExpediente: '35015',
        xidSolicitud: this.idrequest,
        ddocCreator: 'weblogic',
        xidcProfile: 'NSBDB_Gral',
        xidTransferente: this.idTransferent,
        xdelegacionRegional: this.regionalDelId,
        xidBien: this.idGood,
        xestado: this.stateId,
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

      console.log(console.log(formData));
      const docName = 'SAE88234';
      this.wContentService
        .addDocumentToContent(
          docName,
          '.pdf',
          JSON.stringify(formData),
          this.selectedFile,
          '.pdf'
        )
        .subscribe({
          next: resp => {
            console.log('documento', resp);

            this.onLoadToast('success', 'Documento Guardado correctamente', '');
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

/*Tipo de registro solicitud y expediente
    {
    "key": "archivo",
	"type": "file",
	"src": "275165981_651534709411056_3504201958037214315_n.jpg",
    "xidBien": 5457931,
    "xidcProfile": "NSBDB_Gral",
    "dDocAuthor": "tecastaneda",
    "xnombreProceso": "Clasificar Bien",
    "xidTransferente": 120
} */
