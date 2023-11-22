import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IActasConversion } from 'src/app/core/models/ms-convertiongood/convertiongood';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ACTAS } from '../columns2';
// import { IInitFormProceedingsBody } from '../proceedings-conversion/proceedings-conversion.component';
import { ActasConvertionCommunicationService } from '../services/services';
@Component({
  selector: 'app-search-actas',
  templateUrl: './search-actas.component.html',
  styles: [],
})
export class SearchActasComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  actas: string;
  expedienteNumber: any;
  columnFilters: any = [];
  // pageParams: IInitFormProceedingsBody = null;
  conversionGood: IActasConversion;
  edit = false;
  vaultSelect: any;
  cve: any;
  totalItems2: number = 0;
  selectedRow: any | null = null;
  conversiones: any;
  providerForm: FormGroup = new FormGroup({});
  dataTableGoodsActa: LocalDataSource = new LocalDataSource();
  dataFactActas: LocalDataSource = new LocalDataSource();
  @Output() onSave = new EventEmitter<any>();
  @Output() cleanForm = new EventEmitter<any>();
  @Input() idConversion: number | string;
  actaActual: any;
  valDelete: boolean = false;
  // @Output() onConfirm = new EventEmitter<any>();
  constructor(
    private modalRef: BsModalRef,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private opcion: ModalOptions,
    private convertiongoodService: ConvertiongoodService,
    protected goodprocessService: GoodProcessService,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private sharedService: ActasConvertionCommunicationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        delete: true,
        edit: false,
        add: false,
      },
      columns: {
        ...ACTAS,
      },
    };
  }
  ngOnInit(): void {
    this.dataFactActas
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              statusProceedings: () => (searchFilter = SearchFilter.ILIKE),
              keysProceedings: () => (searchFilter = SearchFilter.ILIKE),
              idTypeProceedings: () => (searchFilter = SearchFilter.EQ),
              elaborationDate: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getStatusDeliveryCve();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStatusDeliveryCve());
  }

  return() {
    console.log('SIIII', this.valDelete);
    if (this.valDelete) {
      this.ejecutarFuncionDesdeModal(true);
    }
    this.modalRef.hide();
  }

  getStatusDeliveryCve() {
    this.loading = true;
    // console.log(this.providerForm.value.cveActa.replace(/\//g, ''));
    // console.log(nuevaCadena);
    // console.log(this.providerForm.value.cve);
    this.params.getValue()['filter.numFile'] = this.expedienteNumber;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (params['filter.elaborationDate']) {
      var fecha = new Date(params['filter.elaborationDate']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;

      params[
        'filter.elaborationDate'
      ] = `$btw:${fechaFormateada}T00:00:00.000Z,${fechaFormateada}T23:59:59.999Z`;
      // delete params['filter.elaborationDate'];
    }

    params['filter.typeProceedings'] = `$eq:DONACION`;
    this.proceedingsDeliveryReceptionService
      .getStatusDeliveryCveExpendienteAll(params)
      .subscribe({
        next: data => {
          console.log(data);
          let result = data.data.map((item: any) => {
            item['numTransfer_'] = item.numTransfer
              ? item.numTransfer.id
              : null;
          });
          this.dataFactActas.load(data.data);
          this.dataFactActas.refresh();
          this.loading = false;
          this.totalItems2 = data.count;
          // console.log(this.dataTableGoodsActa);
        },
        error: error => {
          this.loading = false;
          this.totalItems2 = 0;
          // console.log(error);
          this.dataFactActas.load([]);
          this.dataFactActas.refresh();
        },
      });
  }

  onUserRowSelect(row: any): void {
    if (row.isSelected) {
      this.selectedRow = row.data;
    } else {
      this.selectedRow = null;
    }

    console.log(this.selectedRow);
  }

  handleSuccess(): void {
    this.loading = false;
    this.onSave.emit(this.selectedRow);
    this.modalRef.hide();
  }

  showDeleteMsg($event: any) {
    const data = $event.data;
    this.detailProceeDelRecService.getGoodsByProceedings(data.id).subscribe({
      next: data => {
        this.alert(
          'warning',
          'El Acta no se puede eliminar porque tiene bienes asociados',
          ''
        );
      },
      error: error => {
        this.deleteD(data);
      },
    });
  }

  deleteD(data: any) {
    const dataaaID = data.id;
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.proceedingsDeliveryReceptionService
          .deleteProceedingsDeliveryReception(data.id)
          .subscribe({
            next: data => {
              if (this.actaActual)
                if (this.actaActual.id == dataaaID) {
                  this.valDelete = true;
                  this.ejecutarFuncionDesdeModal(true);
                }
              this.alert('success', 'Acta eliminada correctamente', '');
              this.getStatusDeliveryCve();
              // console.log(this.dataTableGoodsActa);
            },
            error: error => {
              this.loading = false;
              this.totalItems2 = 0;
              this.alert(
                'error',
                'Ocurrió un error al intentar eliminar el Acta',
                ''
              );
              // console.log(error);
              this.dataFactActas.load([]);
              this.dataFactActas.refresh();
            },
          });
      }
    });
  }

  ejecutarFuncionDesdeModal(val: boolean) {
    this.sharedService.ejecutarFuncion(val);
  }
}
