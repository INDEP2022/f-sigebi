import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITevents } from 'src/app/core/models/catalogs/tevents.model';
import { IUsersEventTypes } from 'src/app/core/models/catalogs/users-event-types.model';
import { UserEventTypesService } from 'src/app/core/services/catalogs/users-event-types.service';
import { UserTpeeventsService } from 'src/app/core/services/ms-user-events/user-tpeevents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { UsersEventTypesFormsComponent } from '../users-event-types-forms/users-event-types-forms.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-users-event-types',
  templateUrl: './users-event-types.component.html',
  styles: [],
})
export class UsersEventTypesComponent extends BasePage implements OnInit {
  teventsForm: FormGroup;
  valuesList: IUsersEventTypes[] = [];
  events: ITevents;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  rowSelected: boolean = false;
  selectedRow: any = null;
  columnFilters: any = [];
  typeEvent: string;
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private fb: FormBuilder,
    private userEventTypesService: UserEventTypesService,
    private modalService: BsModalService,
    private userTpeeventsService: UserTpeeventsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: false,
        delete: true,
      },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'registrationDate':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'username':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'segUsers':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}.name`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getValuesAll(
            new ListParams(),
            this.teventsForm.controls['event'].value
          );
        }
      });
  }

  private prepareForm(): void {
    this.teventsForm = this.fb.group({
      event: [null, [Validators.required]],
    });
  }

  getValuesAll(params?: ListParams, id?: number) {
    this.loading = true;
    if (id) {
      this.params.getValue()['filter.idTpevent'] = id;
    }
    let paramss = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.userTpeeventsService.getAllTypeUser(paramss).subscribe({
      next: response => {
        console.log(response.data);
        // const newData = response.data.filter((item: any) => {
        //   return item.id_tpevento === id;
        // });

        console.log(response.count);

        this.valuesList = response.data;
        this.data.load(this.valuesList);
        console.log(this.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        console.log(error);
      },
    });
  }
  onTeventsChange(tevents: any) {
    if (tevents != undefined) {
      this.events = tevents;
      this.typeEvent = this.events.description;
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getValuesAll(new ListParams(), this.events.id));
    } else {
      this.valuesList = [];
      this.totalItems = 0;
    }
  }
  openForm(userEvent?: any) {
    let typeEvent = this.typeEvent;
    let idTypeEvent = this.teventsForm.controls['event'].value;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      userEvent,
      typeEvent,
      idTypeEvent,
      callback: (next: any) => {
        if (next) {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getValuesAll(new ListParams(), next));
        }
      },
    };
    this.modalService.show(UsersEventTypesFormsComponent, modalConfig);
  }
  delete(parameter: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log(parameter);
        let data = {
          idTpevent: parameter.idTpevent,
          username: parameter.username,
        };
        this.userTpeeventsService.remove(data).subscribe({
          next: (resp: any) => {
            if (resp) {
              this.alert('success', 'El usuario ha sido eliminado', '');
              this.getValuesAll(
                new ListParams(),
                this.teventsForm.controls['event'].value
              );
            }
          },
          error: error => {
            this.loading = false;
          },
        });
      }
    });
  }
}
