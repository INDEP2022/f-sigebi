import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IGoodresdev } from 'src/app/core/models/ms-rejected-good/rejected-good.model';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-grouper-good-field',
  templateUrl: './grouper-good-field.component.html',
  styles: [],
})
export class GrouperGoodFieldComponent extends BasePage implements OnInit {
  /*renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();*/
  title: string = 'Asignar Bien Agrupador';
  @Output() event: EventEmitter<any> = new EventEmitter();

  grouperForm: FormGroup = new FormGroup({});
  goodResDevs: IGoodresdev[] = null;

  private fb = inject(FormBuilder);
  private bsModalRef = inject(BsModalRef);
  private rejectedGoodService = inject(RejectedGoodService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.grouperForm = this.fb.group({
      goodGrouper: [null, [Validators.required]],
    });
  }

  /*onKeyUp(event:any){
    this.input.emit({data: this.rowData, text:this.value})
  }*/

  confirm() {
    let list: any[] = [];
    this.goodResDevs.map(async (item: any, _i: number) => {
      const index = _i + 1;
      const body: any = {
        goodresdevId: item.goodresdevId,
        goodGrouper: this.grouperForm.get('goodGrouper').value,
      };

      //borrar solo de prueba
      /*item.goodGrouper = 415;
      list.push(item);
      this.event.emit(list);
      this.onLoadToast('success', 'Se agrego el valor agrupador');
      this.close();*/

      const result = await this.updateGoodResDev(body);
      (item['goodGrouper'] = this.grouperForm.get('goodGrouper').value),
        list.push(item);
      if (this.goodResDevs.length == index) {
        this.event.emit(list);
        this.onLoadToast('success', 'Se agrego el valor agrupador');
        this.close();
      }
    });
  }

  close() {
    this.bsModalRef.hide();
  }

  updateGoodResDev(good: any) {
    return new Promise((resolve, reject) => {
      const id = good.goodresdevId;
      this.rejectedGoodService.updateGoodsResDev(id, good).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject('no se pudo agregar el valor agrupador');
          this.onLoadToast(
            'error',
            'No se pudo agregar el valor agrupador',
            `error: ${error.error.message}`
          );
        },
      });
    });
  }
}
