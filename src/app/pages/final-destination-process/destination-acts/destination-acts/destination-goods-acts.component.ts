import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';

@Component({
  selector: 'app-destination-goods-acts',
  templateUrl: './destination-goods-acts.component.html',
  styles: [],
})
export class DestinationGoodsActsComponent extends BasePage implements OnInit {
  actForm: FormGroup;
  formTable1: FormGroup;
  response: boolean = false;
  totalItems: number = 0;
  settings2: any;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private datePipe: DatePipe,
    private goodService: GoodService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS1;
    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.actForm = this.fb.group({
      statusAct: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      preliminaryAscertainment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causePenal: [null, [Validators.required]],
      elabDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      destinationDelivDate: [null, [Validators.required]],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      deliveryName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      receiverName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      auditor: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });
  }

  data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2;

  search(term: string | number) {
    this.loading = true;
    this.expedientService.getById(term).subscribe(
      response => {
        if (response !== null) {
          this.response = !this.response;
          this.actForm.controls['act'].setValue(response.registerNumber);
          this.actForm.controls['preliminaryAscertainment'].setValue(
            response.preliminaryInquiry
          );
          this.actForm.controls['statusAct'].setValue(response.expedientStatus);
          this.actForm.controls['deliveryName'].setValue(
            response.nameInstitution
          );
          this.actForm.controls['receiverName'].setValue(
            response.indicatedName
          );
          this.actForm.controls['observations'].setValue(response.insertMethod);
          this.actForm.controls['causePenal'].setValue(response.criminalCase);
          this.actForm.controls['destinationDelivDate'].setValue(
            this.datePipe.transform(response.receptionDate, 'dd/MM/yyyy')
          );
          this.actForm.controls['captureDate'].setValue(
            this.datePipe.transform(response.insertDate, 'dd/MM/yyyy')
          );
          this.actForm.controls['elabDate'].setValue(
            this.datePipe.transform(
              response.dictaminationReturnDate,
              'dd/MM/yyyy'
            )
          );
        } else {
          this.alert('info', 'No se encontrarón registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  // getGoodsByExpedient(id: string | number): void {
  //   this.goodService.getByExpedient(id, this.params.getValue()).subscribe(
  //     response => {
  //       //console.log(response);
  //       let data = response.data.map((item: IGood) => {
  //         //console.log(item);
  //       });
  //       // this.data.load(data);
  //       this.totalItems = response.count;
  //       this.loading = false;
  //     },
  //     error => (this.loading = false)
  //   );
  // }

  onSubmit() {}

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }
}

const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    acta: 'A/PGR/6/JCS',
    status: false,
  },
];

const EXAMPLE_DATA2 = [
  {
    noBien: 321,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    cantidad: 2,
  },
  {
    noBien: 321,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    cantidad: 2,
  },
  {
    noBien: 321,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    cantidad: 2,
  },
  {
    noBien: 321,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    cantidad: 2,
  },
];
