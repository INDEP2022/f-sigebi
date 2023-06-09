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


FUNCTION PUF_GENERA_CLAVE RETURN VARCHAR2 IS
   SIGLA					   VARCHAR2(30);
   ANIO					     VARCHAR2(4);
   MES						   VARCHAR2(2);
   vNO_DELEGACION    SEG_ACCESO_X_AREAS.NO_DELEGACION%TYPE;
   vNO_SUBDELEGACION SEG_ACCESO_X_AREAS.NO_SUBDELEGACION%TYPE;
   vNO_DEPARTAMENTO  SEG_ACCESO_X_AREAS.NO_DEPARTAMENTO%TYPE;
   vCVE_CARGO        SEG_USUARIOS.CVE_CARGO%TYPE;
   vniveld2      		 CAT_DEPARTAMENTOS.DSAREA%TYPE;
   vniveld3      		 CAT_DEPARTAMENTOS.DSAREA%TYPE;
   vniveld4      		 CAT_DEPARTAMENTOS.DSAREA%TYPE;
   vniveld5      		 CAT_DEPARTAMENTOS.DSAREA%TYPE;
   vnivel        		 CAT_DEPARTAMENTOS.NIVEL%TYPE;
   vdepend       		 CAT_DEPARTAMENTOS.DEPEND%TYPE;
   vdep_deleg				 CAT_DEPARTAMENTOS.DEP_DELEGACION%TYPE;
   SIGLAp				     VARCHAR2(30);
   vnivelp           CAT_DEPARTAMENTOS.NIVEL%TYPE;
   vdependp          CAT_DEPARTAMENTOS.DEPEND%TYPE;
   vdep_delegP			 CAT_DEPARTAMENTOS.DEP_DELEGACION%TYPE;
   VI                NUMBER;
   V_CVE_OF_GESTION  M_OFICIO_GESTION.CVE_OF_GESTION%TYPE;
   ETAPA             NUMBER;
BEGIN
	 ETAPA := FA_ETAPACREDA(SYSDATE);
-- GENERA CLAVE DE OFICIO -- JAM 241007
   ANIO := TO_CHAR(SYSDATE,'YYYY');
   MES	 := TO_CHAR(SYSDATE,'MM');
   IF :PARAMETER.PLLAMO = 'ABANDONO' THEN
      V_CVE_OF_GESTION := 'SAE'||'/'||MES||'/'||'?'||'/'||ANIO;
   ELSE
      BEGIN
         SELECT NO_DELEG1,NO_SUBDELEGACION,NO_DEPART1 
           INTO   vNO_DELEGACION,vNO_SUBDELEGACION,vNO_DEPARTAMENTO
           FROM SEG_ACCESO_X_AREAS
          WHERE USUARIO = :M_OFICIO_GESTION.REMITENTE
            AND ASIGNADO = 'S';
            
         SELECT CVE_CARGO
           INTO vCVE_CARGO
           FROM SEG_USUARIOS
          WHERE USUARIO = :M_OFICIO_GESTION.REMITENTE;
      EXCEPTION
         WHEN OTHERS THEN
            LIP_MENSAJE('No se localizaron datos de la persona que autoriza.','A');
            RAISE FORM_TRIGGER_FAILURE;
      END;
      BEGIN
         SELECT	DSAREA, NIVEL, DEPEND, DEP_DELEGACION
           INTO	SIGLA, vnivel, vdepend,vdep_deleg
           FROM	CAT_DEPARTAMENTOS
          WHERE	NO_DEPARTAMENTO 	= vNO_DEPARTAMENTO
            AND	NO_DELEGACION 		= vNO_DELEGACION
            AND	NO_SUBDELEGACION	= vNO_SUBDELEGACION
            AND ETAPA_EDO = ETAPA;
      EXCEPTION
         WHEN OTHERS THEN
            LIP_MENSAJE('No se localizó la dependencia de la persona que autoriza.','A');
            RAISE FORM_TRIGGER_FAILURE;
      END;
      IF vnivel = 4 THEN
         vniveld4 := 	SIGLA;
         vniveld5 := 	vCVE_CARGO;
      ELSE
         vniveld4 := 	vCVE_CARGO;
         vniveld3 := SIGLA;
      END IF;
      FOR VI IN REVERSE 2..vnivel-1 LOOP
         BEGIN
            SELECT DSAREA, NIVEL, DEPEND, DEP_DELEGACION
              INTO SIGLAp, vnivelp, vdependp,vdep_delegP
              FROM CAT_DEPARTAMENTOS
             WHERE NO_DEPARTAMENTO 	= vdepend
               AND NO_DELEGACION 		= vdep_deleg
               AND ETAPA_EDO = ETAPA;
         EXCEPTION
            WHEN OTHERS THEN
               LIP_MENSAJE('No se localizó el predecesor de la persona que autoriza.','A');
               RAISE FORM_TRIGGER_FAILURE;
         END;
         IF vnivelp = 3 THEN
            vniveld3 := SIGLAp;
         ELSIF vnivelp = 2 THEN
            vniveld2 := SIGLAp;
         END IF;
         vdepend := vdependp;
         vdep_deleg := vdep_delegP;
      END LOOP;
      V_CVE_OF_GESTION := vniveld2||'/'||vniveld3||'/'||vniveld4;
      IF vnivel+1 = 5 THEN
         V_CVE_OF_GESTION := V_CVE_OF_GESTION||'/'||vniveld5;
      END IF;
      V_CVE_OF_GESTION := LTRIM(V_CVE_OF_GESTION||'/?/'||ANIO,'/');
   END IF;
   RETURN(V_CVE_OF_GESTION);
