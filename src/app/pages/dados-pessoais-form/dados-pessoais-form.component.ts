import { DynamicFormService } from './../../shared/services/dynamic-form.service';
import { CadastroService } from './../../shared/services/cadastro.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { Cidade, Estado, IbgeService } from '../../shared/services/ibge.service';
import { cpfValidator } from '../../shared/validators/cpf.validator';
import { EmailValidatorService } from '../../shared/services/email-validator.service';
import { emailValidator } from '../../shared/validators/email.validator';
import { FormConfig } from '../../shared/models/form-config.interface';
import { getDadosPessoaisConfig } from '../../config/dados-pessoais-form.config';
import { FormFieldBase } from '../../shared/models/form-field-base.interface';

export const senhasIguaisValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const senha = control.get('senha');
  const confirmaSenha = control.get('confirmaSenha');

  return senha && confirmaSenha && senha.value === confirmaSenha.value ? null : { senhasNaoIguais: true };
}

@Component({
  selector: 'app-dados-pessoais-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './dados-pessoais-form.component.html',
  styleUrls: ['./dados-pessoais-form.component.scss']
})

export class DadosPessoaisFormComponent implements OnInit{
  dadosPessoaisForm!: FormGroup;
  formConfig!: FormConfig; //para chamar o service

  estado$!: Observable<Estado[]>; //$ para identificar que é um observable
  cidades$!: Observable<Cidade[]>;

  // toda vez que o estado for selecionado ou alterado, será necessário recarregar as cidades pertencentes àquele estado
  carregandoCidades$ = new BehaviorSubject<boolean>(false);

  //construtor deve ser usado apenas para injeção de dependências
  constructor(
    private fb: FormBuilder, //formulario
    private router: Router, //gerenciador de rotas
    private cadastroService: CadastroService, //consumir o service no componente
    private ibgeService: IbgeService,
    private emailService: EmailValidatorService,
    private dynamicFormService: DynamicFormService
  ){

    //registrando formulario dentro da service
    this.dynamicFormService.registerFormConfig('dadosPessoaisForm', getDadosPessoaisConfig);
  }

  //é chamado depois que a injeção de dependências e a construção do componente foram concluídas
  //criar o formulário no ngOnInit() garante que tudo esteja pronto antes de começar a interagir com o DOM ou lógica reativa
  ngOnInit(): void {

    //formConfig recendo a configuração feita na service
    this.formConfig = this.dynamicFormService.getFormConfig('dadosPessoaisForm');
    this.dadosPessoaisForm = this.dynamicFormService.createFormGroup(this.formConfig, { validators: senhasIguaisValidator });

    const formOptions: AbstractControlOptions = {validators: senhasIguaisValidator};

  //funcçao não usada mais, dadosPessoaisForms esta sendo para para o formulario a parti da service
  //  this.dadosPessoaisForm = this.fb.group({
  //    nomeCompleto: ['', Validators.required],
  //    cpf: ['', [Validators.required, cpfValidator]],
  //    estado: ['', Validators.required],
  //    cidade: ['', Validators.required],
  //    email: ['', [Validators.required, Validators.email], [emailValidator(this.emailService)]],
  //    senha: ['', [Validators.required, Validators.minLength(6)]], //no minimo 6 caracteres
  //    confirmaSenha: ['', Validators.required]
  //  }, formOptions);

    this.carregarEstados();
    this.configurarListernerEstado();

  }

  //verificando o tipo do type do formulario para passar para a service
  isFieldType(field: FormFieldBase, type: string): boolean {
    return field.type === type;
  }

  //
  hasField(name: string): boolean {
    return this.formConfig.fields.some(field => field.formControlName === name);
  }

  //
  getFieldByName(name: string): FormFieldBase {
    return this.formConfig.fields.find(field => field.formControlName === name) || {} as FormFieldBase;
  }

  onAnterior(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/area-atuacao']);
  }

  onProximo(): void {
    if(this.dadosPessoaisForm.valid){
      this.salvarDadosAtuais();
      this.router.navigate(['/cadastro/confirmacao']);
    } else {
      this.dadosPessoaisForm.markAllAsTouched();
    }
  }

  carregarEstados(): void {
    this.estado$ = this.ibgeService.getEstados();
  }

  configurarListernerEstado() {
     const estadoControl = this.dadosPessoaisForm.get('estado'); //estado pesquisado
     if(estadoControl) {
       //valueChanges identifica toda vez que o valor de estadoControl for alterado
       //pipe para configurar todas as operações desejadas no observable
       this.cidades$ = estadoControl.valueChanges.pipe(
         startWith(''), //inicia com string  vazia
         tap(() => { //operador de efeito colateral: permite executar ações sem alterar o valor emitido
           this.resetarCidade();
           this.carregandoCidades$.next(true); //ativa o indicador de carregamento
         }),
         switchMap(uf => {  //recebe o novo valor de uf --- Cancela requisições anteriores e troca para uma nova chamada de API
             if(uf){
              return this.ibgeService.getCidades(uf) //retorna um Observable<Cidade[]>
              .pipe(tap(() => this.carregandoCidades$.next(false))) //desativa o indicador de carregamento
            }

            //se não foi pesquisado um estado
            this.carregandoCidades$.next(false); //desativa o indicador de carregamento
            return of([]); //retorna lista vazia

          })
       )
     }
  }

  private salvarDadosAtuais() {
    const formValue = this.dadosPessoaisForm.value; //retorna o JSON do form com os dados

    this.cadastroService.updateCadastroData({ //salva dados no local storage
      nomeCompleto: formValue.nomeCompleto,
      estado: formValue.estado,
      cidade: formValue.cidade,
      email: formValue.email,
      senha: formValue.senha
    })

  }

  private resetarCidade(): void {
    this.dadosPessoaisForm.get('cidade')?.setValue('');
  }

}
