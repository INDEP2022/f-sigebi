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
import {
  IComerDocumentsXML,
  IComerModifyXML,
  IUpdateComerPagosRef,
} from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IUserAccessAreaRelational } from 'src/app/core/models/ms-users/seg-access-area-relational.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ElectronicSignatureFirmModalComponent } from '../electronic-signatures-main-firm-modal/electronic-signatures-main-firm-modal.component';
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
  pendingSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
  };
  dataTablePending: LocalDataSource = new LocalDataSource();
  dataTableParamsPending = new BehaviorSubject<ListParams>(new ListParams());
  loadingPending: boolean = false;
  totalPending: number = 0;
  pendingTestData: IComerDocumentsXML[] = [];
  columnFiltersPending: any = [];
  historySettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  dataTableHistorical: LocalDataSource = new LocalDataSource();
  dataTableParamsHistorical = new BehaviorSubject<ListParams>(new ListParams());
  loadingHistorical: boolean = false;
  totalHistorical: number = 0;
  historicalTestData: IComerDocumentsXML[] = [];
  columnFiltersHistorical: any = [];
  dataUserLogged: IUserAccessAreaRelational;
  messageText: string = '';
  selectedRow: IComerDocumentsXML = null;
  filterByUserP: boolean = false;
  filterByUserH: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private svElectronicSignatures: ElectronicSignaturesService,
    private authService: AuthService,
    private msUsersService: UsersService,
    private siabService: SiabService
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
    // this.getPending();
    // this.getHistory();
  }

  initVariables() {
    this.alertMsg = true;
    this.messageText = '';
    this.selectedRow = null;
    this.filterByUserP = false;
    this.filterByUserH = false;
    this.historicalTestData = [];
    this.dataTableHistorical.load([]);
    this.totalHistorical = 0;
    this.pendingTestData = [];
    this.dataTablePending.load([]);
    this.totalPending = 0;
  }

  loadingDataTablePending() {
    //Filtrado por columnas
    this.dataTablePending
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            if (filter.field == 'reference') {
              field = `filter.${filter.field + 'id'}`;
            } else if (filter.field == 'document') {
              field = `filter.reportkey'`;
            } else {
              field = `filter.${filter.field}`;
            }
            // field = `filter.user`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              referenceid: () => (searchFilter = SearchFilter.EQ),
              reportkey: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              denomination: () => (searchFilter = SearchFilter.EQ),
            };

            if (filter.field == 'reference') {
              search[filter.field + 'id']();
            } else if (filter.field == 'document') {
              search['reportkey']();
            } else {
              search[filter.field]();
            }

            if (filter.search !== '') {
              this.columnFiltersPending[
                field
              ] = `${searchFilter}:${filter.search}`;
              if (this.filterByUserP == true) {
                this.columnFiltersPending[
                  'user'
                ] = `${SearchFilter.EQ}:${this.dataUserLogged.user}`; //ADABDOUBG
              }
              // PENDIENTE CON RAFA
              // this.columnFiltersPending[
              //   'firmdate'
              // ] = `${SearchFilter.EQ}:NULL`;
              this.columnFiltersHistorical['firmdate'] = `$is:$null`;
              this.columnFiltersPending['filter.creationdate'] = `$order:desc`;
            } else {
              delete this.columnFiltersPending[field];
            }
          });
          this.dataTableParamsPending = this.pageFilter(
            this.dataTableParamsPending
          );
          //Su respectivo metodo de busqueda de datos
          this.getRelationPersons();
        }
      });

    if (this.filterByUserP == true) {
      this.columnFiltersPending[
        'user'
      ] = `${SearchFilter.EQ}:${this.dataUserLogged.user}`; //ADABDOUBG
    }
    // PENDIENTE CON RAFA
    // this.columnFiltersPending[
    //   'firmdate'
    // ] = `${SearchFilter.EQ}:NULL`;
    this.columnFiltersHistorical['firmdate'] = `$is:$null`;
    this.columnFiltersPending['filter.creationdate'] = `$order:desc`;
    //observador para el paginado
    this.dataTableParamsPending
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRelationPersons());
  }

  loadingDataTableHistorical() {
    //Filtrado por columnas
    this.dataTableHistorical
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            if (filter.field == 'reference') {
              field = `filter.${filter.field + 'id'}`;
            } else if (filter.field == 'document') {
              field = `filter.reportkey'`;
            } else {
              field = `filter.${filter.field}`;
            }

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              referenceid: () => (searchFilter = SearchFilter.EQ),
              reportkey: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              denomination: () => (searchFilter = SearchFilter.EQ),
            };

            if (filter.field == 'reference') {
              search[filter.field + 'id']();
            } else if (filter.field == 'document') {
              search['reportkey']();
            } else {
              search[filter.field]();
            }

            if (filter.search !== '') {
              this.columnFiltersHistorical[
                field
              ] = `${searchFilter}:${filter.search}`;
              if (this.filterByUserH == true) {
                this.columnFiltersHistorical[
                  'user'
                ] = `${SearchFilter.EQ}:${this.dataUserLogged.user}`; //ADABDOUBG
              }
              this.columnFiltersHistorical['firmdate'] = `$not:$null`;
              this.columnFiltersHistorical[
                'filter.creationdate'
              ] = `$order:desc`;
            } else {
              delete this.columnFiltersHistorical[field];
            }
          });
          this.dataTableParamsHistorical = this.pageFilter(
            this.dataTableParamsHistorical
          );
          //Su respectivo metodo de busqueda de datos
          this.getRelationHistorical();
        }
      });

    if (this.filterByUserH == true) {
      this.columnFiltersHistorical[
        'user'
      ] = `${SearchFilter.EQ}:${this.dataUserLogged.user}`; //ADABDOUBG
    }
    this.columnFiltersHistorical['firmdate'] = `$not:$null`;
    this.columnFiltersHistorical['filter.creationdate'] = `$order:desc`;
    //observador para el paginado
    this.dataTableParamsHistorical
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRelationHistorical());
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
        this.filterByUserH = false;
        this.loadingDataTableHistorical();
      },
      error: error => {
        // console.log(error);
        // FEC_FIRMA IS NOT NULL AND USUARIO
        this.filterByUserH = true;
        this.loadingDataTableHistorical();
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
    this.loadingDataTablePending();
  }

  getRelationPersons() {
    this.loadingPending = true;
    // var params = new FilterParams();
    // params.removeAllFilters();
    // params.addFilter('user', 'ADABDOUBG', SearchFilter.ILIKE); //this.dataUserLogged.user, SearchFilter.ILIKE);
    let params = {
      ...this.dataTableParamsPending.getValue(),
      ...this.columnFiltersPending,
    };
    // params.addFilter('signatureDate', SearchFilter.NULL, SearchFilter.NULL);
    // params.limit = this.dataTableParamsPending.value.limit;
    // params.page = this.dataTableParamsPending.value.page;
    // params = { ...this.columnFiltersPending, params };
    console.log('PARAMS ', params);
    this.svElectronicSignatures.getAllComerDocumentsXml(params).subscribe({
      next: res => {
        console.log('DATA RELATION PERSONS', res);
        this.pendingTestData = res.data.map((i: any) => {
          i['reference'] =
            ['FCOMEREPINGXMAND_I', 'FCOMEREPINGXMAND'].includes(i.screenkey) ==
            true
              ? 'Evento ' + i.referenceid
              : '';
          i['document'] =
            ['FCOMEREPINGXMAND_I', 'FCOMEREPINGXMAND'].includes(i.screenkey) ==
            true
              ? 'Reporte ' + i.reportkey
              : '';
          return i;
        });
        this.dataTablePending.load(this.pendingTestData);
        this.totalPending = res.count;
        this.loadingPending = false;
      },
      error: error => {
        console.log(error);
        this.pendingTestData = [];
        this.dataTablePending.load([]);
        this.totalPending = 0;
        this.loadingPending = false;
      },
    });
  }

  getRelationHistorical() {
    this.loadingHistorical = true;
    let params = {
      ...this.dataTableParamsHistorical.getValue(),
      ...this.columnFiltersHistorical,
    };
    // const params = new FilterParams();
    // params.removeAllFilters();
    // if (userFilter == true) {
    //   params.addFilter('user', 'ADABDOUBG', SearchFilter.ILIKE); //this.dataUserLogged.user, SearchFilter.ILIKE);
    // }
    // // params.addFilter('signatureDate', SearchFilter.NULL, SearchFilter.NULL);
    // params.limit = this.dataTableParamsHistorical.value.limit;
    // params.page = this.dataTableParamsHistorical.value.page;
    console.log('PARAMS HISTORICAL', params);
    this.svElectronicSignatures.getAllComerDocumentsXml(params).subscribe({
      next: res => {
        console.log('DATA HISTORICAL PERSONS', res);
        this.historicalTestData = res.data.map((i: any) => {
          i['reference'] =
            ['FCOMEREPINGXMAND_I', 'FCOMEREPINGXMAND'].includes(i.screenkey) ==
            true
              ? 'Evento ' + i.referenceid
              : '';
          i['document'] =
            ['FCOMEREPINGXMAND_I', 'FCOMEREPINGXMAND'].includes(i.screenkey) ==
            true
              ? 'Reporte ' + i.reportkey
              : '';
          return i;
        });
        this.dataTableHistorical.load(this.historicalTestData);
        this.totalHistorical = res.count;
        this.loadingHistorical = false;
      },
      error: error => {
        console.log(error);
        this.historicalTestData = [];
        this.dataTableHistorical.load([]);
        this.totalHistorical = 0;
        this.loadingHistorical = false;
      },
    });
  }

  getPending() {
    console.log('PENDIENTES');
    // this.pendingColumns = this.pendingTestData;
    // this.pendingTotalItems = this.pendingColumns.length;
  }

  getHistory() {
    console.log('HISTORICO');
    // this.historyColumns = this.historyTestData;
    // this.historyTotalItems = this.historyColumns.length;
    // this.dataTableParamsHistorical
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getRelationHistorical());
  }

  selectPending(event: any) {
    // this.pendingRows.push(row);
    console.log('SELECCION PENDIENTE', event);
    if (event.selected) {
      this.selectedRow = event.data;
      // this.updatePaysRefS(event.data);
    }
  }

  selectHistory(event: any) {
    // this.historyRows.push(row);
    console.log('SELECCION HISTORIAL', event);
    if (event.selected) {
      this.selectedRow = event.data;
      // this.updatePaysRefS(event.data);
    }
  }

  updatePaysRefS(data: IComerDocumentsXML, onlyReport: boolean = false) {
    console.log('UPDATE PAYS REF ', data);
    let body: IUpdateComerPagosRef = {
      referenceId: data.referenceid,
      documentId: data.documentid,
    };
    this.svElectronicSignatures.updateComerPagosRefS(body).subscribe({
      next: res => {
        console.log('DATA UPDATE S', res);
        this.generatePdf(
          data.referenceid,
          0,
          data.title,
          data.documentid,
          data,
          onlyReport
        );
      },
      error: error => {
        console.log(error);
        this.generatePdf(
          data.referenceid,
          0,
          data.title,
          data.documentid,
          data,
          onlyReport
        );
      },
    });
  }

  generatePdf(
    idEvent: number,
    count: number,
    origin: string,
    consecutive: number,
    data: IComerDocumentsXML,
    onlyReport: boolean = false
  ) {
    let params: any = {
      IDEVENTO: count == 0 ? idEvent : null,
      P_ORIGEN: origin,
      P_CONSEC: consecutive,
    };
    this.siabService
      .fetchReport('RCOMERINGXMAND', params)
      .subscribe(response => {
        console.log(response);
        if (onlyReport == false) {
          if (response !== null) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            this.alert('warning', 'Reporte no disponible por el momento', '');
          }
          this.selectedRow = null;
          this.updatePaysRef(data);
        } else {
        }
      });
  }

  updatePaysRef(data: IComerDocumentsXML, onlyReport: boolean = false) {
    console.log('UPDATE PAYS REF ', data);
    let body: IUpdateComerPagosRef = {
      referenceId: data.referenceid,
      documentId: data.documentid,
    };
    this.svElectronicSignatures.updateComerPagosRef(body).subscribe({
      next: res => {
        console.log('DATA UPDATE NULL', res);
        if (onlyReport == true) {
          this.alert('success', 'Proceso Terminado', '');
        }
      },
      error: error => {
        console.log(error);
      },
    });
  }

  refresh() {
    // this.getPending();
    // this.getHistory();
    this.initVariables();
    this.initRelDocs();
  }

  viewDocument() {
    if (this.selectedRow != null) {
      this.updatePaysRefS(this.selectedRow);
    } else {
      this.alert(
        'warning',
        'Sin Registro Seleccionado',
        'Selecciona un registro para continuar'
      );
    }
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
    if (this.selectedRow != null) {
      this.getElectronicFirmData();
    } else {
      this.alert(
        'warning',
        'Sin Registro Seleccionado',
        'Selecciona un registro para continuar'
      );
    }
    // let url =
    //   'http://firma.sae.gob.mx/firmar.aspx?DICTAMEN=_&NATURALEZA_DOC=&NO_DOCUMENTO=&TIPO_DOCUMENTO=&RFC_USR=XAXX010101000';
    // window.open(url, 'Firmar Documento | INDEP');
  }

  // SSF3_FIRMA_ELEC_DOCS
  getElectronicFirmData() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.selectedRow.screenkey);
    params.addFilter('documentNumber', this.selectedRow.referenceid);
    params.addFilter('documentType', this.selectedRow.documentid);
    this.svElectronicSignatures
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: data => {
          console.log('FIRMA ELECTRONICA', data);
          this.generateXMLFile();
        },
        error: error => {
          console.log(error);
          if (error.status == 400) {
            this.generateXMLFile();
          } else {
            this.alert(
              'error',
              'Error',
              'Ocurrió un error al validar la firma electrónica'
            );
          }
        },
      });
  }

  generateXMLFile() {
    let paramsData = new ListParams();
    let nameFile: string =
      this.selectedRow.referenceid + '_' + this.selectedRow.documentid;
    paramsData = {
      IDEVENTO: this.selectedRow.referenceid,
      P_ORIGEN: this.selectedRow.title,
      P_CONSEC: this.selectedRow.documentid,
      nombreReporte: 'RCOMERINGXMAND' + '.jasper',
    };
    this.svElectronicSignatures.getXMLReportToFirm(paramsData).subscribe({
      next: (response: any) => {
        console.log(response);
        this.xmlResponseToFirm(response, nameFile);
      },
      error: error => {
        console.log(error);
        if (error.status == 200) {
          let response = error.error.text;
          this.xmlResponseToFirm(response, nameFile);
        } else {
          this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
          this.onLoadToast(
            'warning',
            'Ocurrió un error al CREAR el XML con el nombre: ',
            ''
          );
        }
      },
    });
  }

  xmlResponseToFirm(response: any, nameFile: string) {
    if (!response) {
      this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
      this.onLoadToast(
        'warning',
        'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
        ''
      );
      return;
    }
    if (!response.includes('xml')) {
      this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
      this.onLoadToast(
        'warning',
        'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
        ''
      );
      return;
    }
    const formData = new FormData();
    const file = new File([response], nameFile + '.xml', {
      type: 'text/xml',
    });
    formData.append('file', file);
    this.startFirmComponent({
      nameFileDictation: nameFile,
      natureDocumentDictation: this.selectedRow.screenkey,
      numberDictation: this.selectedRow.referenceid,
      typeDocumentDictation: this.selectedRow.documentid + '',
      fileDocumentDictation: formData.get('file'), // DOCUMENTO XML GENERADO
    });
  }

  errorFirmOnGetXml() {
    console.log('Error en Firma');
  }

  startFirmComponent(context?: Partial<ElectronicSignatureFirmModalComponent>) {
    const modalRef = this.modalService.show(
      ElectronicSignatureFirmModalComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.responseFirm.subscribe((next: any) => {
      console.log('next', next);
      this.validFirmElectronic();
    });
    modalRef.content.errorFirm.subscribe((next: any) => {
      console.log(next);
      this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
    });
  }

  validFirmElectronic() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.selectedRow.screenkey);
    params.addFilter('documentNumber', this.selectedRow.referenceid);
    params.addFilter('documentType', this.selectedRow.documentid);
    this.svElectronicSignatures
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: data => {
          console.log('FIRMA ELECTRONICA', data);
          this.getComerActXml();
        },
        error: error => {
          console.log(error);
          this.alert('warning', 'Documento no Firmado', '');
        },
      });
  }

  getComerActXml() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('documentStatus', 1);
    params.addFilter('documentsXMLId', this.selectedRow.documensxmltid);
    this.svElectronicSignatures
      .getAllComerceDocumentsXmlH(params.getParams())
      .subscribe({
        next: res => {
          console.log('DATA DOCUMENTS COMERCE H', res);
          this.uploadFirmPDF();
        },
        error: error => {
          console.log(error);
        },
      });
  }

  uploadFirmPDF() {
    let body: IComerModifyXML = {
      documXmlId: this.selectedRow.documensxmltid,
      screenKey: this.selectedRow.screenkey,
      reportKey: this.selectedRow.reportkey,
      referenceId: this.selectedRow.referenceid + '',
      documentId: this.selectedRow.documentid + '',
      consecutiveNumber: this.selectedRow.consecutivenumber,
    };
    this.svElectronicSignatures.comerModifyXML(body).subscribe({
      next: res => {
        console.log('DATA MODIFY XML', res);
        this.updateComerActXml();
      },
      error: error => {
        console.log(error);
        this.alert('error', 'Error', error.error.message);
      },
    });
  }

  updateComerActXml() {
    let obj = {
      pathNamePdf: '',
      documentStatus: 1,
    };
    this.svElectronicSignatures.updateComerceDocumentsXmlH(obj).subscribe({
      next: res => {
        console.log('UPDATE COMER ACT', res);
        this.updatePaysRef(this.selectedRow);
      },
      error: error => {
        console.log(error);
        this.alert(
          'error',
          'Error al Actualizar',
          'No se pudo actualizar el PDF en la base de datos'
        );
      },
    });
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
