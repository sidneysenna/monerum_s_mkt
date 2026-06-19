# Templates

Templates devem existir em versoes HTML e TXT.

Estrutura sugerida:

```txt
src/modules/emails/infrastructure/templates/
  campanhas/
    proposta-sindicato-digital/
      template.html
      template.txt
      metadata.json
```

## Regras

- Cada campanha deve ter `template.html`; `template.txt` pode existir como apoio legado, mas nao deve ser fonte do envio da campanha `proposta-sindicato-digital`.
- O conteudo dinamico deve ser escapado adequadamente.
- Variaveis obrigatorias devem ser validadas antes do envio.
- Preview deve renderizar HTML e TXT.
- Dry-run deve mostrar resumo sem enviar.
- Versionamento de template deve ser considerado no desenho de campanhas.
- Para `proposta-sindicato-digital`, TXT deve ser extraido do HTML ja renderizado por destinatario.
- O `template.html` de `proposta-sindicato-digital` pode ser adaptado estruturalmente para compatibilidade de e-mail marketing, desde que preserve conteudo, chaves, logo externa e visual equivalente.
- Nao incorporar imagens grandes em Base64 nos templates de e-mail. Preferir URL publica quando possivel.
- A logo de `proposta-sindicato-digital` deve usar `http://monerum.com.br/asets/logo-suprema.png`.
- Em templates de e-mail, nao depender apenas de CSS em `<style>`. Estilos criticos devem ser aplicados inline no HTML final antes do preview/envio.
- Templates de e-mail devem priorizar tabelas, CSS inline e estilos criticos aplicados diretamente nos elementos.
- O TXT deve ser extraido do HTML final ja renderizado e com CSS inline aplicado.
- Template remoto e proibido.
- Nao executar `eval` para variaveis.

Handlebars ou mecanismo similar pode ser usado em fase futura.
