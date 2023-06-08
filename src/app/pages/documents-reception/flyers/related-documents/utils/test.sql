DECLARE
	SIGLA   			VARCHAR2(30);
	ANIO    			VARCHAR2(4);
	MES     			VARCHAR2(4);
  AR_REMITENTE	VARCHAR2(30);
  OFICIO  			NUMBER;
	DATO 					VARCHAR2(1);
	CONTADOR 			NUMBER;
	CONTA 				NUMBER;
	ETAPA         NUMBER;
BEGIN
	   ETAPA := FA_ETAPACREDA(SYSDATE);
		IF :ESTATUS_OF = 'ENVIADO' THEN 
			LIP_MENSAJE('El oficio ya fue enviado ... mande a imprimir en el candado','S');
   		RAISE Form_Trigger_Failure;
		END IF;

		IF :TIPO_OFICIO IS NULL THEN 
	 		LIP_MENSAJE('Debe especificar el TIPO OFICIO','C');
   		go_item('tipo_oficio');
   		RAISE Form_Trigger_Failure;
		END IF;

		IF :REMITENTE IS NULL THEN 
	 		LIP_MENSAJE('Debe especificar el REMITENTE','C');
   		go_item('REMITENTE');
   		RAISE Form_Trigger_Failure;
		END IF;

		IF :TIPO_OFICIO = 'INTERNO' THEN 
   		IF :DESTINATARIO IS NULL THEN 
	    		LIP_MENSAJE('Debe especificar el DESTINATARIO','C');
      		go_item('DESTINATARIO');
      		RAISE Form_Trigger_Failure;
   		END IF;
		END IF;

		IF :TIPO_OFICIO = 'EXTERNO' THEN 
   		IF :NOM_DES IS NULL THEN 
	    		LIP_MENSAJE('Debe especificar al DESTINATARIO EXTERNO','C');
      		go_item('NOM_DES');
      		RAISE Form_Trigger_Failure;
   		END IF;
		END IF;

		IF :CIUDAD IS NULL THEN 
	 		LIP_MENSAJE('Debe especificar la CIUDAD','C');
   		go_item('CIUDAD');
   		RAISE Form_Trigger_Failure;
		END IF;

		IF :CVE_OF_GESTION IS NULL AND :M_OFICIO_GESTION.NO_OF_GESTION IS NOT NULL THEN 
			SELECT DSAREA INTO   SIGLA
   	  	    FROM CAT_DEPARTAMENTOS
   		     WHERE NO_DEPARTAMENTO = :BLK_TOOLBAR.TOOLBAR_NO_DEPARTAMENTO
   		       AND NO_DELEGACION = :BLK_TOOLBAR.TOOLBAR_NO_DELEGACION
   		       AND NO_SUBDELEGACION = :BLK_TOOLBAR.TOOLBAR_NO_SUBDELEGACION
   		       AND ETAPA_EDO = ETAPA;
    
   		    SELECT DSAREA INTO AR_REMITENTE
   	 	      FROM CAT_DEPARTAMENTOS
   		     WHERE NO_DELEGACION = :M_OFICIO_GESTION.NO_DEL_REM          
   		       AND NO_DEPARTAMENTO = :M_OFICIO_GESTION.NO_DEP_REM
   		       AND ETAPA_EDO = ETAPA;
    
   		    /*SELECT TO_CHAR(SYSDATE,'YYYY')   		INTO   ANIO   		FROM   DUAL;*/
    
   		    ANIO := TO_CHAR(SYSDATE,'YYYY');
   		    MES  := TO_CHAR(SYSDATE,'MM');
    
   		    IF :PARAMETER.PLLAMO = 'ABANDONO' THEN
   		    --	:M_OFICIO_GESTION.CVE_OF_GESTION := 'SAE'||'/'||MES||'/'||'?'||'/'||ANIO;
   		    		:M_OFICIO_GESTION.CVE_OF_GESTION := PUF_GENERA_CLAVE;
   		    ELSE
   		    	--:M_OFICIO_GESTION.CVE_OF_GESTION := :BLK_TOOLBAR.TOOLBAR_DESC_DELEGACION||'/'||AR_REMITENTE||'/'||SIGLA||'/'||'?'||'/'||ANIO;
   		    	:M_OFICIO_GESTION.CVE_OF_GESTION := PUF_GENERA_CLAVE;
   		    END IF;
   		    :M_OFICIO_GESTION.ESTATUS_OF := 'EN REVISION';
		END IF;

		IF :CVE_OF_GESTION IS NULL AND :M_OFICIO_GESTION.NO_OF_GESTION IS NULL THEN 
	 		SELECT	SEQ_OF_GESTION.nextval
   		    INTO		:M_OFICIO_GESTION.NO_OF_GESTION
   		    FROM		DUAL;

   		    SELECT	DSAREA INTO   SIGLA
   		      FROM  CAT_DEPARTAMENTOS
   		     WHERE  NO_DEPARTAMENTO = :BLK_TOOLBAR.TOOLBAR_NO_DEPARTAMENTO
   		       AND  NO_DELEGACION = :BLK_TOOLBAR.TOOLBAR_NO_DELEGACION
   		       AND  NO_SUBDELEGACION = :BLK_TOOLBAR.TOOLBAR_NO_SUBDELEGACION
   		       AND  ETAPA_EDO = ETAPA;
    
   		    SELECT DSAREA INTO AR_REMITENTE
   	  	    FROM CAT_DEPARTAMENTOS
   	 	     WHERE NO_DELEGACION = :M_OFICIO_GESTION.NO_DEL_REM          
   		       AND NO_DEPARTAMENTO = :M_OFICIO_GESTION.NO_DEP_REM
   		       AND ETAPA_EDO = ETAPA;
    
   		    ANIO := TO_CHAR(SYSDATE,'YYYY');
   		    MES  := TO_CHAR(SYSDATE,'MM');
   	
   		    IF :PARAMETER.PLLAMO = 'ABANDONO' THEN
   		    	--:M_OFICIO_GESTION.CVE_OF_GESTION := 'SAE'||'/'||MES||'/'||'?'||'/'||ANIO;
   		    	:M_OFICIO_GESTION.CVE_OF_GESTION := PUF_GENERA_CLAVE;
   		    ELSE
	   	    	--:M_OFICIO_GESTION.CVE_OF_GESTION := :BLK_TOOLBAR.TOOLBAR_DESC_DELEGACION||'/'||AR_REMITENTE||'/'||SIGLA||'/'||'?'||'/'||ANIO;
	   	    	:M_OFICIO_GESTION.CVE_OF_GESTION := PUF_GENERA_CLAVE;
	   	    END IF;
   		    :M_OFICIO_GESTION.ESTATUS_OF := 'EN REVISION';
    
   		    IF :SE_REFIERE_A = 'Se refiere a todos los bienes' THEN 
      	    	PUP_AGREGA_BIENES;
   		    END IF;
    
   		    IF :SE_REFIERE_A = 'Se refiere a algun (os) bien (es) del expediente' THEN
   	  	    	PUP_AGREGA_ALGUNOS_BIENES;
   		    END IF;
			COMMIT;
		END IF;

		IF :CVE_OF_GESTION IS NOT NULL AND :M_OFICIO_GESTION.NO_OF_GESTION IS NOT NULL THEN 
	 		SELECT	COUNT(0) INTO contador
	 		FROM		BIENES_OFICIO_GESTION
	 		WHERE		no_of_gestion = :M_OFICIO_GESTION.no_of_gestion;
	 
	 		IF :SE_REFIERE_A = 'Se refiere a todos los bienes' AND CONTADOR = 0 THEN 
	 	  	PUP_AGREGA_BIENES;
	 		END IF;
	
     	    IF :SE_REFIERE_A = 'Se refiere a algun (os) bien (es) del expediente' AND CONTADOR = 0 THEN 
     	    	  PUP_AGREGA_ALGUNOS_BIENES;
     	    END IF;
		    COMMIT;
		END IF;

		PUP_LANZA_REPORTE;
		IF :M_OFICIO_GESTION.CVE_OF_GESTION IS NOT NULL AND :SE_REFIERE_A = 'Se refiere a todos los bienes' THEN
	 		Set_Radio_Button_Property('se_refiere_a','b',enabled,property_false);
	 		Set_Radio_Button_Property('se_refiere_a','c',ENABLED,PROPERTY_FALSE);
		END IF;

		IF :M_OFICIO_GESTION.CVE_OF_GESTION IS NOT NULL AND :SE_REFIERE_A = 'Se refiere a algun (os) bien (es) del expediente' THEN
   		Set_Radio_Button_Property('se_refiere_a','a',enabled,property_false);
   		Set_Radio_Button_Property('se_refiere_a','c',ENABLED,PROPERTY_FALSE);
		END IF;

		IF :M_OFICIO_GESTION.CVE_OF_GESTION IS NOT NULL  THEN
   		SELECT	COUNT(0) INTO conta
   		FROM		DOCUM_OFICIO_GESTION
   		WHERE		NO_OF_GESTION = :M_OFICIO_GESTION.NO_OF_GESTION;

   		IF conta <> 0 THEN
      		Set_item_Property('documentos',enabled,property_false);
   		END IF;
		END IF;
		GO_BLOCK('NOTIFICACIONES');
		EXECUTE_QUERY(NO_VALIDATE);
