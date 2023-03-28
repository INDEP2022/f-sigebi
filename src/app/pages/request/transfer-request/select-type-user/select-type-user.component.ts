import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IOrderService } from 'src/app/core/models/ms-order-service/order-service.mode';
import { IUserProcess } from 'src/app/core/models/ms-user-process/user-process.model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
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
  data: any; // solicitud pasada por el modal
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
  private orderService = inject(OrderServiceService);
  private router = inject(Router);

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
      this.loader.load = true;
      const requestUpdate: any = {};
      requestUpdate.id = this.data.id;
      requestUpdate.targetUserType = this.userForm.controls['typeUser'].value;
      requestUpdate.targetUser = this.user.id;
      //Todo: enviar la solicitud
      const requestResult = await this.saveRequest(requestUpdate);
      if (requestResult === true) {
        //TODO: generar o recuperar el reporte
        const report = await this.generateReport(
          'SolicitudTransferencia',
          this.data.id,
          ''
        );

        if (report) {
          let form: any = {};
          form['ddocTitle'] = `Solicitud_${this.data.id}`;
          form['xidExpediente'] = this.data.recordId;
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

          const file: any = report;
          //TODO: Guardarlo en el content
          const addToContent = await this.addDocumentToContent(form, file);
          if (addToContent) {
            const docName = addToContent;
            console.log(docName);
            const title =
              'Registro de solicitud (Verificar Cumplimiento) con folio: ' +
              this.data.id;
            const url = 'pages/request/transfer-request/verify-compliance';
            /* crea una nueva tarea */
            const taskResponse = await this.createTask(title, url);
            if (taskResponse) {
              const from = 'REGISTRO_SOLICITUD';
              const to = 'VERIFICAR_CUMPLIMIENTO';
              /* actualizar status del bien */
              const orderServResult = await this.createOrderService(from, to);

              if (orderServResult) {
                this.loader.load = false;
                Swal.fire({
                  title: 'Solicitud Turnada',
                  text: 'La solicitud se turno correctamente',
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
          this.loader.load = false;
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
              this.loader.load = false;
              this.message('error', 'Error', 'Error al subir al content');
              resolve(null);
            }
          },
          error: error => {
            this.loader.load = false;
            this.message('error', 'Error', 'Error al subir al content');
            reject('error al guardar al content');
          },
        });
    });
  }

  createTask(title: string, url: string) {
    return new Promise((resolve, reject) => {
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
      /* body['isPublic'] = 's';
      body['istestTask'] = 's'; */
      body['programmingId'] = 0;
      body['requestId'] = this.data.id;
      body['expedientId'] = this.data.recordId;
      body['urlNb'] = url;
      this.taskService.createTask(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          this.loader.load = false;
          console.log(error);
          this.message('error', 'Error', 'Error crear la tarea');
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
            this.loader.load = false;
            this.message(
              'error',
              'Error al guardar',
              'No se pudo bajar el documento'
            );
            reject('false');
          },
        });
    });
  }

  createOrderService(from: string, to: string) {
    return new Promise((resolve, reject) => {
      let orderservice: IOrderService = {};
      orderservice.P_ESTATUS_ACTUAL = from;
      orderservice.P_ESTATUS_NUEVO = to;
      orderservice.P_ID_SOLICITUD = this.data.id;
      orderservice.P_SIN_BIENES = '';
      orderservice.P_BIENES_ACLARACION = '';
      orderservice.P_FECHA_INSTANCIA = '';
      orderservice.P_FECHA_ACTUAL = '';
      orderservice.P_ORDEN_SERVICIO_IN = '';
      orderservice.P_ORDEN_SERVICIO_OUT = '';
      this.orderService.UpdateStatusGood(orderservice).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          this.loader.load = false;
          this.message(
            'error',
            'Error',
            'Error al actualizar el estatus del bien'
          );
          reject(error.error.message);
        },
      });
    });
  }

  close() {
    this.modalRef.hide();
    this.router.navigate(['pages/siab-web/sami/consult-tasks']);
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
}
