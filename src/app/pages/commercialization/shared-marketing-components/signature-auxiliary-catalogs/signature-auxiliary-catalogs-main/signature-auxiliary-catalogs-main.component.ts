import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
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
      delete: true,
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
      delete: true,
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
      delete: true,
    },
  };
  eventSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: true,
    },
  };
  signatureSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: true,
    },
  };

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private svSignatureAuxiliaryCatalogsService: SignatureAuxiliaryCatalogsService,
    private datePipe: DatePipe
  ) {
    super();
    this.reportSettings.edit = {
      editButtonContent:
        '<i class="fa fa-pencil-alt text-warning mx-2 pl-3"></i>',
    };
    this.addresseeSettings.edit = {
      editButtonContent:
        '<i class="fa fa-pencil-alt text-warning mx-2 pl-3"></i>',
    };
    this.typeSettings.edit = {
      editButtonContent:
        '<i class="fa fa-pencil-alt text-warning mx-2 pl-3"></i>',
    };

    (this.eventSettings.delete = {
      deleteButtonContent: '<i class="fa fa-trash text-danger mx-2 pl-5"></i>',
      confirmDelete: true,
    }),
      (this.reportSettings.columns = ELECTRONIC_SIGNATURE_REPORT_COLUMNS);
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
    this.loadingDataTableAddresee();
    this.loadingDataTableSignature();
  }

  selectReport(event: any) {
    console.log(event);
    if (event.isSelected) {
      this.originId = event.data.originId;
      this.addresseeData = event.data;
      this.testDataAddresee = [];
      this.dataTableAddresee.load([]);
      this.totalAddresee = 0;
      this.dataTableAddresee.reset();
      setTimeout(() => {
        this.getAddreseeData();
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
        this.getSignatureData();
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
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
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
          this.getReportData();
        }
      });
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
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
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
          this.getTypeData();
        }
      });
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
    this.dataTableAddresee
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

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
          this.getAddreseeData();
        }
      });

    this.dataTableParamsAddresee
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => {
        if (this.totalAddresee > 0) this.getAddreseeData();
      });
  }

  getAddreseeData() {
    if (!this.originId) return;
    this.loadingAddresee = true;
    let params = {
      ...this.dataTableParamsAddresee.getValue(),
      ...this.columnFiltersAddresee,
    };
    params['filter.originId'] = `$eq:${this.originId}`;
    console.log('PARAMS ', params);
    this.svSignatureAuxiliaryCatalogsService.getComerDestXML(params).subscribe({
      next: res => {
        console.log('DATA ADDRESEE', res);
        this.testDataAddresee = res.data;
        this.dataTableAddresee.load(res.data);
        this.dataTableAddresee.refresh();
        this.totalAddresee = res.count;
        this.loadingAddresee = false;
      },
      error: error => {
        console.log(error);
        this.testDataAddresee = [];
        this.dataTableAddresee.load([]);
        this.dataTableAddresee.refresh();
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
              creationDate: () => (searchFilter = SearchFilter.EQ),
              title: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              console.log('filter.field', filter.field);
              if (filter.field == 'creationDate') {
                filter.search = this.datePipe.transform(
                  filter.search,
                  'yyyy-MM-dd'
                );
              }
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
    params['filter.documentStatus'] = `$eq:0`;
    params['sortBy'] = `documentsXMLId:DESC`;
    console.log('PARAMS ', params);
    this.svSignatureAuxiliaryCatalogsService
      .getAllComerceDocumentsXmlH(params)
      .subscribe({
        next: res => {
          console.log('DATA EVENT', res);

          let result = res.data.map(async (i: any) => {
            i['origin'] = i.originId ? i.originId.originId : '';
            i['description'] = await this.getDescriptions(i.documentStatus);
          });

          Promise.all(result).then(resp => {
            this.dataTableEvent.load(res.data);
            this.dataTableEvent.refresh();
            this.loadingEvent = false;
            this.totalEvent = res.count;
          });
        },
        error: error => {
          this.testDataEvent = [];
          this.dataTableEvent.load([]);
          this.dataTableEvent.refresh();
          this.totalEvent = 0;
          this.loadingEvent = false;
        },
      });
  }

  async getDescriptions(documentStatus: any) {
    const params = new ListParams();
    params['filter.parametro'] = 'EST_REP_FIRMA';
    params['filter.valor'] = `${documentStatus}`;
    return new Promise((resolve, reject) => {
      this.svSignatureAuxiliaryCatalogsService
        .getParameterMod(params)
        .subscribe({
          next: res => {
            resolve(
              documentStatus + ' - ' + res.data[0]['descriptionparameter']
            );
          },
          error: error => {
            resolve(documentStatus + ' - ' + 'Verificar');
          },
        });
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
    this.dataTableParamsSignature
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => {
        if (this.totalSignature > 0) this.getSignatureData();
      });
  }

  getSignatureData() {
    this.loadingSignature = true;
    let params = {
      ...this.dataTableParamsSignature.getValue(),
      ...this.columnFiltersSignature,
    };
    params['filter.id_docums_xml'] = `$eq:${this.idDocumentsXml}`;
    console.log('PARAMS ', params);
    this.svSignatureAuxiliaryCatalogsService
      .getAllComerceDocumentsXmlTCatFelec(params)
      .subscribe({
        next: res => {
          console.log('DATA SIGNATURE', res);
          let result = res.data.map(async (i: any) => {
            i['signatoryType'] = i.signatoryTypeId
              ? i.signatoryTypeId.signatoryTypeId
              : '';
            i['documentsXML'] = i.documentsXMLId
              ? i.documentsXMLId.documentsXMLId
              : '';
            i['description'] = await this.getDescriptionsT(i.id_tipo_firmante);
          });

          Promise.all(result).then(resp => {
            this.totalSignature = res.count;
            this.dataTableSignature.load(res.data);
            this.dataTableSignature.refresh();
            this.loadingSignature = false;
          });
        },
        error: error => {
          this.testDataSignature = [];
          this.dataTableSignature.load([]);
          this.dataTableSignature.refresh();
          this.totalSignature = 0;
          this.loadingSignature = false;
        },
      });
  }

  async getDescriptionsT(id_tipo_firmante: any) {
    const params = new ListParams();
    params['filter.signatoryType'] = `$eq:${id_tipo_firmante}`;
    return new Promise((resolve, reject) => {
      this.svSignatureAuxiliaryCatalogsService
        .getComerTypeSignatories(params)
        .subscribe({
          next: res => {
            resolve(res.data[0].denomination);
          },
          error: error => {
            resolve('Verificar');
          },
        });
    });
  }

  getDescriptionsT2() {
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
      this.getReportData();
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
        'Selecciona un registro de la tabla "Comercialización Origenes" para continuar',
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
      this.getAddreseeData();
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
      this.getEventData();
    });
  }

  deleteCommercializationEvent(event: any) {
    console.log(event);
    if (event) {
      this.alertQuestion(
        'question',
        'Se eliminará el registro',
        '¿Desea continuar?'
      ).then(quesition => {
        if (quesition.isConfirmed) {
          this.deleteEvent(event.data);
        }
      });
      return;
      const params = new FilterParams();
      params.addFilter('id_docums_xml', event.data.documentsXMLId);
      this.svSignatureAuxiliaryCatalogsService
        .getAllComerceDocumentsXmlTCatFelec(params.getParams())
        .subscribe({
          next: res => {
            console.log('RESPONSE', res);
            this.loadingEvent = false;
            this.alert(
              'warning',
              'No es posible eliminar este registro',
              'Ya existen registros asociados'
            );
          },
          error: async error => {
            console.log(error);
            if (error.status == 400) {
              let confirm = await this.alertQuestion(
                'warning',
                'Eliminar',
                '¿Desea eliminar este registro?'
              );
              if (confirm.isConfirmed) {
                this.deleteEvent(event.data);
              } else {
                this.loadingEvent = false;
              }
            } else {
              this.loadingEvent = false;
              this.alert(
                'error',
                'Error',
                'Ocurrió un error al validar si existen registros relacionados'
              );
            }
          },
        });
    }
  }

  deleteEvent(data: ComerceDocumentsXmlH) {
    console.log(data);
    // return;
    this.svSignatureAuxiliaryCatalogsService
      .deleteComerceDocumentsXmlH(data.documentsXMLId)
      .subscribe({
        next: res => {
          console.log('RESPONSE', res);
          // this.loadingEvent = false;
          this.getEventData();
          this.alert('success', 'Registro Eliminado Correctamente', '');
        },
        error: error => {
          console.log(error);
          // this.loadingEvent = false;
          if (
            error.error.message ==
            `update or delete on table \"comer_docums_xml_h\" violates foreign key constraint \"comer_docums_xml_t_h_fk\" on table \"comer_docums_xml_t\"`
          ) {
            this.alert(
              'warning',
              'No se pudo eliminar el registro porque tiene firmantes asociados',
              'Verifique la tabla Firmantes e intente nuevamente'
            );
          } else {
            this.alert(
              'error',
              'No se pudo eliminar el registro',
              'Verifique e intente nuevamente'
            );
          }
          // this.alert(
          //   'error',
          //   'Error',
          //   'Ocurrió un error al eliminar registros relacionados'
          // );
        },
      });
  }

  valNewFirmante(): boolean {
    if (this.totalSignature == this.totalType) return false;
    return true;
  }

  async openCommercializationSignature() {
    if (!this.idDocumentsXml) {
      this.alert(
        'warning',
        'Selecciona un registro de la tabla "Eventos" para continuar',
        ''
      );
      return;
    }
    let resp = this.valNewFirmante();
    if (!resp)
      return this.alert(
        'warning',
        'No se puede agregar otra firma.',
        'Total de firmas: ' + this.totalSignature
      );
    this.openModalCommercializationSignature({
      data: null,
      idDocumentsxml: this.idDocumentsXml,
      countTypeSignatures: this.totalType,
    });
  }

  openModalCommercializationSignature(
    context?: Partial<CommercializationSignatureModalComponent>
  ) {
    console.log('CONTEXT ', context);

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
      this.getSignatureData();
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

  deleteCommercializationOrigin(event: any) {
    // console.log(event)
    this.alertQuestion(
      'question',
      'Se eliminará el registro',
      '¿Desea Continuar?'
    ).then(resp => {
      if (resp.isConfirmed) {
        this.svSignatureAuxiliaryCatalogsService
          .deleteComerOrigins(event.data.originId)
          .subscribe({
            next: res => {
              this.alert('success', 'Registro Eliminado Correctamente', '');
              this.getReportData();
            },
            error: error => {
              console.log(error);
              if (
                error.error.message ==
                `update or delete on table "comer_origenes" violates foreign key constraint "comer_dest_xml_o_fk" on table "comer_dest_xml"`
              ) {
                this.alert(
                  'warning',
                  'No se pudo eliminar el registro porque tiene correos asociados',
                  'Verifique la tabla Comercialización Destino XML e intente nuevamente'
                );
              } else {
                this.alert(
                  'error',
                  'No se pudo eliminar el registro',
                  'Verifique e intente nuevamente'
                );
              }
            },
          });
      }
    });
  }

  deleteCommercializationOriginEmail(event: any) {
    this.alertQuestion(
      'question',
      'Se eliminará el registro',
      '¿Desea Continuar?'
    ).then(resp => {
      if (resp.isConfirmed) {
        let obj = {
          originId: event.data.originId,
          email: event.data.email,
        };
        this.svSignatureAuxiliaryCatalogsService
          .deleteComerDestXML(obj)
          .subscribe({
            next: res => {
              this.alert(
                'success',
                'Correo Electrónico Eliminado Correctamente',
                ''
              );
              this.getAddreseeData();
            },
            error: error => {
              this.alert('warning', 'No se pudo eliminar el registro', '');
            },
          });
      }
    });
  }

  deleteCommercializationType(event: any) {
    this.alertQuestion(
      'question',
      'Se eliminará el registro',
      '¿Desea Continuar?'
    ).then(resp => {
      if (resp.isConfirmed) {
        this.svSignatureAuxiliaryCatalogsService
          .deleteComerTypeSignatories(event.data.signatoryType)
          .subscribe({
            next: res => {
              this.alert(
                'success',
                'Tipo de Firmante Eliminado Correctamente',
                ''
              );
              this.getTypeData();
            },
            error: error => {
              this.alert('warning', 'No se pudo eliminar el registro', '');
            },
          });
      }
    });
  }
  deleteCommercializationSignature(event: any) {
    this.alertQuestion(
      'question',
      'Se eliminará el registro',
      '¿Desea Continuar?'
    ).then(resp => {
      if (resp.isConfirmed) {
        let obj = {
          numberconsec: event.data['no_consec'],
          idDocumentsxml: event.data['id_docums_xml'],
        };
        this.svSignatureAuxiliaryCatalogsService
          .deleteComerceDocumentsXmlT(obj)
          .subscribe({
            next: res => {
              this.alert('success', 'Firmante Eliminado Correctamente', '');
              this.getSignatureData();
            },
            error: error => {
              this.alert('warning', 'No se pudo eliminar el registro', '');
            },
          });
      }
    });
  }
}
