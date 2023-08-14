import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { FIndicaService } from 'src/app/core/services/ms-good/findica.service';
import { GenerateCveService } from 'src/app/core/services/ms-security/application-generate-clave';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { OfficeManagementService } from 'src/app/core/services/office-management/officeManagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { VALUATION_REQUEST_COLUMNS } from './valuation-request-columns';

@Component({
  selector: 'app-valuation-request',
  templateUrl: './valuation-request.component.html',
  styles: [],
})
export class valuationRequestComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  user: string;
  event: number = 0;
  tipo: any;
  m_comer: any;
  v_evento: number;
  v_usuario: string;
  titulo_oficio: string;
  title: string = '';
  address: string;
  estatus: string;
  mes: string;
  sender = new DefaultSelect();
  addressee = new DefaultSelect();
  usersList = new DefaultSelect();
  cityList = new DefaultSelect();
  existe: string;
  oficio: string;
  idOficio: string;
  oficio_clave: string;
  num_armada: string;

  addUser: boolean = false;
  removeUser: boolean = false;
  searchChanges: boolean = false;
  sendFi: boolean = false;
  viewOf: boolean = false;
  lsbConCopiaList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventAppService: EventAppService,
    private officeManagementService: OfficeManagementService,
    private findicaService: FIndicaService,
    private generateCveService: GenerateCveService,
    private cityService: CityService,
    private usersService: UsersService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getPagination();
    // this.route.queryParams.subscribe(params => {
    //   if (params['user']) {
    //     this.user= params['user'];
    //   }else{
    //     this.user = localStorage.getItem('username');
    //   }
    //   if (params['idEvent']) {
    //     this.event = params['idEvent'];
    // this.getsContent();
    //   }
    // });
    // 23959- 23496 - 23972
    this.user = localStorage.getItem('username');
    this.event = 23972;
    this.form.controls['event'].setValue(this.event);
    this.getsContent();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      cveService: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      folio: [null, [Validators.required]],

      sender: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      senderTxt: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      addresseeTxt: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],

      paragraph1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraph2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraph3: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      user: [null, [Validators.required]],
      txtUserCCP: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      lsbConCopiaCCP: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  data = [
    {
      noBien: 564,
      description: 'Descripción del 564',
      amount: '$41,151.00',
      status: 'Disponible',
    },
    {
      noBien: 45,
      description: 'Descripción del 45',
      amount: '$1,500.00',
      status: 'No Disponible',
    },
    {
      noBien: 785,
      description: 'Descripción del 785',
      amount: '$201,500.00',
      status: 'Disponible',
    },
  ];

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }
  async getsContent() {
    this.loader.load = true;
    if (this.event == 0) {
      this.event = this.form.controls['event'].value;
    }
    let type = await this.getType(this.event);
    console.log(type);
    this.tipo = type;

    // if (Number(this.tipo.tipoevento) != 10) {
    //   this.alert('warning', 'El evento no es valido', '');
    //   this.clear();
    //   console.log(this.tipo.tipoevento);
    //   return;
    // }
    // if ((this.tipo.id_estatusvta != "PREP") && (this.tipo.id_estatusvta != "APRO") && (this.tipo.id_estatusvta != "SOLV") && (this.tipo.id_estatusvta != "VALV")) {
    //   this.alert('warning', 'El evento no es valido', '');
    //   console.log(this.tipo.id_estatusvta);
    //   this.clear();
    //   return;
    // }
    if (this.tipo.direccion == 'I') {
      this.title = 'OFICIO DE ' + this.tipo.tipo_aval + ' INMUEBLES';
      this.address = this.tipo.direccion;
    } else if (this.tipo.direccion == 'M') {
      this.title = 'OFICIO DE ' + this.tipo.tipo_aval + ' MUEBLES';
      this.address = this.tipo.direccion;
    } else if (this.tipo.direccion == 'A') {
      this.title = 'OFICIO DE ' + this.tipo.tipo_aval + ' ACTIVOS FINANCIEROS';
      this.address = this.tipo.direccion;
    }
    // if ((this.tipo.valor == '') || (this.tipo.valor == null)) {
    //   this.alert('warning', 'El evento no tiene asignado un tipo de oficio', '');
    //   this.clear();
    //   return;
    // }
    let mComer = await this.getTrade(this.event);
    console.log(mComer);
    this.m_comer = mComer;
    if (this.m_comer.estatusOf != null || this.m_comer.estatusOf == '') {
      this.estatus = this.m_comer.estatusOf;
    } else {
      this.estatus = 'GENERADO';
    }
    this.loadGrid(this.event, this.estatus);
    let data_rem: any = await this.getUsers(1);
    console.log(data_rem);
    this.sender = new DefaultSelect(data_rem.data, data_rem.count);
    let data_sed: any = await this.getUsers(2);
    this.addressee = new DefaultSelect(data_sed.data, data_sed.count);
    this.usersList = new DefaultSelect(data_sed.data, data_sed.count);
    if (
      this.m_comer.remitente != null &&
      this.m_comer.remitente != '' &&
      this.m_comer.remitente != undefined
    ) {
      console.log(this.user);
      this.form.controls['sender'].setValue(this.m_comer.remitente);
    } else {
      console.log(this.user);
      let user: any = await this.getUsersFilter(1, this.user);
      this.form.controls['sender'].setValue(user != null ? user.usuario : null);
    }
    if (
      this.m_comer.destinatario != null &&
      this.m_comer.remitente != undefined
    ) {
      this.form.controls['addressee'].setValue(this.m_comer.destinatario);
    }
    if (this.m_comer.estatusOf != null) {
      if (this.m_comer.estatusOf == 'ENVIADO') {
        this.controlControls();
      }
    }
    if (this.m_comer.ciudad != null && this.m_comer.ciudad != undefined) {
      let city: any = await this.getCities(
        new ListParams(),
        this.m_comer.ciudad
      );
      this.cityList = new DefaultSelect(city.data, city.count);
      this.form.controls['city'].setValue(this.m_comer.ciudad);
    } else {
      let city: any = await this.getCities(new ListParams(), '266');
      this.cityList = new DefaultSelect(city.data, city.count);
      this.form.controls['city'].setValue('266');
    }
    let city: any = await this.getCities(new ListParams());
    this.cityList = new DefaultSelect(city.data, city.count);
    if (this.m_comer.cve_oficio != null) {
      this.existe = 'SI';
      this.oficio = this.m_comer.cve_oficio.toString();
      this.oficio_clave = this.m_comer.cve_oficio;
      this.num_armada = this.m_comer.num_cv_armada;
      this.loadControls();
    } else {
      this.form.controls['cveService'].setValue('');
      let folio = await this.getFolio(1, 0);
      this.form.controls['folio'].setValue(folio);
    }
    console.log(this.tipo.direccion);
    if (this.tipo.direccion == 'I') {
      let text1 = await this.getText('SOL1_I');
      let text2 = await this.getText('SOL2_I');
      let text3 = await this.getText('SOL3_I');
      this.form.controls['paragraph1'].setValue(text1);
      this.form.controls['paragraph2'].setValue(text2);
      this.form.controls['paragraph3'].setValue(text3);
    } else {
      let tex1 = await this.getText('SOL1_M');
      let tex2 = await this.getText('SOL2_M');
      let tex3 = await this.getText('SOL3_M');
      console.log(tex3);
      this.form.controls['paragraph1'].setValue(tex1);
      this.form.controls['paragraph2'].setValue(tex2);
      this.form.controls['paragraph3'].setValue(tex3);
    }
    console.log(this.m_comer.id_oficio);
    if (this.m_comer.id_oficio != 0 && this.m_comer.id_oficio != undefined) {
      this.idOficio = this.m_comer.id_oficio;
      this.lsbConCopiaList = [];
      let usuOfico: any = await this.getUserOt(this.m_comer.id_oficio);
      console.log(usuOfico);
      usuOfico.forEach((element: any) => {
        this.lsbConCopiaList.push(element.usuario + '-' + element.nombre);
      });
    }
    this.loader.load = false;
  }
  async getType(idType: number) {
    return new Promise((res, rej) => {
      let data = {
        pIdEventIn: idType,
      };
      console.log(data);
      this.eventAppService.postPaGetsRequestType(data).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async getTrade(idType: number) {
    return new Promise((res, rej) => {
      let data = {
        eventId: idType,
        officeId: '',
      };
      console.log(data);
      this.officeManagementService.postOfficeAvaluo(data).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async getUsers(id: number) {
    return new Promise((res, rej) => {
      const params = new ListParams();
      let data = {
        flagIn: id,
      };
      console.log(data);
      this.generateCveService.postSpUserAppraisal(data, params).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async getUsersFilter(id: number, user: string) {
    return new Promise((res, rej) => {
      const params = new ListParams();
      let data = {
        flagIn: id,
      };
      params['filter.usuario'] = `$eq:${user}`;
      console.log(data);
      this.generateCveService.postSpUserAppraisal(data, params).subscribe({
        next: resp => {
          console.log(resp);
          res(resp.data[0]);
        },
        error: eror => {
          this.loader.load = false;
          res(null);
        },
      });
    });
  }
  async getCities(params: ListParams, idCyti?: string) {
    return new Promise((res, rej) => {
      if (idCyti) {
        params['filter.idCity'] = idCyti;
      }
      this.cityService.getAllCitys(params).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async getFolio(process: number, folio: number) {
    return new Promise((res, rej) => {
      //falta endpoit del procedimiento de FA_CONSECUTIVO_OFICIOS
      // this.cityService.getAllCitys(params).subscribe({
      //   next: resp => {
      //     console.log(resp);
      res('');
      //   },
      //   error: eror => {
      //     this.loader.load = false;
      //     res(eror);
      //   },
      // });
    });
  }
  async getText(acta: string) {
    return new Promise((res, rej) => {
      //falta endpoit culpa del BACK
      this.usersService.getText(acta).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res('');
        },
      });
    });
  }
  async getUserOt(idOficio: string) {
    return new Promise((res, rej) => {
      //falta endpoit culpa del BACK
      this.usersService.getUserOt(idOficio).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  loadGrid(idType: number, estatus: string) {
    let data = {
      eventId: idType,
      actionJob: estatus,
    };
    this.params.getValue()['filter.sortBy'] = 'keyId: ASC';
    this.findicaService
      .postGetListGood(data, this.params.getValue())
      .subscribe({
        next: resp => {
          console.log(resp);
        },
        error: eror => {
          this.loader.load = false;
        },
      });
  }
  getUsersList(params: ListParams) {
    let data = {
      flagIn: 1,
    };
    console.log(data);
    this.generateCveService.postSpUserAppraisal(data, params).subscribe({
      next: resp => {
        console.log(resp);
        this.sender = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.loader.load = false;
        this.sender = new DefaultSelect([], 0, true);
      },
    });
  }
  getUsersDesList(params: ListParams) {
    let data = {
      flagIn: 2,
    };
    console.log(data);
    this.generateCveService.postSpUserAppraisal(data, params).subscribe({
      next: resp => {
        console.log(resp);
        this.addressee = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.loader.load = false;
        this.addressee = new DefaultSelect([], 0, true);
      },
    });
  }
  getCitiesList(params: ListParams) {
    this.cityService.getAllCitys(params).subscribe({
      next: resp => {
        console.log(resp);
        this.cityList = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.loader.load = false;
        this.cityList = new DefaultSelect([], 0, true);
      },
    });
  }
  controlControls() {
    this.addUser = true;
    this.removeUser = true;
    this.form.controls['txtUserCCP'].disable();
    this.form.controls['user'].disable();
    this.searchChanges = true;
    this.sendFi = true;
    this.viewOf = true;
    this.form.controls['sender'].disable();
    this.form.controls['folio'].disable();
    this.form.controls['addressee'].disable();
    this.form.controls['city'].disable();
    this.form.controls['paragraph1'].disable();
    this.form.controls['paragraph2'].disable();
    this.form.controls['paragraph3'].disable();
  }
  loadControls() {
    this.form.controls['cveService'].setValue(this.m_comer.cve_oficio);
    this.form.controls['sender'].setValue(this.m_comer.remitente);
    this.form.controls['addressee'].setValue(this.m_comer.destinatario);
    this.form.controls['paragraph1'].setValue(this.m_comer.texto1);
    this.form.controls['paragraph2'].setValue(this.m_comer.texto2);
    this.form.controls['paragraph3'].setValue(this.m_comer.texto3);
    this.form.controls['folio'].setValue(this.m_comer.num_cv_armada);
  }
  clear() {
    this.form.reset();
  }
}
