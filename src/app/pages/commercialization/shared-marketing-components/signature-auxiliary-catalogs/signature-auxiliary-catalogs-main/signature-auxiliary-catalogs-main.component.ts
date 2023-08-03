import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerceDocumentsXmlH } from 'src/app/core/models/ms-documents/documents-comerce.model';
import { IComerDestXML } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { BasePage } from 'src/app/core/shared/base-page';
import { CommercializationDestinationModalComponent } from '../commercialization-destination-modal/commercialization-destination-modal.component';
import { CommercializationEventModalComponent } from '../commercialization-event-modal/commercialization-event-modal.component';
import { CommercializationOriginsModalComponent } from '../commercialization-origins-modal/commercialization-origins-modal.component';
import { CommercializationSignatureModalComponent } from '../commercialization-signature-modal/commercialization-signature-modal.component';
import { CBROimCReportsModalComponent } from '../reports-modal/reports-modal.component';
import { SignatureAuxiliaryCatalogsService } from '../services/signature-auxiliary-catalogs.service';
import { TypesModalComponent } from '../types-modal/types-modal.component';
import {
  ELECTRONIC_SIGNATURE_ADDRESSEE_COLUMNS,
  ELECTRONIC_SIGNATURE_EVENT_COLUMNS,
  ELECTRONIC_SIGNATURE_REPORT_COLUMNS,
  ELECTRONIC_SIGNATURE_SIGNATURE_COLUMNS,
  ELECTRONIC_SIGNATURE_TYPE_COLUMNS,
} from './signature-auxiliary-catalogs-columns';

