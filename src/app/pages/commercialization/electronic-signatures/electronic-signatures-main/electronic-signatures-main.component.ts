import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerDocumentsXML } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IUserAccessAreaRelational } from 'src/app/core/models/ms-users/seg-access-area-relational.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ElectronicSignaturesService } from '../service/electronic-signatures.service';
import {
  HISTORY_COLUMNS,
  PENDING_COLUMNS,
} from './electronic-signature-columns';

@Component({
  selector: 'app-electronic-signatures-main',
  templateUrl: './electronic-signatures-main.component.html',
  styles: [],
  animations: [
    trigger('OnInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ElectronicSignaturesMainComponent
  extends BasePage
  implements OnInit
{
  alertMsg: boolean = true;
  pdfUrl: string =
    'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  pendingRows: any[] = [];
  historyRows: any[] = [];
  pendingParams = new BehaviorSubject<ListParams>(new ListParams());
  historyParams = new BehaviorSubject<ListParams>(new ListParams());
  pendingTotalItems: number = 0;
  historyTotalItems: number = 0;
  pendingColumns: any[] = [];
  historyColumns: any[] = [];
  pendingSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  dataTablePending: LocalDataSource = new LocalDataSource();
  dataTableParamsPending = new BehaviorSubject<ListParams>(new ListParams());
  loadingPending: boolean = false;
  totalPending: number = 0;
  pendingTestData: IComerDocumentsXML[] = [];
  historySettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  historyTestData = [
    {
      user: 'VCORTES',
      reference: 'Evento 22333',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'ELABORA',
    },
    {
      user: 'VCORTES',
      reference: 'Evento 22333',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'REVISA',
    },
    {
      user: 'MGARCIA',
      reference: 'Evento 22333',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'AUTORIZA',
    },
    {
      user: 'AMORALES',
      reference: 'Evento 22334',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'ELABORA',
    },
    {
      user: 'AMORALES',
      reference: 'Evento 22334',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'REVISA',
    },
    {
      user: 'MGARCIA',
      reference: 'Evento 22334',
      report: 'Reporte 02',
      date: '09/04/2021',
      signatureDate: '09/04/2021',
      description: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      type: 'AUTORIZA',
    },
  ];
  dataUserLogged: IUserAccessAreaRelational;
  messageText: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private svElectronicSignatures: ElectronicSignaturesService,
    private authService: AuthService,
    private msUsersService: UsersService
  ) {
    super();
    this.pendingSettings.columns = PENDING_COLUMNS;
    this.historySettings.columns = HISTORY_COLUMNS;
  }

  ngOnInit(): void {
    this.initVariables();
    const token = this.authService.decodeToken();
    console.log(token);
    if (token.preferred_username) {
      this.getUserDataLogged(
        token.preferred_username
          ? token.preferred_username.toLocaleUpperCase()
          : token.preferred_username
      );
    } else {
      this.alertInfo(
        'warning',
        'Error al Obtener los Datos del Usuario de la Sesión Actual',
        ''
      );
    }
    this.getPending();
    this.getHistory();
  }

  initVariables() {
    this.messageText = '';
  }

  getUserDataLogged(userId: string) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter(
      'user',
      userId == 'SIGEBIADMON' ? userId.toLocaleLowerCase() : userId
    );
    this.msUsersService.getInfoUserLogued(params.getParams()).subscribe({
      next: res => {
        console.log('USER INFO', res);
        this.dataUserLogged = res.data[0];
        this.initForm();
      },
      error: error => {
        console.log(error);
        this.alertInfo(
          'warning',
          'Error al Obtener los Datos del Usuario de la Sesión Actual',
          error.error.message
        );
      },
    });
  }

  initForm() {
    const params = new ListParams();
    params['filter.parameter'] = '$eq:SUPUSUFIRE';
    params['filter.value'] = '$eq:' + this.dataUserLogged.user;
    // params['sortBy'] = 'goodId:ASC';
    this.svElectronicSignatures.getAllParametersMod(params).subscribe({
      next: res => {
        console.log('DATA PARAMETER MOD', res);
        // FEC_FIRMA IS NOT NULL
      },
      error: error => {
        // console.log(error);
        // FEC_FIRMA IS NOT NULL AND USUARIO
      },
    });
    this.initRelDocs();
  }

  initRelDocs() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('user', this.dataUserLogged.user);
    params.addFilter('signatureDate', SearchFilter.NULL, SearchFilter.NULL);
    this.svElectronicSignatures
      .getAllDocumentsComerceService(params.getParams())
      .subscribe({
        next: res => {
          console.log('DATA DOCUMENTS COMERCE', res);
          this.messageText =
            'Tiene ' + res.count + ' Documentos Pendientes de Firma';
        },
        error: error => {
          console.log(error);
          this.messageText = 'No Tiene Documentos Pendientes de Firma';
        },
      });
    // this.getRelationPersons();
    this.dataTableParamsPending
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRelationPersons());
  }

  getRelationPersons() {
    this.loadingPending = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('user', this.dataUserLogged.user, SearchFilter.ILIKE);
    // params.addFilter('signatureDate', SearchFilter.NULL, SearchFilter.NULL);

    this.svElectronicSignatures
      .getAllComerDocumentsXml(params.getParams())
      .subscribe({
        next: res => {
          console.log('DATA RELATION PERSONS', res);
          this.pendingTestData = res.data;
          this.loadingPending = false;
        },
        error: error => {
          console.log(error);
          this.loadingPending = false;
        },
      });
  }

  getPending() {
    this.pendingColumns = this.pendingTestData;
    this.pendingTotalItems = this.pendingColumns.length;
  }

  getHistory() {
    this.historyColumns = this.historyTestData;
    this.historyTotalItems = this.historyColumns.length;
  }

  selectPending(row: any) {
    this.pendingRows.push(row);
  }

  selectHistory(row: any) {
    this.historyRows.push(row);
  }

  refresh() {
    this.getPending();
    this.getHistory();
  }

  viewFile() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  openSignWindow() {
    let url =
      'http://firma.sae.gob.mx/firmar.aspx?DICTAMEN=_&NATURALEZA_DOC=&NO_DOCUMENTO=&TIPO_DOCUMENTO=&RFC_USR=XAXX010101000';
    window.open(url, 'Firmar Documento | INDEP');
  }

  downloadFile() {
    this.downloadPdf(this.pdfUrl, 'example_document');
  }

  downloadPdf(url: string, name: string) {
    // Ejemplo con un get normal, cambiar por el servicio para recibir el pdf
    const PDF_EXTENSION = '.pdf';
    let req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'blob';
    req.onload = function () {
      var file = new Blob([req.response], {
        type: 'application/pdf',
      });
      FileSaver.saveAs(file, name + PDF_EXTENSION);
    };
    req.send();
  }
}
