import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-new-validation-exempted-goods-modal',
  templateUrl: './new-validation-exempted-goods-modal.components.html',
  styleUrls: [],
})
export class NewValidationExemptedGoodModalComponent
  extends BasePage
  implements OnInit
{
  newForm: FormGroup;

  goods = new DefaultSelect();
  processes = new DefaultSelect();

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGoods();
  }

  private prepareForm() {
    this.newForm = this.fb.group({
      goodNumber: [null, [Validators.required]],
      process: [null, [Validators.required]],
    });
  }

  getGoods(event?: any) {
    console.log('Se llamó');
    const paramsF = new FilterParams();
    this.goodService.getAll(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
        this.alert(
          'error',
          'No se pudieron obtener bienes',
          'Se presentó un error al obtener los bienes'
        );
      }
    );
  }

  getProcesses(event: any) {}

  closeModal() {
    this.modalService.hide();
  }
}
