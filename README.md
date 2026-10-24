# 3D Angels

Site institucional e catálogo da **3D Angels**, empresa de impressão 3D em Indaiatuba. Apresenta produtos, serviços, informações sobre a empresa e canais para solicitar orçamentos.

**Endereço público:** [angels3d.com](https://angels3d.com/)

## Tecnologias e recursos

O site usa HTML, CSS e JavaScript puro. Os arquivos de produção ficam na raiz do repositório: não há instalação de dependências, etapa de build ou backend próprio neste projeto.

- Catálogo com categorias, detalhes dos produtos e contato pelo WhatsApp.
- Formulário de orçamento integrado ao FormSubmit.
- Assistente de atendimento com fluxos e respostas definidos em JavaScript.
- Páginas de serviços, apresentação da empresa, privacidade e termos de uso.
- Vídeos, animações e layout responsivo.
- Metadados de SEO, sitemap e regras de navegação para Apache.

## Estrutura do projeto

```text
.
├── index.html                        # Página inicial e catálogo
├── servicos.html                     # Serviços de impressão 3D
├── sobre.html                        # Apresentação da empresa
├── orcamento.html                    # Formulário de orçamento
├── obrigado.html                     # Confirmação após o envio
├── 404.html                          # Página de erro personalizada
├── politica-privacidade-angels3d.html
├── termos-de-uso-angels3d.html
├── styles.css                        # Estilos compartilhados
├── script.js                         # Interações, catálogo e formulário
├── chatbot.js                        # Fluxos do assistente de atendimento
├── img/                              # Imagens de produtos e do site
├── favicons/                         # Ícones e manifesto
├── hero_video_keyframed.mp4
├── services_video_keyframed.mp4
├── .htaccess                         # Rotas, cache e cabeçalhos HTTP
├── robots.txt                        # Orientações para rastreadores
└── sitemap.xml                       # URLs públicas para indexação
```

## Executar localmente

Para uma prévia, use um servidor HTTP local. Com **Python 3** instalado, execute na raiz do projeto:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abra [http://127.0.0.1:8000/index.html](http://127.0.0.1:8000/index.html). Para encerrar o servidor, pressione `Ctrl+C` no terminal.

O servidor do Python não interpreta o `.htaccess`. Nessa prévia, acesse as páginas com a extensão `.html`, como `/servicos.html` e `/orcamento.html`; links sem extensão podem retornar erro. Para validar as URLs públicas, redirecionamentos, cabeçalhos e a página 404, use Apache com `mod_rewrite` e permissão para aplicar o `.htaccess`.

O formulário continua apontando para o serviço externo mesmo na prévia local. Um envio real usa o FormSubmit e tem como destino de confirmação `https://angels3d.com/obrigado`.

## Atualizar conteúdo

- **Produtos:** edite os cards em `index.html` e adicione as imagens em `img/catalogo/`. Mantenha nome, descrição, preço, categoria e os dados da chamada `abrirModal(...)` consistentes.
- **Aparência:** ajuste `styles.css`. Algumas páginas também contêm estilos diretamente no HTML.
- **Interações:** edite `script.js`; as respostas e opções do assistente ficam em `chatbot.js`.
- **Contatos:** revise as constantes `WHATSAPP_NUMBER` e `CONTACT_EMAIL` em `script.js`, além dos links e endereços escritos diretamente nos arquivos HTML.
- **Formulário:** o destinatário do FormSubmit está no atributo `action` em `orcamento.html`; o campo `_next` define a página de confirmação.
- **SEO:** ao alterar ou adicionar páginas, revise título, descrição, URL canônica, metadados sociais e `sitemap.xml`. Atualize `lastmod` conforme a data da alteração da página.

Cabeçalho e rodapé estão presentes em vários arquivos HTML. Ao mudar a navegação ou os contatos, aplique a alteração em todas as páginas correspondentes.

### Serviços externos

O site utiliza Google Fonts para tipografia, FormSubmit para o envio de orçamentos e links para WhatsApp e Instagram. O acompanhamento de pedidos aponta para [pedidos.angels3d.com](https://pedidos.angels3d.com/), cujo código não faz parte deste repositório. Esses recursos dependem de conexão com a internet e da disponibilidade dos respectivos serviços.

## Publicação

A branch principal é `main`. A conexão com a hospedagem e o deploy automático ainda precisam ser configurados.

1. Revise as alterações e faça a verificação manual descrita abaixo.
2. Publique os arquivos HTML, CSS, JavaScript, imagens, favicons, vídeos, `robots.txt`, `sitemap.xml` e `.htaccess` na raiz pública da hospedagem, preservando nomes e pastas. Preserve também o arquivo HTML de verificação existente na raiz.
3. Use hospedagem compatível com Apache, com `mod_rewrite` e leitura do `.htaccess` habilitados. O módulo `mod_headers` aplica as regras de cache e os cabeçalhos de segurança quando disponível.
4. Confira as páginas e os redirecionamentos no domínio de destino.

Não publique `.git/`, credenciais, configurações locais, o checkout antigo em `3Dangels site/` ou pacotes de `release/`. ZIPs de distribuição e o checkout antigo são ignorados pelo Git. Nunca adicione senhas ou chaves ao repositório.

### Rotas e cache

O `.htaccess` permite acessar páginas sem `.html`, redireciona `/index`, `/index.html`, `/catalogo` e `/catalogo.html` para `/` e configura `404.html` como página de erro. Também bloqueia o acesso a arquivos ocultos, com exceção de `.well-known`, e às pastas `tests/` e `release/`.

Com `mod_headers` ativo, o HTML é revalidado e os arquivos estáticos recebem cache de um ano. Ao alterar CSS ou JavaScript, atualize o parâmetro de versão `?v=...` nas referências de **todas as páginas que usam o arquivo**. Para imagens ou vídeos substituídos, use um novo nome ou uma URL versionada e atualize as referências para evitar conteúdo antigo em cache.

## Verificação antes de publicar

O repositório não possui uma suíte de testes automatizados. Faça uma revisão manual em telas de celular e desktop:

- Confira navegação, rodapé, imagens e vídeos.
- Teste as categorias do catálogo, os detalhes dos produtos e os links para WhatsApp.
- Abra o assistente e percorra suas opções de atendimento.
- Verifique a validação dos campos do orçamento; para testar o envio, use dados de teste e confira o recebimento e a página de confirmação.
- Em Apache, teste URLs sem extensão, os redirecionamentos da home e do catálogo antigo e uma URL inexistente.
- Verifique o console e a aba de rede do navegador para identificar erros de JavaScript e arquivos ausentes.
- Após a publicação, confirme que as versões atualizadas de CSS, JavaScript e mídias estão sendo carregadas.
