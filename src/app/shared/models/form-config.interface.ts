// interfaces para renderizar o formulário com base em dados dinâmicos
//para adicionar ou modificar campos no formulário simplesmente alterando o JSON
//ou a configuração no back-end, sem precisar modificar o código do front-end
//em outras palavreas: definimos no backend o que queremos que o frontend exiba

import { FormFieldBase } from "./form-field-base.interface";

export interface FormConfig {
  title: string;
  description: string;
  fields: FormFieldBase[];
}
