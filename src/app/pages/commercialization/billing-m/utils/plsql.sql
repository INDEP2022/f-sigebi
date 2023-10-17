--
/* PROCESO IMPRIME PREFACTURAS DE INMUEBLES 13/ 01 /2016  */
--
-- JACG 07-09-17 Código formateado -- Comento CLOSE_CONNECTION
PROCEDURE IMPRIME_REPORTE (PTIPO      IN NUMBER,
                           PMODO      IN NUMBER,
                           PSUBTIPO   IN NUMBER,
                           P_COPIAS   IN NUMBER) IS
   pl_id           ParamList;
   V_DISPOSITIVO   VARCHAR2 (10);
   V_REPORTE       VARCHAR2 (40);
   --dummy_var       NUMBER;
   --V_DESNAME       VARCHAR2 (10) := 'FACTURAS';
   V_IMAGEN        NUMBER;
BEGIN
   IF PMODO = 1 THEN                                                            -- IMPRIMIR
      V_DISPOSITIVO := 'PRINTER';              -- SE ENVIA DIRECTO A IMPRESORA
      V_IMAGEN := 1;
   ELSIF PMODO = 2 THEN                             -- VA A PANTALLA Y NO SE IMPRIME LA IMAGEN
      V_DISPOSITIVO := 'SCREEN';
      V_IMAGEN := 0;
   END IF;
   pl_id := GET_PARAMETER_LIST ('tmpdata');
   IF NOT ID_NULL (pl_id) THEN
      DESTROY_PARAMETER_LIST (pl_id);
   END IF;
   pl_id := CREATE_PARAMETER_LIST ('tmpdata');
   --Add_Parameter(pl_id, 'DESNAME',  TEXT_PARAMETER, V_DESNAME);
   ADD_PARAMETER (pl_id,
                  'DESTYPE',
                  TEXT_PARAMETER,
                  V_DISPOSITIVO);
   ADD_PARAMETER (pl_id,
                  'PARAMFORM',
                  TEXT_PARAMETER,
                  'NO');
   ADD_PARAMETER (pl_id,
                  'COPIES',
                  TEXT_PARAMETER,
                  TO_CHAR (P_COPIAS));
   IF PTIPO = 8 THEN                                -- PARA IMPRIMIR FACTURAS DE PORTAFOLIO
      IF :COMER_FACTURAS.ID_ESTATUSFACT = 'PREF' THEN
         ADD_PARAMETER (pl_id,
                        'PEVENTO',
                        TEXT_PARAMETER,
                        TO_CHAR ( :COMER_FACTURAS.ID_EVENTO));
         ADD_PARAMETER (pl_id,
                        'PFACTURA',
                        TEXT_PARAMETER,
                        TO_CHAR ( :COMER_FACTURAS.ID_FACTURA));
         ADD_PARAMETER (pl_id,
                        'P_IMAGEN',
                        TEXT_PARAMETER,
                        TO_CHAR (V_IMAGEN));
         v_reporte := '..\reportes\RCOMERFACTURASPREF_INM'; --ESTE REPORTE SOLO SE MUESTRA PARA LAS FACTURAS DEL TIPO 100% EN PREF YA QUE EL REPORTE RCOMERFACTURAS_INM SE ALIMENTA DE
 --LA VISTA VCOMERFACTURAS Y ESTA CONTIENE RESTRICCIOMNES QUE NO PERMITEN SU VISUALIZACION SI NO TIEN PAGOS O SERIE
      ELSE
         ADD_PARAMETER (pl_id,
                        'PEVENTO',
                        TEXT_PARAMETER,
                        TO_CHAR ( :COMER_FACTURAS.ID_EVENTO));
         ADD_PARAMETER (pl_id,
                        'PFACTURA',
                        TEXT_PARAMETER,
                        TO_CHAR ( :COMER_FACTURAS.ID_FACTURA));
         ADD_PARAMETER (pl_id,
                        'P_IMAGEN',
                        TEXT_PARAMETER,
                        TO_CHAR (V_IMAGEN));
         v_reporte := '..\reportes\RCOMERFACTURAS_INM';
      END IF;
   ELSIF PTIPO = 9  THEN                                -- PARA IMPRIMIR FACTURAS DE INDIVIDUAL
      IF :COMER_FACTURAS.ID_ESTATUSFACT = 'PREF' THEN
         ADD_PARAMETER (pl_id,
                        'PEVENTO',
                        TEXT_PARAMETER,
                        TO_CHAR ( :COMER_FACTURAS.ID_EVENTO));
         ADD_PARAMETER (pl_id,
                        'PFACTURA',
                        TEXT_PARAMETER,
                        TO_CHAR ( :COMER_FACTURAS.ID_FACTURA));
         ADD_PARAMETER (pl_id,
                        'P_IMAGEN',
                        TEXT_PARAMETER,
                        TO_CHAR (V_IMAGEN));
         v_reporte := '..\reportes\RCOMERFACTURASPREF_INM'; --ESTE REPORTE SOLO SE MUESTRA PARA LAS FACTURAS DEL TIPO 100% EN PREF YA QUE EL REPORTE RCOMERFACTURAS_INM SE ALIMENTA DE
 --LA VISTA VCOMERFACTURAS Y ESTA CONTIENE RESTRICCIOMNES QUE NO PERMITEN SU VISUALIZACION SI NO TIEN PAGOS O SERIE
      ELSE
         ADD_PARAMETER (pl_id,
                        'PEVENTO',
                        TEXT_PARAMETER,
                        TO_CHAR ( :COMER_FACTURAS.ID_EVENTO));
         ADD_PARAMETER (pl_id,
                        'PFACTURA',
                        TEXT_PARAMETER,
                        TO_CHAR ( :COMER_FACTURAS.ID_FACTURA));
         ADD_PARAMETER (pl_id,
                        'P_IMAGEN',
                        TEXT_PARAMETER,
                        TO_CHAR (V_IMAGEN));
         v_reporte := '..\reportes\RCOMERFACTURAS_INM';
      END IF;
   ELSIF PTIPO = 10 THEN                          -- PARA IMPRIMIR FACTURAS DE INDIVIDUAL PAGOS
      ADD_PARAMETER (pl_id,
                     'PEVENTO',
                     TEXT_PARAMETER,
                     TO_CHAR ( :COMER_FACTURAS.ID_EVENTO));
      ADD_PARAMETER (pl_id,
                     'PFACTURA',
                     TEXT_PARAMETER,
                     TO_CHAR ( :COMER_FACTURAS.ID_FACTURA));
      ADD_PARAMETER (pl_id,
                     'P_IMAGEN',
                     TEXT_PARAMETER,
                     TO_CHAR (V_IMAGEN));
      v_reporte := '..\reportes\RCOMERFACTURAS_INM';
   ELSIF PTIPO = 11 THEN                          -- PARA IMPRIMIR FACTURAS DE PORTAFOLIO PAGOS
      ADD_PARAMETER (pl_id,
                     'PEVENTO',
                     TEXT_PARAMETER,
                     TO_CHAR ( :COMER_FACTURAS.ID_EVENTO));
      ADD_PARAMETER (pl_id,
                     'PFACTURA',
                     TEXT_PARAMETER,
                     TO_CHAR ( :COMER_FACTURAS.ID_FACTURA));
      ADD_PARAMETER (pl_id,
                     'P_IMAGEN',
                     TEXT_PARAMETER,
                     TO_CHAR (V_IMAGEN));
      v_reporte := '..\reportes\RCOMERFACTURAS_INM';
   END IF;
   RUN_PRODUCT (REPORTS,
                v_reporte,
                SYNCHRONOUS,
                RUNTIME,
                FILESYSTEM,
                pl_id,
                NULL);
