/*GO_BLOCK('BLK_BIEN_GEN_MASIV');
	 CLEAR_BLOCK(NO_VALIDATE);*/

------ esto ocurre cuando se da click en el boton subir archivo para insercion masiva de bienes
DECLARE
   l_file            VARCHAR2 (4000);
   L_PATH            VARCHAR2 (4000);
   vc_filtro         VARCHAR2 (200);
   LFiarchivo        Text_IO.File_Type;
   LSt_archivo_img   VARCHAR2 (4000);
BEGIN
   IF :BLK_BIE.NO_BIEN IS NOT NULL THEN
      LIP_MENSAJE('Para la carga masiva, no se debe de tener un bien consultado, verifique...','N');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;
   
   BEGIN
      LFiarchivo := Text_IO.Fopen ('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\siabexcelpath.pth', 'r');

      IF Text_IO.Is_Open (LFiarchivo)
      THEN
         Text_IO.get_Line (LFiarchivo, L_PATH);
         Text_IO.fclose (LFiarchivo);
      END IF;
   EXCEPTION
      WHEN OTHERS
      THEN
         l_path := 'C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\';
   END;

   vc_filtro := 'Todos (*.*)|*.*|';
   vc_filtro := 'Archivos de Texto CSV (*.csv)|*.csv|';          --Archivo CSV
   --    vc_filtro := 'Archivos de MS Excel 4.0 (*.xls)|*.xls|';
   l_file := GET_FILE_NAME (File_Filter => vc_filtro, Directory_name => l_path);
   LFiarchivo := Text_IO.Fopen ('C:\SIABTMP\'||:GLOBAL.VG_DIRUSR||'\siabexcelpath.pth', 'w');
   Text_IO.Put_Line (LFiarchivo, L_PATH);
   Text_IO.fclose (LFiarchivo);

   BEGIN
      Win_Api_Utility.Copy_File (l_file,
                                 'C:\IMTMPSIAB\'||:GLOBAL.VG_DIRUSR||'\BIENESMASIVNUM.CSV',
                                 TRUE,
                                 TRUE);                                  
   EXCEPTION
      WHEN NO_DATA_FOUND
      THEN
         LIP_MENSAJE ('No se puede copiar el archivo de excel.', 'A');
         RAISE FORM_TRIGGER_FAILURE;
   END;
   PUP_CARGA_CSV;
END;

PROCEDURE PUP_CARGA_CSV IS
LST_ARCHIVO_DESTINO  VARCHAR2 (4000);
LFIARCHIVO           TEXT_IO.FILE_TYPE;
LST_CADENA           VARCHAR2 (4000);
VC_PANTALLA          VARCHAR2(100) := GET_APPLICATION_PROPERTY(CURRENT_FORM_NAME);
DI_DISPONIBLE        VARCHAR2(1);
DI_DISPNUME          VARCHAR2(1);
lv_ESTATUS           NUMBER;
lv_NO_BIEN           BIENES.NO_BIEN%TYPE;
BEGIN
 
   LST_ARCHIVO_DESTINO := 'C:\IMTMPSIAB\'||:GLOBAL.VG_DIRUSR||'\BIENESMASIVNUM.CSV';
   GO_BLOCK ('BLK_BIE_NUM_MASIV');
   CLEAR_BLOCK;
   FIRST_RECORD;
   
   LFIARCHIVO := TEXT_IO.FOPEN (LST_ARCHIVO_DESTINO, 'r');

   BEGIN
      LOOP
         TEXT_IO.GET_LINE (LFIARCHIVO, LST_CADENA);
         DI_DISPONIBLE := 'N';
         IF RTRIM(LTRIM(GETWORDCSV (LST_CADENA, 1))) <> 'BIEN' THEN
         	  lv_NO_BIEN := TO_NUMBER(RTRIM(LTRIM(GETWORDCSV (LST_CADENA, 1))));
            BEGIN
               SELECT COUNT(0)
                 INTO lv_ESTATUS
                 FROM bienes bie, estatus_x_pantalla EXP
                WHERE bie.estatus = EXP.estatus
                  AND EXP.cve_pantalla = VC_PANTALLA
                  AND EXP.proceso_ext_dom = bie.proceso_ext_dom
                  AND bie.no_bien = lv_NO_BIEN
                  AND bie.no_clasif_bien NOT IN (SELECT NO_CLASIF_BIEN
                                                   FROM CAT_SSSUBTIPO_BIEN
                                                  WHERE NO_TIPO = 7 AND NO_SUBTIPO = 1)	;
            EXCEPTION WHEN OTHERS THEN
            	lv_ESTATUS := 0;
            END;
            IF lv_ESTATUS > 0 THEN
            	 DI_DISPONIBLE := 'S';            	 
            ELSE DI_DISPONIBLE := 'N';                         	 
            END IF;
            DI_DISPNUME := PUP_VALIDANUME(lv_NO_BIEN);
            
            IF (DI_DISPNUME = 'S' AND di_disponible = 'S') OR (DI_DISPNUME = 'S' AND di_disponible = 'N')THEN
               LIP_MENSAJE('El bien consultado tambien puede ser convertido a numerario por valores y divisas.'||CHR(10)||'Verifique su tipo de conversión antes de continuar con el proceso.','A');
            END IF;
            
            IF :BLK_BIE_NUM_MASIV.NO_BIEN IS NOT NULL THEN
            	 CREATE_RECORD;
            END IF;
            
            --IF DI_DISPNUME = 'S' OR di_disponible = 'S' THEN	
 	             BEGIN
                   SELECT DESCRIPCION,VALOR_AVALUO,ESTATUS,IDENTIFICADOR,PROCESO_EXT_DOM   
                     INTO :BLK_BIE_NUM_MASIV.DESCRIPCION,:BLK_BIE_NUM_MASIV.VALOR_AVALUO,
                          :BLK_BIE_NUM_MASIV.DI_ESTATUS_BIEN,:BLK_BIE_NUM_MASIV.IDENTIFICADOR,:BLK_BIE_NUM_MASIV.PROCESO_EXT_DOM              
                     FROM BIENES
                    WHERE NO_BIEN = lv_NO_BIEN;
	             EXCEPTION
                     WHEN OTHERS THEN   
                     LIP_MENSAJE('Grave al obtener datos del estatus del bien WHEN-OTHERS','S');
	             END;
	             
	             :BLK_BIE_NUM_MASIV.NO_BIEN      := TO_NUMBER(RTRIM(LTRIM(GETWORDCSV (LST_CADENA, 1))));
               :BLK_BIE_NUM_MASIV.PRECIO_VENTA := TO_NUMBER(RTRIM(LTRIM(GETWORDCSV (LST_CADENA, 2))));
               :BLK_BIE_NUM_MASIV.IVAVTA       := :BLK_BIE_NUM_MASIV.PRECIO_VENTA * (TO_NUMBER(RTRIM(LTRIM(GETWORDCSV (LST_CADENA, 3))))/100);
               :BLK_BIE_NUM_MASIV.COMISION     := :BLK_BIE_NUM_MASIV.PRECIO_VENTA * (TO_NUMBER(RTRIM(LTRIM(GETWORDCSV (LST_CADENA, 4))))/100);
               :BLK_BIE_NUM_MASIV.IVACOM       := :BLK_BIE_NUM_MASIV.COMISION * (TO_NUMBER(RTRIM(LTRIM(GETWORDCSV (LST_CADENA, 5))))/100);
               :BLK_BIE_NUM_MASIV.IMPORTE      := :BLK_BIE_NUM_MASIV.COMISION * (TO_NUMBER(RTRIM(LTRIM(GETWORDCSV (LST_CADENA, 6))))/100);
               :BLK_BIE_NUM_MASIV.COMENTARIO   := RTRIM(LTRIM(GETWORDCSV (LST_CADENA, 7)));
               
            IF di_disponible = 'N' AND DI_DISPNUME = 'N' THEN
            --ELSIF di_disponible = 'N' AND DI_DISPNUME = 'N' THEN
            	:BLK_BIE_NUM_MASIV.DISPONIBLE := 'N';
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.NO_BIEN',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.DESCRIPCION',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.PRECIO_VENTA',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.IVAVTA',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.COMISION',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.IVACOM',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.IMPORTE',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.VALOR_AVALUO',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.DI_ESTATUS_BIEN',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.IDENTIFICADOR',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.PROCESO_EXT_DOM',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
            	SET_ITEM_INSTANCE_PROPERTY('BLK_BIE_NUM_MASIV.COMENTARIO',CURRENT_RECORD,VISUAL_ATTRIBUTE,'VA_NO_DISPONIBLE');
	            LIP_MENSAJE('Estatus, identificador o clasificador del bien: '||:BLK_BIE_NUM_MASIV.NO_BIEN||' inválido para cambio a numerario/valores y divisas','C');
            ELSE
            	 :BLK_BIE_NUM_MASIV.DISPONIBLE := 'S';
            END IF;
            
         END IF;        
      END LOOP;
   EXCEPTION WHEN NO_DATA_FOUND THEN
      TEXT_IO.FCLOSE (LFIARCHIVO);
   END;
   FIRST_RECORD;
END;



-------------------- todo apartir de aqui es cuando se da click en el botton convertir a numerario -----------------------------------------------------------------------------------------



IF :blk_toolbar.toolbar_escritura != 'S' THEN
	 LIP_MENSAJE('No tiene permiso de escritura para ejecutar el cambio de numerario','C');
	 RAISE FORM_TRIGGER_FAILURE;
END IF;		


/*IF :blk_bie.no_bien IS NULL AND :MASIVO = 'N' THEN
   LIP_MENSAJE('Debe especificar el bien que se quiere cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;
END IF;*/--VALIDA MASIVO LIRH

IF :blk_bie.no_bien IS NULL AND :MASIVO = 'N' THEN --VALIDA MASIVO LIRH

	 LIP_MENSAJE('Debe especificar el bien que se quiere cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;

ELSIF :BLK_BIE_NUM_MASIV.no_bien IS NULL AND :MASIVO = 'S' THEN --VALIDA MASIVO LIRH
--IF :blk_bie.no_bien IS NULL AND :MASIVO = 'N' THEN
	 LIP_MENSAJE('Debe cargar los bienes que desea cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;
ELSIF :blk_bie.no_bien IS NULL AND :BLK_BIE_NUM_MASIV.no_bien IS NULL THEN
	LIP_MENSAJE('No hay bienes para cambiar a numerario','S');
	 RAISE FORM_TRIGGER_FAILURE;
END IF;
/*IF :importevta IS NULL THEN
	LIP_MENSAJE('Debe especificar el importe para el numerario','S');
	GO_ITEM('ti_importe_new');
	RAISE FORM_TRIGGER_FAILURE;
END IF;*/
--***** 
IF :BLK_CONTROL.CHK_MOVBAN = 'SI' THEN
   IF :ti_banco_new IS NULL THEN
      LIP_MENSAJE('Debe especificar el banco','S');
      GO_ITEM('ti_banco_new');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;		
   IF :di_no_movimiento IS NULL THEN
      LIP_MENSAJE('No ha seleccionado debidamente del deposito que ampara el cambio a numerario','S');
      GO_ITEM('ti_importe_new');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;
END IF;
--*****
IF :BLK_CONTROL.TIPO_CONV IS NULL THEN
	LIP_MENSAJE('No ha seleccionado el tipo de conversión','S');
	GO_ITEM('BLK_CONTROL.TIPO_CONV');
	RAISE FORM_TRIGGER_FAILURE;
END IF;

---H---
/*IF :BLK_CONTROL.TIPO_CONV = 'CNE1' THEN 
	LIP_MENSAJE('Debe especificar el IVA','S');
	GO_ITEM('BLK_CONTROL.PORC1')
END IF;*/

IF :MASIVO = 'S' THEN --- NUMERARIO MASIVO LIRH 16012012
   GO_BLOCK('BLK_BIEN_GEN_MASIV');
   CLEAR_BLOCK(NO_VALIDATE);	 
   PUP_VALIDA_MASIV;
ELSE 
   IF :DI_MONEDA_NEW IS NULL AND PUP_VALIDANUME(:blk_bie.no_bien)= 'S' THEN
      LIP_MENSAJE('Debe especificar el tipo de moneda','S');									
      GO_ITEM('DI_MONEDA_NEW');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;																																		---CAMBIO DIVISAS

   IF (PUP_VALIDANUME(:blk_bie.no_bien)= 'S' AND :BLK_CONTROL.TIPO_CONV not in ('CNE','BBB')) OR 
      (PUP_VALIDANUME(:blk_bie.no_bien)= 'N' AND :BLK_CONTROL.TIPO_CONV = 'CNE') THEN
	    LIP_MENSAJE('El tipo de conversión seleccionado no es permitido para este bien.','S');
	    GO_ITEM('TIPO_CONV');
      RAISE FORM_TRIGGER_FAILURE;
   END IF;																																			---CAMBIO DIVISAS

   IF :importevta IS NULL OR :importevta=0 THEN 
	    IF LIF_MENSAJE_SI_NO('El nuevo bien se generara con un precio de venta de 1. ¿Desea continuar?') = 'S' THEN
		     IF LIF_MENSAJE_SI_NO('¿Seguro que desea cambiar el bien a numerario?') = 'S' THEN
	  --:importevta:=1;
   		      PUP_CREA_BIEN;
		     END IF;
	     ELSE
		     NULL;
	     END IF;
   ELSE
	   	IF LIF_MENSAJE_SI_NO('¿Seguro que desea cambiar el bien a numerario?') = 'S' THEN
		   PUP_CREA_BIEN;
		   END IF;
   END IF;

END IF;









PROCEDURE PUP_VALIDA_MASIV IS
BEGIN
   IF LIF_MENSAJE_SI_NO('¿Seguro que desea cambiar los bienes a numerario?') = 'S' THEN   
      GO_BLOCK('BLK_BIE_NUM_MASIV');
      FIRST_RECORD;
      LOOP    
         IF :BLK_BIE_NUM_MASIV.DISPONIBLE = 'S' THEN 	
            IF :DI_MONEDA_NEW IS NULL AND PUP_VALIDANUME(:BLK_BIE_NUM_MASIV.NO_BIEN)= 'S' THEN
               LIP_MENSAJE('Debe especificar el tipo de moneda.','S');
               RAISE FORM_TRIGGER_FAILURE;
            END IF;																																		---CAMBIO DIVISAS

            IF (PUP_VALIDANUME(:BLK_BIE_NUM_MASIV.NO_BIEN)= 'S' AND :BLK_CONTROL.TIPO_CONV not in ('CNE','BBB')) OR 
               (PUP_VALIDANUME(:BLK_BIE_NUM_MASIV.NO_BIEN)= 'N' AND :BLK_CONTROL.TIPO_CONV = 'CNE') THEN
	             LIP_MENSAJE('El tipo de conversión seleccionado no es permitido para este bien: '||:BLK_BIE_NUM_MASIV.NO_BIEN,'S');
               RAISE FORM_TRIGGER_FAILURE;
            END IF;																																			---CAMBIO DIVISAS

            IF :BLK_BIE_NUM_MASIV.PRECIO_VENTA IS NULL OR :BLK_BIE_NUM_MASIV.PRECIO_VENTA = 0 THEN 
         	     IF LIF_MENSAJE_SI_NO('El nuevo bien para el bien '||:BLK_BIE_NUM_MASIV.NO_BIEN||' se generara con un precio de venta de 1. ¿Desea continuar?') = 'N' THEN
		              LIP_MENSAJE('Agregue el precio de venta del bien '||:BLK_BIE_NUM_MASIV.NO_BIEN||' o elimine el registro...','C');   	        
		              RAISE FORM_TRIGGER_FAILURE;
	             END IF;      
            END IF;
            PUP_CREA_BIEN_MASIV(:BLK_BIE_NUM_MASIV.NO_BIEN);            
         END IF;
      GO_BLOCK('BLK_BIE_NUM_MASIV');
      EXIT WHEN :SYSTEM.LAST_RECORD = 'TRUE';
      NEXT_RECORD;      
      END LOOP;
--LIP_MENSAJE('FINAL :GLOBAL.P_BIEN_TRANS: '||:GLOBAL.P_BIEN_TRANS,'A');      
			IF :GLOBAL.P_BIEN_TRANS > 0 THEN
		   	LIP_MENSAJE('Proceso Terminado, no se generaron bienes hijos por ser de tipo Transferente','A');
		   	:GLOBAL.P_BIEN_TRANS := 0;		
		  ELSE
		  	LIP_MENSAJE('Proceso Terminado, verifique el detalle de los bienes generados','A');	
   		END IF;
   END IF;
   GO_BLOCK('BLK_BIEN_GEN_MASIV');
END;







FUNCTION PUP_VALIDANUME (V_BIEN NUMBER)
RETURN CHAR IS
DI_DISPNUME		CHAR(1);
vc_pantalla 	VARCHAR2(100) := GET_APPLICATION_PROPERTY(CURRENT_FORM_NAME);
BEGIN
  DI_DISPNUME := 'N';
  /*FOR reg1 IN	(SELECT 'S'
                 FROM BIENES
                WHERE NO_BIEN = :BLK_BIE.NO_BIEN
                  AND NO_CLASIF_BIEN 
                   IN (SELECT NO_CLASIF_BIEN
                         FROM CAT_SSSUBTIPO_BIEN
   	 	                  WHERE NO_TIPO = 7
                          --AND NO_SUBTIPO NOT IN (1,36))
                          AND NO_SUBTIPO IN (34,35))
                  AND PROCESO_EXT_DOM = :BLK_BIE.PROCESO_EXT_DOM)*/
                  
	FOR reg in (SELECT 'S'
                FROM BIENES BIE,
                     ESTATUS_X_PANTALLA EXP
               WHERE BIE.ESTATUS         = EXP.ESTATUS
                 AND EXP.CVE_PANTALLA    = vc_pantalla 
                 AND EXP.PROCESO_EXT_DOM = BIE.PROCESO_EXT_DOM
                 AND BIE.NO_BIEN         = V_BIEN
                 AND NO_CLASIF_BIEN IN (SELECT NO_CLASIF_BIEN
                                          FROM CAT_SSSUBTIPO_BIEN
   	 	                                   WHERE NO_TIPO = 7))
  /*FOR reg in (SELECT 'S'
                FROM BIENES BIE,
                     ESTATUS_X_PANTALLA EXP
               WHERE BIE.ESTATUS         = EXP.ESTATUS
                 AND EXP.CVE_PANTALLA    = vc_pantalla 
                 AND EXP.PROCESO_EXT_DOM IN ('DEVOLUCION','DECOMISO','ABANDONO')
                 AND BIE.NO_BIEN         = :BLK_BIE.NO_BIEN
                 AND NO_CLASIF_BIEN IN (SELECT NO_CLASIF_BIEN
                             							FROM CAT_SSSUBTIPO_BIEN
                            						 WHERE NO_TIPO = 7
                              						 AND NO_SUBTIPO = 35))*/
	LOOP
   	DI_DISPNUME := 'S';
    EXIT;
	END LOOP;
RETURN DI_DISPNUME;
END;











PROCEDURE PUP_CREA_BIEN IS
  vn_bien_new 			bienes.no_bien%TYPE;
  vc_pantalla 			VARCHAR2(100) := GET_APPLICATION_PROPERTY(CURRENT_FORM_NAME);
  v_clasif_bien			NUMBER;
	v_sumagasto				NUMBER := 0;
	vNO_MOVIMIENTO_n	MOVIMIENTOS_CUENTAS.NO_MOVIMIENTO%TYPE;
  v_importen        NUMBER := 0;
  v_importe         NUMBER := 0;
	v_importec        VARCHAR2(20);
	v_importenc       VARCHAR2(20);
  v_etiqueta_num    ETIQXCLASIF.NO_ETIQUETA%TYPE;
  v_impor						NUMBER :=0;
  v_tot_gasto			  NUMBER := 0;
  V_CMOVI						MOVIMIENTOS_CUENTAS.NO_MOVIMIENTO%TYPE;
  CONCIL						VARCHAR2(15);
  V_CREGI						MOVIMIENTOS_CUENTAS.NO_REGISTRO%TYPE;
  V_COMENTARIO			BIENES.DESCRIPCION%TYPE;
BEGIN
	--H--
	IF :blk_bie.importevta IS NULL or :blk_bie.importevta<=0 THEN
		:blk_bie.importevta:=1;
	END IF;
	
	IF :BLK_CONTROL.TIPO_CONV = 'CNE1' THEN
		:BLK_CONTROL.TIPO_CONV:='CNE';
	END IF;
	---------
	GO_BLOCK('BLK_CTR');
	FIRST_RECORD;
	IF :BLK_CTR.ID_GASTO IS NOT NULL THEN
		LOOP
			BEGIN
				v_sumagasto := NVL(v_sumagasto,0) + NVL(:BLK_CTR.IMPORTE,0);
			EXCEPTION	WHEN OTHERS THEN
                			NULL;
			END;
		  EXIT WHEN :system.Last_record = 'TRUE';
    	NEXT_RECORD; 
		END LOOP;	
	END IF;
	FOR reg IN (SELECT	estatus_final, estatus_nuevo_bien, accion, est.proceso_ext_dom
  	            FROM	estatus_x_pantalla est
  	           WHERE	est.cve_pantalla = vc_pantalla
  	             AND	est.estatus      = :blk_bie.estatus
  	             AND  est.identificador = :blk_bie.identificador
  	             AND  est.proceso_ext_dom  = :blk_bie.proceso_ext_dom) --AKCO 17/09/2009
  	             
	LOOP
--      IF :BLK_CONTROL.TIPO_CONV <> 'BBB' THEN
         /*v_importe := NVL(:blk_bie.importevta,0)+NVL(:blk_bie.ivavta,0);
         v_importen := NVL(v_importe,0)-(NVL(:blk_bie.comision,0)+NVL(:blk_bie.ivacom,0))-NVL(v_sumagasto,0);*/
         v_importe := NVL(:blk_bie.importevta,0)+NVL(:blk_bie.ivavta,0);
      	 --v_tot_gasto := NVL(v_sumagasto,0)+(NVL(:blk_bie.comision,0)+NVL(:blk_bie.ivacom,0));
      	 v_tot_gasto := NVL(v_sumagasto,0)+(NVL(:blk_bie.comision,0)+NVL(:blk_bie.ivacom,0)+NVL(:blk_bie.ivavta,0));--H--
         v_impor := :blk_bie.importevta;
         v_importen := NVL(v_importe,0)-(NVL(:blk_bie.comision,0)+NVL(:blk_bie.ivacom,0))-NVL(v_sumagasto,0);
         
         IF TRUNC(v_importe) <> v_importe THEN
            v_importec := RTRIM(LTRIM(TO_CHAR(v_importe,'999999999.99')));
         ELSE
            v_importec := RTRIM(LTRIM(TO_CHAR(v_importe,'999999999')));
         END IF;
         IF TRUNC(v_importen) <> v_importen THEN
            v_importenc := RTRIM(LTRIM(TO_CHAR(v_importen,'999999999.99')));
         ELSE
            v_importenc := RTRIM(LTRIM(TO_CHAR(v_importen,'999999999')));
         END IF;
         
         --LIP_MENSAJE (V_IMPOR||'    '||v_tot_gasto,'A');
     IF :BLK_BIE.IDENTIFICADOR!='TRANS' THEN
         begin
             SELECT seq_bienes.nextval
              INTO vn_bien_new
              FROM dual;
          end;
       END IF; 

IF :BLK_CONTROL.TIPO_CONV = 'BBB' THEN -- ALEDESMA SOLICITADO X GMURIAS
V_COMENTARIO := SUBSTR('PAGO PARCIAL POR SINIESTRO GENERANDO EL BIEN HIJO NO. '||TO_CHAR(vn_bien_new)||' CON ESTATUS '||:BLK_BIE.ESTATUS||', '||:BLK_CONTROL.COMENTARIO||' , '||:BLK_BIE.DESCRIPCION,1,1200);
         UPDATE BIENES													-- Actualizacion del bien en su estatus al mismo
            SET ESTATUS = :BLK_BIE.ESTATUS,
                DESCRIPCION = V_COMENTARIO,
                val40 = :BLK_CONTROL.di_moneda_new,
                val41 = v_importec,
                val42 = v_importenc,
                val43 = :ti_banco_new,
                val44 = TO_CHAR(:ti_fecha_new,'dd-mm-yyyy'),
                val45 = :BLK_CONTROL.di_cuenta_new,
                val46 = :blk_bie.importevta,
                val47 = :blk_bie.ivavta,
                val48 = :blk_bie.comision,
                val49 = :blk_bie.ivacom,
                val50 = v_sumagasto,
                proceso_ext_dom = reg.proceso_ext_dom --AKCO 17/09/09
          WHERE NO_BIEN = :blk_bie.no_bien;
         INSERT INTO historico_estatus_bien 			-- Insertar en el historico el cambio de estatus de este bien
         (no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus, proceso_ext_dom)--AKCO 17/09/09
         VALUES          			
         (:blk_bie.no_bien,:BLK_BIE.ESTATUS,sysdate,:toolbar_usuario,'Cambio numerario', vc_pantalla, reg.proceso_ext_dom); --AKCO 17/09/09


ELSIF :BLK_CONTROL.TIPO_CONV = 'CNR' THEN
	
	 V_COMENTARIO :=  SUBSTR(:BLK_BIE.DESCRIPCION,1,1250);    
     begin
         UPDATE BIENES                                                    -- Actualizacion del bien A CNR
            SET ESTATUS = :BLK_CONTROL.TIPO_CONV,
                DESCRIPCION = V_COMENTARIO,
                val40 = :BLK_CONTROL.di_moneda_new,
                val41 = v_importec,
                val42 = v_importenc,
                val43 = :ti_banco_new,
                val44 = TO_CHAR(:ti_fecha_new,'dd-mm-yyyy'),
                val45 = :BLK_CONTROL.di_cuenta_new,
                val46 = :blk_bie.importevta,
                val47 = :blk_bie.ivavta,
                val48 = :blk_bie.comision,
                val49 = :blk_bie.ivacom,
                val50 = v_sumagasto,
                proceso_ext_dom = reg.proceso_ext_dom --AKCO 17/09/09
          WHERE NO_BIEN = :blk_bie.no_bien;
           INSERT INTO historico_estatus_bien             -- Insertar en el historico el cambio de estatus de este bien
         --(no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus)
         (no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus, proceso_ext_dom)--AKCO 17/09/09
         VALUES                      
         --(:blk_bie.no_bien,:BLK_CONTROL.TIPO_CONV,sysdate,:toolbar_usuario,'Cambio numerario', vc_pantalla);
         (:blk_bie.no_bien,:BLK_CONTROL.TIPO_CONV,sysdate,:toolbar_usuario,'Cambio numerario', vc_pantalla, reg.proceso_ext_dom); --AKCO 17/09/09
     lip_commit_silencioso;
     LIP_MENSAJE('Proceso Terminado, no se generó numerario por ser un bien Transferente','A');
      exception when others then
         LIP_MENSAJE('sqlerrm','A');
          raise form_trigger_failure;
        end;  


ELSE

	V_COMENTARIO := SUBSTR('CONV. A NUM. GENERANDO EL BIEN HIJO NO. '||TO_CHAR(vn_bien_new)||' '||:blk_bie.descripcion,1,1250);	
         UPDATE BIENES													-- Actualizacion del bien anterior a el estatus CNE
            SET ESTATUS = :BLK_CONTROL.TIPO_CONV,
                DESCRIPCION = V_COMENTARIO,
                val40 = :BLK_CONTROL.di_moneda_new,
                val41 = v_importec,
                val42 = v_importenc,
                val43 = :ti_banco_new,
                val44 = TO_CHAR(:ti_fecha_new,'dd-mm-yyyy'),
                val45 = :BLK_CONTROL.di_cuenta_new,
                val46 = :blk_bie.importevta,
                val47 = :blk_bie.ivavta,
                val48 = :blk_bie.comision,
                val49 = :blk_bie.ivacom,
                val50 = v_sumagasto,
                proceso_ext_dom = reg.proceso_ext_dom --AKCO 17/09/09
          WHERE NO_BIEN = :blk_bie.no_bien;
          
         INSERT INTO historico_estatus_bien 			-- Insertar en el historico el cambio de estatus de este bien
         --(no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus)
         (no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus, proceso_ext_dom)--AKCO 17/09/09
         VALUES          			
         --(:blk_bie.no_bien,:BLK_CONTROL.TIPO_CONV,sysdate,:toolbar_usuario,'Cambio numerario', vc_pantalla);
         (:blk_bie.no_bien,:BLK_CONTROL.TIPO_CONV,sysdate,:toolbar_usuario,'Cambio numerario', vc_pantalla, reg.proceso_ext_dom); --AKCO 17/09/09





END IF;     
         IF :blk_bie.identificador <> 'TRANS' THEN
            :blk_bie.cantidad :=1;
            
            --IF :BLK_BIE.DI_MONEDA_NEW = 'MN' THEN
            IF :BLK_CONTROL.DI_MONEDA_NEW = 'MN' AND PUP_VALIDANUME(:blk_bie.no_bien)= 'N' THEN
               v_clasif_bien := 1424;
            ELSE
               v_clasif_bien := 1426;
            END IF;
            
            IF :BLK_CONTROL.TIPO_CONV= 'CNE' THEN --H--
               v_clasif_bien := 1427;
            END IF;
            
begin
            SELECT MIN(NO_ETIQUETA)
              INTO v_etiqueta_num
              FROM ETIQXCLASIF
             WHERE no_clasif_bien = v_clasif_bien;
end;             
            INSERT INTO bienes 	-- Insertar el nuevo bien, el bien numerario
            (no_bien,					descripcion,					   no_exp_asociado,						
            val1,							val2,									   val3, 							no_clasif_bien,
            no_expediente,     no_bien_referencia,		   valor_avaluo, 			estatus,            	
            cantidad,					val4,									   val5,              val6,									
            no_delegacion,  		no_subdelegacion,   	   identificador,			val9,
            val10,							val11,								   val12,							val13,
            cve_moneda_avaluo, no_etiqueta,             no_volante,        unidad,
            proceso_ext_dom-- AKCO 17/09/09
            )      
            VALUES 
            (vn_bien_new,SUBSTR('CONV. A NUM. DEL BIEN '||TO_CHAR(:blk_bie.no_bien)||' '||:blk_bie.descripcion,1,1250), :blk_bie.no_exp_asociado,	
            :BLK_CONTROL.di_moneda_new, v_impor,	              :BLK_CONTROL.ti_ficha_new,	             v_clasif_bien,
            :blk_bie.no_expediente, :blk_bie.no_bien,          v_importec,                          reg.estatus_nuevo_bien,
            1 ,	     :ti_banco_new,				     TO_CHAR(:ti_fecha_new,'dd-mm-yyyy'), :BLK_CONTROL.di_cuenta_new,
            :blk_bie.no_delegacion, :blk_bie.no_subdelegacion, :blk_bie.identificador,              :blk_bie.importevta,
            :blk_bie.ivavta,		     :blk_bie.comision,		      :blk_bie.ivacom,			               v_tot_gasto,
            :BLK_CONTROL.di_moneda_new, v_etiqueta_num,            :blk_bie.no_volante,                 'PIEZA',
            reg.proceso_ext_dom -- AKCO 17/09/09
            );
            
          ----H---  
           BEGIN 
           IF 		:ti_fecha_new 	IS NOT NULL 
           		AND	:ti_banco_new IS NOT NULL 
           		AND	:BLK_CONTROL.di_cuenta_new IS NOT NULL 
           		AND	:BLK_CONTROL.di_moneda_new  IS NOT NULL 	
           THEN
           		BEGIN
            		SELECT  MOV.NO_MOVIMIENTO, MOV.NO_REGISTRO
         								INTO		V_CMOVI,V_CREGI
												FROM    movimientos_cuentas mov, cuentas_bancarias   cta 
												WHERE   MOV.fec_movimiento = :ti_fecha_new
												AND     MOV.DEPOSITO = :blk_bie.importevta
												AND     cta.cve_banco = :ti_banco_new
												AND     cta.cve_cuenta = :BLK_CONTROL.di_cuenta_new
												AND     cta.cve_moneda = :BLK_CONTROL.di_moneda_new
												AND     MOV.NO_BIEN IS NULL;
								EXCEPTION
  									WHEN NO_DATA_FOUND THEN
  										V_CMOVI:=NULL;						
								END;						
							
							IF V_CMOVI IS NOT NULL THEN
								  UPDATE	MOVIMIENTOS_CUENTAS 
									SET			NO_BIEN =vn_bien_new, NO_EXPEDIENTE=:blk_bie.no_expediente
									WHERE		NO_MOVIMIENTO = V_CMOVI
									AND			NO_REGISTRO = V_CREGI;
									CONCIL:='CONCILIADO';
							END IF;
           END IF;
           END;
					----------------		

            INSERT INTO historico_estatus_bien -- inserta en el historico el nuevo bien
            --(no_bien,			estatus,	fec_cambio, usuario_cambio, 	motivo_cambio,			programa_cambio_estatus)
            (no_bien, estatus, fec_cambio, usuario_cambio, motivo_cambio, programa_cambio_estatus, proceso_ext_dom)--AKCO 17/09/09
            VALUES 
            --(vn_bien_new, reg.estatus_nuevo_bien,		sysdate,	:toolbar_usuario, 'Cambio numerario', vc_pantalla);
            (vn_bien_new, reg.estatus_nuevo_bien,		sysdate,	:toolbar_usuario, 'Cambio numerario', vc_pantalla, reg.proceso_ext_dom); --AKCO 17/09/09

            INSERT INTO cambio_numerario
            (no_bien_original, 	no_bien_numerario, 	usuario, 					fec_cambio, 	estatus_final, 		estatus_nuevo_bien) 
            VALUES 
            (:blk_bie.no_bien,	vn_bien_new,				:toolbar_usuario,	SYSDATE,:BLK_CONTROL.TIPO_CONV,reg.estatus_nuevo_bien);
           
--
            -- copia registro de relación de documentos -- JAC 231208 --

            INSERT INTO BIENES_REL_DOCUMS (NO_BIEN,ACTA_ACIRDES,ACTA_ACIRDEV,ACTA_ACIRVEN,
                                           ACTA_ACTCIRCU,ACTA_CONSENTR,ACTA_CONSVEN,ACTA_CONVERSION,
                                           ACTA_DECOMISO,ACTA_DESTINO,ACTA_DESTRUCCION,ACTA_DEVOLUCION,
                                           ACTA_DONACION,ACTA_ENTREGA,ACTA_EVENCOMER,ACTA_EVENDEST,
                                           ACTA_EVENDEV,ACTA_EVENDON,ACTA_EVENTREC,ACTA_POSESION_3R,
                                           ACTA_RECEPCAN,ACTA_SUSPENSION,COMER_LOTE,OFIC_DESAHOGO,
                                           DICTA_ABANDONO,DICTA_DECOMISO,DICTA_DESTINO,DICTA_DESTRUCCION,
                                           DICTA_DEVOLUCION,DICTA_DONACION,DICTA_PROCEDENCIA,DICTA_RESARCIMIENTO,
                                           DON_SOLICITUD)
            SELECT vn_bien_new,ACTA_ACIRDES,ACTA_ACIRDEV,ACTA_ACIRVEN,
                   ACTA_ACTCIRCU,ACTA_CONSENTR,ACTA_CONSVEN,ACTA_CONVERSION,
                   ACTA_DECOMISO,ACTA_DESTINO,ACTA_DESTRUCCION,ACTA_DEVOLUCION,
                   ACTA_DONACION,ACTA_ENTREGA,ACTA_EVENCOMER,ACTA_EVENDEST,
                   ACTA_EVENDEV,ACTA_EVENDON,ACTA_EVENTREC,ACTA_POSESION_3R,
                   ACTA_RECEPCAN,ACTA_SUSPENSION,COMER_LOTE,OFIC_DESAHOGO,
                   DICTA_ABANDONO,DICTA_DECOMISO,DICTA_DESTINO,DICTA_DESTRUCCION,
                   DICTA_DEVOLUCION,DICTA_DONACION,DICTA_PROCEDENCIA,DICTA_RESARCIMIENTO,
                   DON_SOLICITUD
              FROM BIENES_REL_DOCUMS
             WHERE NO_BIEN = :blk_bie.no_bien;                         
            
             -----
            LIP_COMMIT_SILENCIOSO;
         IF :blk_bie.identificador <> 'TRANS' THEN
            LIP_MENSAJE('Proceso Terminado, No. de Bien Generado: '||vn_bien_new||' '||CONCIL,'A');      
         ELSE
            LIP_MENSAJE('Proceso Terminado, no se generó numerario por ser un bien Transferente','A');
         END IF;
 	END IF;
 	END LOOP;
--exit_form;
 		EXCEPTION
         	WHEN OTHERS THEN
         	LIP_MENSAJE(SQLERRM,'A');
END;












PROCEDURE PUP_CREA_BIEN_MASIV (P_BIEN NUMBER)IS
  VN_BIEN_NEW       BIENES.NO_BIEN%TYPE;
  VC_PANTALLA       VARCHAR2(100) := GET_APPLICATION_PROPERTY(CURRENT_FORM_NAME);
  V_CLASIF_BIEN     NUMBER;
  V_SUMAGASTO       NUMBER := 0;
  VNO_MOVIMIENTO_N  MOVIMIENTOS_CUENTAS.NO_MOVIMIENTO%TYPE;
  V_IMPORTEN        NUMBER := 0;
  V_IMPORTE         NUMBER := 0;
  V_IMPORTEC        VARCHAR2(20);
  V_IMPORTENC       VARCHAR2(20);
  V_ETIQUETA_NUM    ETIQXCLASIF.NO_ETIQUETA%TYPE;
  V_IMPOR           NUMBER :=0;
  V_TOT_GASTO       NUMBER := 0;
  V_CMOVI           MOVIMIENTOS_CUENTAS.NO_MOVIMIENTO%TYPE;
  CONCIL            VARCHAR2(15);
  V_CREGI           MOVIMIENTOS_CUENTAS.NO_REGISTRO%TYPE;
  V_COMENTARIO      BIENES.DESCRIPCION%TYPE;
BEGIN
    --H--
    IF :BLK_BIE_NUM_MASIV.PRECIO_VENTA IS NULL OR :BLK_BIE_NUM_MASIV.PRECIO_VENTA <= 0 THEN
       :BLK_BIE_NUM_MASIV.PRECIO_VENTA := 1;
    END IF;
    
    IF :BLK_CONTROL.TIPO_CONV = 'CNE1' THEN
       :BLK_CONTROL.TIPO_CONV:='CNE';
    END IF;
    ---------
    /*GO_BLOCK('BLK_CTR');
    FIRST_RECORD;
    IF :BLK_CTR.ID_GASTO IS NOT NULL THEN
        LOOP
            BEGIN
                v_sumagasto := NVL(v_sumagasto,0) + NVL(:BLK_CTR.IMPORTE,0);
            EXCEPTION    WHEN OTHERS THEN
                            NULL;
            END;
          EXIT WHEN :system.Last_record = 'TRUE';
        NEXT_RECORD; 
        END LOOP;    
    END IF;*/
    FOR REG IN (SELECT  ESTATUS_FINAL, ESTATUS_NUEVO_BIEN, ACCION, EST.PROCESO_EXT_DOM
                  FROM  ESTATUS_X_PANTALLA EST, BIENES B
                 WHERE  EST.CVE_PANTALLA = VC_PANTALLA                                  
                   AND  EST.ESTATUS      = B.ESTATUS                 
                   AND  EST.IDENTIFICADOR = B.IDENTIFICADOR
                   AND  EST.PROCESO_EXT_DOM  = B.PROCESO_EXT_DOM
                   AND  NO_BIEN = P_BIEN) 
                   
    LOOP
         V_SUMAGASTO := NVL(:BLK_BIE_NUM_MASIV.IMPORTE,0);
         V_IMPORTE := NVL(:BLK_BIE_NUM_MASIV.PRECIO_VENTA,0)+NVL(:BLK_BIE_NUM_MASIV.IVAVTA,0);           
         V_TOT_GASTO := NVL(V_SUMAGASTO,0)+(NVL(:BLK_BIE_NUM_MASIV.COMISION,0)+NVL(:BLK_BIE_NUM_MASIV.IVACOM,0)+NVL(:BLK_BIE_NUM_MASIV.IVAVTA,0));
         V_IMPOR := :BLK_BIE_NUM_MASIV.PRECIO_VENTA;
         V_IMPORTEN := NVL(V_IMPORTE,0)-(NVL(:BLK_BIE_NUM_MASIV.COMISION,0)+NVL(:BLK_BIE_NUM_MASIV.IVACOM,0))-NVL(V_SUMAGASTO,0);
--LIP_MENSAJE('IMPORTE: '||V_IMPORTE||' COM: '||:BLK_BIE_NUM_MASIV.COMISION||' IVACOM: '||:BLK_BIE_NUM_MASIV.IVACOM||' GAST: '||V_SUMAGASTO,'A');
--LIP_MENSAJE('1','A');         
         IF TRUNC(V_IMPORTE) <> V_IMPORTE THEN
            V_IMPORTEC := RTRIM(LTRIM(TO_CHAR(V_IMPORTE,'999999999.99')));
         ELSE
            V_IMPORTEC := RTRIM(LTRIM(TO_CHAR(V_IMPORTE,'999999999')));
         END IF;
         
         IF TRUNC(V_IMPORTEN) <> V_IMPORTEN THEN
            V_IMPORTENC := RTRIM(LTRIM(TO_CHAR(V_IMPORTEN,'999999999.99')));
         ELSE
            V_IMPORTENC := RTRIM(LTRIM(TO_CHAR(V_IMPORTEN,'999999999')));
         END IF;
         
         --LIP_MENSAJE (V_IMPOR||'    '||v_tot_gasto,'A');
         BEGIN
            SELECT SEQ_BIENES.NEXTVAL
              INTO VN_BIEN_NEW
              FROM DUAL;
         END;
--LIP_MENSAJE('2.- NEW BIEN: '||VN_BIEN_NEW,'A');
         IF :BLK_CONTROL.TIPO_CONV = 'BBB' THEN 
--LIP_MENSAJE('3','A');             
             
             	IF :BLK_BIE_NUM_MASIV.IDENTIFICADOR = 'TRANS' THEN --Se agregó el IF para que verifique que los bienes de tipo Tranferente, cambiado a numerario no se modifica la descripcion del bien. JESUS_PH, 10/10/2012.
								V_COMENTARIO := SUBSTR(:BLK_BIE_NUM_MASIV.DESCRIPCION,1,1250); 
								:GLOBAL.P_BIEN_TRANS := :GLOBAL.P_BIEN_TRANS + 1;
             	ELSE
             		V_COMENTARIO := SUBSTR('PAGO PARCIAL POR SINIESTRO GENERANDO EL BIEN HIJO NO. '||TO_CHAR(VN_BIEN_NEW)||' CON ESTATUS '||:BLK_BIE_NUM_MASIV.DI_ESTATUS_BIEN||', '||:BLK_BIE_NUM_MASIV.COMENTARIO||' , '||:BLK_BIE_NUM_MASIV.DESCRIPCION,1,1200);
             	END IF;
                           
              BEGIN
                 UPDATE BIENES                                                    -- Actualizacion del bien en su estatus al mismo
                    SET ESTATUS = :BLK_BIE_NUM_MASIV.DI_ESTATUS_BIEN,
                        DESCRIPCION = V_COMENTARIO,
                        VAL40 = :BLK_CONTROL.DI_MONEDA_NEW,
                        VAL41 = V_IMPORTEC,
                        VAL42 = V_IMPORTENC,
                        VAL43 = :TI_BANCO_NEW,
                        VAL44 = TO_CHAR(:TI_FECHA_NEW,'dd-mm-yyyy'),
                        VAL45 = :BLK_CONTROL.DI_CUENTA_NEW,
                        VAL46 = :BLK_BIE_NUM_MASIV.PRECIO_VENTA,
                        VAL47 = :BLK_BIE_NUM_MASIV.IVAVTA,
                        VAL48 = :BLK_BIE_NUM_MASIV.COMISION,
                        VAL49 = :BLK_BIE_NUM_MASIV.IVACOM,
                        VAL50 = V_SUMAGASTO,
                        PROCESO_EXT_DOM = REG.PROCESO_EXT_DOM 
                  WHERE NO_BIEN = P_BIEN;
               
                 INSERT INTO HISTORICO_ESTATUS_BIEN             -- Insertar en el historico el cambio de estatus de este bien
                    (NO_BIEN, ESTATUS, FEC_CAMBIO, USUARIO_CAMBIO, MOTIVO_CAMBIO, PROGRAMA_CAMBIO_ESTATUS, PROCESO_EXT_DOM)--AKCO 17/09/09
                 VALUES                      
                    (P_BIEN,:BLK_BIE_NUM_MASIV.DI_ESTATUS_BIEN,SYSDATE,:TOOLBAR_USUARIO,'Cambio numerario', VC_PANTALLA, REG.PROCESO_EXT_DOM); --AKCO 17/09/09
              EXCEPTION
               WHEN OTHERS THEN
                  LIP_MENSAJE('1- '||SQLERRM,'S');
                  RAISE FORM_TRIGGER_FAILURE;
              END;
 
         ELSE
--LIP_MENSAJE('4','A');
             							
							IF :BLK_BIE_NUM_MASIV.IDENTIFICADOR = 'TRANS' THEN --Se agregó el IF para que verifique que los bienes de tipo Tranferente, cambiado a numerario no se modifica la descripcion del bien. JESUS_PH, 10/10/2012.
								V_COMENTARIO := SUBSTR(:BLK_BIE_NUM_MASIV.DESCRIPCION,1,1250);
								:GLOBAL.P_BIEN_TRANS := :GLOBAL.P_BIEN_TRANS + 1;
             	ELSE
             		V_COMENTARIO := SUBSTR('CONV. A NUM. GENERANDO EL BIEN HIJO NO. '||TO_CHAR(VN_BIEN_NEW)||' '||:BLK_BIE_NUM_MASIV.DESCRIPCION,1,1250);    
             	END IF;
--LIP_MENSAJE('V_COMENTARIO:  '||V_COMENTARIO,'A');
--LIP_MENSAJE(':GLOBAL.P_BIEN_TRANS:  '||:GLOBAL.P_BIEN_TRANS,'A');			
--LIP_MENSAJE(':BLK_CONTROL.TIPO_CONV: '||:BLK_CONTROL.TIPO_CONV,'A');				              
              BEGIN
                 UPDATE BIENES                                                    -- Actualizacion del bien anterior a el estatus CNE
                    SET ESTATUS = :BLK_CONTROL.TIPO_CONV,
                        DESCRIPCION = V_COMENTARIO,
                        VAL40 = :BLK_CONTROL.DI_MONEDA_NEW,
                        VAL41 = V_IMPORTEC,
                        VAL42 = V_IMPORTENC,
                        VAL43 = :TI_BANCO_NEW,
                        VAL44 = TO_CHAR(:TI_FECHA_NEW,'dd-mm-yyyy'),
                        VAL45 = :BLK_CONTROL.DI_CUENTA_NEW,
                        VAL46 = :BLK_BIE_NUM_MASIV.PRECIO_VENTA,
                        VAL47 = :BLK_BIE_NUM_MASIV.IVAVTA,
                        VAL48 = :BLK_BIE_NUM_MASIV.COMISION,
                        VAL49 = :BLK_BIE_NUM_MASIV.IVACOM,
                        VAL50 = V_SUMAGASTO,
                        PROCESO_EXT_DOM = REG.PROCESO_EXT_DOM 
                  WHERE NO_BIEN = P_BIEN;
              
                 INSERT INTO HISTORICO_ESTATUS_BIEN             -- Insertar en el historico el cambio de estatus de este bien
                    (NO_BIEN, ESTATUS, FEC_CAMBIO, USUARIO_CAMBIO, MOTIVO_CAMBIO, PROGRAMA_CAMBIO_ESTATUS, PROCESO_EXT_DOM)--AKCO 17/09/09
                 VALUES                      
                    (P_BIEN,:BLK_CONTROL.TIPO_CONV,SYSDATE,:TOOLBAR_USUARIO,'Cambio numerario', VC_PANTALLA, REG.PROCESO_EXT_DOM); --AKCO 17/09/09
              EXCEPTION
               WHEN OTHERS THEN
                  LIP_MENSAJE('2- '||SQLERRM,'S');
                  RAISE FORM_TRIGGER_FAILURE;
              END;
              LIP_COMMIT_SILENCIOSO;              
--LIP_MENSAJE('5','A');
         END IF;     
        
         IF :BLK_BIE_NUM_MASIV.IDENTIFICADOR <> 'TRANS' THEN
           -- :BLK_BIE_NUM_MASIV.CANTIDAD :=1;
            
            IF :BLK_CONTROL.DI_MONEDA_NEW = 'MN' AND PUP_VALIDANUME(:BLK_BIE_NUM_MASIV.NO_BIEN)= 'N' THEN
               V_CLASIF_BIEN := 1424;
            ELSE
               V_CLASIF_BIEN := 1426;
            END IF;
            
            IF :BLK_CONTROL.TIPO_CONV= 'CNE' THEN 
               V_CLASIF_BIEN := 1427;
            END IF;
            
            BEGIN
                SELECT MIN(NO_ETIQUETA)
                  INTO V_ETIQUETA_NUM
                  FROM ETIQXCLASIF
                 WHERE NO_CLASIF_BIEN = V_CLASIF_BIEN;
            END;             
--LIP_MENSAJE('6','A');            
            BEGIN
               INSERT INTO BIENES     -- Insertar el nuevo bien, el bien numerario
               (NO_BIEN,          DESCRIPCION,          NO_EXP_ASOCIADO,                
               VAL1,              VAL2,                 VAL3,              NO_CLASIF_BIEN,
               NO_EXPEDIENTE,     NO_BIEN_REFERENCIA,   VALOR_AVALUO,      ESTATUS,                
               CANTIDAD,          VAL4,                 VAL5,              VAL6,                                    
               NO_DELEGACION,     NO_SUBDELEGACION,     IDENTIFICADOR,     VAL9,
               VAL10,             VAL11,                VAL12,             VAL13,
               CVE_MONEDA_AVALUO, NO_ETIQUETA,          NO_VOLANTE,        UNIDAD,
               PROCESO_EXT_DOM
               ) 
               (SELECT VN_BIEN_NEW,SUBSTR('CONV. A NUM. DEL BIEN '||TO_CHAR(NO_BIEN)||' '||DESCRIPCION,1,1250),   NO_EXP_ASOCIADO,    
               :BLK_CONTROL.DI_MONEDA_NEW, V_IMPOR,                          :BLK_CONTROL.TI_FICHA_NEW,           V_CLASIF_BIEN,
               NO_EXPEDIENTE,              NO_BIEN,                          V_IMPORTEC,                          REG.ESTATUS_NUEVO_BIEN,
               1 ,                         :TI_BANCO_NEW,                    TO_CHAR(:TI_FECHA_NEW,'dd-mm-yyyy'), :BLK_CONTROL.DI_CUENTA_NEW,
               NO_DELEGACION,              NO_SUBDELEGACION,                 IDENTIFICADOR,                       :BLK_BIE_NUM_MASIV.PRECIO_VENTA,
               :BLK_BIE_NUM_MASIV.IVAVTA,  :BLK_BIE_NUM_MASIV.COMISION,      :BLK_BIE_NUM_MASIV.IVACOM,           V_TOT_GASTO,
               :BLK_CONTROL.DI_MONEDA_NEW, V_ETIQUETA_NUM,                   NO_VOLANTE,                          'PIEZA',
               REG.PROCESO_EXT_DOM FROM BIENES WHERE NO_BIEN = P_BIEN);
            EXCEPTION
               WHEN OTHERS THEN
                  LIP_MENSAJE('3- '||SQLERRM,'S');
                  RAISE FORM_TRIGGER_FAILURE;
            END;
--LIP_MENSAJE('7','A');            
          /*
            BEGIN 
               IF :TI_FECHA_NEW     IS NOT NULL
                  AND    :TI_BANCO_NEW IS NOT NULL 
                  AND    :BLK_CONTROL.DI_CUENTA_NEW IS NOT NULL 
                  AND    :BLK_CONTROL.DI_MONEDA_NEW  IS NOT NULL     
               THEN
                   BEGIN
                      SELECT  MOV.NO_MOVIMIENTO, MOV.NO_REGISTRO
                        INTO  V_CMOVI,V_CREGI
                        FROM  MOVIMIENTOS_CUENTAS MOV, CUENTAS_BANCARIAS   CTA 
                       WHERE  MOV.FEC_MOVIMIENTO = :TI_FECHA_NEW
                         AND  MOV.DEPOSITO = :BLK_BIE.IMPORTEVTA
                         AND  CTA.CVE_BANCO = :TI_BANCO_NEW
                         AND  CTA.CVE_CUENTA = :BLK_CONTROL.DI_CUENTA_NEW
                         AND  CTA.CVE_MONEDA = :BLK_CONTROL.DI_MONEDA_NEW
                         AND  MOV.NO_BIEN IS NULL;
                   EXCEPTION
                      WHEN NO_DATA_FOUND THEN
                          V_CMOVI:=NULL;                        
                   END;                        
                                
                   IF V_CMOVI IS NOT NULL THEN
                      UPDATE MOVIMIENTOS_CUENTAS 
                         SET NO_BIEN =VN_BIEN_NEW, NO_EXPEDIENTE=:BLK_BIE.NO_EXPEDIENTE
                       WHERE NO_MOVIMIENTO = V_CMOVI
                         AND NO_REGISTRO = V_CREGI;
                      CONCIL:='CONCILIADO';
                   END IF;
               END IF;
           END;
                    ----------------*/       
            BEGIN
               INSERT INTO HISTORICO_ESTATUS_BIEN -- inserta en el historico el nuevo bien
                  (NO_BIEN, ESTATUS, FEC_CAMBIO, USUARIO_CAMBIO, MOTIVO_CAMBIO, PROGRAMA_CAMBIO_ESTATUS, PROCESO_EXT_DOM)--AKCO 17/09/09
               VALUES                
                  (VN_BIEN_NEW, REG.ESTATUS_NUEVO_BIEN,        SYSDATE,    :TOOLBAR_USUARIO, 'Cambio numerario', VC_PANTALLA, REG.PROCESO_EXT_DOM); --AKCO 17/09/09
--LIP_MENSAJE('8','A');
               INSERT INTO CAMBIO_NUMERARIO
                  (NO_BIEN_ORIGINAL,     NO_BIEN_NUMERARIO,     USUARIO,                     FEC_CAMBIO,     ESTATUS_FINAL,         ESTATUS_NUEVO_BIEN) 
               VALUES 
                  (P_BIEN,    VN_BIEN_NEW,                :TOOLBAR_USUARIO,    SYSDATE,:BLK_CONTROL.TIPO_CONV,REG.ESTATUS_NUEVO_BIEN);
--LIP_MENSAJE('9','A');
           EXCEPTION
               WHEN OTHERS THEN
                  LIP_MENSAJE('4- '||SQLERRM,'S');
                  RAISE FORM_TRIGGER_FAILURE;
              END;
            -- copia registro de relación de documentos -- JAC 231208 --
            
            BEGIN
               INSERT INTO BIENES_REL_DOCUMS (NO_BIEN,ACTA_ACIRDES,ACTA_ACIRDEV,ACTA_ACIRVEN,
                                             ACTA_ACTCIRCU,ACTA_CONSENTR,ACTA_CONSVEN,ACTA_CONVERSION,
                                             ACTA_DECOMISO,ACTA_DESTINO,ACTA_DESTRUCCION,ACTA_DEVOLUCION,
                                             ACTA_DONACION,ACTA_ENTREGA,ACTA_EVENCOMER,ACTA_EVENDEST,
                                             ACTA_EVENDEV,ACTA_EVENDON,ACTA_EVENTREC,ACTA_POSESION_3R,
                                             ACTA_RECEPCAN,ACTA_SUSPENSION,COMER_LOTE,OFIC_DESAHOGO,
                                             DICTA_ABANDONO,DICTA_DECOMISO,DICTA_DESTINO,DICTA_DESTRUCCION,
                                             DICTA_DEVOLUCION,DICTA_DONACION,DICTA_PROCEDENCIA,DICTA_RESARCIMIENTO,
                                             DON_SOLICITUD)
               SELECT VN_BIEN_NEW,ACTA_ACIRDES,ACTA_ACIRDEV,ACTA_ACIRVEN,
                      ACTA_ACTCIRCU,ACTA_CONSENTR,ACTA_CONSVEN,ACTA_CONVERSION,
                      ACTA_DECOMISO,ACTA_DESTINO,ACTA_DESTRUCCION,ACTA_DEVOLUCION,
                      ACTA_DONACION,ACTA_ENTREGA,ACTA_EVENCOMER,ACTA_EVENDEST,
                      ACTA_EVENDEV,ACTA_EVENDON,ACTA_EVENTREC,ACTA_POSESION_3R,
                      ACTA_RECEPCAN,ACTA_SUSPENSION,COMER_LOTE,OFIC_DESAHOGO,
                      DICTA_ABANDONO,DICTA_DECOMISO,DICTA_DESTINO,DICTA_DESTRUCCION,
                      DICTA_DEVOLUCION,DICTA_DONACION,DICTA_PROCEDENCIA,DICTA_RESARCIMIENTO,
                      DON_SOLICITUD
                 FROM BIENES_REL_DOCUMS
                WHERE NO_BIEN = P_BIEN;                         
--LIP_MENSAJE('10','A');            
               EXCEPTION
               WHEN OTHERS THEN
                  LIP_MENSAJE('5- '||SQLERRM,'S');
                  RAISE FORM_TRIGGER_FAILURE;
              END;
             -----
--- AGREGA LOS BIENES PADRE E HIJO  
                         
             GO_BLOCK('BLK_BIEN_GEN_MASIV');
             IF :BLK_BIEN_GEN_MASIV.NO_BIEN_P IS NOT NULL THEN
             	  CREATE_RECORD;
             END IF;
             SET_ITEM_PROPERTY('PB_EXPORTA_EXCEL',DISPLAYED,PROPERTY_TRUE);
             SET_ITEM_PROPERTY('PB_EXPORTA_EXCEL',ENABLED  ,PROPERTY_TRUE);
             :BLK_BIEN_GEN_MASIV.NO_BIEN_P         := P_BIEN;
             IF :BLK_CONTROL.TIPO_CONV = 'BBB' THEN
                :BLK_BIEN_GEN_MASIV.DI_ESTATUS_BIEN_P := :BLK_BIE_NUM_MASIV.DI_ESTATUS_BIEN;
             ELSE	
                :BLK_BIEN_GEN_MASIV.DI_ESTATUS_BIEN_P := :BLK_CONTROL.TIPO_CONV;
             END IF;
             :BLK_BIEN_GEN_MASIV.NO_BIEN_H         := VN_BIEN_NEW;             
             :BLK_BIEN_GEN_MASIV.DI_ESTATUS_BIEN_H := REG.ESTATUS_NUEVO_BIEN;
---             
            LIP_COMMIT_SILENCIOSO;
            
            /*IF :BLK_BIE_NUM_MASIV.IDENTIFICADOR <> 'TRANS' THEN
               LIP_MENSAJE('Proceso Terminado, para el Bien: '||:BLK_BIE_NUM_MASIV.no_bien||' - No. de Bien Generado: '||VN_BIEN_NEW||' '||CONCIL,'A');                     
            ELSE
               LIP_MENSAJE('Proceso Terminado, para el Bien: '||:BLK_BIE_NUM_MASIV.no_bien||' no se generó numerario por ser un bien Transferente','A');
            END IF;*/
        END IF;
    END LOOP;
--exit_form;
EXCEPTION
 WHEN OTHERS THEN
 LIP_MENSAJE(SQLERRM,'S');
 RAISE FORM_TRIGGER_FAILURE;
END;