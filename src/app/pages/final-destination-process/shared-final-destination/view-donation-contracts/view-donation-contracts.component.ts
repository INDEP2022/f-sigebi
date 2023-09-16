import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
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
  dataTable: LocalDataSource = new LocalDataSource();
  bsModalRef?: BsModalRef;
  bsValueFromYear: Date = new Date();
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  minModeFromMonth: BsDatepickerViewMode = 'month';
  minModeFromYear: BsDatepickerViewMode = 'year';

  lista: any = [];
  bienSeleccionado: any = {};
  datosParaTabla: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private donationService: DonationProcessService,
    private previousDonationService: DonationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.datosParaTabla = dataMock;
    this.initForm();
    this.configInputsDate();
    this.assignTableColumns();
    console.log(this.op);
    this.fillTable();

    this.donationService.getAllContracts();

    this.donationService.getDataInventario().subscribe({
      next: data => {
        console.log(data);
      },
      error: error => {
        console.log(error);
      },
    });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.fillTable();
    });
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

  onKeyDownIdContract(event: any) {
    console.log(event.target.value);
    this.donationService.getContrato(event.target.value).subscribe({
      next: data => {
        console.log(data);
        console.log(data.data[0].donee);
        this.form.controls['donee'].setValue(data.data[0].donee || null);
        this.form.controls['reasonSocial'].setValue(
          data.data[0].doneeId.razonSocial
        );
      },
      error: error => {
        console.log(error);
      },
    });
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  onIncorporar() {
    let params = `filter.id=$eq:${this.form.get('idContract').value}`;

    this.donationService.getAllContracts(params).subscribe({
      next: (data: any) => {
        console.log(data);
        console.log(data.data);
        ///Try to find the way to data come in a better and clean way
      },
      error: error => {
        console.log(error);
      },
    });
  }

  fillTable() {
    this.loading = true;

    this.dataTable.load(this.datosParaTabla);
    this.totalItems = this.datosParaTabla.length;

    this.loading = false;
  }

  onQuitarBienesSeleccionados() {
    if (this.bienSeleccionado) {
      const filtra = this.datosParaTabla.filter((item: any) => {
        return item.idRequest !== this.bienSeleccionado.idRequest;
      });

      this.datosParaTabla = filtra;
      this.dataTable.load(this.datosParaTabla);
      this.bienSeleccionado = {};
      this.totalItems = this.datosParaTabla.length;
      this.alert('success', 'El contrato seleccionado han sido retirado', '');
    } else {
      this.alert('warning', '', 'Primero debe seleccionar un contrato');
    }
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

const dataMock = [
  {
    idRequest: 1,
    goodNumb: 123,
    proceedings: 456,
    quantityWarehouse: 50,
    quantityToDonate: 30,
    classifNumbGood: 789,
    ssSubtype: 111,
    description: 'Producto 1',
    delAdmin: 'Admin 1',
  },
  {
    idRequest: 2,
    goodNumb: 234,
    proceedings: 567,
    quantityWarehouse: 75,
    quantityToDonate: 40,
    classifNumbGood: 890,
    ssSubtype: 222,
    description: 'Producto 2',
    delAdmin: 'Admin 2',
  },
  {
    idRequest: 3,
    goodNumb: 345,
    proceedings: 678,
    quantityWarehouse: 60,
    quantityToDonate: 20,
    classifNumbGood: 901,
    ssSubtype: 333,
    description: 'Producto 3',
    delAdmin: 'Admin 3',
  },
  {
    idRequest: 4,
    goodNumb: 456,
    proceedings: 789,
    quantityWarehouse: 45,
    quantityToDonate: 25,
    classifNumbGood: 912,
    ssSubtype: 444,
    description: 'Producto 4',
    delAdmin: 'Admin 4',
  },
  {
    idRequest: 5,
    goodNumb: 567,
    proceedings: 890,
    quantityWarehouse: 70,
    quantityToDonate: 35,
    classifNumbGood: 923,
    ssSubtype: 555,
    description: 'Producto 5',
    delAdmin: 'Admin 5',
  },
  {
    idRequest: 6,
    goodNumb: 678,
    proceedings: 901,
    quantityWarehouse: 55,
    quantityToDonate: 15,
    classifNumbGood: 934,
    ssSubtype: 666,
    description: 'Producto 6',
    delAdmin: 'Admin 6',
  },
  {
    idRequest: 7,
    goodNumb: 789,
    proceedings: 912,
    quantityWarehouse: 80,
    quantityToDonate: 50,
    classifNumbGood: 945,
    ssSubtype: 777,
    description: 'Producto 7',
    delAdmin: 'Admin 7',
  },
  {
    idRequest: 8,
    goodNumb: 890,
    proceedings: 923,
    quantityWarehouse: 65,
    quantityToDonate: 10,
    classifNumbGood: 956,
    ssSubtype: 888,
    description: 'Producto 8',
    delAdmin: 'Admin 8',
  },
  {
    idRequest: 9,
    goodNumb: 901,
    proceedings: 934,
    quantityWarehouse: 40,
    quantityToDonate: 20,
    classifNumbGood: 967,
    ssSubtype: 999,
    description: 'Producto 9',
    delAdmin: 'Admin 9',
  },
  {
    idRequest: 10,
    goodNumb: 101,
    proceedings: 145,
    quantityWarehouse: 90,
    quantityToDonate: 60,
    classifNumbGood: 100,
    ssSubtype: 11,
    description: 'Producto 10',
    delAdmin: 'Admin 10',
  },
  {
    idRequest: 11,
    goodNumb: 202,
    proceedings: 255,
    quantityWarehouse: 35,
    quantityToDonate: 15,
    classifNumbGood: 211,
    ssSubtype: 22,
    description: 'Producto 11',
    delAdmin: 'Admin 11',
  },
  {
    idRequest: 12,
    goodNumb: 303,
    proceedings: 367,
    quantityWarehouse: 75,
    quantityToDonate: 40,
    classifNumbGood: 322,
    ssSubtype: 33,
    description: 'Producto 12',
    delAdmin: 'Admin 12',
  },
  {
    idRequest: 13,
    goodNumb: 404,
    proceedings: 479,
    quantityWarehouse: 55,
    quantityToDonate: 30,
    classifNumbGood: 433,
    ssSubtype: 44,
    description: 'Producto 13',
    delAdmin: 'Admin 13',
  },
  {
    idRequest: 14,
    goodNumb: 505,
    proceedings: 591,
    quantityWarehouse: 95,
    quantityToDonate: 50,
    classifNumbGood: 544,
    ssSubtype: 55,
    description: 'Producto 14',
    delAdmin: 'Admin 14',
  },
  {
    idRequest: 15,
    goodNumb: 606,
    proceedings: 703,
    quantityWarehouse: 50,
    quantityToDonate: 20,
    classifNumbGood: 655,
    ssSubtype: 66,
    description: 'Producto 15',
    delAdmin: 'Admin 15',
  },
  {
    idRequest: 16,
    goodNumb: 707,
    proceedings: 815,
    quantityWarehouse: 80,
    quantityToDonate: 40,
    classifNumbGood: 766,
    ssSubtype: 77,
    description: 'Producto 16',
    delAdmin: 'Admin 16',
  },
  {
    idRequest: 17,
    goodNumb: 808,
    proceedings: 927,
    quantityWarehouse: 60,
    quantityToDonate: 25,
    classifNumbGood: 877,
    ssSubtype: 88,
    description: 'Producto 17',
    delAdmin: 'Admin 17',
  },
  {
    idRequest: 18,
    goodNumb: 909,
    proceedings: 1039,
    quantityWarehouse: 85,
    quantityToDonate: 45,
    classifNumbGood: 988,
    ssSubtype: 99,
    description: 'Producto 18',
    delAdmin: 'Admin 18',
  },
  {
    idRequest: 19,
    goodNumb: 1010,
    proceedings: 1151,
    quantityWarehouse: 45,
    quantityToDonate: 15,
    classifNumbGood: 1055,
    ssSubtype: 100,
    description: 'Producto 19',
    delAdmin: 'Admin 19',
  },
  {
    idRequest: 20,
    goodNumb: 1111,
    proceedings: 1263,
    quantityWarehouse: 70,
    quantityToDonate: 30,
    classifNumbGood: 1111,
    ssSubtype: 111,
    description: 'Producto 20',
    delAdmin: 'Admin 20',
  },
];
