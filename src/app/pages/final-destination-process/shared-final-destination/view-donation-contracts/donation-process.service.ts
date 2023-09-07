import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DonationProcessService {
  constructor() {}

  getAllContracts() {
    console.log('obtener contratos');
  }
}