END;

=================================================================================================================================

PROCEDURE PUP_GENERA_RUTA3 IS
  V_RUTA2     VARCHAR2(2000);
  V_RUTA3     VARCHAR2(2000);
  L_PATH      VARCHAR2(1000);
  V_ARCHOSAL  VARCHAR2(2000);
  V_PATH_TIPO VARCHAR2(100);
  LFiarchivo    Text_IO.File_Type;
BEGIN
	BEGIN 
	   SELECT VALOR_INICIAL
	     INTO L_PATH
	     FROM PARAMETROS
	    WHERE CVE_PARAMETRO = 'PATHANEXOS';
  EXCEPTION
  	 WHEN OTHERS THEN 
  	    LIP_MENSAJE('Al tratar de obtener el parametro del PATH','S');
  	    RAISE FORM_TRIGGER_FAILURE;
  END;	
		
	IF :COMER_FACTURAS.TIPOCOMPROBANTE = 'FAC' AND :COMER_FACTURAS.SERIE LIKE 'INGRG%' THEN
		 V_PATH_TIPO := 'INGRG\';
	ELSIF :COMER_FACTURAS.TIPOCOMPROBANTE = 'FAC' AND :COMER_FACTURAS.SERIE LIKE 'EGRG%' THEN
		 V_PATH_TIPO := 'EGRG\';
	END IF;
	
	V_ARCHOSAL := L_PATH||V_PATH_TIPO; 	
	V_RUTA2 := 'MD '||V_ARCHOSAL||'PDF\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'YYYY')||'\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'MM')||'\'; 
  LFIARCHIVO := TEXT_IO.FOPEN('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\CREARUTA3.BAT', 'W');
  TEXT_IO.PUT_LINE(LFIARCHIVO, V_RUTA2);
  TEXT_IO.FCLOSE(LFIARCHIVO);   
  HOST('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\CREARUTA3.BAT',NO_SCREEN);
  PUP_LIMPIA_ARCHIVO;
	V_ARCHOSAL := L_PATH||V_PATH_TIPO; 	
	V_RUTA3 := 'MD '||V_ARCHOSAL||'XML\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'YYYY')||'\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'MM')||'\'; 
  LFIARCHIVO := TEXT_IO.FOPEN('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\CREARUTA3.BAT', 'W');
  TEXT_IO.PUT_LINE(LFIARCHIVO, V_RUTA3);
  TEXT_IO.FCLOSE(LFIARCHIVO);    
  HOST('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\CREARUTA3.BAT',NO_SCREEN);	  
