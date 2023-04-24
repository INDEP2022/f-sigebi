import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ListDonationComponent } from '../list-donation/list-donation.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-registration-inventories-donation',
  templateUrl: './registration-inventories-donation.component.html',
  styles: [
    `
      .br-card {
        border: 1px solid #545b62 !important;
      }
    `,
  ],
})
export class RegistrationInventoriesDonationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  formTable: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: IListResponse<IGood> = {} as IListResponse<IGood>;
  loadingGood: boolean = false;

  //butons y campos enabled
  PB_CONFIRMAR: boolean = false;
  PB_REGISTRAR: boolean = false;
  constructor(
    private fb: FormBuilder,
    private goodServ: GoodService,
    private datePipe: DatePipe,
    private modalService: BsModalService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      requestId: [null, [Validators.maxLength(11)]],
      doneeId: [null, [Validators.maxLength(11)]],
      donee: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(255)],
      ],
      justification: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(150)],
      ],
      state: [null, [Validators.pattern(STRING_PATTERN)]],
      municipality: [null, [Validators.pattern(STRING_PATTERN)]],
      direction: [null, [Validators.pattern(STRING_PATTERN)]],
      requestDate: [null, [Validators.pattern(STRING_PATTERN)]],
      requestTypeId: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(2)],
      ],
      authorizeCve: [
        null,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(40)],
      ],
      authorizeDate: [null, [Validators.pattern(STRING_PATTERN)]],
      clasifGoodId: [null, [Validators.pattern(STRING_PATTERN)]],
      authorizeType: [
        'T',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(2)],
      ],

      sunQuantity: [null, [Validators.pattern(STRING_PATTERN)]],
      sunStatus: [null, [Validators.pattern(STRING_PATTERN)]],
      representative: [null, [Validators.pattern(STRING_PATTERN)]],
      position: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.form.get('authorizeCve').disable();
    this.form.get('authorizeDate').disable();
    this.form.get('authorizeType').disable();

    this.form.get('authorizeDate').valueChanges.subscribe({
      next: () => this.validateDateAuthorize(),
    });

    this.form.get('requestDate').valueChanges.subscribe({
      next: () => this.validateDateRequest(),
    });

    this.formTable = this.fb.group({
      totalGoods: [null, [Validators.required]],
    });
  }

  validateDateAuthorize() {
    const dateInit = this.form.get('requestDate').value;
    const dateEnd = this.form.get('authorizeDate').value;

    if (!dateEnd || dateEnd == 'Invalid Date') return;

    const date1 =
      typeof dateInit == 'string'
        ? this.dateTimeTypeString(dateInit)
        : this.dateTimeTypeDate(dateInit);
    const date2 =
      typeof dateEnd == 'string'
        ? this.dateTimeTypeString(dateEnd)
        : this.dateTimeTypeDate(dateEnd);

    if (date2 < date1) {
      this.onLoadToast(
        'warning',
        'La Fecha de Autorización es menor a la Fecha de Solicitud.',
        ''
      );
    }
  }

  validateDateRequest() {
    const dateInit = this.form.get('requestDate').value;
    const dateEnd = this.form.get('authorizeDate').value;

    if (!dateEnd) return;
    if (!dateInit || dateInit == 'Invalid Date') return;

    const date1 =
      typeof dateInit == 'string'
        ? this.dateTimeTypeString(dateInit)
        : this.dateTimeTypeDate(dateInit);
    const date2 =
      typeof dateEnd == 'string'
        ? this.dateTimeTypeString(dateEnd)
        : this.dateTimeTypeDate(dateEnd);

    if (date1 > date2) {
      this.onLoadToast(
        'warning',
        'La Fecha de Solicitud no puede mayor a la de autorización.',
        ''
      );
    }
  }

  dateTimeTypeString(date: string): number {
    let time: string = date.split('T')[0].split('-').join('/');
    return new Date(time).getTime();
  }

  dateTimeTypeDate(date: Date): number {
    let time: string = this.datePipe.transform(date, 'yyyy/MM/dd');
    return new Date(time).getTime();
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  callFilterDonation() {
    window.open(
      './pages/parameterization/filters-of-goods-for-donation',
      '_blank'
    );
  }

  callRastreador() {
    window.open('./pages/general-processes/goods-tracker', '_blank');
  }

  authorize() {
    const { authorizeCve, authorizeDate, authorizeType } = this.form.value;
    const type = ['D', 'A'];
    if (!type.includes(authorizeType)) {
      this.onLoadToast('warning', 'Se debe especificar el Tipo de Trámite', '');
      return;
    }
    if (!authorizeCve || !authorizeDate) {
      this.onLoadToast(
        'warning',
        'Se debe ingresar la Clave y/o Fecha de autorización.',
        ''
      );
      return;
    }

    this.form.get('sunStatus').patchValue('ADA');
  }

  getBienes() {
    this.loadingGood = true;
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        this.listGoods();
      },
    });
  }

  listGoods() {
    this.loading = true;
    this.goodServ.getAll(this.params.getValue()).subscribe({
      next: resp => {
        this.loading = false;
        this.loadingGood = false;
        this.data = resp;
        console.log(resp);
      },
      error: () => {
        this.loading = false;
        this.loadingGood = false;
      },
    });
  }

  resetForm() {
    this.form.reset();
    this.form.get('authorizeCve').disable();
    this.form.get('authorizeDate').disable();
    this.form.get('authorizeType').disable();
    this.form.get('authorizeType').patchValue('T');
  }

  openModal(context?: Partial<ListDonationComponent>) {
    let config: ModalOptions = {
      initialState: {
        ...context,
        callback: (next: boolean, data: any) => {
          if (next) {
            this.form.patchValue(data);
            if (data.requestId) {
              this.form.get('requestId').patchValue(data.requestId.id);
            }
            if (data.doneeId) {
              this.form.get('doneeId').patchValue(data.doneeId.id);
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListDonationComponent, config);
  }
}
