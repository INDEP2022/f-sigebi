import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFormGroup } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
interface IPerson {
  name: string;
  birthdate: Date | any;
}

interface IUser {
  username: string;
  person: IPerson;
  roles: IRole[];
}

interface IRole {
  role: string;
  description: string;
  status: string;
  labelNumber: string;
}
@Component({
  selector: 'app-pa-cdgi-c-change-destination-goods-indicators',
  templateUrl: './pa-cdgi-c-change-destination-goods-indicators.component.html',
  styles: [],
})
export class PaCdgiCChangeDestinationGoodsIndicatorsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  goods: IGood[] = [];
  goodsNew: IGood[] = [];
  userExample: IFormGroup<IUser>;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  massive: boolean = false;
  index: number = 0;
  get targetIndicator() {
    return this.form.get('targetIndicator');
  }
  get goodId() {
    return this.form.get('goodId');
  }
  /*   get goodDescription() {
    return this.form.get('goodDescription');
  } */
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private readonly goodServices: GoodService
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
      targetIndicator: [null, [Validators.required]],
      goodId: [null, [Validators.required]],
      goodDescription: [null, [Validators.required]],
    });
    /*     this.userExample = this.fb.group({
      person: this.personForm,
      roles: this.fb.array([this.roleForm]),
      username: [''],
    }); */
  }
  addGood() {
    let idGood = this.goodId.value;
    this.goodServices.getById(idGood).subscribe({
      next: response => {
        let good: IGood[] = this.goods;
        good.push(response);
        console.log(good);
        this.goods = good;
      },
    });
  }
  validarGood() {}

  /*   get personForm(): IFormGroup<IPerson> {
    return this.fb.group({
      name: [null],
      birthdate: [new Date()],
    });
  }
  get roleForm(): IFormGroup<IRole> {
    return this.fb.group({
      role: [null],
      description: [null],
      status: [null],
      labelNumber: [null],
    });
  }

  get roles(): FormArray {
    return this.userExample.get('roles') as FormArray;
  }

  addRole() {
    this.index = this.index + 1;
    this.roles.push(this.roleForm);
  }

  removeRole(index: number) {
    this.roles.removeAt(index);
  }

  saveRole() {
    this.user = this.userExample.getRawValue();
  } */
}
