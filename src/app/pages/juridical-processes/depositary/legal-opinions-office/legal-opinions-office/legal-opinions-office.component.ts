import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS, officeTypeOption } from './columns';
import { LegalOpinionsOfficeService } from './services/legal-opinions-office.service';

export interface IParamsLegalOpinionsOffice {
  PAQUETE: string;
  P_GEST_OK: string;
  CLAVE_OFICIO_ARMADA: string;
  P_NO_TRAMITE: string;
  TIPO: string;
  P_VALOR: string;
}
@Component({
  selector: 'app-legal-opinions-office',
  templateUrl: './legal-opinions-office.component.html',
  styles: [],
})
export class LegalOpinionsOfficeComponent extends BasePage implements OnInit {
  data: any[] = [
    {
      number: 'Bien 1',
      description: 'Descripcion del bien 1',
      kitchenware: 'Menaje 1',
      quantityDict: '2.000',
      status: 'Estatus 1',
      ident: 'Ident 1',
      processes: 'Procesos 1',
    },
    {
      number: 'Bien 1',
      description: 'Descripcion del bien 1',
      kitchenware: 'Menaje 1',
      quantityDict: '2.000',
      status: 'Estatus 1',
      ident: 'Ident 1',
      processes: 'Procesos 1',
    },
    {
      number: 'Bien 1',
      description: 'Descripcion del bien 1',
      kitchenware: 'Menaje 1',
      quantityDict: '2.000',
      status: 'Estatus 1',
      ident: 'Ident 1',
      processes: 'Procesos 1',
    },
    {
      number: 'Bien 1',
      description: 'Descripcion del bien 1',
      kitchenware: 'Menaje 1',
      quantityDict: '2.000',
      status: 'Estatus 1',
      ident: 'Ident 1',
      processes: 'Procesos 1',
    },
  ];

  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  cityData = new DefaultSelect();
  issuingUser = new DefaultSelect();
  addressee = new DefaultSelect();
  expedientData: IExpedient;
  dictationData: IDictation;
  officeDictationData: IOfficialDictation;
  paramsScreen: IParamsLegalOpinionsOffice = {
    PAQUETE: '',
    P_GEST_OK: '',
    CLAVE_OFICIO_ARMADA: '',
    P_NO_TRAMITE: '',
    TIPO: 'PROCEDENCIA', // DEVOLUCION   ---  DESTRUCCION  --- EXP
    P_VALOR: '486064', // --- EXP 791474  --  155--- EXP 5060   ---   5240--- EXP 339805
  };
  officeTypeOption: any[] = officeTypeOption;
  origin: string = '';
  moreInfo1: boolean = false;
  moreInfo2: boolean = false;
  moreInfo3: boolean = false;
  variables = {
    fecha: '',
    identi: '',
    cveActa: '',
    cveOficioArmada: '',
  };
  dictationTypeValidOption: string[] = [
    'PROCEDENCIA',
    'TRANSFERENTE',
    'DESTRUCCION',
    'DONACION',
    'ENAJENACION',
    'ABANDONO',
    'RESARCIMIENTO',
  ];
  showEnableTypeOffice: boolean = false;

