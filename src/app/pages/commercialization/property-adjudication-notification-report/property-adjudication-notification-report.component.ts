import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BatchService } from 'src/app/core/services/catalogs/batch.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
//BasePage
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { NotificationcomerService } from 'src/app/core/services/ms-notificationcomer/notificationcomer.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

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
  parametros: any;
  user: string;
  userdelegacion: string;
  userDepartament: string;
  data = new LocalDataSource();
  nomCliente: any;
  selectedNotifications: any[] = [];
  source: LocalDataSource;
  lotesSelected: any[] = [];
  columnFilters: any = [];
  inputValue: any;
  neworconsult: boolean = true;
  descevento: any;
  description: any;
  imprimir: boolean = false;

  constructor(
    private fb: FormBuilder,
    private batchService: BatchService,
    private reportService: ReportService,
    private authService: AuthService,
    private fractionsService: FractionsService,
    private comerEventService: ComerEventService,
    private notificationcomerService: NotificationcomerService,
    private lotService: LotService,
    private comerClientsService: ComerClientsService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
  }

  settings4 = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
    columns: {
      ...dataBatchColum,
      name: {
        title: 'Selección',
        sort: false,
        type: 'custom',
        valuePrepareFunction: (value: boolean, seleLote: any) =>
          this.isLoteSelected(seleLote),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onSelectLote(instance),
      },
    },
    noDataMessage: 'No se Encontraron Registros',
  };

  ngOnInit(): void {
    this.prepareForm();
    this.getuser();
    this.filterColumns();
    this.source = new LocalDataSource([]);
    this.neworconsult = true;
    this.inicializarVisibilidadCampos();
  }

  inicializarVisibilidadCampos() {
    this.disableCampo('claveOficio');
    this.disableCampo('fechaFallo');
    this.disableCampo('FechaLimPago');
  }

  enableInputs() {
    this.enableCampo('claveOficio');
    this.enableCampo('fechaFallo');
    this.enableCampo('FechaLimPago');
  }

  disableCampo(campo: string) {
    this.form.get(campo).disable();
    this.form.get(campo).setValue('');
  }
  enableCampo(campo: string) {
    this.form.get(campo).enable();
  }

  inicializarCampos() {
    this.form.get('claveOficio').setValue('');
    this.form.get('fechaFallo').setValue('');
    this.form.get('claveOficio').setValue('');
    this.form.get('FechaLimPago').setValue('');
    this.form.get('texto1').setValue('');
    this.form.get('texto2').setValue('');
    this.form.get('texto3').setValue('');
    this.form.get('texto4').setValue('');
    this.form.get('firmante').setValue('');
    this.form.get('elaboro').setValue('');
    this.form.get('ccp1').setValue('');
    this.form.get('ccp2').setValue('');
  }

  prepareForm() {
    this.form = this.fb.group({
      evento: [null, [Validators.required]],
      descevento: [null, [Validators.required]],
      description: [null, [Validators.required]],
      claveOficio: [{ value: null }, [Validators.required]],
      fechaFallo: [null, [Validators.required]],
      FechaLimPago: [null, [Validators.required]],
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
    this.dataBatch = [];
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
                  lotPublic: response.data[i].lotPublic,
                  description: response.data[i].description,
                  cliente: this.nomCliente,
                  num_oficio: response.data[i].noJobnNotifies,
                };

                this.dataBatch.push(dataTable);
                this.data.refresh();
                this.data.load(this.dataBatch);
              },
            });
        }
      },
      error: error => (
        this.inicializarVisibilidadCampos(),
        (this.loading = false),
        console.log('Entra a Error')
      ),
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
    this.parametros = {
      DESTYPE: this.descType,
      P_EVENTO: this.form.controls['evento'].value,
    };

    //this.showSearch = true;
    console.log(this.parametros);
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
        'Advertencia',
        'La Fecha Final no Puede ser Menor a la Fecha de Inicio'
      );
      return;
    }
    this.onSubmit();
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte Generado', '');
    }, 2000);

    //this.loading = false;
    //this.cleanForm();
    //this.imprimir = false;
  }

  onSubmit() {
    if (this.parametros != null) {
      this.siabService
        //RCOMERNOTIFICAINMU
        .fetchReport('blank', this.parametros)
        .subscribe({
          next: res => {
            if (res !== null) {
              const blob = new Blob([res], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              let config = {
                initialState: {
                  documento: {
                    urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                    type: 'pdf',
                  },
                  callback: (data: any) => {},
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(PreviewDocumentsComponent, config);
            } else {
              const blob = new Blob([res], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              let config = {
                initialState: {
                  documento: {
                    urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                    type: 'pdf',
                  },
                  callback: (data: any) => {},
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(PreviewDocumentsComponent, config);
            }
          },
          error: (error: any) => {
            console.log('error', error);
          },
        });
    }
  }
  cleanForm(): void {
    this.form.reset();
    this.data.load([]);
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
    if (this.form.get('evento').value == null || '') {
      return;
    } else {
      this.inputValue = (event.target as HTMLInputElement).value;
      let evento = this.form.get('evento').value;
      this.getComerEvent(evento);
      this.getBatch(evento);
      this.getEvent(evento);
      console.log('evento ', evento);
    }
  }

  getEvent(id: string) {
    this.comerEventService.geEventId(id).subscribe({
      next: response => {
        console.log('respuesta Event: ', response);
        this.descevento = response.processKey;
        this.description = response.observations;
        let dataform = {
          descevento: response.processKey,
          description: response.observations,
        };
        this.form.patchValue(dataform);
      },
    });
  }

  getComerEvent(id: string) {
    this.notificationcomerService.getcomer(id).subscribe({
      next: response => {
        this.inicializarVisibilidadCampos();
        this.inicializarCampos();
        this.imprimir = true;
        this.dataBatch = [];
        console.log('Respuesta Comer Evento: ', response);
        let dataForm = {
          claveOficio: response.data[0].numberJob,
          fechaFallo: response.data[0].dateFailed,
          FechaLimPago: response.data[0].dateLimit,
          texto1: response.data[0].text1,
          texto2: response.data[0].text2,
          texto3: response.data[0].text3,
          texto4: response.data[0].text4,
          firmante: response.data[0].signatory,
          elaboro: response.data[0].elaborated,
          ccp1: response.data[0].ccp1,
          ccp2: response.data[0].ccp2,
        };
        this.form.patchValue(dataForm);
        this.imprimir = true;
      },
      error: err => {
        console.log('Error: ', err);
        this.inicializarCampos();
        if (err.status == 400) {
          this.inicializarVisibilidadCampos();
          this.imprimir = false;
          this.dataBatch = [];
        }
      },
    });
  }

  isLoteSelected(delegation: any) {}
  onSelectLote(instance: CheckboxElementComponent) {}

  selectLote(sele: any, selected: boolean) {}

  filterColumns() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'lotPublic':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'cliente':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'num_oficio':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getBatch(this.inputValue);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBatch(this.inputValue));
  }

  inputFechaFallo(event: Date) {
    let inputDateF = event;
    console.log('event: ', event);
    let fecha1 = inputDateF;
    const dia = fecha1.getDate();
    const mes = fecha1.getMonth();
    console.log('messsss1: ', mes);
    let nombremes = this.obtenerNombreMes(mes);
    console.log('Mes ', nombremes);
    this.DateTextut(dia, nombremes);
  }

  inputFechaLimite(event: Date) {
    if (this.form.get('FechaLimPago').value == null || '') {
      return;
    } else {
      let inputDateL = event;
      let fecha = new Date(inputDateL);
      const dia = fecha.getDate();
      const mes = fecha.getMonth();
      console.log('messsss: ', mes);
      let nombremes = this.obtenerNombreMes(mes);
      console.log('Mes ', nombremes);
      this.DateTextdc(dia, nombremes);
    }
  }

  obtenerNombreMes(numeroMes: number): string {
    switch (numeroMes) {
      case 0:
        return 'enero';
      case 1:
        return 'febrero';
      case 2:
        return 'marzo';
      case 3:
        return 'abril';
      case 4:
        return 'mayo';
      case 5:
        return 'junio';
      case 6:
        return 'julio';
      case 7:
        return 'agosto';
      case 8:
        return 'septiembre';
      case 9:
        return 'octubre';
      case 10:
        return 'noviembre';
      case 11:
        return 'diciembre';
      default:
        return 'Mes inválido';
    }
  }

  DateTextut(dia: number, mes: string) {
    let text1 =
      'Por este medio me permito informale que su propuesta económica presentada el pasado ' +
      dia +
      ' de ' +
      mes +
      ' para participar en la ' +
      this.descevento +
      ' ' +
      this.description +
      ', relativo a el(la) ';

    let text3 =
      'resultó ganadora, por lo que deberá realizar los pagos de acuerdo a lo siguiente:';

    let dataform = {
      texto1: text1,
      texto3: text3,
    };
    this.form.patchValue(dataform);
  }

  DateTextdc(dia: number, mes: string) {
    let text2 =
      'El depósito deberá ser efectuado a más tardar el próximo ' +
      dia +
      ' de ' +
      mes +
      ', a nombre de Servicio de Administración y Enajenación ' +
      'de Bienes, SAE, Banco BANAMEX, Sucursal 0266 Cuenta No. 6968940 con la referencia ';

    let text4 =
      'y remitir vía fax al Tel.:17 19 19 30 confirmando a los teléfonos 17 19 19 26 y 17 19 18 87 ' +
      'el comrobante de pago, junto con los datos del Notario que elevará a escritura la operación  ' +
      'de compraventa, éste puede ser de cualquier entidad federativa, pero la firma de las escrituras ' +
      'es en las oficinas centrales del SAE, en la Ciudad de México.';
    if (this.form.get('FechaLimPago').value != '') {
      let dataform = {
        texto2: text2,
        texto4: text4,
      };
      this.form.patchValue(dataform);
    }
  }
}

export const dataBatchColum = {
  lotPublic: {
    title: 'Lote Público',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
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
