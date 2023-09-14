import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ICourt } from 'src/app/core/models/catalogs/court.model';
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
import { CourtListComponent } from 'src/app/pages/parameterization/court-maintenance/court-list/court-list.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CourtCityComponent } from '../court-city/court-city.component';
import { COLUMNS } from './columns';
import { TableCity } from './table.model';

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
  dataCourtCity: IListResponse<TableCity> = {} as IListResponse<TableCity>;
  idCourt: string | number = null;
  circuit = new DefaultSelect();
  code: number = 321;
  id: number;

  constructor(
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(10)],
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
    this.getCircuit(new ListParams());
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: ICourt) => {
          if (next) {
            this.form.patchValue(data);
            this.edit = true;
            this.idCourt = data.id;
            this.filterParams.getValue().removeAllFilters();
            this.filterParams
              .getValue()
              .addFilter('court', this.idCourt, SearchFilter.EQ);
            this.filterParams
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => {
                this.getCourtByCity();
              });
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CourtListComponent, config);
  }

  deleteCity(city: TableCity) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.courtCityServ.deleteCity(this.idCourt, city.idCity).subscribe({
          next: () => {
            this.alert(
              'success',
              'Registro de Ciudad',
              'Borrado Correctamente'
            );
            this.getCourtByCity();
          },
          error: err => {
            this.alert('error', err.error.message, '');
          },
        });
      }
    });
  }

  confirm() {
    this.id = this.form.get('id').value;
    console.log(this.id);
    this.loadingForm = true;
    if (this.form.value) {
      if (this.edit) {
        this.courtServ.update(this.id, this.form.getRawValue()).subscribe({
          next: () => (
            this.alert('success', 'Juzgado', 'Actualizado Correctamente'),
            this.clean()
          ),
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      } else {
        if (
          this.form.controls['description'].value.trim() === '' ||
          this.form.controls['manager'].value.trim() === '' ||
          this.form.controls['street'].value.trim() === '' ||
          this.form.controls['numExterior'].value.trim() === '' ||
          this.form.controls['numInside'].value.trim() === '' ||
          this.form.controls['cologne'].value.trim() === '' ||
          this.form.controls['delegationMun'].value.trim() === ''
        ) {
          this.alert('warning', 'No se puede guardar campos vacíos', ``);
          return; // Retorna temprano si el campo está vacío.
        }
        this.loading = true;
        this.courtServ.create(this.form.value).subscribe({
          next: data => {
            console.log(data);

            this.alert('success', 'Juzgado', 'Guardado Correctamente');
            this.form.patchValue(data);
            this.form.get('id').disable();
            this.isPresent = true;
            this.idCourt = data.id;
            this.loadingForm = false;
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    }
  }

  getCourtByCity() {
    this.loading = true;
    this.courtCityServ
      .getAllWithFilters(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          this.dataCourtCity.data = [];
          response.data.map((city, index) => {
            const descCity: TableCity = {
              ...(city.city as any),
            };
            this.dataCourtCity.data.push(descCity);
            const properties = city.city as ICity;
            if (properties !== null) {
              console.log(properties);
              this.getEntidad(
                properties.state !== null ? properties.state : (' ' as any),
                index
              );
              this.getDelegation(properties.noDelegation as any, index);
              this.getSubDelegation(properties.noSubDelegation as any, index);
            } else {
              return;
            }
          });
          this.dataCourtCity.count = response.count;
          this.loading = false;
          this.isPresent = true;
        },
        error: error => (
          this.onLoadToast('error', error.error.message, ''),
          (this.loading = false)
        ),
      });
  }

  private getEntidad(id: number, index: number) {
    this.serviceFederation.getById(id).subscribe({
      next: data => {
        this.dataCourtCity.data[index].cvEntidad = data.id;
        this.dataCourtCity.data[index].cvEntDescripcion = data.otWorth;
        this.dataCourtCity.data = [...this.dataCourtCity.data];
      },
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }

  private getDelegation(delegation: number, index: number) {
    this.serviceDeleg.getByIdEtapaEdo(delegation, '1').subscribe({
      next: data => {
        this.dataCourtCity.data[index].cvDelDescription = data.description;
        this.dataCourtCity.data = [...this.dataCourtCity.data];
      },
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }

  private getSubDelegation(subDelegation: number, index: number) {
    this.serviceSubDeleg.getById(subDelegation).subscribe({
      next: data => {
        this.dataCourtCity.data[index].cvSubDelDescription = data.description;
        this.dataCourtCity.data = [...this.dataCourtCity.data];
      },
      error: error => this.onLoadToast('error', error.erro.message, ''),
    });
  }

  clean() {
    this.form.reset();
    this.edit = false;
    this.loading = false;
    this.loadingForm = false;
    this.isPresent = false;
    this.dataCourtCity = {} as IListResponse<TableCity>;
    this.form.get('id').disable();
  }

  openModalCity() {
    let id = this.idCourt;
    let config: ModalOptions = {
      initialState: {
        id,
        callback: (next: boolean) => {
          if (next) {
            this.filterParams
              .getValue()
              .addFilter('court', this.idCourt, SearchFilter.EQ);
            this.filterParams
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => {
                this.getCourtByCity();
              });
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CourtCityComponent, config);
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
}
