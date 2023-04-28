/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-notification-file-update',
  templateUrl: './notification-file-update.component.html',
  styleUrls: ['./notification-file-update.component.scss'],
})
export class NotificationFileUpdateComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  override loading: boolean = true;
  tableFactGenSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa
    noDataMessage: 'No se encontrarón registros',
    columns: {
      wheelNumber: {
        title: 'No Volante',
      },
      affairKey: {
        title: 'Asunto',
      },
      description: {
        title: 'Descripción',
      },
      captureDate: {
        title: 'Fecha Captura',
      },
      protectionKey: {
        title: 'Clave Amparo',
      },
      preliminaryInquiry: {
        title: 'Averiguación Previa',
      },
      criminalCase: {
        title: 'Causa Penal',
      },
      expedientNumber: {
        title: 'No Expediente',
      },
    },
  };

  dataFactGen: any[] = [
    // {
    //   wheelNumber: 1466449,
    //   asunto: '5',
    //   descripcion: 'DOCUMENTACION COMPLEMENTARIA',
    //   captureDate: '18-10-2018 09:50',
    //   claveAmparo: '',
    //   averiguacionPrevia: 'FED/JAL/GDN',
    //   causaPenal: '',
    //   noExpediente: '1',
    // },
  ];
  params = new BehaviorSubject<ListParams>(new ListParams());

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
    this.onLoadListNotifications();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: ['', [Validators.required]],
    });
  }

  public get noExpediente() {
    return this.form.get('noExpediente');
  }

  mostrarInfo(): any {
    console.log(this.form.value);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onLoadListNotifications();
    }
  }

  onLoadListNotifications() {
    const param = new FilterParams();
    param.addFilter('expedientNumber', this.form.get('noExpediente').value);
    this.notificationService.getAllFilter(param.getParams()).subscribe({
      next: data => {
        this.dataFactGen = data.data;
        this.dataFactGen[0].description = data.data[0].departament.description;
        this.loading = false;
      },
      error: () => {
        this.dataFactGen = [];
        this.loading = false;
      },
    });
  }
}
