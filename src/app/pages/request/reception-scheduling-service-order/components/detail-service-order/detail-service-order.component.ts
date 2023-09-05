import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';

@Component({
  selector: 'app-detail-service-order',
  templateUrl: './detail-service-order.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class DetailServiceOrderComponent implements OnInit {
  showDatais: boolean = true;

  idProg: number = null;
  programming: Iprogramming = null;
  parentModal: BsModalRef;
  typeRelevant: string = null;
  stateZone: string = null;
  delegation: string = null;
  transferent: string = null;

  private programmingService = inject(ProgrammingRequestService);
  private typeRelevantService = inject(TypeRelevantService);
  private delegationState = inject(DelegationStateService);
  private transfeService = inject(TransferenteService);
  private router = inject(ActivatedRoute);

  constructor() {}

  ngOnInit(): void {
    this.idProg = +this.router.snapshot.params['id'];
    if (this.idProg) {
      this.getProgramming(this.idProg);
    }
  }

  getProgramming(id: number) {
    this.programmingService.getProgrammingId(id).subscribe({
      next: resp => {
        this.getTypeRelevant(resp.typeRelevantId);
        this.getStateZone(resp.stateKey, resp.regionalDelegationNumber);
        this.getTransferent(resp.tranferId);
        this.getStore(resp.storeId);
        this.programming = resp;
      },
    });
  }

  getTypeRelevant(id: number) {
    this.typeRelevantService.getById(id).subscribe({
      next: resp => {
        this.typeRelevant = resp.description;
      },
    });
  }

  getStateZone(idState: number, idDeleg: number) {
    const params = new ListParams();
    params['filter.keyState'] = `$eq:${idState}`;
    params['filter.regionalDelegation'] = `$eq:${idDeleg}`;
    this.delegationState
      .getAll(params)
      .pipe(
        map((x: any) => {
          return x.data[0];
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.stateZone = resp.regionalDelegation.keyZone;
          this.delegation = resp.regionalDelegation.description;
        },
      });
  }

  getTransferent(id: number) {
    this.transfeService.getById(id).subscribe({
      next: resp => {
        this.transferent = resp.keyTransferent;
      },
    });
  }

  getStore(id: number) {}
}