@Component({
  selector: 'app-signature-auxiliary-catalogs-main',
  templateUrl: './signature-auxiliary-catalogs-main.component.html',
  styles: [],
})
export class SignatureAuxiliaryCatalogsMainComponent
  extends BasePage
  implements OnInit
{
  layout: string = 'movable'; // 'movable', 'immovable'
  selectedReport: any[] = [];
  orders: number[] = [];
  // Reports Table
  dataTableReport: LocalDataSource = new LocalDataSource();
  dataTableParamsReport = new BehaviorSubject<ListParams>(new ListParams());
  loadingReport: boolean = false;
  totalReport: number = 0;
  testDataReport: any[] = [];
  columnFiltersReport: any = [];
  // Addresee Table
  dataTableAddresee: LocalDataSource = new LocalDataSource();
  dataTableParamsAddresee = new BehaviorSubject<ListParams>(new ListParams());
  loadingAddresee: boolean = false;
  totalAddresee: number = 0;
  testDataAddresee: any[] = [];
  columnFiltersAddresee: any = [];
  // Type Table
  dataTableType: LocalDataSource = new LocalDataSource();
  dataTableParamsType = new BehaviorSubject<ListParams>(new ListParams());
  loadingType: boolean = false;
  totalType: number = 0;
  testDataType: any[] = [];
  columnFiltersType: any = [];
  // Event Table
  dataTableEvent: LocalDataSource = new LocalDataSource();
  dataTableParamsEvent = new BehaviorSubject<ListParams>(new ListParams());
  loadingEvent: boolean = false;
  totalEvent: number = 0;
  testDataEvent: any[] = [];
  columnFiltersEvent: any = [];
  // Signature Table
  dataTableSignature: LocalDataSource = new LocalDataSource();
  dataTableParamsSignature = new BehaviorSubject<ListParams>(new ListParams());
  loadingSignature: boolean = false;
  totalSignature: number = 0;
  testDataSignature: any[] = [];
  columnFiltersSignature: any = [];

  reportParams = new BehaviorSubject<ListParams>(new ListParams());
  addresseeParams = new BehaviorSubject<ListParams>(new ListParams());
  typeParams = new BehaviorSubject<ListParams>(new ListParams());
  eventParams = new BehaviorSubject<ListParams>(new ListParams());
  signatureParams = new BehaviorSubject<ListParams>(new ListParams());
  reportTotalItems: number = 0;
  addresseeTotalItems: number = 0;
  typeTotalItems: number = 0;
  eventTotalItems: number = 0;
  signatureTotalItems: number = 0;
  reportColumns: any[] = [];
  addresseeColumns: any[] = [];
  typeColumns: any[] = [];
  eventColumns: any[] = [];
  signatureColumns: any[] = [];
  idDocumentsXml: number = null;
  eventData: ComerceDocumentsXmlH;
  originId: number = null;
  addresseeData: IComerDestXML;
  reportSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: false,
    },
  };
  addresseeSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: false,
    },
  };
  typeSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: false,
    },
  };
  eventSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: false,
    },
  };
  signatureSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
  };

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private svSignatureAuxiliaryCatalogsService: SignatureAuxiliaryCatalogsService
  ) {
    super();
    this.reportSettings.columns = ELECTRONIC_SIGNATURE_REPORT_COLUMNS;
    this.addresseeSettings.columns = ELECTRONIC_SIGNATURE_ADDRESSEE_COLUMNS;
    this.typeSettings.columns = ELECTRONIC_SIGNATURE_TYPE_COLUMNS;
    this.eventSettings.columns = ELECTRONIC_SIGNATURE_EVENT_COLUMNS;
    this.signatureSettings.columns = ELECTRONIC_SIGNATURE_SIGNATURE_COLUMNS;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('property')) {
        this.layout = params.get('property');
      }
    });
    this.initForm();
  }

  initForm() {
    this.loadingDataTableReport();
    this.loadingDataTableType();
    this.loadingDataTableEvent();
  }

  selectReport(event: any) {
    console.log(event);
    if (event) {
      this.originId = event.data.originId;
      this.addresseeData = event.data;
      this.testDataAddresee = [];
      this.dataTableAddresee.load([]);
      this.totalAddresee = 0;
      this.dataTableAddresee.reset();
      setTimeout(() => {
        this.loadingDataTableAddresee();
      }, 300);
    } else {
      this.originId = null;
      this.addresseeData = null;
      this.testDataAddresee = [];
      this.dataTableAddresee.load([]);
      this.totalAddresee = 0;
      this.dataTableAddresee.reset();
    }
  }

  selectEvent(event: any) {
    console.log(event);
    if (event) {
      this.idDocumentsXml = event.data.documentsXMLId;
      this.eventData = event.data;
      this.testDataSignature = [];
      this.dataTableSignature.load([]);
      this.totalSignature = 0;
      this.dataTableSignature.reset();
      setTimeout(() => {
        this.loadingDataTableSignature();
      }, 300);
    } else {
      this.idDocumentsXml = null;
      this.eventData = null;
      this.testDataSignature = [];
      this.dataTableSignature.load([]);
      this.totalSignature = 0;
      this.dataTableSignature.reset();
    }
  }

  refreshReports() {
    this.reportColumns = [...this.reportColumns];
  }

  refreshTyes() {
    this.typeColumns = [...this.typeColumns];
    this.typeColumns.forEach(e => this.orders.push(e.order));
  }

  openReportModal() {
    const modalRef = this.modalService.show(CBROimCReportsModalComponent, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onEdit.subscribe((data: boolean) => {
      if (data) this.refreshReports();
    });
  }

  deleteType(type: any) {
    this.alertQuestion(
      'question',
      '¿Desea eliminar este registro?',
      '',
      'Eliminar'
    ).then(question => {
      if (question.isConfirmed) {
        // Llamar servicio para eliminar
        console.log(type);
      }
    });
  }

  loadingDataTableReport() {
    //Filtrado por columnas
    this.dataTableReport
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              screenKey: () => (searchFilter = SearchFilter.EQ),
              signatoriesNumber: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              reportKey: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersReport[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersReport[field];
            }
          });
          this.dataTableParamsReport = this.pageFilter(
            this.dataTableParamsReport
          );
          //Su respectivo metodo de busqueda de datos
          this.getReportData();
        }
      });

    // this.columnFiltersReport['filter.creationdate'] = `$order:desc`;
    //observador para el paginado
    this.dataTableParamsReport
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getReportData());
  }

  getReportData() {
    this.loadingReport = true;
    let params = {
      ...this.dataTableParamsReport.getValue(),
      ...this.columnFiltersReport,
    };
    console.log('PARAMS ', params);
    this.svSignatureAuxiliaryCatalogsService.getComerOrigins(params).subscribe({
      next: res => {
        console.log('DATA REPORT', res);
        this.testDataReport = res.data;
        this.dataTableReport.load(this.testDataReport);
        this.totalReport = res.count;
        this.loadingReport = false;
      },
      error: error => {
        console.log(error);
        this.testDataReport = [];
        this.dataTableReport.load([]);
        this.totalReport = 0;
        this.loadingReport = false;
      },
    });
  }

  loadingDataTableType() {
    //Filtrado por columnas
    this.dataTableType
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              denomination: () => (searchFilter = SearchFilter.ILIKE),
              orderId: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersType[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersType[field];
            }
          });
          this.dataTableParamsType = this.pageFilter(this.dataTableParamsType);
          //Su respectivo metodo de busqueda de datos
          this.getTypeData();
        }
      });

    // this.columnFiltersType['filter.creationdate'] = `$order:desc`;
    //observador para el paginado
    this.dataTableParamsType
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTypeData());
  }

  getTypeData() {
    this.loadingType = true;
    let params = {
      ...this.dataTableParamsType.getValue(),
      ...this.columnFiltersType,
    };
    console.log('PARAMS ', params);
    this.svSignatureAuxiliaryCatalogsService
      .getComerTypeSignatories(params)
      .subscribe({
        next: res => {
          console.log('DATA TYPE', res);
          this.testDataType = res.data;
          this.dataTableType.load(this.testDataType);
          this.totalType = res.count;
          this.loadingType = false;
        },
        error: error => {
          console.log(error);
          this.testDataType = [];
          this.dataTableType.load([]);
          this.totalType = 0;
          this.loadingType = false;
        },
      });
  }
  loadingDataTableAddresee() {
    //Filtrado por columnas
    this.dataTableAddresee
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              email: () => (searchFilter = SearchFilter.ILIKE),
              name: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersAddresee[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersAddresee[field];
            }
          });
          this.dataTableParamsAddresee = this.pageFilter(
            this.dataTableParamsAddresee
          );
          //Su respectivo metodo de busqueda de datos
          this.getAddreseeData();
        }
      });

    this.columnFiltersAddresee['filter.originId'] = `$eq:${this.originId}`;
    // this.columnFiltersAddresee['filter.creationdate'] = `$order:desc`;
    //observador para el paginado
    this.dataTableParamsAddresee
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAddreseeData());
  }

  getAddreseeData() {
    this.loadingAddresee = true;
    let params = {
      ...this.dataTableParamsAddresee.getValue(),
      ...this.columnFiltersAddresee,
    };
    console.log('PARAMS ', params);
    this.svSignatureAuxiliaryCatalogsService.getComerDestXML(params).subscribe({
      next: res => {
        console.log('DATA ADDRESEE', res);
        this.testDataAddresee = res.data;
        this.dataTableAddresee.load(this.testDataAddresee);
        this.totalAddresee = res.count;
        this.loadingAddresee = false;
      },
      error: error => {
        console.log(error);
        this.testDataAddresee = [];
        this.dataTableAddresee.load([]);
        this.totalAddresee = 0;
        this.loadingAddresee = false;
      },
    });
  }

  loadingDataTableEvent() {
    //Filtrado por columnas
    this.dataTableEvent
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              referenceId: () => (searchFilter = SearchFilter.EQ),
              documentsXMLId: () => (searchFilter = SearchFilter.EQ),
              origin: () => (searchFilter = SearchFilter.EQ),
              documentId: () => (searchFilter = SearchFilter.EQ),
              title: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersEvent[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersEvent[field];
            }
          });
          this.dataTableParamsEvent = this.pageFilter(
            this.dataTableParamsEvent
          );
          //Su respectivo metodo de busqueda de datos
          this.getEventData();
        }
      });
    this.columnFiltersEvent['filter.documentStatus'] = `$eq:0`;
    this.columnFiltersEvent['filter.documentsXMLId'] = `$order:desc`;
    //observador para el paginado
    this.dataTableParamsEvent
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getEventData());
  }

  getEventData() {
    this.loadingEvent = true;
    let params = {
      ...this.dataTableParamsEvent.getValue(),
      ...this.columnFiltersEvent,
    };
    console.log('PARAMS ', params);
    this.svSignatureAuxiliaryCatalogsService
      .getAllComerceDocumentsXmlH(params)
      .subscribe({
        next: res => {
          console.log('DATA EVENT', res);
          this.testDataEvent = res.data.map((i: any) => {
            i['origin'] = i.originId ? i.originId.originId : '';
            return i;
          });
          setTimeout(() => {
            this.totalEvent = res.count;
            this.getDescriptions();
          }, 200);
        },
        error: error => {
          console.log(error);
          this.testDataEvent = [];
          this.dataTableEvent.load([]);
          this.totalEvent = 0;
          this.loadingEvent = false;
        },
      });
  }

  getDescriptions() {
    this.testDataEvent.forEach((element, count) => {
      if (element) {
        const params = new ListParams();
        params['filter.parameter'] = '$eq:EST_REP_FIRMA';
        params['filter.value'] = '$eq:' + element.documentStatus;
        // params['sortBy'] = 'goodId:ASC';
        this.svSignatureAuxiliaryCatalogsService
          .getParameterMod(params)
          .subscribe({
            next: res => {
              // console.log('DATA DESCRIPCION', res);
              element['description'] =
                element.documentStatus + ' ' + res.data[0].description;
              if (this.testDataEvent.length - 1 == count) {
                this.endDescription();
              }
            },
            error: error => {
              // console.log(error);
              element['description'] = element.documentStatus + ' Verificar';
              if (this.testDataEvent.length - 1 == count) {
                this.endDescription();
              }
            },
          });
      }
    });
  }

  endDescription() {
    this.dataTableEvent.load(this.testDataEvent);
    this.loadingEvent = false;
  }

  loadingDataTableSignature() {
    //Filtrado por columnas
    this.dataTableSignature
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              no_consec: () => (searchFilter = SearchFilter.EQ),
              id_docums_xml: () => (searchFilter = SearchFilter.EQ),
              usuario: () => (searchFilter = SearchFilter.ILIKE),
              nombre: () => (searchFilter = SearchFilter.ILIKE),
              cargo: () => (searchFilter = SearchFilter.ILIKE),
              id_tipo_firmante: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersSignature[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersSignature[field];
            }
          });
          this.dataTableParamsSignature = this.pageFilter(
            this.dataTableParamsSignature
          );
          //Su respectivo metodo de busqueda de datos
          this.getSignatureData();
        }
      });

    this.columnFiltersSignature[
      'filter.id_docums_xml'
    ] = `$eq:${this.idDocumentsXml}`;
    // this.columnFiltersSignature['filter.creationdate'] = `$order:desc`;
    //observador para el paginado
    this.dataTableParamsSignature
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSignatureData());
  }

  getSignatureData() {
    this.loadingSignature = true;
    let params = {
      ...this.dataTableParamsSignature.getValue(),
      ...this.columnFiltersSignature,
    };
    console.log('PARAMS ', params);
    this.svSignatureAuxiliaryCatalogsService
      .getAllComerceDocumentsXmlTCatFelec(params)
      .subscribe({
        next: res => {
          console.log('DATA SIGNATURE', res);
          this.testDataSignature = res.data.map((i: any) => {
            i['signatoryType'] = i.signatoryTypeId
              ? i.signatoryTypeId.signatoryTypeId
              : '';
            i['documentsXML'] = i.documentsXMLId
              ? i.documentsXMLId.documentsXMLId
              : '';
            return i;
          });
          setTimeout(() => {
            this.totalSignature = res.count;
            this.getDescriptionsT();
          }, 200);
        },
        error: error => {
          console.log(error);
          this.testDataSignature = [];
          this.dataTableSignature.load([]);
          this.totalSignature = 0;
          this.loadingSignature = false;
        },
      });
  }

  getDescriptionsT() {
    this.testDataSignature.forEach((element, count) => {
      if (element) {
        if (element.id_tipo_firmante) {
          const params = new ListParams();
          params['filter.signatoryType'] = '$eq:' + element.id_tipo_firmante;
          // params['sortBy'] = 'goodId:ASC';
          this.svSignatureAuxiliaryCatalogsService
            .getComerTypeSignatories(params)
            .subscribe({
              next: res => {
                console.log('DATA DESCRIPCION DENOMINATION', res);
                this.testDataSignature[count]['description'] =
                  res.data[0].denomination;
                if (this.testDataSignature.length - 1 == count) {
                  this.endDescriptionT();
                }
              },
              error: error => {
                // console.log(error);
                this.testDataSignature[count]['description'] = 'Verificar';
                if (this.testDataSignature.length - 1 == count) {
                  this.endDescriptionT();
                }
              },
            });
        }
      }
    });
  }

  endDescriptionT() {
    this.dataTableSignature.load(this.testDataSignature);
    this.loadingSignature = false;
  }

  openCommercializationOrigin() {
    this.openModalCommercializationOrigin({});
  }

  openModalCommercializationOrigin(
    context?: Partial<CommercializationOriginsModalComponent>
  ) {
    const modalRef = this.modalService.show(
      CommercializationOriginsModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.onConfirm.subscribe(data => {
      console.log(data);
      this.loadingDataTableReport();
    });
  }

  editCommercializationOrigin(event: any) {
    console.log(event);
    if (event) {
      this.openModalCommercializationOrigin({
        data: event.data,
        edit: true,
      });
    }
  }

  openCommercializationDestination() {
    if (!this.originId) {
      this.alert(
        'warning',
        'Selecciona un Registro de la Tabla "Comercialización Origenes" para Continuar',
        ''
      );
      return;
    }
    this.openModalCommercializationDestination({
      data: { originId: this.originId },
    });
  }

  openModalCommercializationDestination(
    context?: Partial<CommercializationDestinationModalComponent>
  ) {
    const modalRef = this.modalService.show(
      CommercializationDestinationModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.onConfirm.subscribe(data => {
      console.log(data);
      this.loadingDataTableAddresee();
    });
  }

  editCommercializationDestination(event: any) {
    console.log(event);
    if (event) {
      this.openModalCommercializationDestination({
        data: event.data,
        edit: true,
      });
    }
  }

  openCommercializationType() {
    this.openModalCommercializationType({});
  }

  openModalCommercializationType(context?: Partial<TypesModalComponent>) {
    const modalRef = this.modalService.show(TypesModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onConfirm.subscribe(data => {
      console.log(data);
      this.loadingDataTableType();
    });
  }

  editCommercializationType(event: any) {
    console.log(event);
    if (event) {
      this.openModalCommercializationType({
        data: event.data,
        edit: true,
      });
    }
  }

  openCommercializationEvent() {
    this.openModalCommercializationEvent({});
  }

  openModalCommercializationEvent(
    context?: Partial<CommercializationEventModalComponent>
  ) {
    const modalRef = this.modalService.show(
      CommercializationEventModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.onConfirm.subscribe(data => {
      console.log(data);
      this.loadingDataTableAddresee();
    });
  }

  editCommercializationEvent(event: any) {
    console.log(event);
    if (event) {
      this.openModalCommercializationEvent({
        data: event.data,
        edit: true,
      });
    }
  }

  openCommercializationSignature() {
    if (!this.idDocumentsXml) {
      this.alert(
        'warning',
        'Selecciona un Registro de la Tabla "Eventos" para Continuar',
        ''
      );
      return;
    }
    this.openModalCommercializationSignature({
      data: { id_docums_xml: this.idDocumentsXml },
    });
  }

  openModalCommercializationSignature(
    context?: Partial<CommercializationSignatureModalComponent>
  ) {
    const modalRef = this.modalService.show(
      CommercializationSignatureModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.onConfirm.subscribe(data => {
      console.log(data);
      this.loadingDataTableAddresee();
    });
  }

  editCommercializationSignature(event: any) {
    console.log(event);
    if (event) {
      this.openModalCommercializationSignature({
        data: { ...event.data, id_docums_xml: this.idDocumentsXml },
        edit: true,
      });
    }
  }
}
