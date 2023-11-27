# FrontSigebi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Librarys Documentation

https://github.com/MurhafSousli/ngx-scrollbar/wiki/usage

# CASO DE PRUEBA

description : DEVOLUCIÓN DE BIENES COMERCIO EXTERIOR

processDetonate : DEVOLUCION

SOLICITUD 61631

TAREA 61632

Crear solicitud

Se crea la tarea con Registrar Devolución

20.1 Registro de solicitud de devolución: Registrar documentación complementaria devolución
20.1.1 Registrar Devolución
20.1.2 Búsqueda y selección de bienes para devolución
20.1.3 Asociar solicitud a expediente existente
20.1.4 Asociar solicitud a nuevo expediente
20.1.5 Integrar documentación al Expediente
20.1.6 Solicitar búsqueda en SIAB

20.2 Turnar solicitud

Secierra la tarea anterior estatus FINALIZADO

- Que debo actualizar en la solicitud ?
  Se crea la tarea con Registrar Devolución

  20.3 Clasificación Bienes
  20.3.1 Verificar Cumplimiento
  20.3.2 Generar Dictamen Devolución
  20.4 Turnar Solicitud de Devolución

  20.5.1 Revisión de la Solicitud de Devolución
  20.5.3 Rechazar Solicitud de Devolución
  20.5.4 Firmar Dictamen
  20.5.5 Aprobar Solicitud de Devolución

register-request

-DRegistroSolicitudes
DVerificarCumplimiento
DAprobarDevolucion

-BSRegistroSolicitudes
BSNotificarTransferente
BSVisitaOcular
BSValidarVisitaOcular
BSValidarDictamen

-RERegistroSolicitudes
RERevisionLineamientos
REGenerarResultadoAnalisis
