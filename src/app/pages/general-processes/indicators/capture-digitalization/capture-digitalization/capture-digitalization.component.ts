import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ICaptureDig, Info } from 'src/app/core/models/ms-documents/documents';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS,
  GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_DATA,
} from './capture-digitalization-columns';

@Component({
  selector: 'app-capture-digitalization',
  templateUrl: './capture-digitalization.component.html',
  styles: [],
})
export class CaptureDigitalizationComponent extends BasePage implements OnInit {
  data = GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_DATA;
  formCapture: FormGroup;
  dataFactCapt: LocalDataSource = new LocalDataSource();
  totalItemsCaptura = 0;
  captura: ICaptureDig;
  capturasDig: ICaptureDig[] = [];
  info: Info;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  constructor(
    private fb: FormBuilder,
    private documentsService: DocumentsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS,
      // edit: {
      //   editButtonContent: '<i  class="fa fa-eye text-info mx-2" > Ver</i>',
      // },
    };
  }

  ngOnInit(): void {
    this.dataFactCapt
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'preliminaryInquiry' ||
            filter.field == 'criminalCase' ||
            filter.field == 'expedientType' ||
            filter.field == 'stateCode' ||
            filter.field == 'expedientStatus' ||
            filter.field == 'stationNumber' ||
            filter.field == ' authorityNumber'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getFilterCaptura(this.captura);
        }
      });
  }

  getFilterCaptura(find: ICaptureDig) {
    this.documentsService.getDocCapture(find).subscribe({
      next: data => {
        this.capturasDig = data.data;
        console.log(this.capturasDig);
        this.totalItemsCaptura = data.count;
        // this.info = data.data.info;
      },
    });
  }
}
