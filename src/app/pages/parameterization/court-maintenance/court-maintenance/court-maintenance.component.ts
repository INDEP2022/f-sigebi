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
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import { CourtByCityService } from 'src/app/core/services/catalogs/court-by-city.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CourtListComponent } from 'src/app/pages/parameterization/court-maintenance/court-list/court-list.component';
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

  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  dataCourtCity: IListResponse<TableCity> = {} as IListResponse<TableCity>;
  idCourt: string | number = null;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private courtServ: CourtService,
    private courtCityServ: CourtByCityService
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
      circuitCVE: [null, [Validators.maxLength(15), Validators.required]],
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      street: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      numExterior: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(10)],
      ],
      numInside: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(10)],
      ],
      cologne: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      zipCode: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      delegationMun: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      numPhone: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(20)],
      ],
      numRegister: [{ value: null, disabled: true }],
      id: [{ value: null, disabled: true }],
    });
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
            this.onLoadToast('success', 'Eliminado correctamente', '');
            this.getCourtByCity();
          },
          error: err => {
            this.onLoadToast('error', err.error.message, '');
          },
        });
      }
    });
  }

  confirm() {
    this.form.get('id').enable();
    this.loading = true;
    if (this.form.value) {
      if (this.edit) {
        this.courtServ.updateCourt(this.form.value).subscribe({
          next: () => (
            this.onLoadToast('success', 'Juzgado', 'Se ha actualizado'),
            this.clean()
          ),
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      } else {
        this.courtServ.create(this.form.value).subscribe({
          next: data => {
            this.onLoadToast('success', 'Juzgado', 'Se ha guardado');
            this.form.patchValue(data);
            this.isPresent = true;
            this.idCourt = data.id;
            this.loading = false;
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
          let dataCity: TableCity[] = [];
          response.data.map(city => {
            dataCity.push({ ...(city.city as any) });
          });
          this.dataCourtCity.data = dataCity;
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

  clean() {
    this.form.reset();
    this.edit = false;
    this.loading = false;
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
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CourtCityComponent, config);
  }
}
