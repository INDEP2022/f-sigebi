import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';

@Component({
  selector: 'app-donation-processes',
  templateUrl: './donation-processes.component.html',
  styles: [],
})
export class DonationProcessesComponent extends BasePage implements OnInit {
  imgs1 = [
    {
      url: 'assets/images/verification-img.png',
      text: 'Selección de Inventario para Exportación a Excel',
    },
  ];

  img2 = [
    {
      url: 'assets/images/profile-img.png',
      text: 'Asociación de Solicitudes',
    },
  ];

  img3 = [
    {
      url: 'assets/images/verification-img.png',
      text: 'Propuestas e Inventario de Bienes para Donación',
    },
  ];

  img4 = [
    {
      url: 'assets/images/profile-img.png',
      text: 'Contratos de Donación',
    },
  ];
  /** */
  img5 = [
    {
      url: 'assets/images/laptop-img.png',
      text: 'Donaciones Directas',
    },
  ];

  img6 = [
    {
      url: 'assets/images/error-img.png',
      text: 'Asociación de Propuestas e Inventario de Bienes para Donación',
    },
  ];

  img7 = [
    {
      url: 'assets/images/laptop-img.png',
      text: 'Contratos o Convenios',
    },
  ];

  constructor(
    private globalVarsService: GlobalVarsService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {}

  clickImg1() {
    this.alertQuestion(
      'info',
      'Se Abrirá la Pantalla de Exportación de Bienes para Donación. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(
          [
            `/pages/final-destination-process/donation-process/export-goods-donation`,
          ],
          {
            queryParams: {
              origin: 'FPROCDONACIONES',
            },
          }
        );
      }
    });
  }

  clickImg2() {
    this.alertQuestion(
      'info',
      'Se Abrirá la Pantalla de Solicitud y Autorización de Donación. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(
          [
            `/pages/final-destination-process/donation-process/donation-authorization-request`,
          ],
          {
            queryParams: {
              origin: 'FPROCDONACIONES',
            },
          }
        );
      }
    });
  } ///pages/final-destination-process/donation-process/web-donation-inventories

  clickImg3() {
    this.alertQuestion(
      'info',
      'Se Abrirá la Pantalla de Propuesta de Inventarios para Donación Web. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(
          [
            `/pages/final-destination-process/donation-process/web-donation-inventories`,
          ],
          {
            queryParams: {
              origin: 'FPROCDONACIONES',
            },
          }
        );
      }
    });
  }

  clickImg4() {
    this.alertQuestion(
      'info',
      'Se Abrirá la Pantalla de Contratos de Donación. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(
          [
            `/pages/final-destination-process/donation-process/donation-contracts`,
          ],
          {
            queryParams: {
              origin: 'FPROCDONACIONES',
            },
          }
        );
      }
    });
  }

  /** Sub-Img */

  clickImg5() {
    this.alertQuestion(
      'info',
      'Se Abrirá la Pantalla de Registro para Inventarios y Donación Directa. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(
          [
            `/pages/final-destination-process/donation-process/registration-inventories-donation`,
          ],
          {
            queryParams: {
              origin: 'FPROCDONACIONES',
            },
          }
        );
      }
    });
  }

  clickImg6() {
    this.alertQuestion(
      'info',
      'Se Abrirá la Pantalla de Propuesta de Inventarios para Donación Directa. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(
          [
            `/pages/final-destination-process/donation-process/direct-donation-inventories`,
          ],
          {
            queryParams: {
              origin: 'FPROCDONACIONES',
            },
          }
        );
      }
    });
  }

  clickImg7() {
    this.alertQuestion(
      'info',
      'Se Abrirá la Pantalla de Contratos de Donación. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        this.router.navigate(
          [
            `/pages/final-destination-process/donation-process/donation-contracts`,
          ],
          {
            queryParams: {
              origin: 'FPROCDONACIONES',
            },
          }
        );
      }
    });
  }
}
