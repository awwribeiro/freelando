//gerenciando criação do formulário através das interfaces form-config.interface.ts e form-field-base.interface.ts

import { Injectable } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup } from '@angular/forms';
import { FormConfig } from '../models/form-config.interface';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  private FormConfigs: {[key: string]: Function} = {};

  constructor(private fb: FormBuilder) { }

  registerFormConfig(formName: string, config: Function){
    this.FormConfigs[formName] = config;
  }

  getFormConfig(formKey: string, ...args: any[]): FormConfig {
    if (!this.FormConfigs[formKey]) {
      throw new Error(`Configuração de formulário não encontrada: ${formKey}`);
    }

    return this.FormConfigs[formKey](...args);
  }

  createFormGroup(config: FormConfig, formOptions?: AbstractControlOptions): FormGroup {

    const formControls: {[key: string]: any} = {};

    config.fields.forEach(field => {
      formControls[field.formControlName] = [
        '',
        field.validators,
        field.asyncValidators
      ];
    });

    return this.fb.group(formControls, formOptions)
  }

}
