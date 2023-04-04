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
                                                 WHERE NO_TIPO = 7 AND NO_SUBTIPO = 1);
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
                          :BLK_BIE_NUM_MASIV.DI_ESTATUS_BIEN,:BLK_BIE_NUM_MASIV.IDENTIFICADOR,
                          :BLK_BIE_NUM_MASIV.PROCESO_EXT_DOM              
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


FUNCTION PUP_VALIDANUME (V_BIEN NUMBER)
RETURN CHAR IS
DI_DISPNUME		CHAR(1);
vc_pantalla 	VARCHAR2(100) := GET_APPLICATION_PROPERTY(CURRENT_FORM_NAME);
BEGIN
  DI_DISPNUME := 'N';
                  
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
	LOOP
   	DI_DISPNUME := 'S';
    EXIT;
	END LOOP;
RETURN DI_DISPNUME;
END;







----------------BEGIN FVIGMANTENIMIENTO -------------------
PROCEDURE PUP_PROCESOS(P_NUM_PRO number) IS

	LV_VALPROC      number;
	LV_ID_ENVIA     number;
	LV_ID_CUERPO    number;
	LV_MSG_PROCESO  varchar2(300);
	LV_EST_PROCESO  number;

BEGIN
	
	LV_VALPROC := 1;
	
	if :BLK_GENERALES.MOTIVO_CAMBIO is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El motivo de cambio del bloque información de correo, es información obligatoria ...','A');
	end if;
	
	if :BLK_GENERALES.ID_ENVIA is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El identificador de envío del bloque información de correo, es información obligatoria ...','A');
	else
		
		select count(0)
		  into LV_ID_ENVIA
		  from VIG_EMAIL_ENVIA
		 where ID_ENVIA = :BLK_GENERALES.ID_ENVIA;
		 
		if LV_ID_ENVIA = 0 then
			LV_VALPROC := 0;
			LIP_MENSAJE('El identificador de envío del bloque información de correo, no es correcto ...','A');
		end if;
		
	end if;
	
	if :BLK_GENERALES.ID_PARA is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El correo electronico del destino (Para) del bloque información de correo, es información obligatoria ...','A');
	end if;
	
	if :BLK_GENERALES.ID_COPIA is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El correo electronico de la copia (CC) del bloque información de correo, es información obligatoria ...','A');
	end if;
	
	if :BLK_GENERALES.ID_CUERPO is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El identificador de tipo (Cuerpo de correo) del bloque información de correo, es información obligatoria ...','A');
	else
			select count(0)
		  into LV_ID_CUERPO
		  from VIG_EMAIL_CUERPO
		 where ID_CUERPO = :BLK_GENERALES.ID_CUERPO;
		 
		if LV_ID_CUERPO = 0 then
			LV_VALPROC := 0;
			LIP_MENSAJE('El identificador de tipo (Cuerpo de correo) del bloque información de correo, no es correcto ...','A');
		end if;
		
	end if;
	if LV_VALPROC = 1 then
		
  	if P_NUM_PRO = 1 then
  		SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
  		PK_VIGILANCIA_SUPERVISION.PA_ELIMINA_PERIODO(
                                 									:BLK_PERIODO.MTO_ANIO,
                                 									:BLK_PERIODO.MTO_NUMERO,
                                 									:BLK_PERIODO.MTO_PROCESO,
                                 									:BLK_PERIODO.MTO_DELEGACION,
                                 									user,
                                 									:BLK_SEGURIDAD.USUARIO_AUT,
                                 									:BLK_GENERALES.FECHA_SOLICITUD,
                                 									:BLK_GENERALES.MOTIVO_CAMBIO,
                                 									:BLK_GENERALES.ID_ENVIA,
                                 									:BLK_GENERALES.ID_PARA,
                                 									:BLK_GENERALES.ID_COPIA,
                                 									:BLK_GENERALES.ID_CUERPO,
                                 									LV_MSG_PROCESO,
                                 									LV_EST_PROCESO
                                									);
  			SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
  			if LV_EST_PROCESO = 1 then
  				LIP_COMMIT_SILENCIOSO;
    			LIP_MENSAJE(LV_MSG_PROCESO,'A');
					GO_BLOCK('BLK_PERIODO');
    		else
					LIP_MENSAJE(LV_MSG_PROCESO,'S');
					GO_BLOCK('BLK_GENERAL');	
				end if;
  			Set_Window_Property('WIN_AUTORIZA',VISIBLE,PROPERTY_FALSE);
  			
  	elsif P_NUM_PRO = 2 then
  		SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
  		PK_VIGILANCIA_SUPERVISION.PA_CAMBIO_PERIODO(
                                 									:BLK_ENTREPER.ENT_ANIO_INI,
                                 									:BLK_ENTREPER.ENT_NUM_INI,
                                 									:BLK_ENTREPER.ENT_PROC_INI,
                                 									:BLK_ENTREPER.ENT_DEL_INI,
                                 									:BLK_ENTREPER.ENT_ANIO_FIN,
                                 									:BLK_ENTREPER.ENT_NUM_FIN,
                                 									:BLK_ENTREPER.ENT_PROC_FIN,
                                 									:BLK_ENTREPER.ENT_DEL_FIN,
                                 									user,
                                 									:BLK_SEGURIDAD.USUARIO_AUT,
                                 									:BLK_GENERALES.FECHA_SOLICITUD,
                                 									:BLK_GENERALES.MOTIVO_CAMBIO,
                                 									:BLK_GENERALES.ID_ENVIA,
                                 									:BLK_GENERALES.ID_PARA,
                                 									:BLK_GENERALES.ID_COPIA,
                                 									:BLK_GENERALES.ID_CUERPO,
                                 									LV_MSG_PROCESO,
                                 									LV_EST_PROCESO
                                									);
  			SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');	
				if LV_EST_PROCESO = 1 then
  				LIP_COMMIT_SILENCIOSO;
    			LIP_MENSAJE(LV_MSG_PROCESO,'A');
					GO_BLOCK('BLK_PERIODO');
    		else
					LIP_MENSAJE(LV_MSG_PROCESO,'S');
					GO_BLOCK('BLK_GENERAL');	
				end if;
  			Set_Window_Property('WIN_AUTORIZA',VISIBLE,PROPERTY_FALSE);
  			
		elsif P_NUM_PRO = 3 then
			SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
			PK_VIGILANCIA_SUPERVISION.PA_CAMBIO_BIEN_ALE(
                                 									:BLK_SUSTITUIR.SUS_ANIO,
                                 									:BLK_SUSTITUIR.SUS_PERIODO,
                                 									:BLK_SUSTITUIR.SUS_PROCESO,
                                 									:BLK_SUSTITUIR.SUS_DELEGACION,
                                 									:BLK_SUSTITUIR.SUS_ALEATORIO,
                                 									:BLK_SUSTITUIR.SUS_NO_BIEN,
                                 									:BLK_SUSTITUIR.SUS_DESCRIPCION,
                                 									:BLK_SUSTITUIR.SUS_TRANSFERENTE,
                                 									user,
                                 									:BLK_SEGURIDAD.USUARIO_AUT,
                                 									:BLK_GENERALES.FECHA_SOLICITUD,
                                 									:BLK_GENERALES.MOTIVO_CAMBIO,
                                 									:BLK_GENERALES.ID_ENVIA,
                                 									:BLK_GENERALES.ID_PARA,
                                 									:BLK_GENERALES.ID_COPIA,
                                 									:BLK_GENERALES.ID_CUERPO,
                                 									LV_MSG_PROCESO,
                                 									LV_EST_PROCESO
                                									);
      SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');		
			if LV_EST_PROCESO = 1 then
  			LIP_COMMIT_SILENCIOSO;
    		LIP_MENSAJE(LV_MSG_PROCESO,'A');
				GO_BLOCK('BLK_PERIODO');
    	else
				LIP_MENSAJE(LV_MSG_PROCESO,'S');
				GO_BLOCK('BLK_GENERAL');	
			end if;
  			Set_Window_Property('WIN_AUTORIZA',VISIBLE,PROPERTY_FALSE);
  			
		end if;
		
  end if;
			
