import { Routes } from '@angular/router';
import { CadastroFormComponent } from './pages/cadastro-form/cadastro-form.component';
import { DadosPessoaisFormComponent } from './pages/dados-pessoais-form/dados-pessoais-form.component';
import { PerfilFormComponent } from './pages/perfil-form/perfil-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/cadastro/area-atuacao', pathMatch: 'full' },
  //quando path for vazio (usuário acessou a raiz do site), redireciona para componente cadastro/area-atuacao 
  //full significa que o caminho da URL deve bater exatamente com '' (ou seja, estar totalmente vazio).
  { path: 'cadastro/area-atuacao', component: CadastroFormComponent },
  { path: 'cadastro/dados-pessoais', component: DadosPessoaisFormComponent },
  { path: 'cadastro/perfil', component: PerfilFormComponent }
];
