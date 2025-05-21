import { CadastroService } from './../../shared/services/cadastro.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';

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

  estados = [
      { sigla: 'AC', nome: 'Acre'},
      { sigla: 'AL', nome: 'Alagoas'},
      { sigla: 'AP', nome: 'Amapá'},
      { sigla: 'AM', nome: 'Amazonas'},
      { sigla: 'BA', nome: 'Bahia'},
      { sigla: 'CE', nome: 'Ceará'},
      { sigla: 'DF', nome: 'Distrito Federal'},
      { sigla: 'ES', nome: 'Espírito Santo'},
      { sigla: 'GO', nome: 'Goiás'},
      { sigla: 'MA', nome: 'Maranhão'},
      { sigla: 'MT', nome: 'Mato Grosso'},
      { sigla: 'MS', nome: 'Mato Grosso do Sul'},
      { sigla: 'MG', nome: 'Minas Gerais'},
      { sigla: 'PA', nome: 'Pará'},
      { sigla: 'PB', nome: 'Paraíba'},
      { sigla: 'PR', nome: 'Paraná'},
      { sigla: 'PE', nome: 'Pernambuco'},
      { sigla: 'PI', nome: 'Piauí'},
      { sigla: 'RJ', nome: 'Rio de Janeiro'},
      { sigla: 'RN', nome: 'Rio Grande do Norte'},
      { sigla: 'RS', nome: 'Rio Grande do Sul'},
      { sigla: 'RO', nome: 'Rondônia'},
      { sigla: 'RR', nome: 'Roraima'},
      { sigla: 'SC', nome: 'Santa Catarina'},
      { sigla: 'SP', nome: 'São Paulo'},
      { sigla: 'SE', nome: 'Sergipe'},
      { sigla: 'TO', nome: 'Tocantins'}
  ]

  //construtor deve ser usado apenas para injeção de dependências
  constructor(
    private fb: FormBuilder, //formulario
    private router: Router, //gerenciador de rotas
    private cadastroService: CadastroService //consumir o service no componente
  ){}

  //é chamado depois que a injeção de dependências e a construção do componente foram concluídas
  //criar o formulário no ngOnInit() garante que tudo esteja pronto antes de começar a interagir com o DOM ou lógica reativa
  ngOnInit(): void {
    this.dadosPessoaisForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], //segundo validators -- nativo do angular
      senha: ['', [Validators.required, Validators.minLength(6)]], //no minimo 6 caracteres
      confirmaSenha: ['', Validators.required]
    })
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

  salvarDadosAtuais() {
    const formValue = this.dadosPessoaisForm.value; //retorna o JSON do form com os dados

    this.cadastroService.updateCadastroData({ //salva dados no local storage
      nomeCompleto: formValue.nomeCompleto,
      estado: formValue.estado,
      cidade: formValue.cidade,
      email: formValue.email,
      senha: formValue.senha
    })

  }

}
