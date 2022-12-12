import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

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

  get file() {
    return this.form.get('file');
  }
  get numberOfficeDic() {
    return this.form.get('numberOfficeDic');
  }
  get typeOffice() {
    return this.form.get('typeOffice');
  }
  get passwordArmedOffice() {
    return this.form.get('passwordArmedOffice');
  }
  get authorizedDic() {
    return this.form.get('authorizedDic');
  }
  get name() {
    return this.form.get('name');
  }
  get addressee() {
    return this.form.get('addressee');
  }
  get nameAddressee() {
    return this.form.get('nameAddressee');
  }
  get city() {
    return this.form.get('city');
  }
  get descriptionCity() {
    return this.form.get('descriptionCity');
  }
  get introductoryParagraph() {
    return this.form.get('introductoryParagraph');
  }
  get finalParagraph() {
    return this.form.get('finalParagraph');
  }
  get numberNotary() {
    return this.form.get('numberNotary');
  }
  /////////////////////////////////////////
  get ccp_person() {
    return this.form.get('ccp_person');
  }
  get ccp_addressee() {
    return this.form.get('ccp_addressee');
  }
  get ccp_TiPerson() {
    return this.form.get('ccp_TiPerson');
  }
  get ccp_person_I() {
    return this.form.get('ccp_person_I');
  }
  get ccp_addressee_I() {
    return this.form.get('ccp_addressee_I');
  }
  get ccp_TiPerson_I() {
    return this.form.get('ccp_TiPerson_I');
  }
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
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
      file: [null, [Validators.required]],
      numberOfficeDic: [null, [Validators.required]],
      typeOffice: [null, [Validators.required]],
      passwordArmedOffice: [null, [Validators.required]],
      authorizedDic: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      nameAddressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      descriptionCity: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      introductoryParagraph: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      finalParagraph: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      numberNotary: [null, [Validators.required]],
      ccp_person: [null, [Validators.required]],
      ccp_addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ccp_TiPerson: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ccp_person_I: [null, [Validators.required]],
      ccp_addressee_I: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ccp_TiPerson_I: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
