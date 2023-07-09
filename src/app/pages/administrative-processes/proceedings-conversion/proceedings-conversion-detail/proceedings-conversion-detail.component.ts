import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { AbandonmentsDeclarationTradesService } from 'src/app/pages/juridical-processes/abandonments-declaration-trades/service/abandonments-declaration-trades.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ActasConvertionCommunicationService } from '../services/proceedings-conversionn';
@Component({
  selector: 'app-proceedings-conversion-detail',
  templateUrl: './proceedings-conversion-detail.component.html',
  styles: [],
})
export class ProceedingsConversionDetailComponent
  extends BasePage
  implements OnInit
{
  header: ModelForm<any>;
  antecedent: ModelForm<any>;
  antecedentTwo: ModelForm<any>;
  antecedentThree: ModelForm<any>;
  first: ModelForm<any>;
  closureOfMinutes: ModelForm<any>;
  antecedentThreeEnable: boolean = false;
  inputValue: string;
  userRes: any;
  inputDisabled: boolean = true;
  showEnableDetail = false;
  datosEnviadosSource: any;

  idConversion: any;
  valUpdate: boolean = true;
  cities = new DefaultSelect<ICity>();
  appointedBy = new DefaultSelect<ICity>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private actasConvertionCommunicationService: ActasConvertionCommunicationService,
    private convertiongoodService: ConvertiongoodService,
    private abandonmentsService: AbandonmentsDeclarationTradesService,
    private securityService: SecurityService,
    private cityService: CityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.actasConvertionCommunicationService
      .getInputValue()
      .subscribe(value => {
        this.inputValue = value;
        console.log('AQUII', this.inputValue);
        this.header.value.idConversion =
          this.actasConvertionCommunicationService.setInputValue;
        this.inputDisabled = false;
      });

    this.actasConvertionCommunicationService
      .getInputValue2()
      .subscribe(value => {
        this.convertiongoodService.getConvertionActaById(1).subscribe({
          next: (res: any) => {
            const data = res;
            this.valUpdate = true;

            // if (data.encabDesignatedx.toString()) {
            //   const paramsRecipient: any = new ListParams();
            //   paramsRecipient.text = data.encabDesignatedx.toString();
            //   this.getappointedBy(paramsRecipient);
            // }

            this.header.patchValue({
              destiny: data.encabDestination.toString(),
              city: data.encabCity.toString(),
              status: data.encabState.toString(),
              hour: data.encabDateMinutes.toString(),
              date: data.encabDesignatedx.toString(),
              appointedBy: data.encabDesignatedx.toString(),
              titleOf: data.encabdesignatedXArea.toString(),
              officeNumber: data.encabOfficeNumber.toString(),
              dateOfOffice: data.encabOfficeDate.toString(),
            });

            this.antecedent.patchValue({
              tradeEntity: data.antec1OfficeEntity,
              officialDate: data.antec1OfficeDate,
              signedBy: data.antec1SubscribedX,
              position: data.antec1Charge,
              dependence: data.antec1Dependence,
              customs: data.antec1Aduana,
              container: data.antec1Customs,
              noContainer: data.antec1ContainerNumber,
            });

            this.antecedentTwo.patchValue({
              job: data.antec2OOffice,
              officialDate: data.antec2OfDate,
              signedBy: data.antec2OfSubscribedX,
              position: data.actec2OfSubscribedxCharge,
              propertyOf: data.antec2OwnedBy,
            });

            this.antecedentThree.patchValue({
              date: data.antec3PropertyDate,
              subscribe1: data.antec3Subscribes1,
              position1: data.antec3Charge1,
              attachedA: data.antec3Adscritoa1,
              subscribe2: data.antec3Subscribes2,
              position2: data.antec3Charge2,
              attachedB: data.antec3Adscritoa2,
              wineriesSAE: data.antec3WinerySae,
              verificationOf: data.antec3Verification,
              consistsIn: data.antec3Weight,
              correspondentA: data.antec3Amount,
              description: data.antec3Description,
              status: data.antec3State,
            });

            this.first.patchValue({
              authorizedBy: data.primeraAutorizadoX,
              addressee: data.firstAddressee,
            });

            this.closureOfMinutes.patchValue({
              date: data.closingDate,
              hour: data.closingSheet,
              closePages: data.closingFojas,
            });
            console.log(res);
          },
          error: error => {
            this.valUpdate = false;
            console.log(error);
          },
        });
        this.idConversion = value;

        console.log('AQUII2222', value);
        this.header.get('idConversion').setValue(value);
        this.inputDisabled = false;

        this.getCities(new ListParams());
      });
  }
  private prepareForm() {
    this.header = this.fb.group({
      destiny: [null, Validators.required],
      idConversion: [null, Validators.required],
      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      hour: [null, Validators.required],
      date: [null, Validators.required],
      appointedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      titleOf: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      officeNumber: [null, Validators.required],
      dateOfOffice: [null, Validators.required],
    });
    this.antecedent = this.fb.group({
      tradeEntity: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      officialDate: [null, Validators.required],
      signedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dependence: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      customs: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      container: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      noContainer: [null, Validators.required],
    });
    this.antecedentTwo = this.fb.group({
      job: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      officialDate: [null, Validators.required],
      signedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      propertyOf: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.antecedentThree = this.fb.group({
      date: [null, Validators.required],
      subscribe1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      attachedA: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subscribe2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      attachedB: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      wineriesSAE: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      verificationOf: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      consistsIn: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      correspondentA: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    this.first = this.fb.group({
      authorizedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.closureOfMinutes = this.fb.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      closePages: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  public next() {
    this.antecedentThreeEnable = true;
  }
  public previous() {
    this.antecedentThreeEnable = false;
  }
  close() {
    this.modalRef.hide();
  }

  salvar() {
    if (this.valUpdate) {
      // UPDATE
      console.log('form', this.header);
      let obj: any = {
        id: this.idConversion,
        encabDestination: 'DONACION',
        encabCity: 'WER2',
        encabState: 'WER',
        encabTimeRecord: '1212',
        encabDateMinutes: '23-12-2004',
        encabDesignatedx: 'ALFONSO',
        encabdesignatedXArea: 'DFG',
        encabOfficeNumber: 'ASDF',
        encabOfficeDate: '23-12-2004',
        antec1OfficeEntity: 'SDFGSADF',
        antec1OfficeDate: '23-12-2004',
        antec1SubscribedX: 'ERWTERT',
        antec1Charge: 'WERTWET',
        antec1Dependence: 'WERTWET',
        antec1Aduana: 'WERWERT',
        antec1Customs: 'ERWTERT',
        antec1ContainerNumber: null,
        antec2OOffice: null,
        antec2OfDate: null,
        antec2OfSubscribedX: null,
        actec2OfSubscribedxCharge: null,
        antec2OwnedBy: null,
        antec3PropertyDate: null,
        antec3Subscribes1: null,
        antec3Charge1: null,
        antec3Adscritoa1: null,
        antec3Subscribes2: null,
        antec3Charge2: null,
        antec3Adscritoa2: null,
        antec3WinerySae: null,
        antec3Verification: null,
        antec3Weight: null,
        antec3Amount: null,
        antec3Description: null,
        antec3State: null,
        primeraAutorizadoX: null,
        firstAddressee: null,
        closingSheet: null,
        closingDate: null,
        closingFojas: null,
      };

      this.convertiongoodService
        .updateConvertionActa(obj, this.idConversion)
        .subscribe({
          next: (res: any) => {
            this.valUpdate = true;
            this.alert('success', 'El acta se actualizó correctamente', '');
            console.log(res);
          },
          error: error => {
            this.valUpdate = false;
            this.alert('error', 'Error al intentar guardar los cambios', '');
            console.log(error);
          },
        });
    } else {
      // CREATE
      console.log('form', this.header);

      let obj: any = {
        id: this.idConversion,
        encabDestination: this.header.value.destiny,
        encabCity: this.header.value.city,
        encabState: this.header.value.status,
        encabTimeRecord: this.header.value.hour,
        encabDateMinutes: this.header.value.date,
        encabDesignatedx: this.header.value.appointedBy,
        encabdesignatedXArea: this.header.value.titleOf,
        encabOfficeNumber: this.header.value.officeNumber,
        encabOfficeDate: this.header.value.dateOfOffice,
        antec1OfficeEntity: 'SDFGSADF',
        antec1OfficeDate: '23-12-2004',
        antec1SubscribedX: 'ERWTERT',
        antec1Charge: 'WERTWET',
        antec1Dependence: 'WERTWET',
        antec1Aduana: 'WERWERT',
        antec1Customs: 'ERWTERT',
        antec1ContainerNumber: null,
        antec2OOffice: null,
        antec2OfDate: null,
        antec2OfSubscribedX: null,
        actec2OfSubscribedxCharge: null,
        antec2OwnedBy: null,
        antec3PropertyDate: null,
        antec3Subscribes1: null,
        antec3Charge1: null,
        antec3Adscritoa1: null,
        antec3Subscribes2: null,
        antec3Charge2: null,
        antec3Adscritoa2: null,
        antec3WinerySae: null,
        antec3Verification: null,
        antec3Weight: null,
        antec3Amount: null,
        antec3Description: null,
        antec3State: null,
        primeraAutorizadoX: null,
        firstAddressee: null,
        closingSheet: null,
        closingDate: null,
        closingFojas: null,
      };

      this.convertiongoodService.creatConvertionActa(obj).subscribe({
        next: (res: any) => {
          this.alert('success', 'El acta se creó correctamente', '');
          console.log(res);
        },
        error: error => {
          this.alert('error', 'Error al intentar guardar los cambios', '');
          console.log(error);
        },
      });
    }
  }

  getCities(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idCity', lparams.text, SearchFilter.EQ);
      } else {
        console.log('NO');
        params.addFilter('nameCity', lparams.text, SearchFilter.ILIKE);
      }

    // this.hideError();
    this.cityService.getAllFiltered(params.getParams()).subscribe({
      next: data => {
        let result = data.data.map((c: any) => {
          c['nameAndId'] = `${c.nameCity}`;
        });

        Promise.all(result).then(item => {
          this.cities = new DefaultSelect(data.data, data.count);
        });
        // console.log('CITY', data);
      },
      error: () => {
        this.cities = new DefaultSelect();
      },
    });
  }

  async getSenders(params: ListParams) {
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.appointedBy = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.appointedBy = new DefaultSelect();
      }
    );
  }

  getappointedBy(params: ListParams) {
    params['filter.user'] = `$eq:${params.text}`;
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });

        Promise.all(result).then((resp: any) => {
          this.header.get('appointedBy').setValue(data.data[0]);

          // this.recipients = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.appointedBy = new DefaultSelect();
      }
    );
  }
}
