import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodDonation } from 'src/app/core/models/ms-donation/donation.model';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ModalApprovalDonationComponent } from './../modal-approval-donation/modal-approval-donation.component';
import { COLUMNS_APPROVAL_DONATION } from './columns-approval-donation';

@Component({
  selector: 'app-capture-approval-donation',
  templateUrl: './capture-approval-donation.component.html',
  styles: [
    `
      @media screen and (max-width: 767px) {
        #column {
          border-right: 0px !important;
        }
      }
    `,
  ],
})
export class CaptureApprovalDonationComponent
  extends BasePage
  implements OnInit
{
  regisForm: FormGroup;
  siabForm: FormGroup;
  foolio: number;
  bsValueToYear: Date = new Date();
  minModeToYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigToYear: Partial<BsDatepickerConfig>;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  // @Input() getDetailComDonation: Function;
  // @Input() idActa: number | string;
  type = 'COMPDON';
  origin = 'FMCOMDONAC_1';
  donationGood: IGoodDonation;
  paramsScreen: IParamsDonac = {
    origin: '',
    recordId: '',
    cveEvent: '',
    area: '',
  };
  data = EXAMPLE_DATA;
  info = [
    {
      id: 0,
      title: 'CONSULTA BIENES',
      color: 'grey',
    },
    {
      id: 1,
      title: 'COM. EXTERIOR KG',
      color: 'brackground-color: green',
    },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private donationService: DonationService
  ) {
    super();
    // this.settings = { ...this.settings, actions: false };
    // this.settings.columns = COLUMNS_APPROVAL_DONATION;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...COLUMNS_APPROVAL_DONATION },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        this.paramsScreen.recordId = paramsQuery['recordId'] ?? null;
        this.paramsScreen.cveEvent = paramsQuery['cveEvent'] ?? null;
        this.paramsScreen.area = paramsQuery['area'] ?? null;
        this.paramsScreen.area = paramsQuery['area'] ?? null;
        if (this.origin == 'FMCOMDONAC_1') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
        }
      });
    this.configDatePicker();
    this.initForm();
    // this.openModal('Seleccione el Área a Trabajar', 'select-area');
    this.regisForm.get('type').setValue(this.type);
  }

  initForm() {
    this.regisForm = this.fb.group({
      type: [null, []],
      area: [null, [Validators.pattern(STRING_PATTERN)]],
      year: [this.bsValueToYear, []],
      folio: [
        null,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(4)],
      ],
      captureDate: [null, []],
      keyEvent: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
    this.regisForm.get('area').setValue(this.paramsScreen.area);
  }
  // lv_TRAN      Varchar2(4);
  // lv_TIPO      Varchar2(4);
  // lv_AREA      Varchar2(10);
  // lv_CONS      Varchar2(10);
  // lv_TIPO_ACTA INDICADORES_PARAMETRO.TIPO_ACTA% type;
  // lv_FOLIO     Number;

  createDon(donationGood: IGoodDonation) {
    this.loading = true;
    const folio = this.regisForm.value.folio;
    const acta = this.regisForm.value.type;
    let year = this.regisForm.value.year;
    const area = this.regisForm.value.area;
    let folio_ = folio.toString().padStart(4, '0');
    this.foolio = folio_;

    // this.eventComDonacion.cveActa =
    //   this.eventComDonacion.tipo +
    //   '/' +
    //   this.global.regi +
    //   '/' +
    //   this.eventComDonacion.anio +
    //   '/' +
    //   this.global.cons;

    const cveActa = `${acta}/${area}/${year}/${folio_}/${this.type}`;
    console.log('cveActa -->', cveActa);
    this.donationService.createD(donationGood).subscribe({
      next: resp => {
        console.log('guardado');
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  configDatePicker() {
    this.bsConfigToYear = Object.assign(
      {},
      {
        minMode: this.minModeToYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  onSubmit() {}

  openModal(title: string, op: string, subTitle: string = '') {
    const initialState: ModalOptions = {
      initialState: {
        title,
        op,
        subTitle,
      },
    };
    this.bsModalRef = this.modalService.show(
      ModalApprovalDonationComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  goBackDonation() {
    this.router.navigate(['/pages/general-processes/scan-documents'], {
      queryParams: {
        // origin: this.origin,
        // acta: this.actaRecepttionForm.get('type').value,
      },
    });
  }
}

const EXAMPLE_DATA = [
  {
    ref: 1,
    goods: 33321,
    goodsDescrip: 'Bien Integrado',
    quantity: 7,
    unit: 'KILOGRAMO',
    status: 'ADM',
    proceedings: 1245454,
    targetTag: 'DONACION',
    transfNumb: 120,
    desTransf: 'SAT',
    clasifNumb: 778,
    process: 'TRANSFERENT',
    warehouseNumb: 28730,
    warehouse: 'DRCS ALMA',
    warehouseLocat: 'DCRS ALMA',
    coordAdmin: 'DELELGACIÓN REG.',
  },
];

export interface IParamsDonac {
  origin: string;
  recordId: string;
  cveEvent: string;
  area: string;
}
