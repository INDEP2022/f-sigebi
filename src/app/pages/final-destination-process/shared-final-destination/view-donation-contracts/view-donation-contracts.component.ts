import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { CheckboxElementComponent } from './../../../../shared/components/checkbox-element-smarttable/checkbox-element';
import { COLUMNS } from './columns';
import { ModalSelectRequestsComponent } from './modal-select-requests/modal-select-requests.component';

@Component({
  selector: 'app-view-donation-contracts',
  templateUrl: './view-donation-contracts.component.html',
  styles: [],
})
export class ViewDonationContractsComponent extends BasePage implements OnInit {
  @Input() op: number;
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any;
  bsModalRef?: BsModalRef;
  bsValueFromYear: Date = new Date();
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  minModeFromMonth: BsDatepickerViewMode = 'month';
  minModeFromYear: BsDatepickerViewMode = 'year';

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.configInputsDate();
    this.assignTableColumns();
  }

  newColumn = {
    select: {
      title: 'Sel',
      type: 'custom',
      renderComponent: CheckboxElementComponent,
      onComponentInitFunction(instance: any) {
        instance.toggle.subscribe((data: any) => {
          data.row.to = data.toggle;
        });
      },
      sort: false,
    },
  };

  assignTableColumns() {
    let column = {};
    Object.assign(column, COLUMNS);
    Object.assign(column, this.newColumn);
    console.log(column);
    this.settings = { ...this.settings, actions: false };
    if (this.op == 2) {
      this.settings.columns = column;
    } else {
      this.settings.columns = COLUMNS;
    }
  }

  initForm() {
    this.form = this.fb.group({
      idContract: [null, [Validators.required]],
      cto: [null, [Validators.required]],
      status: [null, [Validators.required]],
      trans: [null, [Validators.required]],
      don: [null, [Validators.required]],
      ctrlAut: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      key: [null, [Validators.required]],
      cve: [null, [Validators.required]],
      donee: [null, [Validators.required]],
      reasonSocial: [null, [Validators.required]],
      subscribeDate: [null, [Validators.required]],
      domicilie: [null, [Validators.required]],
      nameRepDon: [null, [Validators.required]],
      positionRepDon: [null, [Validators.required]],
      nameRepSae: [null, [Validators.required]],
      nameFunSae: [null, [Validators.required]],
      positionFunSae: [null, [Validators.required]],
      witness1: [null, [Validators.required]],
      witness2: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      deliveryDate: [null, [Validators.required]],
      folioScan: [null, [Validators.required]],
      contractStatus: [null, [Validators.required]],
    });
  }

  onSubmit() {}

  settingsChange(event: any) {
    this.settings = event;
  }

  configInputsDate() {
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MMMM',
      }
    );
  }

  openModal() {
    const initialState: ModalOptions = {
      initialState: {
        op: this.op,
      },
    };
    this.bsModalRef = this.modalService.show(
      ModalSelectRequestsComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }
}
