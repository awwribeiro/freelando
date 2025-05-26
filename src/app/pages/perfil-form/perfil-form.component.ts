import { Habilidade } from './../../shared/models/habilidade.interface';

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { CadastroService } from '../../shared/services/cadastro.service';
import { ChipComponent } from "../../shared/components/chip/chip.component";
import { Idioma } from '../../shared/models/idioma.interface';


@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    ChipComponent
],
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.scss']
})
export class PerfilFormComponent implements OnInit {
  perfilForm!: FormGroup;
  fotoPreview!: string | ArrayBuffer | null;
  caracteresRestante: number = 70;

  habilidades: Habilidade[] = [
    { nome: 'Fullstack', selecionada: false },
    { nome: 'Front-end', selecionada: false },
    { nome: 'React', selecionada: false },
    { nome: 'Angular', selecionada: false }
  ];

  niveisIdioma: string[] = [
    'Básico',
    'Intermediário',
    'Avançado',
    'Fluente',
    'Nativo'
  ];

  idiomas: string[] = [
    'Português',
    'Inglês',
    'Espanhol',
    'Françes',
    'Italiano',
    'Alemão',
    'Japones',
    'Chines'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cadastroService: CadastroService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    this.perfilForm.get('resumo')?.valueChanges.subscribe(resumo => {
      this.caracteresRestante = 70 - resumo.length;
    })

  }

  onAnterior(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/dados-pessoais']);
  }

  onProximo(): void {
    if(this.perfilForm.valid){
      this.salvarDadosAtuais();
      this.router.navigate(['/cadastro/confirmacao']);
    }
  }

  onFotoSelecionada(event: any): void { //representa o evento de alteração (change) de um campo de arquivo (<input type="file">)
    const file = event.target.files[0]; //Acessa o primeiro arquivo selecionado pelo usuário no input de arquivos
    if(file) {
      const reader = new FileReader(); //FileReader API que permite aplicativos da web leiam de forma assíncrona o conteúdo de arquivos armazenados no computador do usuário
      reader.onload = () => { //será executada automaticamente quando a leitura do arquivo for concluída com sucesso.
        this.fotoPreview = reader.result; //Armazena o resultado da leitura do arquivo
        this.perfilForm.patchValue( {foto: reader.result}); //patchValue é usado para atualizar parcialmente o formulário, sem precisar preencher todos os campos.
      }
      reader.readAsDataURL(file); // transforma a imagem em uma string que pode ser usada diretamente em um atributo src de imagem
    }
  }

  toggleHabilidade(habilidade: Habilidade): void {
    habilidade.selecionada = !habilidade.selecionada; //alterna o estado
    //filter pega apenas as habilidades que estão selecionadas
    //map transforma essa lista em um array contendo apenas os nomes dessas habilidades
    const habilidadesSelecionadas = this.habilidades.filter(h => h.selecionada).map(h => h.nome);
    this.perfilForm.patchValue({ habilidadesSelecionadas }); //patchValua atualiza somente o campo habilidades
  }

  get idiomasArray(): FormArray {
    return this.perfilForm.get('idiomas') as FormArray; // acessa o array de idiomas do formulário
  }

  adicionarIdioma(nome: string = '', nivel: string = ''): void {
    const idiomaForm = this.fb.group({ //Cria um novo FormGroup chamado idiomaForm, que representa um idioma
      nome: [nome, Validators.required],
      nivel: [nivel, Validators.required]
    });
    this.idiomasArray.push(idiomaForm); //acessando novo FormGroup
  }

  removerIdioma(index: number): void {
    if(index === 0 && this.idiomasArray.at(0).get('nome')?.value === 'Português') { //impede a remoção do "Português" no índice 0
      return;
    }
  }

  inicializarFormulario(): void {
    this.perfilForm = this.fb.group({
      foto: [''],
      resumo: ['', [Validators.required, Validators.maxLength(70)]],
      habilidadesSelecionadas: [[]],
      idiomas: this.fb.array([]),
      portfolio: ['', Validators.pattern('https?://.+')],
      linkedin: ['', Validators.pattern('https?://(www\\.)?linkedin\\.com/.+')]
    });

    this.adicionarIdioma('Português', 'Nativo');
  }

  private extrairIdiomas(): Idioma[] {
    return this.idiomasArray.controls.map(control => {
      return {
        nome: control.get('nome')?.value,
        nivel: control.get('nivel')?.value
      };
    });
  }

  private salvarDadosAtuais() {
    const formValue = this.perfilForm.value;

    this.cadastroService.updateCadastroData({
      foto: this.fotoPreview,
      resumo: formValue.resumo,
      habilidadesSelecionadas: formValue.habilidadesSelecionadas,
      idiomas: this.extrairIdiomas(),
      portfolio: formValue.portfolio,
      linkedin: formValue.linkedin
    })
  }

}
