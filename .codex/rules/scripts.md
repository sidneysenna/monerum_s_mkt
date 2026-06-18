# Regras de scripts

- Scripts sao a camada de entrada inicial do projeto.
- Nao criar controllers HTTP nesta etapa.
- Todo script deve validar ambiente.
- Todo script com impacto deve ter preview ou dry-run.
- Envio real deve exigir confirmacao explicita.
- Envio real deve exigir `EMAIL_SENDING_ENABLED=true`.
- Envio real deve exigir `EMAIL_DRY_RUN=false`.
- Scripts devem limitar lotes e evitar duplicidades.
- Scripts nao devem enviar para toda a base por acidente.
- Scripts devem registrar logs sem segredos.
