import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
import { IInitFormProceedingsBody } from 'src/app/pages/administrative-processes/proceedings-conversion/proceedings-conversion/proceedings-conversion.component';
import { ActasConvertionCommunicationService } from 'src/app/pages/administrative-processes/proceedings-conversion/services/proceedings-conversionn';
import { ACTAS } from '../implementation-report-historic/implementation-report-historic-columns';

@Component({
  selector: 'app-find-acta',
  templateUrl: './find-acta.component.html',
  styles: [],
})
export class FindActaComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  actas: string;
  expedienteNumber: any;
  columnFilters: any = [];
  pageParams: IInitFormProceedingsBody = null;
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
  @Input() loadingExpedient: boolean;
  actaActual: any;
  valDelete: boolean = false;
  // @Output() onConfirm = new EventEmitter<any>();
  constructor(
    private modalRef: BsModalRef,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private opcion: ModalOptions,
    private changeDetectorRef: ChangeDetectorRef,
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
      actions: false,
      // actions: {
      //   title: 'Acciones',
      //   delete: true,
      //   edit: false,
      //   add: false,
      // },
      columns: {
        ...ACTAS,
      },
    };
  }
  ngOnInit(): void {
    // this.providerForm.patchValue(this.actas);
    this.dataFactActas
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            // this.cve = filter.field == 'cveActa';
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'numberProceedings':
                searchFilter = SearchFilter.EQ;
                break;
              case 'numberGood':
                searchFilter = SearchFilter.EQ;
                break;
              case 'amount':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getStatusDeliveryCve();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStatusDeliveryCve());
  }

  return() {
    this.loadingExpedient = false;
    console.log('SIIII', this.valDelete);
    if (this.valDelete) {
      this.ejecutarFuncionDesdeModal(true);
    }
    this.modalRef.hide();
  }

  getStatusDeliveryCve() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.detailProceeDelRecService.getProcedingImp(params).subscribe({
      next: data => {
        console.log(data);
        let result = data.data.map((item: any) => {
          item['received'] = item.received = 'S';
        });
        this.dataFactActas.load(data.data);
        this.dataFactActas.refresh();
        this.loading = false;
        this.totalItems2 = data.count;

        console.log('asdasd ', this.dataTableGoodsActa);
      },
      error: error => {
        this.loading = false;
        this.totalItems2 = 0;
        // console.log(error);
        // this.dataFactActas.load([]);
        // this.dataFactActas.refresh();
      },
    });
  }

  handleSuccess(): void {
    this.loading = false;
    this.onSave.emit(this.selectedGooodsValid);
    this.modalRef.hide();
  }

  showDeleteMsg($event: any) {
    const data = $event.data;
    this.detailProceeDelRecService.getGoodsByProceedings(data.id).subscribe({
      next: data => {
        this.alert(
          'warning',
          'No Puede Borrar Registro Maestro Cuando Existen Registros Detalles Coincidentes.',
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
      '¿Desea Eliminar Este Registro?'
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
              this.alert('success', 'Acta Eliminada Correctamente', '');
              this.getStatusDeliveryCve();
              // console.log(this.dataTableGoodsActa);
            },
            error: error => {
              this.loading = false;
              this.totalItems2 = 0;
              this.alert(
                'error',
                'Ocurrió un error al Intentar Eliminar el Acta',
                ''
              );
              // console.log(error);
              // this.dataFactActas.load([]);
              // this.dataFactActas.refresh();
            },
          });
      }
    });
  }
  selectedGooodsValid: any[] = [];
  selectedGooods: any[] = [];

  ejecutarFuncionDesdeModal(val: boolean) {
    this.sharedService.ejecutarFuncion(val);
  }

  onUserRowSelect(event: { data: any; selected: any[] }) {
    this.selectedRow = event.data;
    this.selectedGooods = event.selected;
    this.selectedGooodsValid.push(this.selectedRow);
    console.log(this.selectedGooodsValid);
    console.log(this.selectedGooods);
    this.changeDetectorRef.detectChanges();
  }
}