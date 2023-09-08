import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { CheckboxElementComponent } from './../../../../shared/components/checkbox-element-smarttable/checkbox-element';
import { COLUMNS } from './columns';
import { DonationProcessService } from './donation-process.service';
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

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private donationService: DonationProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.configInputsDate();
    this.assignTableColumns();
    console.log(this.op);

    this.donationService.getAllContracts();
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
      idContract: [null, [Validators.required, Validators.maxLength(10)]],
      cto: [null, [Validators.required, Validators.maxLength(5)]],
      status: [null, [Validators.required]],
      trans: [null, [Validators.required, Validators.maxLength(50)]],
      don: [null, [Validators.required, Validators.maxLength(30)]],
      ctrlAut: [null, [Validators.required, Validators.maxLength(30)]],
      folio: [null, [Validators.required, Validators.maxLength(4)]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      key: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      cve: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(4),
        ],
      ],
      donee: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      reasonSocial: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      subscribeDate: [null, [Validators.required]],
      domicilie: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(250),
        ],
      ],
      nameRepDon: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      positionRepDon: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      nameRepSae: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      nameFunSae: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      positionFunSae: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      witness1: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      witness2: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      observations: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1250),
        ],
      ],
      deliveryDate: [null, [Validators.required]],
      folioScan: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(15),
        ],
      ],
      contractStatus: [null, [Validators.required]],
    });
  }

  onSubmit() {}

  settingsChange(event: any) {
    this.settings = event;
  }

  onIncorporar() {
    this.alert('success', 'El contrato ha sido incorporado', '');
  }

  onQuitarBienesSeleccionados() {
    this.alert(
      'success',
      'El bien o los bienes seleccionados han sido retirados',
      ''
    );
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

  onImprimir() {
    this.alert('success', 'Test', 'Impresión exitosa');
  }

  onBloquearFirma() {
    this.alert('success', 'Test', 'Se ha bloqueado en firma');
  }

  onCerrarContrato() {
    this.alert('success', 'Test', 'Se ha cerrado el contrato');
  }
}