  constructor(
    private fb: FormBuilder,
    private svLegalOpinionsOfficeService: LegalOpinionsOfficeService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.showEnableTypeOffice = false;
    this.buildForm();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        for (const key in this.paramsScreen) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            this.paramsScreen[key as keyof typeof this.paramsScreen] =
              params[key] ?? null;
          }
        }
        this.origin = params['origin'] ?? null;
        // if (this.origin) {
        //   this.btnSearchAppointment();
        // }
        console.log(params, this.paramsScreen);
      });
    if (this.paramsScreen) {
      this.initForm();
    }
  }

  initForm() {
    if (this.paramsScreen.TIPO == 'RESARCIMIENTO') {
      this.form.get('cveOfficeGenerate').enable();
    } else {
      this.form.get('cveOfficeGenerate').disable();
    }
    //  SET VARIABLES
    if (
      this.variables.identi.includes('4') &&
      this.paramsScreen.TIPO == 'RESARCIMIENTO'
    ) {
      this.form.get('addressee').disable();
    }
    this.btnSearchAppointment();
  }

  showMoreInformationField(show: boolean, option: number) {
    this.moreInfo1 = option == 1 ? show : false;
    this.moreInfo2 = option == 2 ? show : false;
    this.moreInfo3 = option == 3 ? show : false;
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      file: [{ value: '', disabled: false }, [Validators.required]],
      numberOfficeDic: [{ value: '', disabled: false }, [Validators.required]],
      typeOffice: [{ value: '', disabled: true }],
      cveOfficeGenerate: [{ value: '', disabled: true }, [Validators.required]],
      authorizedDic: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      issuingUser: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      name: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      addressee: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      nameAddressee: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      city: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      descriptionCity: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      introductoryParagraph: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      finalParagraph: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      moreInformation1: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      moreInformation2: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      moreInformation3: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      numberNotary: [{ value: '', disabled: false }, [Validators.required]],
      ccp_person: [{ value: '', disabled: false }, [Validators.required]],
      ccp_addressee: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      ccp_TiPerson: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ccp_person_1: [{ value: '', disabled: false }, [Validators.required]],
      ccp_addressee_1: [
        { value: null, disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      ccp_TiPerson_1: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  btnSearchAppointment() {
    const params = new FilterParams();
    params.removeAllFilters();
    // params.addFilter('fileNumber', this.form.get('file').value);
    // params.addFilter(
    //   'appointmentOffice',
    //   this.form.get('numberOfficeDic').value
    // );
    params.addFilter('typeDict', this.paramsScreen.TIPO);
    params.addFilter('id', this.paramsScreen.P_VALOR);
    // params['sortBy'] = 'nameCity:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getDictations(params.getParams())
      .subscribe({
        next: data => {
          console.log(data);
          this.dictationData = data.data[0];
          subscription.unsubscribe();
          this.getOfficeDictationData();
          // Call dictaminaciones por bien
          this.getExpedientData();
          if (
            this.dictationTypeValidOption.includes(
              this.dictationData.typeDict
            ) &&
            !this.variables.identi.includes('4')
          ) {
            this.form.get('typeOffice').enable();
            this.showEnableTypeOffice = true;
          }
        },
        error: error => {
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }
  // SSF3_FIRMA_ELEC_DOCS
  getElectronicFirmData() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.dictationData.typeDict);
    params.addFilter('documentNumber', this.dictationData.id);
    params.addFilter('documentType', this.dictationData.statusDict);
    let subscription = this.svLegalOpinionsOfficeService
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: data => {
          console.log(data);
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }
  getOfficeDictationData() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('officialNumber', this.paramsScreen.P_VALOR);
    params.addFilter('typeDict', this.paramsScreen.TIPO);
    let subscription = this.svLegalOpinionsOfficeService
      .getOfficeDictation(params.getParams())
      .subscribe({
        next: data => {
          console.log(data);
          this.officeDictationData = data.data[0];
          if (this.dictationData.keyArmyNumber) {
            if (
              this.officeDictationData.statusOf == 'ENVIADO' &&
              !this.dictationData.keyArmyNumber.toString().includes('?')
            ) {
              this.getElectronicFirmData();
            }
          }
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }
  getExpedientData() {
    let paramsData = new ListParams();
    paramsData['filter.id'] = '$eq:' + 791474; //this.dictationData.expedientNumber;
    let subscription = this.svLegalOpinionsOfficeService
      .getExpedient(paramsData)
      .subscribe({
        next: data => {
          console.log(data);
          this.expedientData = data.data[0];
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  getCityByDetail(paramsData: ListParams) {
    console.log(paramsData);
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('nameCity', paramsData['search'], SearchFilter.LIKE);
    params['sortBy'] = 'nameCity:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getCityByDetail(params.getParams())
      .subscribe({
        next: data => {
          this.cityData = new DefaultSelect(
            data.data.map(i => {
              i.nameAndId =
                '#' + i.idCity + ' -- ' + i.nameCity + ' -- ' + i.legendOffice;
              return i;
            }),
            data.count
          );
          console.log(data, this.cityData);
          subscription.unsubscribe();
        },
        error: error => {
          this.cityData = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }
  getIssuingUserByDetail(paramsData: ListParams) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('name', paramsData['search'], SearchFilter.LIKE);
    params['sortBy'] = 'name:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getIssuingUserByDetail(params.getParams())
      .subscribe({
        next: data => {
          this.issuingUser = new DefaultSelect(
            data.data.map(i => {
              i.name = '#' + i.id + ' -- ' + i.name;
              return i;
            }),
            data.count
          );
          console.log(data, this.issuingUser);
          subscription.unsubscribe();
        },
        error: error => {
          this.issuingUser = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  changeAddreseeDetail(event: any) {
    console.log(event);
  }
  // DELEGACION Y DEPARTAMENTO EN DESTINATARIO
  getAddresseeByDetail(paramsData: ListParams) {
    paramsData['filter.userDetail.name'] = '$ilike:' + paramsData['search'];
    delete paramsData['text'];
    paramsData['sortBy'] = 'userDetail.name:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getAddresseeByDetail(paramsData)
      .subscribe({
        next: data => {
          this.addressee = new DefaultSelect(
            data.data.map(i => {
              i['description'] = '#' + i.user + ' -- ' + i.userDetail.name;
              return i;
            }),
            data.count
          );
          console.log(data, this.addressee);
          subscription.unsubscribe();
        },
        error: error => {
          this.addressee = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  changeTypeOffice(event: any) {
    // console.log(event);
    if (event) {
      console.log(event.target.value);
      if (event.target.value && this.dictationData) {
        this.officeDictationData =
          this.svLegalOpinionsOfficeService.getTextDefaultDictation(
            this.dictationData,
            this.expedientData,
            this.officeDictationData,
            event.target.value
          );
      }
    }
  }
}
