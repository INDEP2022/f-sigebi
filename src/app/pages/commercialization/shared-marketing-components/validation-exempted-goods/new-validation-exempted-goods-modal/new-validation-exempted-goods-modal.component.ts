import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodsTransAva } from 'src/app/core/models/ms-good/goods-trans-ava.model';
import { BankMovementType } from 'src/app/core/services/ms-bank-movement/bank-movement.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { v4 as uuidv4 } from 'uuid';
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
    private goodFinderService: GoodFinderService,
    private goodService: GoodService,
    private processService: BankMovementType
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getProcesses();
  }

  private prepareForm() {
    this.newForm = this.fb.group({
      goodNumber: [null, [Validators.required]],
      process: [null, [Validators.required]],
    });
  }

  getGoods(event?: any) {
    console.log('Se llamó');
    console.log(event);
    const paramsF = new FilterParams();
    Number.isInteger(parseFloat(event.text))
      ? paramsF.addFilter('id', event.text)
      : paramsF.addFilter('description', event.text, SearchFilter.LIKE);

    this.goodFinderService.goodFinder(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        const newResp = res.data.map((item: any) => {
          return {
            ...item,
            bindValue: `${item.id} - ${item.description}`,
          };
        });

        this.goods = new DefaultSelect(newResp, res.count);
      },
      err => {
        console.log(err);
        this.goods = new DefaultSelect();
        this.alert(
          'error',
          'No se pudieron obtener bienes',
          'Se presentó un error al obtener los bienes'
        );
      }
    );
  }

  getProcesses() {
    const paramsF = new FilterParams();
    paramsF.addFilter('parameter', 'COMERBIENEX');
    this.processService.getProcess(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        const newResp = res.data.map((item: any) => {
          return {
            ...item,
            bindValue: `${item.value} - ${item.description}`,
          };
        });

        this.processes = new DefaultSelect(newResp, res.count);
      },
      err => {
        this.processes = new DefaultSelect();
        this.alert('error', 'No se pudieron obtener los procesos', '');
      }
    );
  }

  saveNewGood() {
    this.newForm.markAllAsTouched();
    if (this.newForm.invalid) {
      this.alert(
        'error',
        'Formulario inválido',
        'Por favor, complete los campos requeridos'
      );
      return;
    }

    const body: IGoodsTransAva = {
      goodNumber: this.newForm.get('goodNumber').value.id,
      process: this.newForm.get('process').value.value,
      registryNumber: uuidv4(),
    };

    this.goodService.postTransAva(body).subscribe(
      res => {
        console.log(res);
        this.alert(
          'success',
          'Bien registrado',
          'El bien se ha registrado correctamente'
        );
        this.modalService.hide();
      },
      err => {
        this.alert(
          'error',
          'No se pudo registrar el bien',
          'Se presentó un error al registrar el bien'
        );
      }
    );
  }

  closeModal() {
    this.modalService.hide();
  }
}