END;




PROCEDURE PUP_AGREGA_BIENES IS
BEGIN
Loop
  GO_BLOCK('BIENES_OFICIO_GESTION');
  LAST_RECORD;
  IF :bienes.disponible = 'S' Then
     CREATE_RECORD;
     :BIENES_OFICIO_GESTION.NO_BIEN := :bienes.no_bien;  
     :BIENES_OFICIO_GESTION.CLASIF := :bienes.no_clasif_bien;
     :BIENES_OFICIO_GESTION.NO_OF_GESTION := :M_OFICIO_GESTION.NO_OF_GESTION; 
     :BIENES.DISPONIBLE := 'N';
  END IF;
  GO_BLOCK('bienes');
  exit when :system.last_record = 'TRUE'; 
  NEXT_RECORD;
end loop;
:VARIABLES.B := 'S';
end;




PROCEDURE PUP_LANZA_REPORTE IS
   pl_id   ParamList; 
   pl_name VARCHAR2(15) := 'Params_Reporte'; 
BEGIN
   pl_id := Get_Parameter_List(pl_name); 
   IF Id_Null(pl_id) THEN 
   	  pl_id := Create_Parameter_List(pl_name); 
   	  IF Id_Null(pl_id) THEN 
  	  	    LIP_MENSAJE('Error al crear lista de parámetros. '||pl_name,'N'); 
   	  	    RAISE Form_Trigger_Failure; 
   	  END IF; 
   ELSE 
       Destroy_Parameter_List(pl_id); 
       pl_id := Create_Parameter_List(pl_name); 
   END IF; 
    pl_id := Get_Parameter_List('Params_Reporte');
    IF NOT Id_Null(pl_id) THEN 
        Add_Parameter(pl_id, 'PARAMFORM' ,TEXT_PARAMETER, 'NO');
        Add_Parameter(pl_id, 'NO_OF_GES' ,TEXT_PARAMETER, TO_CHAR(:M_OFICIO_GESTION.NO_OF_GESTION));
        Add_Parameter(pl_id, 'TIPO_OF',TEXT_PARAMETER, (:M_OFICIO_GESTION.TIPO_OFICIO));
        Add_Parameter(pl_id, 'VOLANTE',TEXT_PARAMETER, TO_CHAR(:NOTIFICACIONES.NO_VOLANTE));
        Add_Parameter(pl_id, 'EXP',TEXT_PARAMETER, TO_CHAR(:NOTIFICACIONES.NO_EXPEDIENTE));
    END IF; 
    
    IF :M_OFICIO_GESTION.TIPO_OFICIO = 'INTERNO' AND :PARAMETER.PLLAMO != 'ABANDONO' THEN 
       Run_Product(REPORTS, '..\reportes\RGEROFGESTION', ASYNCHRONOUS, RUNTIME, FILESYSTEM, pl_id, NULL);    
    ELSIF :M_OFICIO_GESTION.TIPO_OFICIO = 'EXTERNO'  AND :PARAMETER.PLLAMO != 'ABANDONO' THEN 
       Run_Product(REPORTS, '..\reportes\RGEROFGESTION_EXT', ASYNCHRONOUS, RUNTIME, FILESYSTEM, pl_id, NULL);    
    ELSIF :M_OFICIO_GESTION.TIPO_OFICIO = 'EXTERNO'  AND :PARAMETER.PLLAMO = 'ABANDONO' THEN 
       Run_Product(REPORTS, '..\reportes\RGENABANSUB', ASYNCHRONOUS, RUNTIME, FILESYSTEM, pl_id, NULL);   
    ELSE   
       lip_mensaje('No se ha especificado el tipo de oficio (EXTERNO,INTERNO)','A');
       go_item(':tipo_oficio');    
    END IF;
    
END;



PROCEDURE PUP_AGREGA_ALGUNOS_BIENES IS

BIENES number;
clasif number;
BEGIN
GO_BLOCK('bienes');
FIRST_RECORD;
LOOP	
 IF :bienes.SELECCION = 'S' AND :bienes.disponible = 'S' Then
    bienes := :bienes.no_bien;
    clasif := :bienes.no_clasif_bien;
    GO_BLOCK('BIENES_OFICIO_GESTION');
    CREATE_RECORD;
    :BIENES_OFICIO_GESTION.NO_BIEN := BIENES;	 
    :BIENES_OFICIO_GESTION.clasif := clasif;	
    :BIENES_OFICIO_GESTION.NO_OF_GESTION := :M_OFICIO_GESTION.NO_OF_GESTION;
    :bienes.disponible := 'N';
 END IF;
 GO_BLOCK('bienes');
 EXIT WHEN :system.last_record = 'TRUE';
 NEXT_RECORD;
END LOOP;
:variables.b := 'S';
END;