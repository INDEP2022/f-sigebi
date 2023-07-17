import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MaintenanceIndividualsAndCompaniesComponent } from '../maintenance-individuals-and-companies/maintenance-individuals-and-companies.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-list-individuals-and-companies',
  templateUrl: './list-individuals-and-companies.component.html',
  styles: [],
})
export class ListIndividualsAndCompaniesComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  searchFilter: SearchBarFilter;
  dataPerson: IPerson[] = [];
  origin: string = '';
  no_bien: number = null;
  no_nom: number = null;

  constructor(
    private modalRef: BsModalRef,
    private personsSer: PersonService,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log(params);
        this.origin = params['origin'] ?? null;
        if (this.origin == 'FACTJURREGDESTLEG') {
          this.no_bien = params['no_bien'] ?? null;
          this.no_nom = params['p_nom'] ?? null;
        }
        console.log(params);
      });
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
            // filter.field == 'id'
            //   ? (searchFilter = SearchFilter.EQ)
            //   : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getPersons();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getPersons();
    });
  }
  getPersons() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.personsSer.getAllFilters(params).subscribe({
      next: response => {
        this.dataPerson = response.data;
        this.totalItems = response.count;
        this.data.load(this.dataPerson);
        this.data.refresh();
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.onLoadToast('error', err.error.message, '');
      },
    });
  }

  deletePerson(person: IPerson) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.personsSer.remove(person.id).subscribe({
          next: () => {
            this.getPersons();
            this.alert(
              'success',
              'Lista mantenimiento de personas físicas y morales',
              'Ha sido eliminada'
            );
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }
  openModal(dataPerson?: IPerson) {
    let config: ModalOptions = {
      initialState: {
        dataPerson,
        callback: (next: boolean) => {
          if (next) this.getPersons();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaintenanceIndividualsAndCompaniesComponent, config);
  }

  close() {
    this.modalRef.hide();
  }
  goBack() {
    if (this.origin == 'FACTJURREGDESTLEG') {
      this.router.navigate(
        ['/pages/juridical/depositary/depositary-record/' + this.no_bien],
        {
          queryParams: {
            p_nom: this.no_nom,
          },
        }
      );
    } else {
      this.alert(
        'warning',
        'La página de origen no tiene opción para regresar a la pantalla anterior',
        ''
      );
    }
  }
}
