import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { CourtByCityService } from 'src/app/core/services/catalogs/court-by-city.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-court-maintenance',
  templateUrl: './court-maintenance.component.html',
  styles: [],
})
export class CourtMaintenanceComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  form: FormGroup = new FormGroup({});
  edit: boolean = false;
  isPresent: boolean = false;
  loadingForm: boolean = false;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  idCourt: string | number = null;
  circuit = new DefaultSelect();
  code: number = 321;
  id: number;
  data: any;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private courtServ: CourtService,
    private courtCityServ: CourtByCityService,
    private readonly serviceSubDeleg: SubdelegationService,
    private readonly serviceFederation: EntFedService,
    private readonly serviceDeleg: DelegationService,
    private dinamic: DynamicTablesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: true,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getCircuit(new ListParams());
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      circuitCVE: [null, [Validators.required]],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      manager: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      street: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      numExterior: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      numInside: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      cologne: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      zipCode: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(5),
        ],
      ],
      delegationMun: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      numPhone: [
        null,
        [
          Validators.required,
          Validators.pattern(PHONE_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      numRegister: [{ value: null, disabled: true }],
      id: [{ value: null, disabled: true }],
    });
    if (this.data) {
      this.edit = true;
      this.form.patchValue(this.data);
    }
  }

  confirm() {
    this.id = this.form.get('id').value;
    if (this.edit) {
      this.courtServ.update(this.id, this.form.getRawValue()).subscribe({
        next: () => {
          this.alert('success', 'Juzgado actualizado correctamente', '');
          this.modalRef.content.callback(true);
          this.close();
        },
        error: err => {
          this.alert('error', 'No se pudo guardar el juzgado', '');
        },
      });
    } else {
      this.loading = true;
      this.courtServ.create(this.form.value).subscribe({
        next: data => {
          this.alert('success', 'Juzgado guardado correctamente', '');
          this.modalRef.content.callback(true);
          this.close();
        },
        error: err => {
          this.alert('error', 'No se pudo guardar el juzgado', '');
        },
      });
    }
  }

  getCircuit(params?: ListParams) {
    this.dinamic.getTvalTable1ByTableKey(this.code, params).subscribe({
      next: response => {
        this.circuit = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        this.onLoadToast('error', err.error.message, '');
        this.circuit = new DefaultSelect();
      },
    });
  }
  close() {
    this.modalRef.hide();
  }
}
