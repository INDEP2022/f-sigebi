import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  guidelinesForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  saveButton: string =
    '<span><i class="bx bx-save text-success font-size-20 float-icon me-1"></i></span>';
  cancelButton: string =
    '<span><i class="bx bx-x-circle text-danger font-size-20 float-icon me-1 cancel"></i></span>';
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  guidelinesColumns: any[] = [];
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

  guidelinesTestData = [
    {
      guideline: 'ACTA DE TRANSFERENCIA INDEP',
      firstRevision: 'SI',
      firstRevisionObserv: 'EJEMPLO OBSERVACION 1',
      secondRevision: 'N/A',
      secondRevisionObserv: 'EJEMPLO OBSERVACION 2',
    },
    {
      guideline: 'SOLICITUD DE PAGO RESARCIMIENTO (INSTRUCCIÓN DE PAGO ANCEA)',
      firstRevision: '',
      firstRevisionObserv: '',
      secondRevision: '',
      secondRevisionObserv: '',
    },
    {
      guideline:
        'COPIA CERTIFICADA DE LA RESOLUCIÓN EMITIDA POR LA AUTORIDAD QUE ORDENE EL PAGO DE RESARCMIENTO',
      firstRevision: '',
      firstRevisionObserv: '',
      secondRevision: '',
      secondRevisionObserv: '',
    },
    {
      guideline: 'DOCUMENTO EN EL CUAL SE INDICA EL MONTO A PAGAR',
      firstRevision: '',
      firstRevisionObserv: '',
      secondRevision: '',
      secondRevisionObserv: '',
    },
  ];

  constructor(private fb: FormBuilder) {
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
  }

  prepareForm() {
    this.guidelinesForm = this.fb.group({
      firstRevisionDate: [null, [Validators.required]],
      secondRevisionDate: [null],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getData() {
    this.guidelinesColumns = this.guidelinesTestData;
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
    this.onSave.emit(true);
  }
}
