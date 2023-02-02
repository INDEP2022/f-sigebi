import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { format } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  skip,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { CopiesByTradeService } from 'src/app/core/services/ms-office-management/copies-by-trade.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ShippingDocumentsDialogComponent } from './components/shipping-documents-dialog/shipping-documents-dialog.component';
import { SHIPPING_DOCUMENTS_COLUMNS } from './shipping-documents-columns';
import { JOB_FORM } from './utils/job-form';
import { OFFICE_COPIES_FORM } from './utils/office_copies-form';
import {
  AREAS_TEXT,
  DIRECTION_TEXT,
} from './utils/shipping-documents-contants';
import { SHIPPING_DOCUMENTS_FORM } from './utils/shipping-documents-forms';

@Component({
  selector: 'app-shipping-documents',
  templateUrl: './shipping-documents.component.html',
  styles: [],
})
export class ShippingDocumentsComponent extends BasePage implements OnInit {
  documentsForm = this.fb.group(new SHIPPING_DOCUMENTS_FORM());
  receiver = this.fb.group(new OFFICE_COPIES_FORM('D'));
  cpp = this.fb.group(new OFFICE_COPIES_FORM('C'));
  jobForm = this.fb.group(new JOB_FORM());
  select = new DefaultSelect();
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalNotifications: number = 0;
  senders = new DefaultSelect();
  receivers = new DefaultSelect();
  departments = new DefaultSelect();
  delegations = new DefaultSelect();
  subdelegations = new DefaultSelect();
  notifications: any[] = [];
  selectedNotifications: any[] = [];
  officeNumber: string = null;
  officeKey: string = null;
  queryMode: boolean = false;

