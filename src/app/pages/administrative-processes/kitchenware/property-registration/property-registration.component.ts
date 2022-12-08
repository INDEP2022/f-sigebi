import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

export interface Example {
  numberFile: number;
  causePenal: string;
  preliminaryInquiry: string;
  goods: ExampleGood[];
}

export interface ExampleGood {
  numberGood: number;
  description: string;
  menajes?: ExampleMenajesItems[];
}

export interface ExampleMenajesItems {
  kitchenware: number;
  description: string;
}

@Component({
  selector: 'app-property-registration',
  templateUrl: './property-registration.component.html',
  styles: [],
})
export class PropertyRegistrationComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  //Data Table

  //Data Table bien padre
  settings1 = {
    ...this.settings,
    actions: false,
    columns: {
      numberGood: {
        title: 'No Bien',
        width: '20%',
        sort: false,
      },
      description: {
        title: 'Descripcion',
        width: '40%',
        sort: false,
      },
    },
  };

  goods: any[] = [];
  menajes: any[] = [];

  data: Example[] = [
    {
      numberFile: 1,
      causePenal: 'Causa penal 1',
      preliminaryInquiry: 'Previa 1',
      goods: [
        {
          numberGood: 1,
          description: 'Descripcion del bien 1',
          menajes: [
            {
              kitchenware: 1,
              description: 'Descripción 1',
            },
            {
              kitchenware: 2,
              description: 'Descripción 2',
            },
            {
              kitchenware: 3,
              description: 'Descripción 2',
            },
          ],
        },
        {
          numberGood: 2,
          description: 'Descripcion del bien 2',
        },
      ],
    },
  ];

  // property to know if I am looking for
  searched: boolean = false;
  //Reactive Forms
  form: FormGroup;

  get numberFile() {
    return this.form.get('numberFile');
  }
  get causePenal() {
    return this.form.get('causePenal');
  }
  get preliminaryInquiry() {
    return this.form.get('preliminaryInquiry');
  }

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        kitchenware: {
          title: 'Menaje',
          width: '20%',
          sort: false,
        },
        description: {
          title: 'Descripcion',
          width: '40%',
          sort: false,
        },
      },
    };
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
      numberFile: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      preliminaryInquiry: [null, [Validators.required]],
    });
  }

  searchGoodFather() {
    const numberFile = Number(this.numberFile.value);
    this.data.forEach(element => {
      if (element.numberFile === numberFile) {
        this.causePenal.setValue(element.causePenal);
        this.preliminaryInquiry.setValue(element.preliminaryInquiry);
        this.goods = element.goods;
        this.searched = true;
      }
    });
  }

  uploadTableMenaje(event: any) {
    this.menajes = [];
    event.data.menajes!
      ? (this.menajes = [...event.data.menajes])
      : this.alert('info', 'Oops...', 'Este Bien no tiene Menajes Asociados');
  }
}
