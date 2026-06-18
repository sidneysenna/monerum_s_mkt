# Templates

Templates futuros devem existir em versoes HTML e TXT.

Estrutura sugerida:

```txt
src/modules/emails/infrastructure/templates/
  campanhas/
    apresentacao-monerum/
      template.html
      template.txt
      metadata.json
```

## Regras

- Cada campanha deve ter `template.html` e `template.txt`.
- O conteudo dinamico deve ser escapado adequadamente.
- Variaveis obrigatorias devem ser validadas antes do envio.
- Preview deve renderizar HTML e TXT.
- Dry-run deve mostrar resumo sem enviar.
- Versionamento de template deve ser considerado no desenho de campanhas.

Handlebars ou mecanismo similar pode ser usado em fase futura. Nao implementar motor de templates agora.