END;







------------------------------------//TODO: BOTON BORRAR  --------------------------------------------------------------------------------------

/* Se le agregó el botón de Eliminar Oficios Realcionados
 ZCMA --06 de Octubre de 2008--*/

DECLARE 
   v_no_of_gestion M_OFICIO_GESTION.NO_OF_GESTION%TYPE;
   v_no_volante    M_OFICIO_GESTION.NO_VOLANTE%TYPE;
   ATJR						 NUMBER(1);
BEGIN
	-- Comentado ya que primero debe realizar las validaciones y despues las actualizaciones ELC 08082011
   /*BEGIN
      UPDATE NOTIFICACIONES
         SET CVE_DICTAMEN = NULL
       WHERE NO_VOLANTE = :NOTIFICACIONES.NO_VOLANTE;
      EXCEPTION
               WHEN OTHERS THEN
                  NULL;
   END;
   LIP_COMMIT_SILENCIOSO;*/
   IF :M_OFICIO_GESTION.NO_OF_GESTION IS NULL THEN
      LIP_MENSAJE('No se tiene oficio','S');
      RAISE Form_Trigger_Failure;
   END IF;
   IF :ESTATUS_OF = 'ENVIADO' THEN 
      LIP_MENSAJE('El oficio ya esta enviado no puede borrar','S');
      RAISE Form_Trigger_Failure;
   END IF;
   IF :M_OFICIO_GESTION.USUARO_INSERT <> :global.toolbar_usuario THEN      
      BEGIN
         SELECT COUNT(0)
           INTO ATJR
           FROM SEG_ACCESO_X_AREAS SA,
          			 SEG_USUARIOS SU,
          			 TVALTABLA1 TVL
	   		 WHERE SA.USUARIO = SU.USUARIO
      			 AND NO_DELEGACION = :BLK_TOOLBAR.TOOLBAR_NO_DELEGACION
      			 AND SU.CVE_CARGO = TVL.OTCLAVE
      			 AND TVL.OTCLAVE LIKE 'ATJR%'
      			 AND SA.USUARIO = :global.toolbar_usuario;
      EXCEPTION
      	WHEN OTHERS THEN
      		 ATJR := 0;
      	   LIP_MENSAJE('VERIFICAR PERMISOS','A');
      END;

      IF	ATJR = 0 THEN
            LIP_MENSAJE('El Usuario no está autorizado para eliminar el Oficio','A');
          RAISE FORM_TRIGGER_FAILURE;   	 
      END IF;   
   	/*
   	  LIP_MENSAJE('Usuario inválido para borrar oficio','S');
      RAISE Form_Trigger_Failure;
    */
      
   END IF;
   IF INSTR(:M_OFICIO_GESTION.CVE_OF_GESTION,'?') = 0 THEN
   	  LIP_MENSAJE('La clave está armada, no puede borrar oficio','S');
      RAISE Form_Trigger_Failure;
   END IF;

   v_no_of_gestion := :M_OFICIO_GESTION.NO_OF_GESTION;
   v_no_volante    := :M_OFICIO_GESTION.NO_VOLANTE;
   IF PUF_MENSAJE_SI_NO('Se borra oficio (Exp.: '||TO_CHAR(:NOTIFICACIONES.NO_EXPEDIENTE)||' No.oficio: '||TO_CHAR(v_no_of_gestion)||')?') = 'N' THEN
      GO_ITEM('NOTIFICACIONES.NO_EXPEDIENTE');
      RAISE FORM_TRIGGER_FAILURE;
   ELSE
   -- Borra BIENES_OFICIO_GESTION
      BEGIN
         DELETE FROM BIENES_OFICIO_GESTION
          WHERE NO_OF_GESTION  = v_no_of_gestion;
         LIP_COMMIT_SILENCIOSO;
         GO_BLOCK('BIENES_OFICIO_GESTION');
         Clear_Block(No_Validate);
      EXCEPTION
         WHEN OTHERS THEN
            NULL;
      END;
      -- Borra COPIAS_OFICIO_GESTION
      BEGIN
         DELETE FROM COPIAS_OFICIO_GESTION
          WHERE NO_OF_GESTION  = v_no_of_gestion;
         LIP_COMMIT_SILENCIOSO;
         GO_BLOCK('COPIAS_OFICIO_GESTION');
         Clear_Block(No_Validate);
      EXCEPTION
         WHEN OTHERS THEN
            NULL;
      END;
      -- Borra DOCUM_OFICIO_GESTION
      BEGIN
         DELETE FROM DOCUM_OFICIO_GESTION
          WHERE NO_OF_GESTION  = v_no_of_gestion;
         LIP_COMMIT_SILENCIOSO;
         GO_BLOCK('DOCUM_OFICIO_GESTION');
         Clear_Block(No_Validate);
      EXCEPTION
         WHEN OTHERS THEN
            NULL;
      END;
      -- Borra M_OFICIO_GESTION
      BEGIN
         DELETE FROM M_OFICIO_GESTION
          WHERE NO_OF_GESTION  = v_no_of_gestion
            AND NO_VOLANTE = v_no_volante;
               
      -- Actualiza cve_dcitamen en volante 080307 JAM
         BEGIN
            UPDATE NOTIFICACIONES
               SET CVE_DICTAMEN = NULL
             WHERE NO_VOLANTE = v_no_volante;
         EXCEPTION
            WHEN OTHERS THEN
               NULL;
         END;
         LIP_COMMIT_SILENCIOSO;
         GO_BLOCK('M_OFICIO_GESTION');
         Clear_Block(No_Validate);
         :se_refiere_a := 'D';
      EXCEPTION
         WHEN OTHERS THEN
            NULL;
      END;
      -- actualizo bienes con estatus ROP -- 140607 JAC --
       /*  GO_BLOCK('BIENES');
         FIRST_RECORD;
         LOOP
            :BIENES.ESTATUS  := 'ROP';
            EXIT WHEN :system.last_record = 'TRUE';
            NEXT_RECORD;			
         END LOOP;
         LIP_COMMIT_SILENCIOSO;*/
   END IF;
      Set_Radio_Button_Property('se_refiere_a','a',ENABLED,PROPERTY_TRUE);
         Set_Radio_Button_Property('se_refiere_a','b',ENABLED,PROPERTY_TRUE);
   GO_ITEM('NOTIFICACIONES.NO_EXPEDIENTE');
   LIP_EXEQRY;
END;