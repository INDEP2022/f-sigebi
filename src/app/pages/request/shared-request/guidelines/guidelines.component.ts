import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GuidelinesService } from 'src/app/core/services/guidelines/guideline.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';
import { GUIDELINES_COLUMNS } from './guidelines-columns';
import { GuidelinesObservationsComponent } from './guidelines-observations/guidelines-observations.component';
import { GuidelinesRevisionViewComponent } from './guidelines-revision-view/guidelines-revision-view.component';
import { GuidelinesRevisionComponent } from './guidelines-revision/guidelines-revision.component';

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.scss'],
})
export class GuidelinesComponent extends BasePage implements OnInit {
  edited: boolean = false;
  @Input() requestId: number;
  @Output() onSave = new EventEmitter<boolean>();
  @Output() onChange = new EventEmitter<any>();

  guidelinesForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  saveButton: string =
    '<span><i class="bx bx-save text-success font-size-20 float-icon me-1"></i></span>';
  cancelButton: string =
    '<span><i class="bx bx-x-circle text-danger font-size-20 float-icon me-1 cancel"></i></span>';
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  guidelinesColumns: any[] = [];
  loadingTurn = false;
  configuration: any = null;

  guidelinesSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'left',
      add: false,
      edit: false,
      delete: false,
    },
    //mode: 'internal',
    /*attr: {
      class: 'table-bordered normal-hover',
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
      saveButtonContent: this.saveButton,
      cancelButtonContent: this.cancelButton,
      confirmSave: true,
    },
    actions: {
      columnTitle: 'Acciones',
      position: 'left',
      add: true,
      edit: true,
      delete: false,
    },*/
  };

  guidelinesData = [
    {
      id: 1,
      guideline: 'ACTA DE TRANSFERENCIA INDEP',
      firstRevision: '',
      firstRevisionObserv: '',
      secondRevision: '',
      secondRevisionObserv: '',
    },
    {
      id: 2,
      guideline: 'SOLICITUD DE PAGO RESARCIMIENTO (INSTRUCCIÓN DE PAGO ANCEA)',
      firstRevision: '',
      firstRevisionObserv: '',
      secondRevision: '',
      secondRevisionObserv: '',
    },
    {
      id: 3,
      guideline:
        'COPIA CERTIFICADA DE LA RESOLUCIÓN EMITIDA POR LA AUTORIDAD QUE ORDENE EL PAGO DE RESARCMIENTO',
      firstRevision: '',
      firstRevisionObserv: '',
      secondRevision: '',
      secondRevisionObserv: '',
    },
    {
      id: 4,
      guideline: 'DOCUMENTO EN EL CUAL SE INDICA EL MONTO A PAGAR',
      firstRevision: '',
      firstRevisionObserv: '',
      secondRevision: '',
      secondRevisionObserv: '',
    },
  ];

  loadGuidelines = [];

  private authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private guidelinesService: GuidelinesService
  ) {
    super();
    this.guidelinesSettings.columns = GUIDELINES_COLUMNS;
    this.guidelinesSettings.columns = {
      ...this.guidelinesSettings.columns,
      firstRevision: {
        title: '(Revisión 1) Cumple',
        sort: false,
        type: 'custom',
        renderComponent: GuidelinesRevisionComponent,
        onComponentInitFunction(instance) {
          if (!isNullOrEmpty(instance)) {
            instance.key = 'firstRevision';
            instance.cellChanged.subscribe(row => {

            });
          }
        }
      },
      firstRevisionObserv: {
        title: 'Observaciones',
        sort: false,
        type: 'custom',
        width: '25%',
        renderComponent: GuidelinesObservationsComponent,
        onComponentInitFunction(instance) {
          if (!isNullOrEmpty(instance)) {
            instance.key = 'firstRevisionObserv';
            instance.cellChanged.subscribe(row => {

            });
          }
        }
      },
      secondRevision: {
        title: '(Revisión 2) Cumple',
        sort: false,
        type: 'custom',
        renderComponent: GuidelinesRevisionComponent,
        onComponentInitFunction(instance) {
          if (!isNullOrEmpty(instance)) {
            instance.key = 'secondRevision';
            instance.cellChanged.subscribe(row => {

            });
          }
        }
      },
      secondRevisionObserv: {
        title: 'Observaciones',
        sort: false,
        type: 'custom',
        width: '25%',
        renderComponent: GuidelinesObservationsComponent,
        onComponentInitFunction(instance) {
          if (!isNullOrEmpty(instance)) {
            instance.key = 'secondRevisionObserv';
            instance.cellChanged.subscribe(row => {

            });
          }
        }
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGuidelines();
  }

  prepareForm() {
    this.guidelinesForm = this.fb.group({
      firstRevisionDate: [null, [Validators.required]],
      secondRevisionDate: [null],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getData(data) {
    this.guidelinesColumns = data;
    this.totalItems = this.guidelinesColumns.length;
  }

  editGuideline(event: any) {

    let { newData, confirm, data } = event;
    // Llamar servicio para editar
    // console.log(newData);
    if (JSON.stringify(data) !== JSON.stringify(newData)) {
      confirm.resolve(newData);
      this.edited = true;
    } else {
      this.onLoadToast(
        'error',
        'No se detectaron cambios',
        'Edite un valor de la fila o cancele la edición de la misma'
      );
      confirm.reject();
    }
  }

  edit(event: any) {
    clg: event;
  }

  async save() {
    // Llamar servicio para guardar informacion

    let validate = this.guidelinesColumns.every(objeto => {
      return Object.values(objeto).every(valor => !isNullOrEmpty(valor));
    });

    if (!validate) {
      this.msgModal(
        'Debe llenar todos los campos'.concat(),
        'Campos requeridos',
        'warning'
      );
      return;
    }

    let config = this.guidelinesForm.getRawValue();
    let isNew = true;

    let deault = this.loadGuidelines.find(x => x.lineamentId == 5);
    isNew = isNullOrEmpty(deault);
    if (isNew) {
      deault = this.getObject({
        id: 5,
        firstRevision: 'N/A',
        secondRevision: 'NA',
        firstRevisionObserv: '',
        secondRevisionObserv: ' ',
      });
    }

    deault.missingActionsRev1 = isNullOrEmpty(config.observations) ? " " : config.observations;

    deault.dateCreation = moment(new Date(config.firstRevisionDate));
    deault.dateModification = isNullOrEmpty(config.secondRevisionDate) ? null :
      moment(new Date(config.secondRevisionDate));

    deault.version = !isNullOrEmpty(config.secondRevisionDate) ? "2" : "1";

    await this.saveGuidelines(isNew, deault);

    let promises = this.guidelinesColumns.map(async (element: any) => {
      let deault = this.loadGuidelines.find(x => x.lineamentId == element.id);
      let obj = this.getObject(element);
      return this.saveGuidelines(isNullOrEmpty(deault), obj);
    });

    Promise.all(promises).then(() => {
      this.getGuidelines();

      this.msgModal(
        'Se guardarón los cambios'.concat(),
        'Solicitud Guardada',
        'success'
      );
    });

  }

  getObject(obj) {
    const user: any = this.authService.decodeToken();

    return {
      applicationId: this.requestId.toString(),
      lineamentId: obj.id.toString(),
      meetsRevision1: obj.firstRevision,
      meetsRevision2: obj.secondRevision,
      missingActionsRev1: obj.firstRevisionObserv,
      missingActionsRev2: obj.secondRevisionObserv,
      version: '1',
      userCreation: user.username,
      dateCreation: moment(new Date()).format('YYYY-MM-DD'),
      userModification: user.username,
      dateModification: moment(new Date()).format('YYYY-MM-DD'),
    };
  }

  msgModal(message: string, title: string, typeMsg: any) {
    Swal.fire({
      title: title,
      html: message,
      icon: typeMsg,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        this.loadingTurn = false;
      }
    });
  }

  getGuidelines() {
    const params = new ListParams();
    params['filter.applicationId'] = `$eq:${this.requestId}`;
    this.guidelinesService.getGuidelines(params).subscribe({
      next: resp => {
        this.loadGuidelines = resp.data;

        if (this.loadGuidelines.length > 0) {
          this.guidelinesData.forEach(element => {
            let item = this.loadGuidelines.find(
              x => x.lineamentId == element.id
            );
            if (!isNullOrEmpty(item)) {
              element.firstRevision = item.meetsRevision1;
              element.secondRevision = item.meetsRevision2;
              element.firstRevisionObserv = (item.missingActionsRev1 + "").trim();
              element.secondRevisionObserv = (item.missingActionsRev2 + "").trim();
            }
          });

          let deault = this.loadGuidelines.find(x => x.lineamentId == 5);
          if (!isNullOrEmpty(deault)) {
            this.guidelinesForm.patchValue({
              firstRevisionDate: new Date(deault.dateCreation),
              secondRevisionDate: deault.version == "1" ? null : new Date(deault.dateModification),
              observations: (deault.missingActionsRev1 + "").trim(),
            });
          }

        }

        this.getData(this.guidelinesData);
        this.selectChanges();
      },
      error: err => {
        this.getData(this.guidelinesData);
        this.selectChanges();
      },
    });
  }

  saveGuidelines(create, object) {
    if (create) {
      return new Promise((resolve, reject) => {
        this.guidelinesService.createGuidelines(object).subscribe({
          next: resp => {
            resolve(resp);
          },
          error: err => {
            resolve(err);
          },
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.guidelinesService.updateGuidelines(object).subscribe({
          next: resp => {
            resolve(resp);
          },
          error: err => {
            resolve(err);
          },
        });
      });
    }
  }

  selectChanges() {
    this.onChange.emit({
      isValid: this.loadGuidelines.length > 0,
      object: this.loadGuidelines,
    });
  }
}
