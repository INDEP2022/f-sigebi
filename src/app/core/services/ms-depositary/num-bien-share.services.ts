import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';

export interface valorBien {
  numBien: number;
  cveContrato: string;
  depositario: string;
  desc: string;
  nomPantall: string;
}

@Injectable({ providedIn: 'root' })
export class NumBienShare extends HttpService {
  //   private sharingNumbien: BehaviorSubject<valorBien> = new BehaviorSubject({numBien: null, nomPantall: null});

  private sharingNumbien: BehaviorSubject<valorBien> = new BehaviorSubject({
    numBien: null,
    cveContrato: null,
    depositario: null,
    desc: null,
    nomPantall: null,
  });

  get SharingNumbien() {
    return this.sharingNumbien.asObservable();
  }

  set SharingNumbienData(data: valorBien) {
    this.sharingNumbien.next(data);
  }
}
