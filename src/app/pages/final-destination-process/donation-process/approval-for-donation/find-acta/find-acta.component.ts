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
import { IGoodDonation } from 'src/app/core/models/ms-donation/donation.model';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ACTAS } from '../capture-approval-donation/columns-approval-donation';
import { ServiceService } from './service.service';

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
  edit = false;
  vaultSelect: any;
  cve: any;
  donationGood: IGoodDonation;
  totalItems2: number = 0;
  selectedRow: any | null = null;
  conversiones: any;
  providerForm: FormGroup = new FormGroup({});
  dataTableGoodsActa: LocalDataSource = new LocalDataSource();
  dataFactActas: LocalDataSource = new LocalDataSource();
  @Input() agregarCaptura: Function;
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
    protected goodprocessService: GoodProcessService,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private sharedService: ServiceService,
    private donationService: DonationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        title: 'Acciones',
        delete: true,
        edit: true,
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
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            this.cve = filter.field == 'cveAct';
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'actType':
                searchFilter = SearchFilter.EQ;
                break;
              case 'actId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'expedient':
                searchFilter = SearchFilter.EQ;
                break;
              case 'folioUniversal':
                searchFilter = SearchFilter.EQ;
                break;
              case 'actType':
                searchFilter = SearchFilter.EQ;
                break;
              case 'elaborated':
                searchFilter = SearchFilter.EQ;
                break;
              case 'captureDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'closeDate':
                filter.search = this.returnParseDate(filter.search);
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
    this.params.getValue()['filter.actType'] = 'COMPDON';
    params['sortBy'] = `captureDate:DESC`;
    this.donationService.getEventGood(params).subscribe({
      next: data => {
        console.log(data.data);

        this.dataFactActas.load(data.data);
        this.dataFactActas.refresh();
        this.loading = false;
        this.totalItems2 = data.count;
      },
      error: error => {
        this.loading = false;
        this.totalItems2 = 0;
      },
    });
  }

  onUserRowSelect(row: any): void {
    if (row.isSelected) {
      this.selectedRow = row.data;
      console.log(this.selectedRow);
    } else {
      this.selectedRow = null;
    }
  }

  handleSuccess(): void {
    this.loading = false;
    // for (const prop in this.selectedRow) {
    //   if (Object.prototype.hasOwnProperty.call(this.selectedRow, prop)) {
    //     console.log(`${prop}: ${this.selectedRow[0].idConversion}`);
    //   }
    // }
    this.onSave.emit(this.selectedRow);
    this.modalRef.hide();
  }

  showDeleteMsg($event: any) {
    const data = $event.data;
    this.detailProceeDelRecService
      .getGoodsByProceedings(data.actaId)
      .subscribe({
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

  ejecutarFuncionDesdeModal(val: boolean) {
    this.sharedService.ejecutarFuncion(val);
  }
}
