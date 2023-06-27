import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, map, of, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { HistoryProtectionService } from 'src/app/core/services/ms-history-protection/history-protection.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { MaintenanceOfCoveragesService } from '../maintenace-of-coverages-services/maintenance-of-coverages.service';
import { SendingOfEMailsComponent } from '../sending-of-e-mails/sending-of-e-mails.component';
import { COLUMNS } from './columns';

export interface PathParams {
  volante: number;
  expediente: number;
}

@Component({
  selector: 'app-jp-d-mc-c-maintenance-of-coverages',
  templateUrl: './jp-d-mc-c-maintenance-of-coverages.component.html',
  styles: [],
})
export class JpDMcCMaintenanceOfCoveragesComponent
  extends BasePage
  implements OnInit
{
  e_mail: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any[] = [];
  form: FormGroup; //formulario notificaciones
  pathParams: PathParams = {
    volante: null,
    expediente: null,
  };
  blkControlForm: any = {
    folioUniversal: null,
    rel_est_si: null,
    rel_est_no: null,
  };
  receiptDateValue: Date;
  externalOfficeDateValue: Date;
  affairSelect = new DefaultSelect();
  indiciadosSelected = new DefaultSelect();
  minPubSelected = new DefaultSelect();
  juzgadoSelected = new DefaultSelect();
  delegationSelected = new DefaultSelect();
  citySelected = new DefaultSelect();
  entFedSelected = new DefaultSelect();
  transferentSelected = new DefaultSelect();
  stationSelected = new DefaultSelect();
  authoritySelected = new DefaultSelect();

  listGoodSelected: any = [];
  selectAll: boolean = false;

  notificationServices = inject(NotificationService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  affairService = inject(AffairService);
  indiciadoService = inject(IndiciadosService);
  minPubService = inject(MinPubService);
  juzgadosService = inject(CourtService);
  delegacionService = inject(DelegationService);
  entFedService = inject(EntFedService);
  cityService = inject(CityService);
  transferentService = inject(TransferenteService);
  stationService = inject(StationService);
  authorityService = inject(AuthorityService);
  goodService = inject(GoodService);
  historyProtection = inject(HistoryProtectionService);
  maintenanceOfCoferageService = inject(MaintenanceOfCoveragesService);

  get wheelNumber() {
    return this.form.get('wheelNumber');
  }
  get expedientNumber() {
    return this.form.get('expedientNumber');
  }
  get receiptDate() {
    return this.form.get('receiptDate');
  }
  get expedientTransferenceNumber() {
    return this.form.get('expedientTransferenceNumber');
  }
  get externalOfficeDate() {
    return this.form.get('externalOfficeDate');
  }
  get externalRemitter() {
    return this.form.get('externalRemitter');
  }
  get protectionKey() {
    return this.form.get('protectionKey');
  }
  get officeExternalKey() {
    return this.form.get('officeExternalKey');
  }
  get touchPenaltyKey() {
    return this.form.get('touchPenaltyKey');
  }
  get circumstantialRecord() {
    return this.form.get('circumstantialRecord');
  }
  get preliminaryInquiry() {
    return this.form.get('preliminaryInquiry');
  }
  get criminalCase() {
    return this.form.get('criminalCase');
  }
  get subject() {
    return this.form.get('subject');
  }
  get subjectDescription() {
    return this.form.get('subjectDescription');
  }
  get indiciadoNumber() {
    return this.form.get('indiciadoNumber');
  }
  get defendantDescription() {
    return this.form.get('defendantDescription');
  }
  get minpubNumber() {
    return this.form.get('minpubNumber');
  }
  /*get publicMinistryDescription() {
    return this.form.get('publicMinistryDescription');
  }*/
  get courtNumber() {
    return this.form.get('courtNumber');
  }
  /*get courtDescription() {
    return this.form.get('courtDescription');
  }*/
  get delegationNumber() {
    return this.form.get('delegationNumber');
  }
  /*  get delegationDescription() {
    return this.form.get('delegationDescription');
  } */
  get entFedKey() {
    return this.form.get('entFedKey');
  }
  /*get federativeOrganizationDescription() {
    return this.form.get('federativeOrganizationDescription');
  }*/
  get cityNumber() {
    return this.form.get('cityNumber');
  }
  /*get cityDescription() {
    return this.form.get('cityDescription');
  }*/
  get transference() {
    return this.form.get('transference');
  }
  /*get transferorDescription() {
    return this.form.get('transferorDescription');
  }*/
  get stationNumber() {
    return this.form.get('stationNumber');
  }
  /*get broadcasterDescription() {
    return this.form.get('broadcasterDescription');
  }*/
  get autorityNumber() {
    return this.form.get('autorityNumber');
  }
  /*get authorityDescription() {
    return this.form.get('authorityDescription');
  }*/
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;

    COLUMNS.selected = {
      ...COLUMNS.selected,
      onComponentInitFunction: this.onCLickCheckBox.bind(this),
    };
  }

  ngOnInit(): void {
    this.buildForm();
    //volante
    this.pathParams.volante = Number(
      this.route.snapshot.queryParamMap.get('wheelNumber')
    );
    //expediente
    this.pathParams.expediente = Number(
      this.route.snapshot.queryParamMap.get('proceedingsNumber')
    );
    this.getNotifications();
    this.getFolioUniv();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      const expediente = this.pathParams.expediente;
      if (expediente) {
        this.getGoodTable(data);
      }
    });
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      wheelNumber: [null, [Validators.required]], //no_volante
      expedientNumber: [null], //expediente
      receiptDate: [null, [Validators.required]], //fecha_recepcion
      expedientTransferenceNumber: [null], //no_expediente_transferente
      officeExternalKey: [null], //cve_oficio_externo
      externalOfficeDate: [null], //fecha_oficio_externo
      externalRemitter: [null, [Validators.required]], //ext_remitente
      protectionKey: [null], //cve_amparo
      touchPenaltyKey: [null], //cve_toca_penal
      circumstantialRecord: [null], // acta_circunstaciada
      preliminaryInquiry: [null], //averiguacion_previa
      criminalCase: [null], //causa_penal
      affairKey: [null], //asunto
      //subjectDescription: [null, [Validators.required]],
      indiciadoNumber: new FormControl<{
        id: number;
        name: string;
      }>(null), //indiciado
      //indiciadoNumberDescription: [null, [Validators.required]],
      minpubNumber: [null],
      //minpubNumberDescription: [null, [Validators.required]],
      courtNumber: [null],
      //courtDescription: [null, [Validators.required]],
      delegationNumber: [null, [Validators.required]],
      //delegationDescription: [null, [Validators.required]],
      entFedKey: [null],
      //federativeOrganizationDescription: [null, [Validators.required]],
      cityNumber: [null],
      //cityDescription: [null, [Validators.required]],
      transference: [null],
      //transferorDescription: [null, [Validators.required]],
      stationNumber: [null],
      //broadcasterDescription: [null, [Validators.required]],
      autorityNumber: [null],
      //authorityDescription: [null, [Validators.required]],
    });
  }

  getFolioUniv() {
    this.maintenanceOfCoferageService.currentFolioUniv.subscribe({
      next: resp => {
        if (resp) {
          console.log('folio generado', resp);
          this.blkControlForm.folioUniversal = resp;
        }
      },
    });
  }

  openModal(): void {
    const modal = this.modalService.show(SendingOfEMailsComponent, {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modal.content.refresh.subscribe(resp => {
      console.log(resp);
    });
  }

  getNotifications() {
    const params = new ListParams();
    params['filter.wheelNumber'] = `$eq:${this.pathParams.volante}`;
    this.notificationServices
      .getAllNotifications(params)
      .pipe(map(x => x.data[0]))
      .subscribe({
        next: async resp => {
          console.log(resp);
          this.receiptDateValue = this.parseDateNoOffset(resp.receiptDate);
          this.externalOfficeDateValue = this.parseDateNoOffset(
            resp.externalOfficeDate
          );

          this.form.patchValue({
            ...resp,
          });
          console.log(this.form.value);
          const delegaction =
            resp.delegationNumber != null ? resp.delegation : null;
          const city = resp.cityNumber != null ? resp.city : null;
          this.getIndiciados(new ListParams());
          this.getMinPub(new ListParams());
          this.getJuzgados(new ListParams());
          this.getDelegacion(new ListParams(), delegaction);
          this.getEntity(new ListParams());
          this.getCity(new ListParams(), city);
          this.getTransferent(new ListParams());
          this.getStation(new ListParams());
          this.getAuthority(new ListParams());

          //this.getGoodTable(new ListParams());
        },
      });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() + dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  getAffair(params: ListParams) {
    params.limit = 100;
    params['sortBy'] = 'id:ASC';
    this.affairService.getAll(params).subscribe({
      next: resp => {
        this.affairSelect = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getIndiciadoById(id: number): any {
    return new Promise((resolve, reject) => {
      this.indiciadoService.getById(id).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  async getIndiciados(params: ListParams) {
    let indiciado: any = null;
    if (this.form.controls['indiciadoNumber'].value && params.page == 1) {
      indiciado = await this.getIndiciadoById(
        this.form.controls['indiciadoNumber'].value
      );
    }
    this.indiciadoService.getAll(params).subscribe({
      next: resp => {
        if (this.form.controls['indiciadoNumber'].value && params.page == 1) {
          resp.data.push(indiciado);
        }

        resp.data.map(item => {
          item['nameAndId'] = item.id + ' - ' + item.name;
        });

        this.indiciadosSelected = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getMinPubById(id: number): any {
    return new Promise((resolve, reject) => {
      this.minPubService.getById(id).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  async getMinPub(params: ListParams) {
    let minpub: any = null;
    if (this.form.controls['minpubNumber'].value && params.page == 1) {
      minpub = await this.getMinPubById(
        this.form.controls['minpubNumber'].value
      );
    }
    this.minPubService.getAll(params).subscribe({
      next: resp => {
        if (this.form.controls['minpubNumber'].value && params.page == 1) {
          resp.data.push(minpub);
        }

        resp.data.map((item: any) => {
          item['descriptionAndId'] = item.id + ' - ' + item.description;
        });

        this.minPubSelected = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getJuzgadoById(id: number): any {
    return new Promise((resolve, reject) => {
      this.juzgadosService.getById(id).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  async getJuzgados(params: ListParams) {
    let court: any = null;
    if (this.form.controls['courtNumber'].value && params.page == 1) {
      court = await this.getJuzgadoById(
        this.form.controls['courtNumber'].value
      );
    }
    this.juzgadosService.getAll(params).subscribe({
      next: resp => {
        if (this.form.controls['courtNumber'].value && params.page == 1) {
          resp.data.push(court);
        }

        resp.data.map((item: any) => {
          item['descriptionAndId'] = item.id + ' - ' + item.description;
        });

        this.juzgadoSelected = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  async getDelegacion(params: ListParams, delegation?: any) {
    this.delegacionService.getAll(params).subscribe({
      next: resp => {
        if (this.form.controls['delegationNumber'].value && params.page == 1) {
          resp.data.push(delegation);
        }
        resp.data.map((item: any) => {
          item['descriptionAndId'] = item.id + ' - ' + item.description;
        });

        this.delegationSelected = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getEntity(params: ListParams) {
    params.limit = 50;
    this.entFedService.getAll(params).subscribe({
      next: resp => {
        resp.data.map((item: any) => {
          item['otWorthAndId'] = item.id + ' - ' + item.otWorth;
        });

        this.entFedSelected = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getCity(params: ListParams, city?: any) {
    this.cityService.getAll(params).subscribe({
      next: resp => {
        if (this.form.controls['cityNumber'].value && params.page == 1) {
          resp.data.push(city);
        }
        resp.data.map((item: any) => {
          item['nameCityAndIdCity'] = item.idCity + ' - ' + item.nameCity;
        });
        this.citySelected = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getTransferentById(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${id}`;
      this.transferentService
        .getAll(params)
        .pipe(map(x => x.data[0]))
        .subscribe({
          next: resp => {
            resolve(resp);
          },
        });
    });
  }

  async getTransferent(params: ListParams) {
    let transferent: any = null;
    if (this.form.controls['transference'].value && params.page == 1) {
      transferent = await this.getTransferentById(
        this.form.controls['transference'].value
      );
    }
    this.transferentService.getAll(params).subscribe({
      next: resp => {
        if (this.form.controls['transference'].value && params.page == 1) {
          resp.data.push(transferent);
        }
        resp.data.map((item: any) => {
          item['nameTransferentAndId'] = item.id + ' - ' + item.nameTransferent;
        });
        this.transferentSelected = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getStationById(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${id}`;
      this.stationService
        .getAll(params)
        .pipe(map(x => x.data[0]))
        .subscribe({
          next: resp => {
            resolve(resp);
          },
        });
    });
  }

  async getStation(params: ListParams) {
    let station: any = null;
    if (this.form.controls['stationNumber'].value && params.page == 1) {
      station = await this.getStationById(
        this.form.controls['stationNumber'].value
      );
    }
    this.stationService.getAll(params).subscribe({
      next: resp => {
        if (this.form.controls['stationNumber'].value && params.page == 1) {
          resp.data.push(station);
        }
        resp.data.map((item: any) => {
          item['stationNameAndId'] = item.id + ' - ' + item.stationName;
        });
        this.stationSelected = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getAuthorityById(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.idAuthority'] = `$eq:${id}`;
      this.authorityService
        .getAll(params)
        .pipe(
          map(x => x.data[0]),
          catchError(() => {
            return of(null);
          })
        )
        .subscribe({
          next: resp => {
            resolve(resp);
          },
        });
    });
  }

  async getAuthority(params: ListParams) {
    let authority: any = null;
    if (this.form.controls['autorityNumber'].value && params.page == 1) {
      authority = await this.getAuthorityById(
        this.form.controls['autorityNumber'].value
      );
    }
    this.authorityService.getAll(params).subscribe({
      next: resp => {
        if (
          this.form.controls['autorityNumber'].value &&
          params.page == 1 &&
          authority
        ) {
          resp.data.push(authority);
        }
        resp.data.map((item: any) => {
          item['authorityNameAndId'] =
            item.idAuthority + ' - ' + item.authorityName;
        });
        this.authoritySelected = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getGoodTable(params: ListParams) {
    this.loading = true;
    const expediente = this.pathParams.expediente;
    params['filter.fileNumber'] = `$eq:${expediente}`;
    this.goodService
      .getAll(params)
      .pipe(
        catchError((e, _a) => {
          if (e.status == 400) {
            return of({ data: [], count: 0 });
          } else {
            throw e;
          }
        })
      )
      .subscribe({
        next: resp => {
          resp.data.map(item => {
            const result: any = this.setFolioUnivAndSelects(item);
            item.selected = result.block;
            item.cambio_ch = result.block;
            item.folio_universal = result.folio;
            this.blkControlForm.folioUniversal = result.folio;
            if (result.block == true) {
              this.listGoodSelected.push(item);
            }
          });
          if (this.selectAll == true) {
            this.listGoodSelected = [];
            resp.data.map((item: any) => {
              item.selected = true;
            });
          }

          this.data = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        },
        error: error => {
          this.data = [];
          this.loading = false;
        },
      });
  }

  async setFolioUnivAndSelects(good: any) {
    const folio = await this.getGoodFolio(good.id);
    console.log('folio', folio);
    let result = { block: false, folio: folio };
    if (good.labelNumber == 6) {
      result.block = true;
      result.folio = folio;
    }
    return result;
  }

  getGoodFolio(id: number) {
    return new Promise((resolve, reject) => {
      this.historyProtection.getGoodFolioUniversal(id).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          resolve('');
          console.log(error);
        },
      });
    });
  }

  onCLickCheckBox(event: any) {
    event.toggle.subscribe((data: any) => {
      const index = this.listGoodSelected.indexOf(data.row);
      if (index == -1 && data.toggle == true) {
        this.listGoodSelected.push(data.row);
      } else if (index != -1 && data.toggle == false) {
        this.listGoodSelected.splice(index, 1);
      }
      console.log(this.listGoodSelected);
    });
  }

  changeSelectAll(event: any) {
    console.log(event.checked);
    this.selectAll = event.checked;
    this.listGoodSelected = [];
    this.getGoodTable(new ListParams());
  }

  goBack() {
    this.router.navigate(['/pages/general-processes/work-mailbox']);
  }

  existData() {
    //let exist = resp.data.filter(x => x.idAuthority == authority.idAuthority);
  }

  apply() {
    const notifications = this.form.value;
    //folio en duro
    const folio: any = 3600189; //this.blkControlForm.folioUniversal
    let vc_pantalla = '';
    let v_cuantos = 0;
    let v_ind_si = false;
    let v_ind_no = false;
    let v_rel_si = null;
    let v_rel_no = null;
    let v_ban = false;
    let v_no_etiqueta = '';
    let v_ban_esc = true;
    let v_val_esc = 0;

    if (!notifications.wheelNumber) {
      this.alert('error', 'Error', 'Se debe ingresar un Volante/Expediente.');
      return;
    }

    if (
      folio == 0 &&
      (Number(notifications.affairKey) == 13 ||
        Number(notifications.affairKey) == 14)
    ) {
      this.alert('error', 'Error', 'Se debe ingresar el Folio de escaneo.');
      return;
    }

    if (this.data.length == 0 || this.data[0].id == null) {
      this.alert(
        'error',
        'Error',
        'No se tienen bienes relacionados al Volante/Expediente.'
      );
      return;
    }

    /*this.data.map((item:any)=>{
      if(data)
    })*/
  }
}
