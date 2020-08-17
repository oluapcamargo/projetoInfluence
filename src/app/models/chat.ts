import { MensagemType } from "./mensagem";

export class ChatType {
  id: string;
  usuarioId: string;
  conteudo: string;
  nomeUsuario: string;
  data: Date;
}

// public string Id { get; set; }
// public string UsuarioId { get; set; }
// public string Conteudo { get; set; }
// public DateTime Data { get; set; }
// public Mensagem()
// {
//     Id = "";
//     UsuarioId = "";
//     Conteudo = "";
// }
