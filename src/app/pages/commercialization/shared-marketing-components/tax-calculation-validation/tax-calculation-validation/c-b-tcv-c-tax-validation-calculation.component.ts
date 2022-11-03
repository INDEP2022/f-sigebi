import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { CBRcCRateChangeComponent } from '../rate-change/c-b-rc-c-rate-change.component';
import { CBICInconsistenciesComponent } from '../inconsistencies/c-b-i-c-inconsistencies.component';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS, COLUMNS2 } from './columns';

@Component({
  selector: 'app-c-b-tcv-c-tax-validation-calculation',
  templateUrl: './c-b-tcv-c-tax-validation-calculation.component.html',
  styles: [
  ]
})
export class CBTcvCTaxValidationCalculationComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  settings2 = { ...this.settings, actions: false };
  data2: any[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
    this.settings2 = {
      ...this.settings2,
      actions: false,
      columns: { ...COLUMNS2 },
    };
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      range: [20, [Validators.required]],
      eventId: [null, [Validators.required]],
      processKey: [null, [Validators.required]],
      eventDate: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      requestDate: [null, [Validators.required]],
      requestType: [null, [Validators.required]],
      status: [null, [Validators.required]],
      reference: [null, [Validators.required]],
    });
  }

  openModalRateChange(context?: Partial<CBRcCRateChangeComponent>): void {
    const modalRef = this.modalService.show(
      CBRcCRateChangeComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );

    modalRef.content.data.subscribe((data: any) => {
      //if (data)
    });
  }

  openModalInconsistencies(context?: Partial<CBICInconsistenciesComponent>): void {
    const modalRef = this.modalService.show(
      CBICInconsistenciesComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );

    modalRef.content.selected.subscribe((data: any) => {
      //console.log(data)
      //if (data)
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }
}
