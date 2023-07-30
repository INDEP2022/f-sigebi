import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BatchService } from 'src/app/core/services/catalogs/batch.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
//BasePage
import { LocalDataSource } from 'ng2-smart-table';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { NotificationcomerService } from 'src/app/core/services/ms-notificationcomer/notificationcomer.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-property-adjudication-notification-report',
  templateUrl: './property-adjudication-notification-report.component.html',
  styleUrls: ['property-adjudication-notification-report.component.scss'],
})
export class PropertyAdjudicationNotificationReportComponent
  extends BasePage
  implements OnInit
{
  batchList: any;
  desc: any;
  descType: string;
  dataBatch: any[] = [];
  totalItems: number = 0;
  form: FormGroup;
  params = new BehaviorSubject<ListParams>(new ListParams());
  user: string;
  userdelegacion: string;
  userDepartament: string;
  data = new LocalDataSource();
  nomCliente: any;
  constructor(
    private fb: FormBuilder,
    private batchService: BatchService,
    private reportService: ReportService,
    private authService: AuthService,
    private fractionsService: FractionsService,
    private comerEventService: ComerEventService,
    private notificationcomerService: NotificationcomerService,
    private lotService: LotService,
    private comerClientsService: ComerClientsService
  ) {
    super();
  }

  settings4 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: { ...dataBatchColum },
    noDataMessage: 'No se encontrarón registros',
  };

  data4 = EXAMPLE_DAT4;

  ngOnInit(): void {
    this.prepareForm();
    this.getuser();
  }

  prepareForm() {
    this.form = this.fb.group({
      evento: [null, [Validators.required]],
      claveOficio: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      fechaFallo: [null],
      FechaLimPago: [null],
      texto1: [null, [Validators.pattern(STRING_PATTERN)]],
      texto2: [null, [Validators.pattern(STRING_PATTERN)]],
      texto3: [null, [Validators.pattern(STRING_PATTERN)]],
      texto4: [null, [Validators.pattern(STRING_PATTERN)]],
      firmante: [null, [Validators.pattern(STRING_PATTERN)]],
      elaboro: [null, [Validators.pattern(STRING_PATTERN)]],
      ccp1: [null, [Validators.pattern(STRING_PATTERN)]],
      ccp2: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }
  userRowSelect(event: any) {
    this.reportService.getBatch(event.data.description).subscribe({
      next: data => {
        this.desc = data;
        console.log(this.desc);
      },
      error: error => (this.loading = false),
    });
  }

  getBatch(event: string | number) {
    this.loading = true;
    this.lotService.getLotbyEvent(event, this.params.getValue()).subscribe({
      next: response => {
        this.totalItems = response.count;
        for (let i = 0; i < response.data.length; i++) {
          console.log('respuesta Batch: ', response.data[i]);
          this.comerClientsService
            .getClientEventId(response.data[i].idClient)
            .subscribe({
              next: resp => {
                this.nomCliente = resp.reasonName;

                let dataTable = {
                  loPublico: response.data[i].lotPublic,
                  description: response.data[i].description,
                  cliente: this.nomCliente,
                  num_oficio: response.data[i].description,
                };
                this.dataBatch.push(dataTable);
                this.data.load(this.dataBatch);
              },
            });
        }
      },
      error: error => (this.loading = false),
    });
  }

  getClientEvent(id: string | number) {
    this.comerClientsService.getClientEventId(id).subscribe({
      next: response => {
        console.log('response cliente: ', response);
        this.nomCliente = response.reasonName;
      },
    });
  }

  confirm(): void {
    let params = {
      DESTYPE: this.descType,
      P_EVENTO: this.form.controls['evento'].value,
    };

    //this.showSearch = true;
    console.log(params);
    const start = new Date(this.form.get('fechaFallo').value);
    const end = new Date(this.form.get('FechaLimPago').value);

    const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;

    if (end < start) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Fecha final no puede ser menor a fecha de inicio'
      );
      return;
    }

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FCOMERNOTIFICAINMU.pdf?DESTYPE=${params.DESTYPE}&P_EVENTO=${params.P_EVENTO}`;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, ' FCOMERNOTIFICAINMU.pdf');
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    this.loading = false;
    this.cleanForm();
  }

  cleanForm(): void {
    this.form.reset();
  }

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.name.toUpperCase();
    this.userdelegacion = token.delegacionreg.toUpperCase();
    let userDepartament = token.department.toUpperCase();
    this.getdepartament(userDepartament);
    console.log('User: ', token);
  }

  getdepartament(id: number | string) {
    this.fractionsService.getDepartament(id).subscribe({
      next: response => {
        this.userDepartament = response.data[0].description;
        console.log('respuesta Departament ', response.data[0]);
      },
    });
  }
  onInvoiceInputChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.getComerEvent(inputValue);
    this.getBatch(inputValue);
  }

  getComerEvent(id: string) {
    this.notificationcomerService.getcomer(id).subscribe({
      next: response => {
        console.log('Respuesta Comer Evento: ', response);
        let dataForm = {
          claveOficio: response.numberJob,
          fechaFallo: response.dateFailed,
          FechaLimPago: response.dateLimit,
          texto1: response.text1,
          texto2: response.text2,
          texto3: response.text3,
          texto4: response.text4,
        };
        this.form.patchValue(dataForm);
      },
    });
  }
}

const EXAMPLE_DAT4 = [
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
];
export const dataBatchColum = {
  loPublico: {
    title: 'Lote Público',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Description',
    type: 'string',
    sort: false,
  },
  cliente: {
    title: 'Cliente',
    type: 'number',
    sort: false,
  },
  num_oficio: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },
};
