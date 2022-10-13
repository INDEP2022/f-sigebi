import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PersonFormComponent } from '../person-form/person-form.component';
import { PERSON_COLUMNS } from './person-columns';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styles: [
  ]
})
export class PersonListComponent extends BasePage implements OnInit {

  
  persons: IPerson[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private personService: PersonService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = PERSON_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.personService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.persons = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(person?: IPerson) {
    let config: ModalOptions = {
      initialState: {
        person,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.BsModalService.show(PersonFormComponent, config);
  }

  delete(person?: IPerson) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //this.personService.remove(person.id);
      }
    });
  }

}
