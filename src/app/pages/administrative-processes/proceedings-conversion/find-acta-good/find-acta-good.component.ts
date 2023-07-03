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
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { ACTAS } from '../proceedings-conversion/proceedings-conversion-columns';
import { IInitFormProceedingsBody } from '../proceedings-conversion/proceedings-conversion.component';
@Component({
  selector: 'app-find-acta-good',
  templateUrl: './find-acta-good.component.html',
  styles: [],
})
export class FindActaGoodComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  actas: IProceedingDeliveryReception[] = [];
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
  @Input() idConversion: number | string;

  // @Output() onConfirm = new EventEmitter<any>();
  constructor(
    private modalRef: BsModalRef,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private opcion: ModalOptions,
    private convertiongoodService: ConvertiongoodService,
    protected goodprocessService: GoodProcessService,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...ACTAS,
      },
    };
  }
  ngOnInit(): void {
    this.providerForm.patchValue(this.actas);
    this.dataFactActas
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            this.cve = filter.field == 'cveActaConv';
            field = `filter.${filter.field}`;
            filter.field == 'idConversion' ||
            filter.field == 'fileNumber' ||
            filter.field == 'goodFatherNumber' ||
            filter.field == 'witnessOic' ||
            filter.field == 'cveActaConv'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
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
    this.modalRef.hide();
  }

  getStatusDeliveryCve() {
    // console.log(this.providerForm.value.cveActa.replace(/\//g, ''));
    // console.log(nuevaCadena);
    console.log(this.providerForm.value.cve);
    this.proceedingsDeliveryReceptionService
      .getStatusDeliveryCveExpendiente(this.providerForm.value.cveActa)
      .subscribe({
        next: data => {
          this.dataFactActas.load(data.data);
          this.dataFactActas.refresh();
          this.loading = false;
          this.totalItems2 = data.count;
          // console.log(this.dataTableGoodsActa);
        },
        error: error => {
          this.loading = false;
          // console.log(error);
          // this.dataTableGoodsConvertion.load([]);
          // this.dataTableGoodsConvertion.refresh();
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
    // for (const prop in this.selectedRow) {
    //   if (Object.prototype.hasOwnProperty.call(this.selectedRow, prop)) {
    //     console.log(`${prop}: ${this.selectedRow[0].idConversion}`);
    //   }
    // }
    this.onSave.emit(this.selectedRow);
    this.modalRef.hide();
    // this.router.navigate(
    //   ['/pages/administrative-processes/proceedings-conversion'],
    //   {
    //     queryParams: {
    //       origin: 'FACTDBCONVBIEN',
    //       PAR_IDCONV: Number(this.selectedRow.id),
    //     },
    //   }
    // );
  }
}