END;

==========================================================================================================================================

PROCEDURE IMPRIME_PAQUETE IS
    LST_LEVEL_MSG  VARCHAR2(4);
    VC_FILTRO      VARCHAR2(200);
    L_FILE         VARCHAR2(4000);
    L_PATH         VARCHAR2(4000);
    V_UUID         NUMBER(1);

BEGIN
  GO_BLOCK('COMER_FACTURAS');
  FIRST_RECORD;
--** Para la generacion de los PDF's de los anexos **--
    L_PATH := NULL;
        
  BEGIN   
       SELECT VALOR_INICIAL
         INTO L_PATH
         FROM PARAMETROS
        WHERE CVE_PARAMETRO = 'PATHANEXOS';
  EXCEPTION
       WHEN OTHERS THEN 
          LIP_MENSAJE('Al tratar de obtener el parametro del PATH','S');
          RAISE FORM_TRIGGER_FAILURE;
  END;
     
    :BLK_CTRL.PATH := L_PATH;
    LST_LEVEL_MSG := :System.Message_Level;
    :System.Message_level:='0';
    :System.Message_level:= LST_LEVEL_MSG;
--**
    LOOP
            IF :COMER_FACTURAS.SELECCIONA = 'S' THEN
                 PUP_REP_FACTURA_MAS(11,:COMER_FACTURAS.TIPO);
             END IF;
            :COMER_FACTURAS.SELECCIONA := 'N';
            EXIT WHEN :SYSTEM.LAST_RECORD = 'TRUE';
            NEXT_RECORD;
    END LOOP;
    FIRST_RECORD;
END;

==========================================================================================================================================

PROCEDURE PUP_REP_FACTURA_MAS (P_TIPOA IN NUMBER, PSUBTIPO IN NUMBER)IS
REPID					REPORT_OBJECT;
	V_REP					VARCHAR2(100);
	V_PATH				PARAMETROS.VALOR_INICIAL%TYPE;
	LEYENDA1				COMER_FACTURAS.LEYENDA1%TYPE;
	V_ARCHOSAL	  VARCHAR2(100);
	V_ARCHOSAL1	  VARCHAR2(100);	
	PTIPO  				 NUMBER;
	V_PATH_TIPO   VARCHAR2(200);
	V_PATH_TIPO1   VARCHAR2(200);	
	V_NOMBRE      VARCHAR2(200);
	V_RUTA        VARCHAR2(200);
  V_RUTA1 	    VARCHAR2(2000);	
  V_RUTA2 	    VARCHAR2(2000);
  V_RUTA3 	    VARCHAR2(2000);


