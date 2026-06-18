import { ObterHealthUseCase } from './obter-health.usecase';

describe('ObterHealthUseCase', () => {
  it('deve retornar status basico da API v1', () => {
    const useCase = new ObterHealthUseCase();

    const result = useCase.execute();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('monerum_s_mkt');
    expect(result.version).toBe('v1');
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});
