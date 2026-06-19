export interface CampanhaStatusResponseDto {
  campanha: {
    codigo: string;
    nome: string;
    status: string;
    limiteDiario: number;
  };
  resumo: {
    totalEnviados: number;
    enviadosHoje: number;
    vagasRestantesHoje: number;
    totalFalhas: number;
  };
}
