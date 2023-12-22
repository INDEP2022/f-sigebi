import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { GUIDELINES_COLUMNS } from './guidelines-columns';
import { GuidelinesObservationsComponent } from './guidelines-observations/guidelines-observations.component';
import { GuidelinesRevisionViewComponent } from './guidelines-revision-view/guidelines-revision-view.component';
import { GuidelinesRevisionComponent } from './guidelines-revision/guidelines-revision.component';
import { GuidelinesService } from 'src/app/core/services/guidelines/guideline.service';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.scss'],
})
export class GuidelinesComponent extends BasePage implements OnInit {
  edited: boolean = false;
  @Input() requestId: number;
  @Output() onSave = new EventEmitter<boolean>();
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

  guidelinesSettings = {
    ...TABLE_SETTINGS,
    mode: 'internal',
    attr: {
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
    },
  };

  guidelinesData = [
    {
      id: 1,
      guideline: 'ACTA DE TRANSFERENCIA INDEP',
      firstRevision: 'SI',
      firstRevisionObserv: 'EJEMPLO OBSERVACION 1',
      secondRevision: 'N/A',
      secondRevisionObserv: 'EJEMPLO OBSERVACION 2',
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
      guideline: 'COPIA CERTIFICADA DE LA RESOLUCIÓN EMITIDA POR LA AUTORIDAD QUE ORDENE EL PAGO DE RESARCMIENTO',
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


  constructor(private fb: FormBuilder,
    private guidelinesService: GuidelinesService) {
    super();
    this.guidelinesSettings.columns = GUIDELINES_COLUMNS;
    this.guidelinesSettings.columns = {
      ...this.guidelinesSettings.columns,
      firstRevision: {
        title: '(Revisión 1) Cumple',
        sort: false,
        type: 'custom',
        renderComponent: GuidelinesRevisionViewComponent,
        editor: {
          type: 'custom',
          component: GuidelinesRevisionComponent,
        },
      },
      firstRevisionObserv: {
        title: 'Observaciones',
        sort: false,
        type: 'html',
        width: '25%',
        editor: {
          type: 'custom',
          component: GuidelinesObservationsComponent,
        },
      },
      secondRevision: {
        title: '(Revisión 2) Cumple',
        sort: false,
        type: 'custom',
        renderComponent: GuidelinesRevisionViewComponent,
        editor: {
          type: 'custom',
          component: GuidelinesRevisionComponent,
        },
      },
      secondRevisionObserv: {
        title: 'Observaciones',
        sort: false,
        type: 'html',
        width: '25%',
        editor: {
          type: 'custom',
          component: GuidelinesObservationsComponent,
        },
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getData();
    this.getGuidelines();
  }

  prepareForm() {
    this.guidelinesForm = this.fb.group({
      firstRevisionDate: [null, [Validators.required]],
      secondRevisionDate: [null],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getData() {
    this.guidelinesColumns = this.guidelinesData;
    this.totalItems = this.guidelinesColumns.length;
  }

  editGuideline(event: any) {
    console.log(event);
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

  save() {
    // Llamar servicio para guardar informacion
    console.log(this.guidelinesForm.value, this.guidelinesColumns);
    this.saveGuidelines();
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
          this.guidelinesForm.patchValue({
            firstRevisionDate: new Date(this.loadGuidelines[0].meetsRevision1),
            secondRevisionDate: new Date(this.loadGuidelines[0].meetsRevision2),
            observations: this.loadGuidelines[0].missingActionsRev1,
          });
        }

        console.log(resp);
      },
    });
  }

  saveGuidelines() {

    let obj = this.guidelinesForm.getRawValue();
    const user: any = this.authService.decodeToken();

    let object: any = {
      applicationId: this.requestId,
      lineamentId: 2,
      meetsRevision1: moment(obj.firstRevisionDate).format('YYYY-MM-DD'),
      meetsRevision2: moment(obj.secondRevisionDate).format('YYYY-MM-DD'),
      missingActionsRev1: obj.observations,
      missingActionsRev2: obj.observations,
      version: "1",
      userCreation: user.username,
      dateCreation: moment(new Date()).format('YYYY-MM-DD'),
      userModification: user.username,
      dateModification: moment(new Date()).format('YYYY-MM-DD'),
    };

    if (isNullOrEmpty(object.id)) {
      this.guidelinesService.createGuidelines(object).subscribe({
        next: resp => {
          console.log(resp);
          this.msgModal(
            'Se guardarón los cambios'.concat(),
            'Solicitud Guardada',
            'success'
          );
          this.onSave.emit(true);
        }, error: err => {
          console.log(err);
          this.msgModal(
            err.error.message,
            'Error',
            'error'
          );
        }
      });
    } else {
      this.guidelinesService.updateGuidelines(object).subscribe({
        next: resp => {
          console.log(resp);

        },
      });
    }
  }


}
