import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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

  constructor(
    private personService: PersonService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = PERSON_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPersons());
  }

  getPersons() {
    this.loading = true;
    this.personService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.person = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(person?: IPerson) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      person,
      callback: (next: boolean) => {
        if (next) this.getPersons();
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
      next: () => this.getPersons(),
    });
  }
}