BEGIN
--	V_ARCHOSAL := :BLK_CTRL.PATH||TO_CHAR(:COMER_FACTURAS.ID_EVENTO)||'-'||TO_CHAR(:COMER_FACTURAS.ID_LOTE)||'-'||:COMER_FACTURAS.SERIE||LTRIM(TO_CHAR(:COMER_FACTURAS.FOLIO,'0999999999'))||'.PDF';
	PTIPO := :COMER_FACTURAS.TIPO;
	IF P_TIPOA = 10 THEN
		PTIPO := P_TIPOA;
	ELSIF P_TIPOA = 11 THEN
		PTIPO := P_TIPOA;
	END IF;
	/***********************/ --AGREGA LA RUTA DE ACUERDO AL TIPO  --  LIRH-1 --
	V_PATH_TIPO := 'ANEXOS\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'YYYY')||'\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'MM')||'\';
	V_PATH_TIPO1 := 'XML\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'YYYY')||'\'||TO_CHAR(:COMER_FACTURAS.FECHA_IMPRESION,'MM')||'\';
	
	IF :COMER_FACTURAS.TIPOCOMPROBANTE =    'FAC' AND :COMER_FACTURAS.SERIE LIKE 'INGRG%' THEN
		 V_PATH_TIPO := 'INGRG\'||V_PATH_TIPO;
		 V_PATH_TIPO1 := 'INGRG\'||V_PATH_TIPO1;
	ELSIF :COMER_FACTURAS.TIPOCOMPROBANTE = 'FAC' AND :COMER_FACTURAS.SERIE LIKE 'EGRG%' THEN
		 V_PATH_TIPO1 := 'EGRG\'||V_PATH_TIPO1;
	ELSIF :COMER_FACTURAS.TIPOCOMPROBANTE = 'NCR' AND :COMER_FACTURAS.SERIE LIKE 'EGRG%' THEN
		 V_PATH_TIPO := 'EGRG\'||V_PATH_TIPO;
	END IF;
	
