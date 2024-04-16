import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { CourtByCityService } from 'src/app/core/services/catalogs/court-by-city.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CourtCityComponent } from '../court-city/court-city.component';
import { COLUMNS, COLUMNSLIST } from '../court-maintenance/columns';
import { CourtMaintenanceComponent } from '../court-maintenance/court-maintenance.component';
import { TableCity } from '../court-maintenance/table.model';

@Component({
  selector: 'app-court-list',
  templateUrl: './court-list.component.html',
  styles: [],
})
export class CourtListComponent extends BasePage implements OnInit {
  columns: ICourt[] = [];
  data: LocalDataSource = new LocalDataSource();
  dataCourtCity: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  totalItems2: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  dataCourt: IListResponse<ICourt> = {} as IListResponse<ICourt>;
  idCourt: string | number = null;
  settings2 = { ...this.settings };
  loading2: boolean = false;
  rowSelect: any;
  constructor(
    private serviceSubDeleg: SubdelegationService,
    private serviceFederation: EntFedService,
    private serviceDeleg: DelegationService,
    private modalService: BsModalService,
    private courtService: CourtService,
    private courtCityServ: CourtByCityService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNSLIST },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        add: false,
        edit: false,
        delete: true,
        position: 'right',
      },
      delete: {
        deleteButtonContent:
          '<i class="fa fa-trash text-danger pl-5 mx-2"></i>',
        confirmDelete: true,
      },
      hideSubHeader: true,
      columns: { ...COLUMNS },
    };
    this.totalItems = 0;
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'city'
              ? (field = `filter.${filter.field}.nameCity`)
              : (field = `filter.${filter.field}`);
            filter.field == 'id' || filter.field == 'zipCode'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getCourts();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCourts());
  }

  getCourts() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['sortBy'] = 'id:DESC';
    this.courtService.getAll(params).subscribe({
      next: response => {
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.totalItems = 0;
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
      },
    });
  }

  editCourt(data: ICourt) {
    this.openForm(data);
  }

  openForm(data?: ICourt) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {
          if (next) {
            this.getCourts();
          }
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CourtMaintenanceComponent, config);
  }
  deleteCourt(id: number) {
    this._getCourtByCity(id);
  }

  _getCourtByCity(id: number) {
    let params = new ListParams();
    params['filter.court'] = `${SearchFilter.EQ}:${id}`;
    this.courtCityServ.getAllWithFilters(params).subscribe({
      next: response => {
        if (response.data.length > 0) {
          this.alert(
            'warning',
            'Juzgado con Ciudades',
            'Debe eliminar primero las ciudades asociadas al juzgado'
          );
        } else {
          this.removeCourt(id);
        }
      },
      error: error => {
        this.removeCourt(id);
      },
    });
  }

  removeCourt(id: string | number) {
    this.alertQuestion(
      'question',
      'Se eliminará el juzgado',
      '¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.courtService.remove(id).subscribe({
          next: () => {
            this.alert('success', 'Juzgado eliminado correctamente', '');
            this.getCourts();
            this.idCourt = null;
          },
          error: err => {
            this.alert('warning', 'No se pudo eliminar el juzgado', '');
          },
        });
      }
    });
  }

  deleteCity(city: TableCity) {
    this.alertQuestion(
      'question',
      'Se eliminará la ciudad',
      '¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.courtCityServ.deleteCity(this.idCourt, city.idCity).subscribe({
          next: () => {
            this.alert('success', 'Ciudad eliminada correctamente', '');
            this.getCourtByCity();
          },
          error: err => {
            this.alert('error', 'No se pudo eliminar el registro', '');
          },
        });
      }
    });
  }

  rowsSelected(event: any) {
    console.log(event);
    this.rowSelect = event.data;
    if (event) {
      this.idCourt = event.data.id;
      this.params2.getValue()[
        'filter.court'
      ] = `${SearchFilter.EQ}:${this.rowSelect.id}`;
      this.getCourtByCity();
    }
  }

  getCourtByCity() {
    this.loading2 = true;
    const params = {
      ...this.params2.getValue(),
    };
    this.courtCityServ.getAllWithFilters(params).subscribe({
      next: response => {
        let result = response.data.map(async city => {
          city['nameCity'] = city?.city?.nameCity;
          city['idCity'] = city?.city?.idCity;
          city['noDelegation'] = city?.city?.noDelegation;
          city['noSubDelegation'] = city?.city?.noSubDelegation;
          const entity: any = await this.getEntidad(Number(city.city.state));
          if (entity) {
            city['cvEntidad'] = entity?.id;
            city['cvEntDescripcion'] = entity?.otWorth;
          } else {
            city['cvEntidad'] = '';
            city['cvEntDescripcion'] = '';
          }
          const delegation = await this.getDelegation(
            Number(city.city.noDelegation)
          );
          if (delegation) {
            city['cvDelDescription'] = delegation?.description;
          } else {
            city['cvDelDescription'] = '';
          }
          const subdelegation = await this.getSubDelegation(
            Number(city.city.noSubDelegation)
          );
          console.log(subdelegation);
          if (subdelegation) {
            city['cvSubDelDescription'] = subdelegation?.description;
          } else {
            city['cvSubDelDescription'] = '';
          }
        });
        Promise.all(result).then(resp => {
          this.dataCourtCity.load(response.data);
          this.dataCourtCity.refresh();
          this.totalItems2 = response.count;
          this.loading2 = false;
          console.log(response);
        });
      },
      error: error => {
        this.dataCourtCity.load([]);
        this.dataCourtCity.refresh();
        this.totalItems2 = 0;
        this.loading2 = false;
      },
    });
  }

  getEntidad(id: number) {
    return new Promise((resolve, reject) => {
      this.serviceFederation.getById(id).subscribe({
        next: data => {
          resolve(data);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  getDelegation(delegation: number): Promise<IDelegation | null> {
    return new Promise((resolve, reject) => {
      this.serviceDeleg.getByIdEtapaEdo(delegation, '1').subscribe({
        next: data => {
          resolve(data);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  getSubDelegation(subDelegation: number): Promise<ISubdelegation | null> {
    return new Promise((resolve, reject) => {
      this.serviceSubDeleg.getById(subDelegation).subscribe({
        next: data => {
          resolve(data);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  openModalCity() {
    let id = this.idCourt;
    let config: ModalOptions = {
      initialState: {
        id,
        callback: (next: boolean) => {
          if (next) {
            this.getCourtByCity();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CourtCityComponent, config);
  }
}
