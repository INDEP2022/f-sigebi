import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { GoodByProceedingsModalComponent } from '../good-by-proceedings-modal/good-by-proceedings-modal.component';
import { ProceedingsModalComponent } from '../proceedings-modal/proceedings-modal.component';
import {
  ACTA_RECEPTION_COLUMNS,
  DETAIL_PROCEEDINGS_DELIVERY_RECEPTION,
  DICTATION_COLUMNS,
  GOODS_COLUMNS,
  PROCEEDINGS_COLUMNS,
} from './columns';

export interface IReport {
  data: File;
}

@Component({
  selector: 'app-destruction-authorization',
  templateUrl: './destruction-authorization.component.html',
  styles: [],
})
export class DestructionAuthorizationComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  totalItems4: number = 0;
  totalItems5: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  params5 = new BehaviorSubject<ListParams>(new ListParams());

  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

  filterParams2 = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter2: SearchBarFilter;

  proceedingsList: IProccedingsDeliveryReception[] = [];
  proceedings: IProccedingsDeliveryReception;

  detailProceedingsList: IDetailProceedingsDeliveryReception[] = [];
  detailProceedings: IDetailProceedingsDeliveryReception;
  dictaList: IDictation[] = [];

  goodPDS: IGood[] = [];

  goods: IDetailProceedingsDeliveryReception;

  settings2;
  settings3;
  settings4;
  settings5;

  rowSelected: boolean = false;
  selectedRow: any = null;

  data: LocalDataSource = new LocalDataSource();
  actaList: any;

  loadingProceedings = this.loading;
  loadingGoods = this.loading;
  loadingGoodsByP = this.loading;
  loadingDictation = this.loading;
  loadingActReception = this.loading;

  show: boolean = false;
  show2: boolean = false;

  constructor(
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private modalService: BsModalService,
    private goodService: GoodService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private datePipe: DatePipe,
    private dictationService: DictationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    super();

    this.searchFilter = {
      field: 'keysProceedings',
      operator: SearchFilter.ILIKE,
    };

    this.searchFilter2 = {
      field: 'description',
      operator: SearchFilter.ILIKE,
    };

    this.settings = {
      //Actas
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...PROCEEDINGS_COLUMNS },
    };

    this.settings2 = {
      //Bienes por actas
      ...this.settings,
      actions: false,
      columns: { ...DETAIL_PROCEEDINGS_DELIVERY_RECEPTION },
    };

    this.settings3 = {
      //Bienes en estatus PDS
      ...this.settings,
      actions: false,
      columns: { ...GOODS_COLUMNS },
    };

    this.settings4 = {
      //Actas de recepción
      ...this.settings,
      actions: false,
      columns: { ...ACTA_RECEPTION_COLUMNS },
    };

    this.settings5 = {
      //dictaminaciones
      ...this.settings,
      actions: false,
      columns: { ...DICTATION_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.show = true;
    this.filterParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllProceeding());
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllProceeding());*/
    this.show2 = true;
    this.filterParams2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodByStatusPDS());
  }

  //Trae todas las actas/Oficios
  getAllProceeding(): void {
    if (this.show) this.filterParams.getValue().removeAllFilters();
    this.filterField();
    this.loadingProceedings = true;
    this.proceedingsDeliveryReceptionService
      .getAll3(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          this.show = false;
          // let data = response.data.map(
          //   (item: IProccedingsDeliveryReception) => {
          //     let date1 = item.elaborationDate;
          //     item.elaborationDate = this.datePipe.transform(
          //       date1,
          //       'dd-MM-yyyy'
          //     );
          //     let date2 = item.datePhysicalReception;
          //     item.datePhysicalReception = this.datePipe.transform(
          //       date2,
          //       'dd-MM-yyyy'
          //     );
          //     let date3 = item.captureDate;
          //     item.captureDate = this.datePipe.transform(date3, 'dd-MM-yyyy');
          //     return item;
          //   }
          // );
          console.log(response);
          this.proceedingsList = response.data;
          this.totalItems = response.count;
          this.loadingProceedings = false;
        },
        error: error => {
          this.loadingProceedings = false;
          console.log(error);
        },
      });
  }

  filterField() {
    this.filterParams.getValue().addFilter('typeProceedings', 'RGA');
  }

  //Para agregar nueva acta/oficio
  openForm1(proceeding?: IProccedingsDeliveryReception) {
    let config: ModalOptions = {
      initialState: {
        proceeding,
        callback: (next: boolean) => {
          if (next) this.getAllProceeding();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProceedingsModalComponent, config);
  }

  //Seleccionar una fila de la tabla para ver sus bienes relacionados
  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.detailProceedingsList = [];
    this.proceedings = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsByProceedings(this.proceedings));
  }

  //Consulta los bienes relacionados con el id del acta seleccionada en la tabla
  getGoodsByProceedings(proceedings: IProccedingsDeliveryReception): void {
    this.loadingGoodsByP = true;
    this.detailProceeDelRecService
      .getGoodsByProceedings(proceedings.id, this.params2.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          this.detailProceedingsList = response.data;
          this.totalItems2 = response.count;
          this.loadingGoodsByP = false;
        },
        error: error => (this.loadingGoodsByP = false),
      });
  }

  openForm2() {
    const idP = { ...this.proceedings };
    let config: ModalOptions = {
      initialState: {
        idP,
        callback: (next: boolean) => {
          if (next) this.getGoodsByProceedings(idP);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodByProceedingsModalComponent, config);
  }

  //Método seleccionar columna bien para mostrar dictamen y acta recepcional
  rowsSelected2(event: any) {
    this.totalItems5 = 0;
    this.dictaList = [];
    this.detailProceedings = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDictationbyGood(this.detailProceedings));
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDictationbyGood(this.detailProceedings));
  }

  //Trae las dictaminaciones relacionadas al bien generado por no. de acta
  getDictationbyGood(
    detailProceedings: IDetailProceedingsDeliveryReception
  ): void {
    this.loadingDictation = true;
    this.dictationService
      .getDictationByGood(detailProceedings.numberGood)
      .subscribe({
        next: response => {
          this.dictaList = response.data;
          this.totalItems5 = response.count;
          this.loadingDictation = false;
        },
        error: error => (this.loadingDictation = false),
      });
  }

  //Trae todos los bienes con estado PDS
  getGoodByStatusPDS() {
    if (this.show2) this.filterParams2.getValue().removeAllFilters();
    this.filterField2();
    this.loadingGoods = true;
    this.goodService
      .getGoodByStatusPDS(this.filterParams2.getValue().getParams())
      .subscribe({
        next: response => {
          this.show2 = false;
          this.goodPDS = response.data;
          this.totalItems3 = response.count;
          this.loadingGoods = false;
        },
        error: error => (this.loadingGoods = false),
      });
  }

  filterField2() {
    this.filterParams2.getValue().addFilter('status', 'PDS');
  }

  //Muestra información de la fila seleccionada de actas/oficios
  selectRow(row?: any) {
    console.log('columna seleccionada', row);
    this.selectedRow = row;
    this.rowSelected = true;
  }

  //msj cuando se presiona el botón de escanear
  scan() {
    this.alertQuestion(
      'question',
      'Precaución',
      'Se abrirá la pantalla de escaneo para el folio de escaneo de la solicitud abierta. ¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.alert('success', 'Listo', 'Se redirigió');
        this.router.navigateByUrl('/pages/general-processes/scan-request/scan');
      }
    });
  }

  //Al presionar "Cerrar acta"
  openEmail() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(EmailModalComponent, config);
  }

  //Al presionar "Solicitud" para generar reporte
  report() {
    if (this.proceedings.universalFolio == null) {
      this.alertQuestion(
        'question',
        'Precaución',
        'No hay ningún folio universal asignado, asígnelo primero para continuar'
      ).then(question => {
        if (question.isConfirmed) {
          this.alert(
            'info',
            'Recuerde',
            'Elija una acta y actualice la información'
          );
          this.openForm1;
        }
      });
    } else {
      this.loading = true;
      const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      //console.log(linkSource);
      downloadLink.href = pdfurl;
      downloadLink.target = '_blank';
      downloadLink.click();

      //let newWin = window.open(pdfurl, 'test.pdf');
      this.onLoadToast('success', '', 'Reporte generado');
      this.loading = false;
    }
  }

  /*readFile(file: IReport) {
    const reader = new FileReader();
    reader.readAsDataURL(file.data);
    reader.onload = _event => {
      // this.retrieveURL = reader.result;
      this.openPrevPdf(reader.result as string);
    };
  }
  

  openPrevPdf(pdfurl: string) {
    console.log(pdfurl);
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfurl),
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
  }*/
}
