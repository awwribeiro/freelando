//Criando o arquivo de configuração JSON para o formulário de dados pessoais.
//Este arquivo será responsável por definir a estrutura e as validações dos campos do formulário.

import { Validators } from "@angular/forms";
import { FormConfig } from "../shared/models/form-config.interface";
import { cpfValidator } from "../shared/validators/cpf.validator";
import { emailValidator } from "../shared/validators/email.validator";

export function getDadosPessoaisConfig(emailService: any): FormConfig {
  return {
    title: 'Crie seu cadastro',
    description: 'Crie seu perfil gratuitamente para começar a trabalhar com os melhores freelancers.',
    fields: [
      {
        label: 'Nome Completo',
        formControlName: 'nomeCompleto',
        type: 'text',
        required: true,
        errorMessages: {required: 'Nome completo é obrigatório'},
        validators: [Validators.required],
        width: 'full'
      },
      {
        label: 'CPF',
        formControlName: 'cpf',
        type: 'text',
        required: true,
        errorMessages: {required: 'CPF é obrigatório', cpfInvalido: 'CPF inválido'},
        validators: [Validators.required, cpfValidator],
        width: 'full'
      },
      {
        label: 'Estado',
        formControlName: 'estado',
        type: 'select',
        required: true,
        placeholder: 'Selecione',
        errorMessages: {required: 'Estado é obrigatório'},
        validators: [Validators.required],
        width: 'half'
      },
      {
        label: 'Cidade',
        formControlName: 'cidade',
        type: 'select',
        required: true,
        errorMessages: {required: 'Cidade é obrigatório'},
        validators: [Validators.required],
        width: 'half'
      },
      {
        label: 'Email',
        formControlName: 'email',
        type: 'email',
        required: true,
        errorMessages: {required: 'Email é obrigatório',
                        email: 'Email inválido',
                        emailExistente: 'Email já cadastrado'},
        validators: [Validators.required, Validators.email],
        asyncValidators: [emailValidator(emailService)],
        width: 'full'
      },
      {
        label: 'Senha',
        formControlName: 'senha',
        type: 'password',
        required: true,
        errorMessages: {required: 'Senha é obrigatória',
                        minlength: 'Senha deve ter pelo menos 6 caracteres'},
        validators: [Validators.required, Validators.minLength],
        width: 'half'
      },
      {
        label: 'Repita a senha',
        formControlName: 'confirmaSenha',
        type: 'password',
        required: true,
        errorMessages: {required: 'Confirmação de senha é obrigatório'},
        validators: [Validators.required],
        width: 'half'
      }

    ]
  }
}
