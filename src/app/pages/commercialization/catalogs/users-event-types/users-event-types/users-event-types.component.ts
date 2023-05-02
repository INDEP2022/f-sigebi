import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITevents } from 'src/app/core/models/catalogs/tevents.model';
import { IUsersEventTypes } from 'src/app/core/models/catalogs/users-event-types.model';
import { UserEventTypesService } from 'src/app/core/services/catalogs/users-event-types.service';
import { BasePage } from 'src/app/core/shared/base-page';
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

  constructor(
    private fb: FormBuilder,
    private userEventTypesService: UserEventTypesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      mode: '',
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.teventsForm = this.fb.group({
      event: [null, [Validators.required]],
    });
  }
  getValuesAll(params?: ListParams, id?: number) {
    this.loading = true;
    this.userEventTypesService.getAll(params).subscribe({
      next: response => {
        const newData = response.data.filter((item: any) => {
          return item.id_tpevento === id;
        });
        this.valuesList = newData;
        this.totalItems = newData.length;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
  onTeventsChange(tevents: any) {
    if (tevents != undefined) {
      this.events = tevents;
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getValuesAll(new ListParams(), this.events.id));
    } else {
      this.valuesList = [];
      this.totalItems = 0;
    }
  }
}
