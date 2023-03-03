import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { CoverExpedientService } from 'src/app/core/services/ms-cover-expedient/cover-expedient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-associate-file',
  templateUrl: './associate-file.component.html',
  styles: [],
})
export class AssociateFileComponent extends BasePage implements OnInit {
  associateFileForm: FormGroup = new FormGroup({});
  parameter: any;
  users: any;
  units: any;
  files: any;
  dispositions: any;
  functionarys = new DefaultSelect();

  idUser: number;
  idUnit: number;
  ddcId: number = null;
  codificacion: string = '';
  periodoRecerva: string = '';
  vigenciaTramite: string = '';
  vigenciaConcentracion: string = '';
  transferentName: string = '';
  regionalDelegacionName: string = '';

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private externalExpedientService: CoverExpedientService,
    private transferentService: TransferenteService,
    private regioinalDelegation: RegionalDelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getUserSelect(new ListParams());
    this.formsChanges();
    this.getTransferent();
    this.getRegionalDelegation();
    console.log(this.parameter);
  }
  formsChanges() {
    this.associateFileForm.controls['user'].valueChanges.subscribe(data => {
      if (data) {
        this.idUser = data;
        this.getUnitSelect(new ListParams(), data);
      }
    });

    this.associateFileForm.controls['unit'].valueChanges.subscribe(data => {
      if (data) {
        this.idUnit = data;
        this.getFileSelect(new ListParams(), this.idUnit, this.idUser);
      }
    });

    this.associateFileForm.controls['file'].valueChanges.subscribe(data => {
      if (data) {
        this.getDispositionSelect(new ListParams());
      }
    });
    this.associateFileForm.controls['disposition'].valueChanges.subscribe(
      data => {
        if (data) {
          const disposition = this.dispositions.filter(
            (x: any) => x.ddcId === data
          )[0];
          this.ddcId = data;
          this.codificacion = disposition.ddcCodificacion;
          this.periodoRecerva = disposition.PeriodoReserva;
          this.vigenciaTramite = disposition.VArchivoTramite;
          this.vigenciaConcentracion = disposition.VArchivoConcentracion;
        }
      }
    );
  }

  prepareForm() {
    this.associateFileForm = this.fb.group({
      user: [null, [Validators.required]],
      unit: [null, [Validators.required]],
      file: [null, [Validators.required]],
      disposition: [null, [Validators.required]],
      functionary: [null, [Validators.required]],
      fileDate: [null, [Validators.required]],
      reservationDate: [null],
      fojas: [null, [Validators.required]],
      legajos: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  confirm() {}

  close() {
    this.modalRef.hide();
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

  getFunctionarySelect(functionary: ListParams) {}

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
}
