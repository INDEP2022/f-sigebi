import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { LegalOpinionsOfficeService } from '../legal-opinions-office/services/legal-opinions-office.service';
import { COLUMNS_APPOINTMENT } from './columns';

@Component({
  selector: 'app-legal-opinions-office-find-appointment',
  templateUrl: './legal-opinions-office-find-appointment.component.html',
  styles: [],
})
export class LegalOpinionsOfficeFindAppointmentComponent
  extends BasePage
  implements OnInit
{
  settingsAppoinment: any = {};
  loadingAppoinment: boolean = false;
  dataAppoinment: LocalDataSource = new LocalDataSource();
  paramsAppoinment = new BehaviorSubject<ListParams>(new ListParams());
  appoinmentData: IDictation[] = [];
  totalAppoinment: number = 0;
  formAppoinment: FormGroup;
  selectAppoinment: IDictation;

  @Output() continueEmitter = new EventEmitter<any>();
  @Output() cancelEmitter = new EventEmitter<boolean>();

  @Input() expediente: string = '';

  constructor(
    private fb: FormBuilder,
    private svLegalOpinionsOfficeService: LegalOpinionsOfficeService
  ) {
    super();
    this.settingsAppoinment = {
      ...this.settings,
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
      },
      hideSubHeader: true, //oculta subheaader de filtro
      columns: COLUMNS_APPOINTMENT,
    };
    console.log(this.expediente);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.buildForm();
      this.getAppoinmentData();
    }, 1000);
  }

  buildForm() {
    this.formAppoinment = this.fb.group({
      id: [
        { value: '', disabled: false },
        [Validators.pattern(NUM_POSITIVE), Validators.maxLength(11)],
      ],
      expedientNumber: [
        { value: this.expediente, disabled: false },
        [Validators.maxLength(11), Validators.pattern(NUM_POSITIVE)],
      ],
      wheelNumber: [
        { value: '', disabled: false },
        [Validators.maxLength(11), Validators.pattern(NUM_POSITIVE)],
      ],
      typeDict: [
        { value: '', disabled: false },
        [Validators.maxLength(15), Validators.pattern(STRING_PATTERN)],
      ],
      passOfficeArmy: [
        { value: '', disabled: false },
        [
          Validators.pattern(STRING_PATTERN.replace(']*', '?]*')),
          Validators.maxLength(100),
        ],
      ],
    });
  }
  resetFields() {
    this.formAppoinment.reset();
    this.dataAppoinment.load([]);
    this.dataAppoinment.refresh();
    this.totalAppoinment = 0;
    this.paramsAppoinment = new BehaviorSubject<ListParams>(new ListParams());
  }
  selectRow(row: any) {
    console.log(row);
    row.isSelected
      ? (this.selectAppoinment = row.data)
      : (this.selectAppoinment = null);
  }
  getAppoinmentData() {
    if (
      !this.formAppoinment.get('expedientNumber').value &&
      !this.formAppoinment.get('wheelNumber').value &&
      !this.formAppoinment.get('typeDict').value &&
      !this.formAppoinment.get('passOfficeArmy').value &&
      !this.formAppoinment.get('id').value
    ) {
      this.onLoadToast(
        'warning',
        'Ingrese por lo menos un Filtro de los campos del Formulario',
        ''
      );
      return;
    }
    if (this.formAppoinment.invalid) {
      this.onLoadToast(
        'warning',
        'Ingrese datos validos en los campos e intente nuevamente',
        ''
      );
      return;
    }
    this.paramsAppoinment
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAppoinment());
  }

  getAppoinment() {
    this.loadingAppoinment = true;
    const params = new FilterParams();
    params.removeAllFilters();
    if (this.formAppoinment.get('id').value) {
      params.addFilter('id', this.formAppoinment.get('id').value);
    }
    if (this.formAppoinment.get('expedientNumber').value) {
      params.addFilter(
        'expedientNumber',
        this.formAppoinment.get('expedientNumber').value
      );
    }
    if (this.formAppoinment.get('wheelNumber').value) {
      params.addFilter(
        'wheelNumber',
        this.formAppoinment.get('wheelNumber').value
      );
    }
    if (this.formAppoinment.get('typeDict').value) {
      params.addFilter(
        'typeDict',
        this.formAppoinment.get('typeDict').value,
        SearchFilter.ILIKE
      );
    }
    if (this.formAppoinment.get('passOfficeArmy').value) {
      params.addFilter(
        'passOfficeArmy',
        this.formAppoinment.get('passOfficeArmy').value,
        SearchFilter.ILIKE
      );
    }
    params['sortBy'] = 'id:DESC';
    params.limit = this.paramsAppoinment.value.limit;
    params.page = this.paramsAppoinment.value.page;
    let subscription = this.svLegalOpinionsOfficeService
      .getDictations(params.getParams())
      .subscribe({
        next: data => {
          this.loadingAppoinment = false;
          console.log('DICTAMEN', data);
          this.appoinmentData = data.data;
          this.totalAppoinment = data.count;
          this.dataAppoinment.load(data.data);
          this.dataAppoinment.refresh();
        },
        error: error => {
          console.log(error);
          this.loadingAppoinment = false;
          this.dataAppoinment.load([]);
          this.dataAppoinment.refresh();
          if (error.status == 400) {
            this.onLoadToast('warning', error.error.message, '');
          } else {
            this.onLoadToast('error', error.error.message, '');
          }
          subscription.unsubscribe();
        },
      });
  }
  continue() {
    if (this.selectAppoinment) {
      this.continueEmitter.emit(this.selectAppoinment);
    } else {
      this.onLoadToast('warning', 'Selecciona un registro para continuar', '');
    }
  }
  goBack() {
    this.cancelEmitter.emit(true);
  }
}