END;

----------------END FVIGMANTENIMIENTO -------------------













PROCEDURE PUP_PROCESOS(P_NUM_PRO number) IS

	LV_VALPROC      number;
	LV_ID_ENVIA     number;
	LV_ID_CUERPO    number;
	LV_MSG_PROCESO  varchar2(300);
	LV_EST_PROCESO  number;

BEGIN
	
	LV_VALPROC := 1;
	
	if :BLK_GENERALES.MOTIVO_CAMBIO is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El motivo de cambio del bloque información de correo, es información obligatoria ...','A');
	end if;
	
	if :BLK_GENERALES.ID_ENVIA is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El identificador de envío del bloque información de correo, es información obligatoria ...','A');
	else
		
		select count(0)
		  into LV_ID_ENVIA
		  from VIG_EMAIL_ENVIA
		 where ID_ENVIA = :BLK_GENERALES.ID_ENVIA;
		 
		if LV_ID_ENVIA = 0 then
			LV_VALPROC := 0;
			LIP_MENSAJE('El identificador de envío del bloque información de correo, no es correcto ...','A');
		end if;
		
	end if;
	
	if :BLK_GENERALES.ID_PARA is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El correo electronico del destino (Para) del bloque información de correo, es información obligatoria ...','A');
	end if;
	
	if :BLK_GENERALES.ID_COPIA is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El correo electronico de la copia (CC) del bloque información de correo, es información obligatoria ...','A');
	end if;
	
	if :BLK_GENERALES.ID_CUERPO is null then
		LV_VALPROC := 0;
		LIP_MENSAJE('El identificador de tipo (Cuerpo de correo) del bloque información de correo, es información obligatoria ...','A');
	else
			select count(0)
		  into LV_ID_CUERPO
		  from VIG_EMAIL_CUERPO
		 where ID_CUERPO = :BLK_GENERALES.ID_CUERPO;
		 
		if LV_ID_CUERPO = 0 then
			LV_VALPROC := 0;
			LIP_MENSAJE('El identificador de tipo (Cuerpo de correo) del bloque información de correo, no es correcto ...','A');
		end if;
		
	end if;
	if LV_VALPROC = 1 then
		
  	if P_NUM_PRO = 1 then
  		SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
  		PK_VIGILANCIA_SUPERVISION.PA_ELIMINA_PERIODO(
                                 									:BLK_PERIODO.MTO_ANIO,
                                 									:BLK_PERIODO.MTO_NUMERO,
                                 									:BLK_PERIODO.MTO_PROCESO,
                                 									:BLK_PERIODO.MTO_DELEGACION,
                                 									user,
                                 									:BLK_SEGURIDAD.USUARIO_AUT,
                                 									:BLK_GENERALES.FECHA_SOLICITUD,
                                 									:BLK_GENERALES.MOTIVO_CAMBIO,
                                 									:BLK_GENERALES.ID_ENVIA,
                                 									:BLK_GENERALES.ID_PARA,
                                 									:BLK_GENERALES.ID_COPIA,
                                 									:BLK_GENERALES.ID_CUERPO,
                                 									LV_MSG_PROCESO,
                                 									LV_EST_PROCESO
                                									);
  			SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
  			if LV_EST_PROCESO = 1 then
  				LIP_COMMIT_SILENCIOSO;
    			LIP_MENSAJE(LV_MSG_PROCESO,'A');
					GO_BLOCK('BLK_PERIODO');
    		else
					LIP_MENSAJE(LV_MSG_PROCESO,'S');
					GO_BLOCK('BLK_GENERAL');	
				end if;
  			Set_Window_Property('WIN_AUTORIZA',VISIBLE,PROPERTY_FALSE);
  			
  	elsif P_NUM_PRO = 2 then
  		SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
  		PK_VIGILANCIA_SUPERVISION.PA_CAMBIO_PERIODO(
                                 									:BLK_ENTREPER.ENT_ANIO_INI,
                                 									:BLK_ENTREPER.ENT_NUM_INI,
                                 									:BLK_ENTREPER.ENT_PROC_INI,
                                 									:BLK_ENTREPER.ENT_DEL_INI,
                                 									:BLK_ENTREPER.ENT_ANIO_FIN,
                                 									:BLK_ENTREPER.ENT_NUM_FIN,
                                 									:BLK_ENTREPER.ENT_PROC_FIN,
                                 									:BLK_ENTREPER.ENT_DEL_FIN,
                                 									user,
                                 									:BLK_SEGURIDAD.USUARIO_AUT,
                                 									:BLK_GENERALES.FECHA_SOLICITUD,
                                 									:BLK_GENERALES.MOTIVO_CAMBIO,
                                 									:BLK_GENERALES.ID_ENVIA,
                                 									:BLK_GENERALES.ID_PARA,
                                 									:BLK_GENERALES.ID_COPIA,
                                 									:BLK_GENERALES.ID_CUERPO,
                                 									LV_MSG_PROCESO,
                                 									LV_EST_PROCESO
                                									);
  			SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');	
				if LV_EST_PROCESO = 1 then
  				LIP_COMMIT_SILENCIOSO;
    			LIP_MENSAJE(LV_MSG_PROCESO,'A');
					GO_BLOCK('BLK_PERIODO');
    		else
					LIP_MENSAJE(LV_MSG_PROCESO,'S');
					GO_BLOCK('BLK_GENERAL');	
				end if;
  			Set_Window_Property('WIN_AUTORIZA',VISIBLE,PROPERTY_FALSE);
  			
		elsif P_NUM_PRO = 3 then
			SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
			PK_VIGILANCIA_SUPERVISION.PA_CAMBIO_BIEN_ALE(
                                 									:BLK_SUSTITUIR.SUS_ANIO,
                                 									:BLK_SUSTITUIR.SUS_PERIODO,
                                 									:BLK_SUSTITUIR.SUS_PROCESO,
                                 									:BLK_SUSTITUIR.SUS_DELEGACION,
                                 									:BLK_SUSTITUIR.SUS_ALEATORIO,
                                 									:BLK_SUSTITUIR.SUS_NO_BIEN,
                                 									:BLK_SUSTITUIR.SUS_DESCRIPCION,
                                 									:BLK_SUSTITUIR.SUS_TRANSFERENTE,
                                 									user,
                                 									:BLK_SEGURIDAD.USUARIO_AUT,
                                 									:BLK_GENERALES.FECHA_SOLICITUD,
                                 									:BLK_GENERALES.MOTIVO_CAMBIO,
                                 									:BLK_GENERALES.ID_ENVIA,
                                 									:BLK_GENERALES.ID_PARA,
                                 									:BLK_GENERALES.ID_COPIA,
                                 									:BLK_GENERALES.ID_CUERPO,
                                 									LV_MSG_PROCESO,
                                 									LV_EST_PROCESO
                                									);
      SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');		
			if LV_EST_PROCESO = 1 then
  			LIP_COMMIT_SILENCIOSO;
    		LIP_MENSAJE(LV_MSG_PROCESO,'A');
				GO_BLOCK('BLK_PERIODO');
    	else
				LIP_MENSAJE(LV_MSG_PROCESO,'S');
				GO_BLOCK('BLK_GENERAL');	
			end if;
  			Set_Window_Property('WIN_AUTORIZA',VISIBLE,PROPERTY_FALSE);
  			
		end if;
		
  end if;
			
END;

