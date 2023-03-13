import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IRequestList } from 'src/app/core/models/catalogs/request-list.model';
import { IRequestTask } from 'src/app/core/models/requests/request-task.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { REQUEST_LIST_COLUMNS } from 'src/app/pages/siab-web/sami/consult-tasks/consult-tasks/consult-tasks-columns';
@Component({
  selector: 'app-consult-tasks',
  templateUrl: './consult-tasks.component.html',
  styles: [],
})
export class ConsultTasksComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: IRequestList[] = [];
  totalItems: number = 0;
  tasks: IRequestTask[] = [];

  loadingText = '';
  userName = '';
  consultTasksForm: FormGroup;

  // constructor(private fb: FormBuilder) {}
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private excelService: ExcelService,
    public router: Router,
    private fb: FormBuilder
  ) {
    super();
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: '' };
    this.settings.columns = REQUEST_LIST_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.userName = this.authService.decodeToken().given_name;

    this.consultTasksForm = this.fb.group({
      unlinked: [null, Validators.required],
      unlinked1: [null, Validators.required],
      txtSearch: [''],
    });

    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.getTasks())
      )
      .subscribe();
  }

  exportToExcel() {
    const filename: string = this.userName + '-Tasks';
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(this.tasks, { filename });
  }

  getTasks() {
    const params = this.params.getValue();

    this.loading = true;
    this.loadingText = 'Cargando';
    params.text = this.consultTasksForm.value.txtSearch;
    params['others'] = this.userName;

    this.taskService.getTasksByUser(params).subscribe({
      next: response => {
        this.loading = false;
        this.tasks = response.data;
        this.totalItems = response.count;
      },
      error: () => (this.loading = false),
    });
  }

  cleanFilter() {
    this.consultTasksForm.value.txtSearch = '';
    // this.consultTasksForm.value.unlinked1.setValue({"0", "Todos"});
  }

  onKeydown(event: any) {
    // console.log("event", event);
    this.getTasks();
  }
}
