import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { PersonFormComponent } from '../person-form/person-form.component';
import { PERSON_COLUMNS } from './person-columns';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styles: [],
})
export class PersonListComponent extends BasePage implements OnInit {
  person: IPerson[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  origin: string = '';
  no_bien: number = null;
  no_nom: number = null;

  constructor(
    private personService: PersonService,
    private modalService: BsModalService,
    private tvalTable1Service: TvalTable1Service,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.settings.columns = PERSON_COLUMNS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
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
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getPersons();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPersons());
  }

  getPersons() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.personService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        if (response.data != null) {
          // this.getEntFed(response)
          //   .then(() => {
          //     this.getTurn();
          //   })
          //   .catch(error => {
          //     console.error('Ocurrió un error al ejecutar el bucle:', error);
          //     this.data.load([]);
          //     this.data.refresh();
          //     this.loading = false;
          //     this.totalItems = response.count;
          //   });
          this.person = response.data;
          this.data.load(response.data);
          //console.log(this.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
        } else {
          this.data.load([]);
          this.data.refresh();
          this.loading = false;
          this.totalItems = response.count;
        }
      },
      error: error => (this.loading = false),
    });
  }
  async getEntFed(response: any): Promise<void> {
    for (let i = 0; i < response.data.length; i++) {
      const params = new ListParams();
      params['filter.nmtable'] = `$eq:1`;
      params['filter.otkey'] = `$eq:${response.data[i].keyEntFed}`;
      if (response.data[i].keyEntFed) {
        this.tvalTable1Service.getAlls(params).subscribe({
          next: resp => {
            console.log(resp.data[0].otvalor);
            response.data[i].DetEntFed = resp.data[0].otvalor;
            if (i == response.data.length - 1) {
              this.person = response.data;
              this.totalItems = response.count;
            }
          },
          error: erro => console.log(erro),
        });
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  async getTurn(): Promise<void> {
    console.log(this.person.length);
    for (let i = 0; i < this.person.length; i++) {
      const params = new ListParams();
      params['filter.nmtable'] = `$eq:8`;
      params['filter.otkey'] = `$eq:${this.person[i].keyOperation}`;
      console.log(this.person[i].keyOperation);
      if (this.person[i].keyOperation) {
        this.tvalTable1Service.getAlls(params).subscribe({
          next: resp => {
            console.log(resp.data[0].otvalor);
            this.person[i].DetOperation = resp.data[0].otvalor;
            if (i == this.person.length - 1) {
              this.data.load(this.person);
              this.data.refresh();
              this.loading = false;
            }
          },
          error: erro => console.log(erro),
        });
      } else if (i == this.person.length - 1) {
        console.log(this.person);
        this.data.load(this.person);
        this.data.refresh();
        this.loading = false;
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  openForm(person?: IPerson) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      person,
      callback: (next: boolean) => {
        if (next) {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getPersons());
        }
      },
    };
    this.modalService.show(PersonFormComponent, modalConfig);
  }

  showDeleteAlert(person: IPerson) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(person.id);
      }
    });
  }

  delete(id: number) {
    this.personService.remove(id).subscribe({
      next: () => {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getPersons());

        this.alert(
          'success',
          // 'Mantenimiento a Administrador, Depositario e Interventor',
          'Borrado correctamente',
          ''
        );
      },
      error: error => {
        console.log(error);
      },
    });
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
