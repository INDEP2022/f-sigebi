import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IUserProcess } from 'src/app/core/models/ms-user-process/user-process.model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { UserProcessService } from 'src/app/core/services/ms-user-process/user-process.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { TURN_SELECTED_COLUMNS } from './request-in-turn-selected-columns';

@Component({
  selector: 'app-select-tipe-user',
  templateUrl: './select-type-user.component.html',
  styles: [],
})
export class SelectTypeUserComponent extends BasePage implements OnInit {
  userForm: ModelForm<any>;
  data: any; // parameters desde el padre de la solicitud
  typeAnnex: string;

  paragraphs: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  user: IUserProcess = null;
  warningTLP: boolean = false;

  //injections
  private fb = inject(FormBuilder);
  private userProcessService = inject(UserProcessService);
  private transferentService = inject(TransferenteService);
  private requestService = inject(RequestService);
  private wcontentService = inject(WContentService);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);

  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: TURN_SELECTED_COLUMNS,
    };
    this.initForm();

    this.userForm.controls['typeUser'].valueChanges.subscribe((data: any) => {
      this.getUsers();
      this.TLPMessage();
    });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getUsers();
    });
  }

  initForm() {
    this.userForm = this.fb.group({
      typeUser: ['TE'],
    });
  }

  getUsers() {
    this.loading = true;
    const typeEmployee = this.userForm.controls['typeUser'].value;
    this.params.value.addFilter('employeeType', typeEmployee);
    const filter = this.params.getValue().getParams();
    this.userProcessService.getAll(filter).subscribe({
      next: resp => {
        this.paragraphs = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
        this.params.value.removeAllFilters();
      },
      error: error => {
        this.loading = false;
        this.params.value.removeAllFilters();
      },
    });
  }

  getTransferent(id: number) {
    return new Promise((resolve, reject) => {
      this.transferentService.getById(id).subscribe({
        next: resp => {
          resolve(resp.typeTransferent);
        },
      });
    });
  }

  async TLPMessage() {
    const transferente = this.data.transferenceId;
    const typeUser = this.userForm.controls['typeUser'].value;
    if (transferente != null) {
      const transferenteType = await this.getTransferent(transferente);
      if ('CE' !== transferenteType && 'TE' === typeUser) {
        this.warningTLP = true;
      } else {
        this.warningTLP = false;
      }
    }
  }

  userSelected(event: any) {
    if (event.isSelected) {
      this.user = event.data;
    } else {
      this.user = null;
    }
  }

  async turnRequest() {
    if (this.user) {
      this.data.targetUserType = this.userForm.controls['typeUser'].value;
      this.data.targetUserType = this.user.id;

      //Todo: enviar la solicitud
      const isUpdated = await this.saveRequest(this.data as IRequest);
      if (true === true) {
        //TODO: generar o recuperar el reporte
        const report = await this.generateReport(
          'SolicitudTransferencia',
          this.data.id,
          ''
        );
        if (report) {
          let form: any = {};
          form['ddocTitle'] = `Solicitud_${this.data.id}`;
          form['xidExpediente'] = `Solicitud_${this.data.recordId}`;
          form['ddocType'] = 'Document';
          form['xNombreProceso'] = 'Captura Solicitud';
          form['dSecurityGroup'] = 'Public';
          form['xNivelRegistroNSBDB'] = 'Solicitud';
          form['xTipoDocumento'] = '90';
          form['xnoOficio'] = this.data.paperNumber;
          form['xremitente'] = this.data.nameOfOwner;
          form['xcargoRemitente'] = this.data.holderCharge;

          if (this.data.stationId) {
            form['xestado'] = this.data.stationId;
          }
          form['xidSolicitud'] = this.data.id;
          if (this.data.transferenceId) {
            form['transferenceId'] = this.data.transferenceId;
          }

          //TODO: Guardarlo en el content
          const file: any = report;
          const addToContent = await this.addDocumentToContent(form, file);
          if (addToContent) {
            const docName = addToContent;
            console.log(docName);
            let body: any = {};
            const user: any = this.authService.decodeToken();
            body['id'] = 0;
            body['assignees'] = this.user.username;
            body['assigneesDisplayname'] = this.user.firstName;
            body['creator'] = user.username;
            body['taskNumber'] = Number(this.data.id);
            body['title'] =
              'Registro de solicitud (Verificar Cumplimiento) con folio: ' +
              this.data.id;
            body['isPublic'] = 's';
            body['istestTask'] = 's';

            /* crea una nueva tarea */
            const taskResponse = await this.createTask(body);
            if (taskResponse) {
              Swal.fire({
                title: 'Solicitud Turnada',
                text: 'La solicitud se turno conrrectamente',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#9D2449',
                cancelButtonColor: '#B38E5D',
                confirmButtonText: 'Aceptar',
              }).then(result => {
                this.close();
              });
            }
          }
        }
      }
    } else {
      this.message(
        'error',
        'Seleccione un usuario',
        'Es requerido seleccionar un usuario'
      );
    }
  }

  saveRequest(request: IRequest) {
    return new Promise((resolve, reject) => {
      this.requestService.update(request.id, request).subscribe({
        next: resp => {
          if (resp.id) {
            resolve(true);
          } else {
            this.message(
              'error',
              'Error al guardar',
              'Ocurrio un error al guardar la solicitud'
            );
            reject(false);
          }
        },
        error: error => {
          this.message(
            'error',
            'Error al guardar',
            'Ocurrio un error al guardar la solicitud'
          );
          reject(false);
        },
      });
    });
  }

  addDocumentToContent(form: any, file: any) {
    return new Promise((resolve, reject) => {
      //const body = {};
      const docName = `Reporte_${94}20230321`; //perguntar

      const body = JSON.stringify(form);

      this.wcontentService
        .addDocumentToContent(docName, '.pdf', body, file, '.pdf')
        .subscribe({
          next: resp => {
            if (resp.dDocName) {
              resolve(resp.dDocName);
            } else {
              resolve(null);
            }
          },
          error: error => {
            reject('error al guardar al content');
          },
        });
    });
  }

  createTask(task: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTask(task).subscribe({
        next: resp => {
          if (resp) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: error => {
          console.log(error);
        },
      });
    });
  }

  generateReport(nomReport: string, form: any, ciudad: string) {
    return new Promise((resolve, reject) => {
      this.wcontentService
        .downloadTransferRequestFile(nomReport, form, ciudad)
        .subscribe({
          next: (resp: any) => {
            if (resp) {
              resolve(resp);
            } else {
              resolve(null);
            }
          },
          error: error => {
            reject('');
          },
        });
    });
  }

  close() {
    console.log('entro');

    this.modalRef.hide();
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
}
