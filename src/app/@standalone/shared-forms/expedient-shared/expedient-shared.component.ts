import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Params
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { BehaviorSubject } from 'rxjs';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';

@Component({
  selector: 'app-expedient-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './expedient-shared.component.html',
  styles: [],
})
export class ExpedientSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() expedientField: string = 'id';
  @Output() selectExpedient = new EventEmitter<IExpedient>();
  expedient = new DefaultSelect<Partial<IExpedient>>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  get noExpedient() {
    return this.form.get(this.expedientField);
  }

  constructor(private expedientService: ExpedientService) {
    super();
  }

  ngOnInit(): void {
    this.noExpedient.valueChanges.subscribe(data => {
      if (data) {
        this.filterParams.getValue().removeAllFilters();
        this.filterParams.getValue().page = 1;
        this.expedientService
          .getAllFilter(this.filterParams.getValue().getParams())
          .subscribe({
            next: resp => {
              this.expedient = new DefaultSelect(resp.data, resp.count);
            },
            error: err => {
              let error = '';
              if (err.status === 0) {
                error = 'Revise su conexión de Internet.';
              } else {
                error = err.error.message;
              }
              this.onLoadToast('error', error, '');
            },
          });
      }
    });
    this.getExpedient({ limit: 10, page: 1, text: '' });
  }

  getExpedient(params: ListParams) {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    if (params.text)
      this.filterParams
        .getValue()
        .addFilter('id', params.text, SearchFilter.EQ);

    this.expedientService
      .getAllFilter(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          this.expedient = new DefaultSelect(resp.data, resp.count);
        },
        error: err => {
          this.expedient = new DefaultSelect();
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
          } else {
            error = err.error.message;
          }
          this.onLoadToast('error', error, '');
        },
      });
  }

  onExpedientChange(expedient: any) {
    if (expedient) {
      this.selectExpedient.emit(expedient);
    } else {
      this.selectExpedient.emit({
        id: null,
        courtNumber: null,
        criminalCase: null,
        preliminaryInquiry: null,
        protectionKey: null,
        crimeKey: null,
        circumstantialRecord: null,
        keyPenalty: null,
        nameInstitution: null,
        courtName: null,
        mpName: null,
        indicatedName: null,
        federalEntityKey: null,
        identifier: null,
        transferNumber: null,
        expTransferNumber: null,
        expedientType: null,
        stationNumber: null,
        authorityNumber: null,
      });
    }
    this.expedient = new DefaultSelect();
  }
}
