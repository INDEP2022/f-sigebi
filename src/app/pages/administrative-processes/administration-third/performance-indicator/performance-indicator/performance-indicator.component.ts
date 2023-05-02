import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PerformanceIndicatorStrategyComponent } from '../performance-indicator-strategy/performance-indicator-strategy.component';
import {
  PERFORMANCEINDICATOR_COLUMNS,
  REPORTPERFORMANCEINDICATOR_COLUMNS,
} from './performance-indicator-columns';

@Component({
  selector: 'app-performance-indicator',
  templateUrl: './performance-indicator.component.html',
  styles: [],
})
export class PerformanceIndicatorComponent extends BasePage implements OnInit {
  performanceIndicatorForm: FormGroup;
  settings2 = { ...this.settings, actions: false };
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  public regionalCoordination = new DefaultSelect();

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PERFORMANCEINDICATOR_COLUMNS,
    };
    this.settings2.columns = REPORTPERFORMANCEINDICATOR_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.performanceIndicatorForm = this.fb.group({
      dateCapture: [null, Validators.required],
      year: [null, Validators.required],
      month: [null, Validators.required],
      regionalCoordination: [null, Validators.required],
      user: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
    });
  }
  public getRegionalCoordination(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }
  openStrategy(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PerformanceIndicatorStrategyComponent, config);
  }
}
