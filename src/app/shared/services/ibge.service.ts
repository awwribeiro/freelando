import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

//duas intefaces, uma para cidade e outra para estado
export interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

export interface Cidade {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class IbgeService {

  private readonly API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

  constructor(private http: HttpClient) { }

  getEstados(): Observable<Estado[]> { //A função retorna um Observable que emitirá um array de objetos do tipo Estado quando chamado por subscribe
    return this.http.get<Estado[]> //faz uma requisição HTTP GET e espera como resposta um array de objetos Estado
           (`${this.API_URL}/estados?orderBy=nome`) //Monta a URL da requisição
           .pipe // encadear operadores RxJS que modificam ou reagem ao Observable.
           (retry(2)); //retry garante que, caso ocorra algum erro, tentaremos novamente acessar essa API
  }

  getCidades(uf: string): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(`${this.API_URL}/estados/${uf}/municipios?orderBy=nome`).pipe(retry(2));
  }

}


//CONFIGURAR APP.CONFIG para habilitar o uso do http.client ( provideHttpClient() )
