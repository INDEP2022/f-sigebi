/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';
import { LIST_BIENES_COLUMN } from './columns-bienes';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-approve-return-request',
  templateUrl: './approve-return-request.component.html',
  styleUrls: ['./approve-return-request.component.scss'],
})
export class ApproveReturnRequestComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  data = [
    {
      title:
        'APROBAR DEVOLUCION, No. Solicitud: 1830, Contribuyente, Daniel, PAMA:25345ADF',
      noRequest: 1830,
      numTask: 545456,
      noInstance: 820170,
      created: 'tester_nsbxt',
      status: '',
      process: 'RegistroSolicitudes',
    },
    {
      title:
        'APROBAR DEVOLUCION, No. Solicitud: 1932, Contribuyente, Daniel, PAMA:25345ADF',
      noRequest: 1932,
      numTask: 543156,
      noInstance: 610170,
      created: 'tester_nsbxt',
      status: '',
      process: 'RegistroSolicitudes',
    },
  ];
  items = new DefaultSelect<Example>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;
  listSolicitudSelected: any[] = [];
  public form: FormGroup;
  public nombrePantalla: string = 'approve-return-request';
  public nombreTabInformacionSolicitud: string = 'Información de la Solicitud';
  public idNoRequest: number = null;
  public mostrarListado: boolean = true;

  constructor(
    private fb: FormBuilder,
    private exampleService: ExampleService,
    public router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: '' };
    this.settings.columns = LIST_BIENES_COLUMN;
    this.loading = false;
    this.paragraphs = this.data;
  }

  editRowTable(event: any) {
    console.log(event);
    if (event.data.process == 'RegistroSolicitudes') {
      // en el caso de que el proceso seleccionado sea Solicitud de DEVOLUCION
      this.idNoRequest = event.data.noRequest;
      this.mostrarListado = false;
    }
  }
  btnRegresarLista() {
    this.mostrarListado = true;
  }
  dataRegistration(data: any) {
    console.log(data);
  }
}
