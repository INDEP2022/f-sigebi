import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { PHONE_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-request-detail-tab',
  templateUrl: './request-detail-tab.component.html',
  styleUrls: ['./request-detail-tab.component.scss'],
})
export class RequestDetailTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() typeDoc = '';
  //datos pasados del padre
  @Input() requestForm: ModelForm<any>;
  @Input() process: string = '';
  public receptionForm: ModelForm<IRequest>;
  selectTypeExpedient = new DefaultSelect<IRequest>();
  priority: any = null;
  idRequest: number = 0;
  infoRequest: IRequest;
  affairName: string = '';
  ofiginName: string = '';
  selectOriginInfo = new DefaultSelect();
  formLoading: boolean = false;

  transferenceId: number = 0;
  tyepOfTransferent: string = '';

  prioridadLabel: string = 'Prioridad';
  prioridadDateLabel: string = 'Fecha Prioridad';
  procedenciaLabel: string = 'Procedencia Información';
  fechaRecepcionLabel: string = 'Fecha de Recepción';
  fechaOficioLabel: string = 'Fecha de Oficio';
  tipoExpedienteLabel: string = 'Tipo Expediente';
  misterioPublicLabel: string = 'Ministerio Público';
  nombreLabel: string = 'Nombre del Remitente';
  jusgadoLabel: string = 'Juzgado';
  cargoLabel: string = 'Cargo del Remitente';
  delitoLabel: string = 'Delito';
  telefonoLabel: string = 'Teléfono del Remitente';
  viaRecepcionLabel: string = 'Vía Recepción';
  correoLable: string = 'Correo del Remitente';
  gestionDestino: string = 'Gestión Destino';
  contribuyenteLabel: string = 'Contribuyente y/o Indiciado';
  asuntoLabel: string = 'Asunto';
  expedienteTransLabel: string = 'Expediente Transferente/PAMA';
  extincionDomicile: string = 'Extinción de Dominio';
  tipoTransferenteLabel: string = 'Tipo Transferente';
  notasLabel: string = 'Notas Entidad Transferente';
  observaciones: string = 'Observaciones';
  causaPenal: string = 'Causa Penal';
  noAmparoLabel: string = 'No. Amparo';
  tocaPenal: string = 'Toca Penal';
  gestionDestinoLabel: string = 'Gestión de Destino';
  actaCircunstacial: string = 'Acta Circunstanciada';
  averiguacionPreviaLabel: string = 'Averiguación Previa';

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private affairService: AffairService,
    private genericsService: GenericService
  ) {
    super();
    this.idRequest = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.formLoading = true;
    this.tyepOfTransferent = this.requestForm.controls['typeOfTransfer'].value;
    this.reactiveFormCalls();
    this.showDataProg();
    setTimeout(() => {
      this.formLoading = false;
    }, 600);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestForm.controls['originInfo'].value) {
      const originId = Number(this.requestForm.controls['originInfo'].value);
      this.getOriginInfo(new ListParams(), originId);
    }

    if (this.requestForm.controls['affair'].value) {
      const affair = Number(this.requestForm.controls['affair'].value);
      this.getAffair(affair);
    }
  }

  ngAfterViewInit() {
    //this.formLoading = false;
  }

  prepareForm(): void {
    this.receptionForm = this.fb.group({
      priority: [null],
      priorityDate: [null],
      infoProvenance: [null],
      receptDate: [null],
      officeDate: [null, Validators.required],
      typeExpedient: [null],
      nameSender: [null],
      senderCharge: [null],
      phoneSender: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(13)],
      ],
      emailSender: [null],
      publicMinister: [null],
      tribunal: [null],
      crime: [null],
      typeReception: [null], //esta campo depende de que tipo de recepcion es el formulario
      destinationManage: [null],
      contributor: [null],
      subject: [null],
      transExpedient: [null],
      typeTransfer: [null],
      transferEntityNotes: [null],
      observations: [null],
      lawsuit: [null],
    });
  }

  showDataProg() {
    this.requestService.getById(this.idRequest).subscribe((data: any) => {
      this.infoRequest = data;

      this.setLabelNames(this.tyepOfTransferent);
    });
  }

  getTypeExpedient(event: any) {}

  confirm() {
    this.loading = true;
  }

  getAffair(id: number) {
    let params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    params['filter.nbOrigen'] = `$eq:SAMI`;
    this.affairService.getAll(params).subscribe({
      next: ({ data }) => {
        this.affairName = data[0].description;
      },
      error: error => {
        this.affairName = '';
      },
    });
  }

  getOriginInfo(params: ListParams, id: number) {
    params['filter.name'] = '$eq:Procedencia';
    params['filter.keyId'] = `$eq:${id}`;
    params.limit = 20;
    this.genericsService.getAll(params).subscribe({
      next: resp => {
        this.ofiginName = resp.data[0].description;
      },
    });
  }

  setLabelNames(typeTransferent: string) {
    if (typeTransferent === 'PGR_SAE' || typeTransferent === 'FGR_SAE') {
      this.nombreLabel = 'Nombre MP';
      this.cargoLabel = 'Cargo y/o Adscripción';
      this.telefonoLabel = 'Teléfono MP';
      this.correoLable = 'Correo MP';
    }
  }

  reactiveFormCalls() {
    if (this.requestForm.controls['urgentPriority'].value) {
      this.priority =
        this.requestForm.controls['urgentPriority'].value === 'N'
          ? false
          : true;
    }
  }
}