  get formControls() {
    return this.documentsForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private notificationService: NotificationService,
    private affairService: AffairService,
    private jobsService: JobsService,
    private copiesByTradeService: CopiesByTradeService,
    private departmentService: DepartamentService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...SHIPPING_DOCUMENTS_COLUMNS,
        name: {
          title: 'Seleccion volante',
          sort: false,
          type: 'custom',
          valuePrepareFunction: (departament: any, row: any) =>
            this.isNotificationSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSendNotificationChange(instance),
        },
      },
    };
  }

  onSendNotificationChange(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.sendNotification(data.row, data.toggle),
    });
  }

  isNotificationSelected(notification: any) {
    const exists = this.selectedNotifications.find(
      _notifi => _notifi.wheelNumber == notification.wheelNumber
    );
    if (!exists) return false;
    return true;
  }

  ngOnInit(): void {
    this.openDialog();
    this.formControls.messageType.valueChanges
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.onMessageTypeChange())
      )
      .subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        skip(1) // TODO: cambiar por skipwhile cuando funcione el ms de usuarios
        // skipWhile(() => !this.documentsForm.valid)
      )
      .subscribe(() => this.getNotificationsByAreas());
  }

  openDialog() {
    const modalConfig: any = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        callback: (data: { job: any; copies: any[] }) => {
          if (data) {
            this.queryMode = true;
            this.patchFormValue(data);
          }
        },
      },
    };
    this.modalService.show(ShippingDocumentsDialogComponent, modalConfig);
  }

  patchFormValue(data: { job: any; copies: any[] }) {
    this.documentsForm.disable();
    const { job, copies } = data;
    this.officeKey = job.jobKey;
    this.officeNumber = job.id;
    // const receiver = copies.find(copy => copy.personType == 'D');
    // const cpp = copies.find(copy => copy.personType == 'C');
    // const receivers = [receiver];
    // console.log({ receiver, cpp });
    // if (cpp) {
    //   this.formControls.cpp.setValue(cpp.id);
    //   receivers.push(cpp);
    //   this.getDepartmentTarget(cpp);
    // } else {
    //   this.getDepartmentTarget(receiver);
    // }
    // this.receivers = new DefaultSelect(receivers, receivers.length);
    this.documentsForm.patchValue({
      date: job.shippingDate,
      priority: job.priority,
      messageBody: job.text,
      sender: job.userOrigin,
      // receiver: receiver.id,
    });
    this.getNotificationsByOffice(job.id);
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...SHIPPING_DOCUMENTS_COLUMNS,
      },
    };
  }

  getNotificationsByOffice(officeNum: string | number) {
    const params = this.params.getValue();
    params.addFilter('wheelNumber', officeNum);
    this.params.next(params);
  }

  onMessageTypeChange() {
    const messageType = this.formControls.messageType.value;
    if (messageType == 'area') {
      const dateCtrl = new Date(this.formControls.date.value);
      const date = format(dateCtrl, 'dd-mm-yyyy');
      this.formControls.messageBody.setValue(AREAS_TEXT(date));
    }
    if (messageType == 'direction') {
      this.formControls.messageBody.setValue(DIRECTION_TEXT);
    }
  }

  sendNotification(notification: any, selected: boolean) {
    if (selected) {
      this.selectedNotifications.push(notification);
    } else {
      this.selectedNotifications = this.selectedNotifications.filter(
        _notification => _notification.wheelNumber != notification.wheelNumber
      );
    }
  }

  save() {
    if (this.queryMode) {
      return;
    }
    this.documentsForm.markAllAsTouched();
    if (!this.documentsForm.valid) {
      this.onLoadToast('warning', 'Advertencia', 'Valida el formulario');
      return;
    }
    if (this.selectedNotifications.length === 0) {
      this.onLoadToast(
        'warning',
        'Advertencia',
        'Debe seleccionar los volantes a enviar'
      );
      return;
    }
    this.getDepartmentById().subscribe({
      next: department => this.setOfficeKey(department),
    });
  }

  setOfficeKey(department: IDepartment) {
    const { dsarea, lastOffice } = department;
    const last = Number(lastOffice ?? 0) + 1;
    const year = new Date().getFullYear();
    const officeKey = `${dsarea}/${last}/${year}`;
    this.formControls.officeCve.setValue(officeKey);
    this.saveAll(department);
  }

  incrementLastOffice(department: IDepartment) {
    department.lastOffice = Number(department.lastOffice) + 1;
    this.departmentService.update2(department).subscribe();
  }

  getDepartmentById() {
    /**
     * ! Estos valores estan harcodeados, se deben traer del token
     */
    const body = {
      id: 1,
      numDelegation: 0,
      numSubDelegation: 0,
      phaseEdo: 1,
    };
    return this.departmentService.getByDelIds(body);
  }

  saveAll(department: IDepartment) {
    this.patchJobValue();
    this.createOffice().subscribe({
      next: () => {
        this.incrementLastOffice(department);

        this.onLoadToast('success', '', 'Envio generado correctamente');
      },
    });
  }

  buildOfficeCopies(officeNum: string) {
    const { receiver, cpp } = this.formControls;
    this.receiver.controls.personKey.setValue(receiver.value);
    this.cpp.controls.personKey.setValue(`${cpp.value}`);
    const copies = [this.receiver];
    if (cpp.value) {
      copies.push(this.cpp);
    }
    copies.forEach(copy => copy.controls.jobNumber.setValue(officeNum));
    return copies;
  }

  createTradeCopy(job: any) {
    return this.copiesByTradeService.create(job);
  }

  updateNotification(id: string, officeNumber: string) {
    return this.notificationService.update(id, { officeNumber });
  }

  createOffice() {
    this.loading = true;
    return this.jobsService.create(this.jobForm.value).pipe(
      // TODO: Descomentar y checar funcionalidad ticket - 254
      switchMap((response: any) => {
        const copies = this.buildOfficeCopies(response.id);
        const obs = copies.map(copy => this.createTradeCopy(copy.value));
        return forkJoin(obs).pipe(map(() => response));
      }),
      switchMap((response: any) =>
        forkJoin(
          this.selectedNotifications.map(noti =>
            this.updateNotification(noti.wheelNumber, response.id)
          )
        ).pipe(map(() => response))
      ),
      catchError(error => {
        this.loading = false;
        if (error.status >= 500) {
          this.handleError('Ocurrio un error al generar el oficio');
        }
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        this.patchOfficeCve(response);
      })
    );
  }

  patchOfficeCve(job: any) {
    this.officeKey = job.jobKey;
    this.officeNumber = job.id;
    window.scrollTo(0, 0);
  }

  handleError(message: string) {
    this.onLoadToast('error', 'Error', message);
  }

  patchJobValue() {
    const mainForm = this.documentsForm.value;
    this.jobForm.patchValue({
      jobKey: mainForm.officeCve,
      shippingDate: new Date(mainForm.date),
      shippingDate2: new Date(mainForm.date),
      priority: mainForm.priority,
      status: 'P',
      jobsType: 'T',
      text: mainForm.messageBody,
      userOrigin: mainForm.sender,
    });
  }

  getSenders(params: ListParams) {
    this.getUsers(params)
      .pipe(
        map(response => {
          const receiverCode = this.formControls.receiver.value;
          return this.filterUsers(response, receiverCode);
        }),
        tap(
          response =>
            (this.senders = new DefaultSelect(response.data, response.count))
        )
      )
      .subscribe();
  }

  getReceivers(params: ListParams) {
    this.getUsers(params)
      .pipe(
        map(response => {
          const senderCode = this.formControls.sender.value;
          return this.filterUsers(response, senderCode);
        }),
        tap(
          response =>
            (this.receivers = new DefaultSelect(response.data, response.count))
        )
      )
      .subscribe();
  }

  getUsers(params: ListParams) {
    return this.usersService.getAllSegXAreas(params);
  }

  getDepartmentTarget(user: any) {
    const { delegation, departament, subDelegation } = user;
    this.delegations = new DefaultSelect([delegation], 1);
    this.subdelegations = new DefaultSelect([subDelegation], 1);
    this.departments = new DefaultSelect([departament], 1);
    this.documentsForm.patchValue({
      delegation: delegation.id,
      subdelegation: subDelegation.id,
      department: departament.id,
    });
  }

  filterUsers(response: IListResponse<any>, usercode: string) {
    if (usercode) {
      response.data = response.data.filter(user => user.id != usercode);
      return response;
    } else {
      return response;
    }
  }

  getNotifications() {
    const { delegation, subdelegation, department } = this.formControls;
    const params = this.params.getValue();
    params.addFilter('delDestinyNumber', delegation.value);
    params.addFilter('subDelDestinyNumber', subdelegation.value);
    params.addFilter('departamentDestinyNumber', department.value);
    params.addFilter('officeNumber', SearchFilter.NULL);
    this.params.next(params);
  }

  getNotificationsByAreas() {
    const params = this.params.getValue().getParams();
    return this.notificationService
      .getNotificationsFilter(params)
      .pipe(
        tap(response => {
          if (response.count == 0) {
            this.onLoadToast('error', 'Error', 'No hay notificaciones');
          }
        })
      )
      .subscribe({
        next: response => {
          if (this.queryMode) {
            this.selectedNotifications = response.data;
          }
          this.notifications = response.data;
          this.totalNotifications = response.count;
        },
      });
  }

  getSubjectById(code: string) {
    return this.affairService.getById(code);
  }
}
