
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService {
//Definindo quem são os e-mails inválidos. Como não estamos trabalhando especificamente com o back-end aqui,
//vamos simular essa chamada para a API utilizando um Observable.
//Definimos alguns e-mails que são existentes e que irão retornar erro na tela para o usuário
  private emailsCadastrados = [
    'usuario1@exemplo.com',
    'usuario2@exemplo.com',
    'teste@exemplo.com',
    'admin@exemplo.com',
    'contato@exemplo.com'
  ];

  verificarEmailExistente(email: string): Observable<boolean> {
    return of(this.emailsCadastrados.includes(email.toLowerCase())).pipe(delay(1500));
  }


}
