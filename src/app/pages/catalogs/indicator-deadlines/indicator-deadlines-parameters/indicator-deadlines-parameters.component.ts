import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IParametersIndicators } from 'src/app/core/models/catalogs/parameters-indicators.model';
import { ParameterIndicatorsService } from 'src/app/core/services/catalogs/parameters-indicators.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { INDICATOR_DEADLINES_PARAMETERS_COLUMNS } from './inidicator-deadlines-parameters-columns';

@Component({
  selector: 'app-indicator-deadlines-parameters',
  templateUrl: './indicator-deadlines-parameters.component.html',
  styles: [],
})
export class IndicatorDeadlinesParametersComponent
  extends BasePage
  implements OnInit
{
  indicatorDeadlinesParameters: IParametersIndicators[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  rowSelected: boolean = false;
  selectedRow: any = null;
  @Output() refresh = new EventEmitter<true>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private parameterIndicatorsService: ParameterIndicatorsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: INDICATOR_DEADLINES_PARAMETERS_COLUMNS,
      selectedRowIndex: -1,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllIndicators());
  }
  getAllIndicators() {
    this.loading = true;
    this.parameterIndicatorsService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.indicatorDeadlinesParameters = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  close() {
    this.modalRef.hide();
  }
  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }
  confirm() {
    if (!this.rowSelected) return;
    this.refresh.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
