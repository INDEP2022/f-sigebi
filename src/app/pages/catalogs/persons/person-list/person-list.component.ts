import { Component, OnInit } from '@angular/core';
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
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
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

  constructor(
    private personService: PersonService,
    private modalService: BsModalService
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
          this.person = response.data;
          this.data.load(this.person);
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
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(person.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.personService.remove(id).subscribe({
      next: () => {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getPersons());
      },
    });
  }
}
