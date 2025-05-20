import { CadastroService } from './../../shared/services/cadastro.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RadioOptionComponent } from '../../shared/components/radio-option/radio-option.component';
import { ExperienceLevelComponent } from '../../shared/components/experience-level/experience-level.component';
import { Router } from '@angular/router';

const MODULES = [
  CommonModule,
  ReactiveFormsModule
];

const COMPONENTS = [
  ExperienceLevelComponent,
  RadioOptionComponent,
  ButtonComponent
];

@Component({
  selector: 'app-cadastro-form',
  standalone: true,
  imports: [
    ...MODULES,
    ...COMPONENTS
  ],
  templateUrl: './cadastro-form.component.html',
  styleUrls: ['./cadastro-form.component.scss']
})
export class CadastroFormComponent implements OnInit{ //metodo de inicializacao da classe - Permite que o compilador verifique se o método ngOnInit está presente.


  cadastroForm!: FormGroup;

  areasAtuacao = [
    { id: 'ti', value: 'ti', label: 'TI e Programação' },
    { id: 'design', value: 'design', label: 'Design e Multimídia' },
    { id: 'revisao', value: 'revisao', label: 'Revisão' },
    { id: 'traducao', value: 'traducao', label: 'Tradução' },
    { id: 'transcricao', value: 'transcricao', label: 'Transcrição' },
    { id: 'marketing', value: 'marketing', label: 'Marketing' }
  ];

  niveisExperiencia = [
    {
      id: 'iniciante',
      label: 'Iniciante',
      description: '(1 a 3 anos)'
    },
    {
      id: 'intermediario',
      label: 'Intermediário',
      description: '(3 a 6 anos)'
    },
    {
      id: 'avancado',
      label: 'Avançado',
      description: '(6 anos ou mais)'
    }
  ];

  constructor(private fb: FormBuilder, 
              private router: Router,
              private cadastroService: CadastroService) {}

  ngOnInit(): void {
    // Este método é chamado automaticamente pelo Angular logo após a criação do componente.
    this.cadastroForm = this.fb.group({
      areasAtuacao: ['', Validators.required],
      niveisExperiencia: ['', Validators.required]
    });
  }

  onAreaChange(area: string) { //Método chamado quando o usuário seleciona uma nova área de atuação.
    this.cadastroForm.get('areasAtuacao')?.setValue(area); //Atualiza o valor do campo areasAtuacao do formulário com o valor selecionado.
    // ? significa que o valor pode existir ou não
  }

  onNivelChange(nivel: string){ //Método chamado quando o usuário seleciona um novo nível de experiência.
    this.cadastroForm.get('niveisExperiencia')?.setValue(nivel); //Atualiza o valor do campo niveisExperiencia do formulário com o valor selecionado.
  }

  onProximo() { //proxima etapa
    if(this.cadastroForm.valid) { //se formulário estiver válido

      this.cadastroService.updateCadastroData({
        areaAtuacao: this.cadastroForm.get('areasAtuacao')?.value,
        nivelExperiencia: this.cadastroForm.get('niveisExperiencia')?.value});

      this.router.navigate(['/cadastro/dados-pessoais']);
    }
  }

  onAnterior() {
    console.log('Voltar para etapa anterior');
  }

}
   