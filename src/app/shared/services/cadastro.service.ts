import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CadastroData {
  areaAtuacao?: string;
  nivelExperiencia?: string;
  nomeCompleto?: string;
  estado?: string;
  cidade?: string;
  email?: string;
  senha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  //subject => Pode ser observado (como qualquer Observable) e Pode emitir dados para os seus assinantes com .next().
  //um subject não mantém o valor atual. Se alguém se inscreve depois que algo foi emitido, ele não recebe o valor antigo.
  //BehaviorSubject é uma variação de Subject com duas características principais: Requer um valor inicial. Sempre armazena o valor mais recente e o emite imediatamente para novos assinantes.
  //cadastroDataSubject amazena o estado atual do cadastro e emitirá atualizações para quem se inscrever
  private cadastroDataSubject = new BehaviorSubject<CadastroData>({});

  //$ indica que é um Observable.
  //expõe os dados apenas para leitura, sem permitir que outros componentes modifiquem diretamente o BehaviorSubject
  cadastroData$ = this.cadastroDataSubject.asObservable();

  constructor() {

    //Busca do localStorage algum dado salvo anteriormente com a chave "cadastroData".
    const savedData = localStorage.getItem('cadastroData');

    //Se encontrou dados salvos, faz o parse do JSON e atualiza o BehaviorSubject com os dados recuperados.
    if(savedData){
      this.cadastroDataSubject.next(JSON.parse(savedData));
    }
  }

  updateCadastroData(data: Partial<CadastroData>): void { //O parâmetro data pode conter apenas parte dos dados (Partial<CadastroData>), não precisa passar tudo.
    const currentData = this.cadastroDataSubject.value; //Pega o valor atual armazenado no BehaviorSubject
    const updatedData = { ...currentData, ...data }; //Usa spread operator para mesclar o valor atual com os novos dados recebidos [novas propriedades sobrescrevam as antigas, mas sem apagar o resto]
    this.cadastroDataSubject.next(updatedData); //Atualiza o BehaviorSubject com o novo estado
    localStorage.setItem('cadastroData', JSON.stringify(updatedData)); //Persiste os dados atualizados no localStorage, convertendo-os para string com JSON.stringify
  }

  //Método auxiliar para retornar diretamente o valor atual (síncrono), sem precisar se inscrever no observable.
  getCadastroData(): CadastroData {
    return this.cadastroDataSubject.value;
  }

}
