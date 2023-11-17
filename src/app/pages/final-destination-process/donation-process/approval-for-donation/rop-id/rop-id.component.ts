import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { BasePage } from 'src/app/core/shared/base-page';
import { IInitFormProceedingsBody } from 'src/app/pages/administrative-processes/proceedings-conversion/proceedings-conversion/proceedings-conversion.component';
import { DETALLES } from '../approval-for-donation/approval-columns';
@Component({
  selector: 'app-rop-id',
  templateUrl: './rop-id.component.html',
  styles: [],
})
export class RopIdComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  actas: string;
  expedienteNumber: any;
  columnFilters: any = [];
  pageParams: IInitFormProceedingsBody = null;
  edit = false;
  cve: any;
  totalItemRrop: number = 0;
  loadingRop: boolean = false;
  donationGood: IGoodDonation;
  totalItems2: number = 0;
  selectedRow: any | null = null;
  conversiones: any;
  providerForm: FormGroup = new FormGroup({});
  dataDetail: LocalDataSource = new LocalDataSource();
  @Output() onSave = new EventEmitter<any>();

  valDelete: boolean = false;
  // @Output() onConfirm = new EventEmitter<any>();
  constructor(
    private modalRef: BsModalRef,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private opcion: ModalOptions,
    protected goodprocessService: GoodProcessService,
    private donationService: DonationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: {
        ...DETALLES,
      },
    };
  }
  ngOnInit(): void {
    // this.providerForm.patchValue(this.actas);
    this.dataDetail
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
              case 'goodId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
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
    console.log('SIIII', this.valDelete);
    this.modalRef.hide();
  }

  getStatusDeliveryCve() {
    this.loadingRop = true;
    // console.log(this.providerForm.value.cveActa.replace(/\//g, ''));

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.params.getValue()['filter.actType'] = 'COMPDON';
    params['sortBy'] = `captureDate:DESC`;
    this.donationService.getEventGood(params).subscribe({
      next: data => {
        console.log(data.data);
        // this.donationGood = data.data
        this.dataDetail.load(data.data);
        this.dataDetail.refresh();
        this.loadingRop = false;
        this.totalItems2 = data.count;
      },
      error: error => {
        this.loadingRop = false;
        this.totalItems2 = 0;
        // console.log(error);
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
    this.loadingRop = false;
    this.onSave.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
