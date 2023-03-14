import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { CoverExpedientService } from 'src/app/core/services/ms-cover-expedient/cover-expedient.service';
import { ExpedientSamiService } from 'src/app/core/services/ms-expedient/expedient-sami.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RequestHelperService } from '../../../request-helper-services/request-helper.service';

@Component({
  selector: 'app-associate-file',
  templateUrl: './associate-file.component.html',
  styles: [],
})
export class AssociateFileComponent extends BasePage implements OnInit {
  associateFileForm: FormGroup = new FormGroup({});
  parameter: ModelForm<IRequest>;
  users: any;
  units: any;
  files: any;
  dispositions: any;
  functionarys = new DefaultSelect();

  idUser: number;
  idUnit: number;
  ddcId: number = null;
  transferentName: string = '';
  regionalDelegacionName: string = '';

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private externalExpedientService: CoverExpedientService,
    private transferentService: TransferenteService,
    private regioinalDelegation: RegionalDelegationService,
    private requestService: RequestService,
    private expedientSamiService: ExpedientSamiService,
    private requestHelperService: RequestHelperService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getUserSelect(new ListParams());
    this.formsChanges();
    this.getTransferent();
    this.getRegionalDelegation();
    console.log(this.authService.decodeToken());
  }
  formsChanges() {
    this.associateFileForm.controls['inaiUser'].valueChanges.subscribe(data => {
      if (data) {
        this.idUser = data;
        this.getUnitSelect(new ListParams(), data);
      }
    });

    this.associateFileForm.controls['inaiUnit'].valueChanges.subscribe(data => {
      if (data) {
        this.idUnit = data;
        this.getFileSelect(new ListParams(), this.idUnit, this.idUser);
      }
    });

    this.associateFileForm.controls['inaiFile'].valueChanges.subscribe(data => {
      if (data) {
        this.getDispositionSelect(new ListParams());
      }
    });

    this.associateFileForm.controls['provisionInai'].valueChanges.subscribe(
      data => {
        if (data) {
          this.getCompleteDisposition(Number(data));
        }
      }
    );
  }

  prepareForm() {
    this.associateFileForm = this.fb.group({
      inaiUser: [null, [Validators.required]], //user
      inaiUnit: [null, [Validators.required]], //unidad
      inaiFile: [null, [Validators.required]], //file
      provisionInai: [null, [Validators.required]], //disposicion
      inaiOfficial: [null, [Validators.required]], //funcionario
      expedientDate: [null, [Validators.required]], //fecha expediente
      reserveDateInai: [null], //fecha reserva
      sheetsInai: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ], //foja
      filesInai: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      fullCoding: [null], // codificacion
      reservePeriodInai: [null], //periodo de reserva
      clasificationInai: [null], // clasificación
      documentarySectionInai: [null], //seccion documental
      documentarySeriesInai: [null], // serie documental
      vaProcedureInai: [null], // vigencia del archivo tramite
      vaConcentrationInai: [null], // vigencia archivo concentracion
      documentaryValueInai: [null], //valor documental
    });
  }

  confirm() {
    let request = this.parameter.getRawValue();
    let expedient = this.associateFileForm.getRawValue();

    this.expedientSamiService.create(expedient).subscribe({
      next: expedient => {
        if (expedient.id) {
          debugger;
          request.recordId = expedient.id;
          /* this.requestService.update(request.id, request).subscribe({
            next: resp => {
              if (resp.id) {
                this.message(
                  'success',
                  'Expediente Asociado',
                  'Se asocio el expediente correctamente'
                );
                this.closeAssociateExpedientTab();
                this.close();
              }
            },
          }); */
        } else {
          this.message(
            'error',
            'Error en el expediente',
            'Ocurrio un erro al guardar el expediente'
          );
        }
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  closeAssociateExpedientTab() {
    this.requestHelperService.associateExpedient(true);
  }

  getUserSelect(params: ListParams) {
    this.externalExpedientService.getUsers(params).subscribe({
      next: (resp: any) => {
        const data = resp.ObtenUsuarioResult.Usuario;
        this.users = data; //new DefaultSelect(data, data.length);
      },
    });
  }

  getUnitSelect(params: ListParams, userId?: number) {
    this.externalExpedientService.getUnits(userId).subscribe({
      next: (resp: any) => {
        const data = resp.ObtenUnidadResult.Unidad;
        this.units = data; //new DefaultSelect(data, data.length);
      },
    });
  }

  getFileSelect(params: ListParams, unitId?: number, userId?: number) {
    this.externalExpedientService.getFiles(unitId, userId).subscribe({
      next: (resp: any) => {
        const data = resp.ObtenArchivoResult.Archivo;
        this.files = data; //new DefaultSelect(data, data.length);
      },
    });
  }

  getDispositionSelect(params: ListParams) {
    this.externalExpedientService.getDisposition(params).subscribe({
      next: (resp: any) => {
        const data = resp.ObtenDisposicionResult.Disposicion;
        this.dispositions = data;
      },
    });
  }

  getCompleteDisposition(id: string | number) {
    this.externalExpedientService.getCompleteDisposition(id).subscribe({
      next: (resp: any) => {
        const disposition = resp.ObtenDisposicionCompletaResult.Disposicion[0];
        this.ddcId = disposition.ddcId;
        this.associateFileForm.controls['fullCoding'].setValue(
          disposition.ddcCodificacion
        );
        this.associateFileForm.controls['reservePeriodInai'].setValue(
          disposition.PeriodoReserva
        );

        this.associateFileForm.controls['clasificationInai'].setValue(
          disposition.TClasificacion
        );

        this.associateFileForm.controls['documentarySectionInai'].setValue(
          disposition.SeccionDocumental
        );

        this.associateFileForm.controls['documentarySeriesInai'].setValue(
          disposition.SerieDocumental
        );

        this.associateFileForm.controls['vaProcedureInai'].setValue(
          disposition.VArchivoTramite
        );

        this.associateFileForm.controls['vaConcentrationInai'].setValue(
          disposition.VArchivoConcentracion
        );

        this.associateFileForm.controls['documentaryValueInai'].setValue(
          disposition.ValoresDocumentales
        );
      },
    });
  }

  getTransferent() {
    var id = this.parameter.value.transferenceId;
    this.transferentService.getById(id).subscribe({
      next: resp => {
        this.transferentName = resp.nameTransferent;
      },
    });
  }

  getRegionalDelegation() {
    var id = this.parameter.value.regionalDelegationId;
    this.regioinalDelegation.getById(id).subscribe({
      next: resp => {
        this.regionalDelegacionName = resp.description;
      },
    });
  }

  message(header: any, title: string, body: string) {
    setTimeout(() => {
      this.onLoadToast(header, title, body);
    }, 2000);
  }
}
