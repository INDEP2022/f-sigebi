import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS } from './columns';
import { LegalOpinionsOfficeService } from './services/legal-opinions-office.service';

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

  constructor(
    private fb: FormBuilder,
    private svLegalOpinionsOfficeService: LegalOpinionsOfficeService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.buildForm();
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
      typeOffice: [{ value: '', disabled: false }],
      cveOfficeGenerate: [
        { value: '', disabled: false },
        [Validators.required],
      ],
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
  btnSearchAppointment() {}

  getCityByDetail(paramsData: ListParams) {
    console.log(paramsData);
    // const params: any = new FilterParams();
    // params.removeAllFilters();
    // params['sortBy'] = 'townshipKey:DESC';
    // if (this.delegationSelectValue) {
    //   params.addFilter('municipalityKey', this.delegationSelectValue);
    // }
    // if (this.stateSelectValue) {
    //   params.addFilter('stateKey', this.stateSelectValue);
    // }
    // if (this.localitySelectValue && !paramsData['search']) {
    //   params.addFilter('townshipKey', this.localitySelectValue);
    // } else {
    //   if (paramsData['search'] || paramsData['search'] == '0') {
    //     params.addFilter('township', paramsData['search'], SearchFilter.LIKE);
    //   }
    // }
    // let subscription = this.appointmentsService
    //   .getLocalityByFilter(params.getParams())
    //   .subscribe({
    //     next: data => {
    //       if (this.localitySelectValue && !paramsData['search']) {
    //         if (data.data) {
    //           let dataSet = data.data.find((item: any) => {
    //             return (
    //               Number(item.townshipKey) == Number(this.localitySelectValue)
    //             );
    //           });
    //           if (dataSet) {
    //             this.localitySelectValue = dataSet.townshipKey.toString();
    //             this.locality = new DefaultSelect(
    //               [dataSet].map((i: any) => {
    //                 i.township = '#' + i.townshipKey + ' -- ' + i.township;
    //                 return i;
    //               }),
    //               1
    //             );
    //             this.form
    //               .get('colonia')
    //               .setValue(Number(this.localitySelectValue));
    //           }
    //         }
    //       } else {
    //         this.locality = new DefaultSelect(
    //           data.data.map((i: any) => {
    //             i.township = '#' + i.townshipKey + ' -- ' + i.township;
    //             return i;
    //           }),
    //           data.count
    //         );
    //       }
    //       subscription.unsubscribe();
    //     },
    //     error: error => {
    //       this.locality = new DefaultSelect();
    //       subscription.unsubscribe();
    //     },
    //   });
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
}
