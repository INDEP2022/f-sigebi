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
import { BasePage } from 'src/app/core/shared/base-page';
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
  reportSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
  };
  addresseeSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
  };
  typeSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: true,
      edit: true,
      delete: true,
    },
  };
  eventSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  signatureSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  reportTestData = [
    {
      screen: 'FCOMEREPINGXMAND',
      signerQuantity: 3,
      title: 'Reporte de Órdenes de Ingreso de Muebles por Mandato',
      report: 'RCOMERINGXMAND',
    },
    {
      screen: 'FCOMEREPINGXMAND_I',
      signerQuantity: 3,
      title: 'Reporte de Órdenes de Ingreso de Inmuebles por Mandato',
      report: 'RCOMERINGXMAND',
    },
  ];

  addresseeTestData = [
    {
      email: 'testemail1@example.com',
      name: 'Andrea Morales',
    },
    {
      email: 'testemail2@example.com',
      name: 'Victor Mejia',
    },
    {
      email: 'testemail3@example.com',
      name: 'Juan Jimenez',
    },
  ];

  typeTestData = [
    {
      denomination: 'ELABORA',
      order: 1,
    },
    {
      denomination: 'REVISA',
      order: 2,
    },
    {
      denomination: 'AUTORIZA',
      order: 3,
    },
  ];

  eventTestData = [
    {
      event: 4515,
      reportId: 165,
      originId: 467,
      documentId: 617,
      title: 'Reporte de Ingreso de Bienes 165',
      creationDate: '27/06/2021',
      status: 'C CREADO',
    },
    {
      event: 4516,
      reportId: 184,
      originId: 468,
      documentId: 618,
      title: 'Reporte de Ingreso de Bienes 166',
      creationDate: '27/06/2021',
      status: 'C CREADO',
    },
    {
      event: 4517,
      reportId: 192,
      originId: 469,
      documentId: 619,
      title: 'Reporte de Ingreso de Bienes 167',
      creationDate: '27/06/2021',
      status: 'C CREADO',
    },
  ];

  signatureTestData = [
    {
      reportId: 1976,
      reportNumber: 165,
      user: 'JPEREZ',
      name: 'Juan Perez',
      position: 'Gerente',
      type: 'ELABORA',
      signer: '',
      signDate: '',
    },
    {
      reportId: 1977,
      reportNumber: 166,
      user: 'EMORALES',
      name: 'Edwin Morales',
      position: 'Administrador',
      type: 'ELABORA',
      signer: '',
      signDate: '',
    },
  ];

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
    this.getData();
    this.initForm();
  }

  initForm() {
    this.loadingDataTableReport();
    this.loadingDataTableAddresee();
  }

  getData() {
    this.reportColumns = this.reportTestData;
    this.reportTotalItems = this.reportColumns.length;
    this.typeColumns = this.typeTestData;
    this.typeTotalItems = this.typeColumns.length;
    this.typeColumns.forEach(e => this.orders.push(e.order));
    this.eventColumns = this.eventTestData;
    this.eventTotalItems = this.eventColumns.length;
  }

  selectReport(report: any[]) {
    this.addresseeColumns = this.addresseeTestData;
    this.addresseeTotalItems = this.addresseeColumns.length;
    this.selectedReport = report;
  }

  selectEvent(event: any[]) {
    this.signatureColumns = this.signatureTestData;
    this.signatureTotalItems = this.signatureColumns.length;
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

  openFormType(type?: any) {
    this.openModalType({ type });
  }

  openModalType(context?: Partial<TypesModalComponent>) {
    const modalRef = this.modalService.show(TypesModalComponent, {
      initialState: { ...context, orders: this.orders },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onConfirm.subscribe(data => {
      if (data) this.refreshTyes();
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
            field = `filter.user`;

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

    this.columnFiltersReport['filter.creationdate'] = `$order:desc`;
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
            field = `filter.user`;

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

    this.columnFiltersAddresee['filter.creationdate'] = `$order:desc`;
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
}