--LIP_MENSAJE('RUTA: '||V_PATH_TIPO,'A');			
			
	/***********************/   -- EXTRAE EL NOMBRE DEL CFDI
	BEGIN
		 V_NOMBRE := NULL;
		 
		 SELECT NOMBRE_ARCHIVO,RUTA_PDF
		   INTO V_NOMBRE,V_RUTA
       FROM COMER_FACTURA_ELEC
      WHERE ID_EVENTO = :COMER_FACTURAS.ID_EVENTO
        AND ID_LOTE = :COMER_FACTURAS.ID_LOTE
        AND ID_FACTURA = :COMER_FACTURAS.ID_FACTURA;
	EXCEPTION
  	 WHEN OTHERS THEN 
  	    LIP_MENSAJE('Al tratar de obtener el nombre del Archivo','S');
  	    RAISE FORM_TRIGGER_FAILURE;
	END;
	
	V_NOMBRE := REPLACE(V_NOMBRE,'.TXT','');
	V_RUTA   := REPLACE(V_RUTA,'F:','');
	-- 	V_RUTA   := REPLACE(V_RUTA,'C:','');
	V_RUTA   := '\\'||GETWORD(:BLK_CTRL.PATH,'\',2)||V_RUTA;
/***********************EXTRAE EL NOMBRE DEL CFDI PARA VENTAS DIRECTAS**********************************/
	BEGIN
		 V_NOMBRE := NULL;
		 
		 SELECT NOMBRE_ARCHIVO,RUTA_PDF
		   INTO V_NOMBRE,V_RUTA1
       FROM COMER_FACTURA_ELEC
      WHERE ID_EVENTO = :COMER_FACTURAS.ID_EVENTO
        AND ID_LOTE = :COMER_FACTURAS.ID_LOTE
        AND ID_FACTURA = :COMER_FACTURAS.ID_FACTURA;
	EXCEPTION
  	 WHEN OTHERS THEN 
  	    LIP_MENSAJE('Al tratar de obtener el nombre del Archivo','S');
  	    RAISE FORM_TRIGGER_FAILURE;
	END;
	V_NOMBRE := REPLACE(V_NOMBRE,'.TXT','');
	V_RUTA1   := REPLACE(V_RUTA1,'F:','');
--	V_RUTA1   := REPLACE(V_RUTA1,'C:','');
	V_RUTA1   := '\\'||GETWORD(:BLK_CTRL.PATH,'\',2)||V_RUTA1;
	--LIP_MENSAJE('RUTA CFDI_VD: '||V_RUTA1,'A');
/***********************EXTRAE EL NOMBRE DEL CFDI PARA ATENCION A CLIENTES******************************/	
		BEGIN
		 V_NOMBRE := NULL;
		 
		 SELECT NOMBRE_ARCHIVO,RUTA_PDF
		   INTO V_NOMBRE,V_RUTA2
       FROM COMER_FACTURA_ELEC
      WHERE ID_EVENTO = :COMER_FACTURAS.ID_EVENTO
        AND ID_LOTE = :COMER_FACTURAS.ID_LOTE
        AND ID_FACTURA = :COMER_FACTURAS.ID_FACTURA;
	EXCEPTION
  	 WHEN OTHERS THEN 
  	    LIP_MENSAJE('Al tratar de obtener el nombre del Archivo','S');
  	    RAISE FORM_TRIGGER_FAILURE;
	END;
	V_NOMBRE := REPLACE(V_NOMBRE,'.TXT','');
	V_RUTA2   := REPLACE(V_RUTA2,'F:','');
	--V_RUTA2   := REPLACE(V_RUTA2,'C:','');
	V_RUTA2   := '\\'||GETWORD(:BLK_CTRL.PATH,'\',2)||V_RUTA2;
--	LIP_MENSAJE('RUTA CFDI_ATC: '||V_RUTA2,'A');	
/***********************EXTRAE EL NOMBRE DEL XML PARA ATENCION A CLIENTES******************************/		
		BEGIN
		 V_NOMBRE := NULL;
		 
		 SELECT NOMBRE_ARCHIVO,RUTA_PDF
		   INTO V_NOMBRE,V_RUTA3
       FROM COMER_FACTURA_ELEC
      WHERE ID_EVENTO = :COMER_FACTURAS.ID_EVENTO
        AND ID_LOTE = :COMER_FACTURAS.ID_LOTE
        AND ID_FACTURA = :COMER_FACTURAS.ID_FACTURA;
	EXCEPTION
  	 WHEN OTHERS THEN 
  	    LIP_MENSAJE('Al tratar de obtener el nombre del Archivo','S');
  	    RAISE FORM_TRIGGER_FAILURE;
	END;
	V_NOMBRE := REPLACE(V_NOMBRE,'.TXT','');
	V_RUTA3   := REPLACE(V_RUTA3,'F:','');
	--	V_RUTA2   := REPLACE(V_RUTA2,'C:','');
	V_RUTA3   := '\\'||GETWORD(:BLK_CTRL.PATH,'\',2)||V_RUTA3;

--LIP_MENSAJE('RUTA CFDI_ATC: '||V_RUTA3,'A');
	/******************************************************************************************************/
	IF PTIPO = 10 THEN
	   --V_ARCHOSAL := :BLK_CTRL.PATH||'A'||TO_CHAR(:COMER_FACTURAS.ID_EVENTO)||'-'||TO_CHAR(:COMER_FACTURAS.ID_LOTE)||'-'||:COMER_FACTURAS.SERIE||LTRIM(TO_CHAR(:COMER_FACTURAS.FOLIO,'0999999999'))||'.PDF'; LIRH-1
	   V_ARCHOSAL := :BLK_CTRL.PATH||V_PATH_TIPO||'A'||V_NOMBRE||'.PDF';
	   V_ARCHOSAL1 := :BLK_CTRL.PATH||V_PATH_TIPO1||V_NOMBRE||'.XML';
	ELSIF PTIPO = 11 THEN   -- LIRH-1 --
		 V_ARCHOSAL := :BLK_CTRL.PATH||V_PATH_TIPO||'CE'||V_NOMBRE||'.PDF';
		 V_ARCHOSAL1 := :BLK_CTRL.PATH||V_PATH_TIPO1||V_NOMBRE||'.XML';
	ELSE
		 V_ARCHOSAL := :BLK_CTRL.PATH||TO_CHAR(:COMER_FACTURAS.ID_EVENTO)||'-'||TO_CHAR(:COMER_FACTURAS.ID_LOTE)||'-'||:COMER_FACTURAS.SERIE||LTRIM(TO_CHAR(:COMER_FACTURAS.FOLIO,'0999999999'))||'.PDF';		 
	END IF;

	
   IF PTIPO  = 10 THEN   	
   	 -- PUP_GUARDA_ARCHIVO (V_ARCHOSAL,TO_CHAR(:COMER_FACTURAS.ID_EVENTO),TO_CHAR(:COMER_FACTURAS.ID_LOTE));
   	  IF :COMER_FACTURAS.TPEVENTO = 3 THEN   	  	
		 			PUP_ENVIAR_VD(V_RUTA1,TO_CHAR(:COMER_FACTURAS.ID_EVENTO),TO_CHAR(:COMER_FACTURAS.ID_LOTE));		 	
		 			PUP_ENVIAR_VD(V_ARCHOSAL,TO_CHAR(:COMER_FACTURAS.ID_EVENTO),TO_CHAR(:COMER_FACTURAS.ID_LOTE));
   	  END IF;
   	  IF LEYENDA1 IS NOT NULL THEN   	  	
   	  PUP_ENVIAR_ATC(V_RUTA2,TO_CHAR(:COMER_FACTURAS.ID_EVENTO),TO_CHAR(:COMER_FACTURAS.ID_LOTE));		 	
		 	PUP_ENVIAR_ATC(V_ARCHOSAL1,TO_CHAR(:COMER_FACTURAS.ID_EVENTO),TO_CHAR(:COMER_FACTURAS.ID_LOTE));
   	  END IF;   
   	  
   	  ELSE
   	 -- PUP_GUARDA_ARCHIVO (V_RUTA,TO_CHAR(:COMER_FACTURAS.ID_EVENTO),TO_CHAR(:COMER_FACTURAS.ID_LOTE));
   	 -- PUP_GUARDA_ARCHIVO (V_ARCHOSAL,TO_CHAR(:COMER_FACTURAS.ID_EVENTO),TO_CHAR(:COMER_FACTURAS.ID_LOTE));  	   
   	   IF :COMER_FACTURAS.TPEVENTO = 3 THEN	    	   	
		 			PUP_ENVIAR_VD(V_RUTA1,TO_CHAR(:COMER_FACTURAS.ID_EVENTO),TO_CHAR(:COMER_FACTURAS.ID_LOTE));		 	
   	   END IF;
   	  IF :COMER_FACTURAS.TIPOCOMPROBANTE = 'FAC' AND :COMER_FACTURAS.ID_ESTATUSFACT = 'CFDI' THEN
   	  PUP_ENVIAR_ATC(V_RUTA2,TO_CHAR(:COMER_FACTURAS.ID_EVENTO),TO_CHAR(:COMER_FACTURAS.ID_LOTE));		 	
		 	PUP_LIMPIA_ARCHIVO;
		 	PUP_ENVIAR_ATC(V_ARCHOSAL1,TO_CHAR(:COMER_FACTURAS.ID_EVENTO),TO_CHAR(:COMER_FACTURAS.ID_LOTE));   	  
			END IF;
   END IF;
   
   
END;

==========================================================================================================================================
FALLO()
-- JACG 12-09-17 Código formateado -- 
DECLARE
   V_NOFACTURAS   NUMBER (10);
   V_OBSERV       VARCHAR (2000);
   V_EXIS_FACT    NUMBER (10);
   CONT           NUMBER (10);
   V_ESTEVENTO    VARCHAR (10);
   VAL_ESTATUS    NUMBER (10);
BEGIN
   CONT := 0;
   IF :BLK_CTRL.ID_EVENTO IS NULL THEN
      LIP_MENSAJE ('Ingrese el número de evento.', 'A');
      GO_ITEM ('BLK_CTRL.ID_EVENTO');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;

   SELECT ID_ESTATUSVTA
     INTO V_ESTEVENTO
     FROM COMER_EVENTOS
    WHERE ID_EVENTO = :BLK_CTRL.ID_EVENTO;

   SELECT COUNT (0)
     INTO V_NOFACTURAS
     FROM COMER_FACTURAS
    WHERE ID_EVENTO = :BLK_CTRL.ID_EVENTO;

   IF V_NOFACTURAS = 0 THEN
      IF PUF_MENSAJE_SI_NO ('Se ejecuta el proceso?') = 'S' THEN
         V_OBSERV := 'Se realiza la actualización de todos los lotes en estatus PAG,PAGE   a estatus VEN';
         SET_APPLICATION_PROPERTY (CURSOR_STYLE, 'BUSY');
         FOR ACT
            IN (SELECT LOTE_PUBLICO, ID_ESTATUSVTA
                  FROM COMER_LOTES
                 WHERE     ID_EVENTO = :BLK_CTRL.ID_EVENTO
                       AND ID_ESTATUSVTA IN ('PAG', 'PAGE')) LOOP
            CONT := CONT + 1;
            UPDATE COMER_EST_LOTES
               SET TIPO_CAMBIO = 5              --EL 5 INDICA QUE ES HISTORICO
             WHERE     id_evento = :BLK_CTRL.ID_EVENTO
                   AND LOTE_PUBLICO = ACT.LOTE_PUBLICO
                   AND TIPO_CAMBIO = 1;
            UPDATE COMER_LOTES
               SET ID_ESTATUSVTA = 'VEN'
             WHERE     id_evento = :BLK_CTRL.ID_EVENTO
                   AND LOTE_PUBLICO = ACT.LOTE_PUBLICO
                   AND ID_ESTATUSVTA IN ('PAG', 'PAGE');
            INSERT INTO COMER_EST_LOTES (LOTE_PUBLICO,
                                         ID_EVENTO,
                                         ESTATUS,
                                         ESTATUS_ANT,
                                         FEC_CAMBIO,
                                         MOTIVO_CAMBIO,
                                         TIPO_CAMBIO,
                                         USUARIO)
                    VALUES (
                              ACT.LOTE_PUBLICO,
                              :BLK_CTRL.ID_EVENTO,
                              'VEN',
                              ACT.ID_ESTATUSVTA,
                              SYSDATE,
                              'Se realiza la actualización del lote en FCOMER086_I',
                              '1',
                              USER);
         END LOOP;
         IF CONT > 0 AND V_ESTEVENTO NOT IN ('VEN') THEN
            UPDATE COMER_EST_LOTES
               SET TIPO_CAMBIO = 6              --EL 6 INDICA QUE ES HISTORICO
             WHERE     id_evento = :BLK_CTRL.ID_EVENTO
                   AND TIPO_CAMBIO = 3
                   AND LOTE_PUBLICO IS NULL;
            UPDATE COMER_EVENTOS
               SET ID_ESTATUSVTA = 'VEN'
             WHERE ID_EVENTO = :BLK_CTRL.ID_EVENTO;
            INSERT INTO COMER_EST_LOTES (ID_EVENTO,
                                         ESTATUS,
                                         ESTATUS_ANT,
                                         FEC_CAMBIO,
                                         MOTIVO_CAMBIO,
                                         TIPO_CAMBIO,
                                         USUARIO)
                    VALUES (
                              :BLK_CTRL.ID_EVENTO,
                              'VEN',
                              V_ESTEVENTO,
                              SYSDATE,
                              'Se realiza la actualización del evento en FCOMER086_I',
                              '3',
                              USER);
         END IF;
         SET_APPLICATION_PROPERTY (CURSOR_STYLE, 'NORMAL');
         LIP_COMMIT_SILENCIOSO;
         IF CONT > 0 THEN
            :BLK_CTRL.EJEC_REG_ESTAT := 1; -- JACG 11-10-17 Para control de regreso de estatus --
         END IF;
         LIP_MENSAJE (CONT || 'registro (s)  Procesado(os)', 'A');
      END IF;
   ELSE
      IF :BLK_CTRL.ID_LOTE_PUB IS NULL THEN
         LIP_MENSAJE ('No es posible actualizar todo el evento. Ingrese el lote a actualizar.','A');
         GO_ITEM ('BLK_CTRL.ID_LOTE_PUB');
         RAISE FORM_TRIGGER_FAILURE;
      END IF;
      SELECT COUNT (0)
        INTO V_EXIS_FACT
        FROM COMER_LOTES CL
       WHERE     id_evento = :BLK_CTRL.ID_EVENTO
             AND LOTE_PUBLICO = :BLK_CTRL.ID_LOTE_PUB
             AND ID_ESTATUSVTA IN ('PAG', 'PAGE')
             AND EXISTS
                    (SELECT 1
                       FROM COMER_FACTURAS CF
                      WHERE     CL.ID_EVENTO = CF.ID_EVENTO
                            AND CL.LOTE_PUBLICO = CF.ID_LOTE
                            AND CF.ID_ESTATUSFACT IN ('FOL', 'IMP', 'CFDI')
                            AND CF.TIPO IN (8, 9));
      IF V_EXIS_FACT > 0 THEN
         LIP_MENSAJE ('El lote ya cuenta con una factura del 100% trabajada o el estatus no es el esperado.','A');
         GO_ITEM ('BLK_CTRL.ID_EVENTO');
         RAISE FORM_TRIGGER_FAILURE;
      ELSE
         IF PUF_MENSAJE_SI_NO ('Se ejecuta el proceso?') = 'S' THEN
            SET_APPLICATION_PROPERTY (CURSOR_STYLE, 'BUSY');
            FOR ACTX1
               IN (SELECT LOTE_PUBLICO, ID_ESTATUSVTA
                     FROM COMER_LOTES
                    WHERE     ID_EVENTO = :BLK_CTRL.ID_EVENTO
                          AND LOTE_PUBLICO = :BLK_CTRL.ID_LOTE_PUB
                          AND ID_ESTATUSVTA IN ('PAG', 'PAGE')) LOOP
               CONT := CONT + 1;
               UPDATE COMER_EST_LOTES
                  SET TIPO_CAMBIO = 5              --EL 5 INDICA QUE ES HISTORICO
                WHERE     id_evento = :BLK_CTRL.ID_EVENTO
                      AND LOTE_PUBLICO = ACTX1.LOTE_PUBLICO
                      AND TIPO_CAMBIO = 1;
               LIP_COMMIT_SILENCIOSO;
               UPDATE COMER_LOTES
                  SET ID_ESTATUSVTA = 'VEN'
                WHERE     id_evento = :BLK_CTRL.ID_EVENTO
                      AND LOTE_PUBLICO = ACTX1.LOTE_PUBLICO
                      AND ID_ESTATUSVTA IN ('PAG', 'PAGE');
               INSERT INTO COMER_EST_LOTES (LOTE_PUBLICO,
                                            ID_EVENTO,
                                            ESTATUS,
                                            ESTATUS_ANT,
                                            FEC_CAMBIO,
                                            MOTIVO_CAMBIO,
                                            TIPO_CAMBIO,
                                            USUARIO)
                       VALUES (
                                 ACTX1.LOTE_PUBLICO,
                                 :BLK_CTRL.ID_EVENTO,
                                 'VEN',
                                 ACTX1.ID_ESTATUSVTA,
                                 SYSDATE,
                                 'Se realiza la actualización del lote en FCOMER086_I',
                                 '1',
                                 USER);
            END LOOP;
            IF CONT > 0 AND V_ESTEVENTO NOT IN ('VEN') THEN
               UPDATE COMER_EST_LOTES
                  SET TIPO_CAMBIO = 6              --EL 6 INDICA QUE ES HISTORICO
                WHERE     id_evento = :BLK_CTRL.ID_EVENTO
                      AND TIPO_CAMBIO = 3
                      AND LOTE_PUBLICO IS NULL;
               LIP_COMMIT_SILENCIOSO;
               UPDATE COMER_EVENTOS
                  SET ID_ESTATUSVTA = 'VEN'
                WHERE ID_EVENTO = :BLK_CTRL.ID_EVENTO;
               INSERT INTO COMER_EST_LOTES (ID_EVENTO,
                                            ESTATUS,
                                            ESTATUS_ANT,
                                            FEC_CAMBIO,
                                            MOTIVO_CAMBIO,
                                            TIPO_CAMBIO,
                                            USUARIO)
                       VALUES (
                                 :BLK_CTRL.ID_EVENTO,
                                 'VEN',
                                 V_ESTEVENTO,
                                 SYSDATE,
                                    'Se realiza la actualización del evento en FCOMER086_I Lote: '
                                 || :BLK_CTRL.ID_LOTE_PUB,
                                 '3',
                                 USER);
            END IF;
            SET_APPLICATION_PROPERTY (CURSOR_STYLE, 'NORMAL');
            LIP_COMMIT_SILENCIOSO;
            IF CONT > 0 THEN
               :BLK_CTRL.EJEC_REG_ESTAT := 1; -- JACG 11-10-17 Para control de regreso de estatus --
            END IF;
            LIP_MENSAJE (CONT || 'registro (s)  Procesado(os)', 'A');
         END IF;
      END IF;
   END IF;
END;
