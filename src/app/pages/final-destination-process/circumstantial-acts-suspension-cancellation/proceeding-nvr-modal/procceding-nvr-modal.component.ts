import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { Columns } from './columns';

@Component({
  selector: 'app-procceding-nvr-modal',
  templateUrl: './procceding-nvr-modal.component.html',
  styleUrls: [],
})
export class ProceedingNVRModalComponent extends BasePage implements OnInit {
  isLoading = false;
  data = new LocalDataSource();

  override settings = {
    ...this.settings,
    columns: Columns,
  };

  form: FormGroup;
  eventData = new DefaultSelect();
  filterData = new DefaultSelect([
    { value: 1, label: 'LOTE_PUBLICO' },
    { value: 2, label: 'CLIENTE' },
    { value: 3, label: 'CFDI' },
  ]);

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private comerEventsService: ComerEventosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.searchEvents();
  }

  close() {
    this.bsModalRef.hide();
  }

  initForm() {
    this.form = this.fb.group({
      events: [null],
      filter: [null],
      value: [null],
    });
  }

  searchEvents(e?: any) {
    const paramsF = new FilterParams();

    if (e) {
      paramsF.page = e.page;

      if (e.search != '') {
        {
          paramsF.addFilter('processKey', e.search, SearchFilter.LIKE);
        }
      }
    }

    this.comerEventsService.listComerEvent(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        const newData = res.data.map(item => {
          return {
            ...item,
            bindLabel: item.id + ' - ' + item.processKey,
          };
        });
        this.eventData = new DefaultSelect(newData, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }
}
