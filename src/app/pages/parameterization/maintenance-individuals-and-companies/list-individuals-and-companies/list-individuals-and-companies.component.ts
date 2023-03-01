import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  searchFilter: SearchBarFilter;
  dataPerson: IListResponse<IPerson> = {} as IListResponse<IPerson>;

  constructor(private modalRef: BsModalRef, private personsSer: PersonService) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getPersons();
    });
  }
  getPersons() {
    this.loading = true;
    this.personsSer.getAllFilters(this.params.getValue()).subscribe({
      next: response => {
        this.dataPerson = response;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.onLoadToast('error', err.error.message, '');
        this.dataPerson = {} as IListResponse<IPerson>;
      },
    });
  }

  formDataPerson(person: IPerson) {
    this.modalRef.content.callback(true, person);
    this.modalRef.hide();
  }

  deletePerson(person: IPerson) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.personsSer.remove(person.id).subscribe({
          next: () => {
            this.onLoadToast('success', 'Ha sido eliminado', '');
            this.getPersons();
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
