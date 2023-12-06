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
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { RadiobuttonElementComponent } from 'src/app/shared/components/radiobutton-element-smarttable/radiobutton-element';

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
  ropid: LocalDataSource = new LocalDataSource();
  cve: any;
  settingsRop;
  totalItemRrop: number = 0;
  loadingRop: boolean = false;
  donationGood: IGoodDonation;
  totalItemsRopa: number = 0;
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
    this.settingsRop = {
      ...this.settingsRop,
      hideSubHeader: false,
      actions: false,
      columns: {
        goodid: {
          title: 'No. Bien',
          sort: false,
          visible: true,
        },
        description: {
          title: 'Descripción',
          sort: false,
          visible: true /*
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good?.description;
          },*/,
        },
        RIC: {
          filter: false,
          sort: false,
          title: 'RIC',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction(row: any) {
            return row;
          },
          renderComponent: RadiobuttonElementComponent,
        },
        CH: {
          filter: false,
          sort: false,
          title: 'CH',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction(row: any) {
            return row;
          },
          renderComponent: RadiobuttonElementComponent,
        },
        N: {
          filter: false,
          sort: false,
          title: 'N',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction(row: any) {
            return row;
          },
          renderComponent: RadiobuttonElementComponent,
        },
        Q: {
          filter: false,
          sort: false,
          title: 'Q',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction(row: any) {
            return row;
          },
          renderComponent: RadiobuttonElementComponent,
        },
      },
    };
  }
  ngOnInit(): void {
    this.dataDetail
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            // this.cve = filter.field == 'cveAct';
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
  ropaId(rop: string) {
    return rop;
  }
  onRopaId(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.updateGood(data.row, data.toggle),
    });
  }

  getStatusDeliveryCve() {
    this.loadingRop = true;
    this.params.getValue()['filter.recordId'] = `$eq:${localStorage.getItem(
      'actaId'
    )}`;
    this.params.getValue()['filter.good.noClasifGood'] = `$eq:${778}`;
    this.params.getValue()['filter.good.unit'] = `$eq:PIEZA`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.donationService.getEventComDonationDetail(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.dataDetail.load(resp.data);
        this.dataDetail.refresh();
        this.loadingRop = false;
        this.totalItemsRopa = resp.count;
      },
      error: err => {
        this.loadingRop = true;
        this.dataDetail.load([]);
        this.dataDetail.refresh();
        this.totalItemsRopa = 0;
      },
    });
  }
  updateGood(row: any, selected?: boolean) {
    if (selected) {
      console.log('actualiza', row);
    } else {
      console.log('actualiza');
    }
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
