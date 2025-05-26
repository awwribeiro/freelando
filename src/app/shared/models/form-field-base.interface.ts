import { AsyncValidatorFn } from '@angular/forms';
// interfaces para renderizar o formulário com base em dados dinâmicos
//para adicionar ou modificar campos no formulário simplesmente alterando o JSON
//ou a configuração no back-end, sem precisar modificar o código do front-end
//em outras palavreas: definimos no backend o que queremos que o frontend exiba
export interface FormFieldBase {
   label: string;
   formControlName: string;
   type: string;
   required?: boolean;
   placeholder?: string;
   errorMessages?: { [key: string]: string };
   validators?: any[];
   asyncValidators?: any[];
   width?: string;
}
