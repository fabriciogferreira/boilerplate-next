# Decisões — boilerplate-next

Registro do que foi escolhido, do que foi deixado de fora e da referência que levou a cada escolha. Data desta etapa: 2026-10-24.

O app Next ainda não existe (o clone tinha só o README). Esta etapa cria o contrato Docker. O `docker build` não tem o que instalar até existir `package.json` e um lockfile.

## Contexto

Pedido: arquivos Docker segundo o guia [Containerize a Next.js application](https://docs.docker.com/guides/nextjs/). O guia foi escrito por Kristiyan Velkov e acompanha os exemplos oficiais em [vercel/next.js `examples/with-docker`](https://github.com/vercel/next.js/tree/canary/examples/with-docker).

Referência de forma no meta-repo: `boilerplate-laravel` (`compose.dev.yaml`, bind mount, `container_name` com o nome do projeto). Onde o guia e o Laravel divergem, esta etapa segue o guia. A divergência fica abaixo para não ser "corrigida" depois sem uma decisão nova.

Não clonamos o sample [kristiyan-velkov/docker-nextjs-sample](https://github.com/kristiyan-velkov/docker-nextjs-sample). Ele é o app de demonstração do guia. Aqui os arquivos entram neste boilerplate.

## Output standalone, não export

Escolha: `output: "standalone"` em `next.config.ts`. Sem `nginx.conf`.

O guia tem dois modos. Standalone faz o `next build` emitir um servidor Node autônomo; a imagem final roda `node server.js` na porta 3000 e mantém SSR, Route Handlers e ISR. Export (`output: "export"`) gera site estático no diretório `out`, servido por Nginx na porta 8080, e abre mão do servidor Node. O `nginx.conf` do guia existe só para esse modo.

Este boilerplate é o equivalente Next do `boilerplate-laravel`, que é um app com servidor (php-fpm), não um site estático.

Referências:

- Guia, seções 1.1 e 1.2: https://docs.docker.com/guides/nextjs/
- https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- https://nextjs.org/docs/advanced-features/output-file-tracing

`next.config.ts` entrou agora, antes do app, porque o estágio `runner` copia `.next/standalone`. Sem essa chave o build da imagem de produção não tem o que copiar. Um `create-next-app` posterior não pode apagar `output: "standalone"`.

## Imagem oficial `node`, não Docker Hardened Image

Escolha: `FROM node:…` (Docker Official Image).

O guia oferece DHI (`dhi.io/node:24-alpine3.22-dev`) e a imagem oficial. DHI exige `docker login dhi.io`. As VMs deste meta-repo puxam imagens públicas; o Laravel usa `php` e `nginx` do Docker Hub. Não há credencial DHI no setup.

Referências:

- Abas "Docker Hardened Images" e "Docker Official Image" no guia
- https://hub.docker.com/_/node
- https://docs.docker.com/dhi/

## Tag `24.22.1-slim`, não `24.14.0-slim`

Escolha: `ARG NODE_VERSION=24.22.1-slim` no `Dockerfile` e no `Dockerfile.dev`.

O guia fixa `24.14.0-slim` e avisa para revisar a tag oficial antes de buildar, porque patch de segurança sai direto. Em 2026-10-24 a tag `24-slim` no Docker Hub é a mesma imagem que `24.22.1-slim` (publicada em 2026-10-21; também `lts` e `krypton`). Conferido na API do Hub: a tag `24.22.1-slim` existe e o manifesto `linux/amd64` coincide com o de `24-slim`.

Ficamos no Node 24, que é a linha LTS do guia, e não no Node 26 Current. O patch fica fixo, no mesmo nível de pin do guia, para um rebuild não trocar o Node sozinho. A tag flutuante `24-slim` não foi usada. O digest também não: o guia pina tag, não digest.

Variante `slim`: é a da aba "Docker Official Image". A imagem final de produção fica menor. A própria página do Hub recomenda a tag default (não slim) quando o build precisa dos pacotes comuns. Se um módulo nativo falhar no `npm ci` por falta de compilador, trocar o dev para a imagem cheia é decisão nova e entra aqui.

## Um `compose.yaml`, não o par do Laravel

Escolha: um `compose.yaml` com produção, dev, teste e lint, como o compose final do guia (seção de testes).

`docker compose` acha `compose.yaml` sem `-f`. O Laravel separa `compose.dev.yaml` e `compose.prod.yaml` porque o meta-repo sobe só o stack de desenvolvimento (`COMPOSE_FILE` no `project.conf`). Aqui continua um arquivo só. O `project.conf` do meta-repo aponta `COMPOSE_FILE=compose.yaml`.

O `project-start` roda `docker compose up -d` sem nome de serviço. No guia, prod e dev sobem juntos e os dois publicam a porta 3000, então o login quebraria. Produção ficou no profile `prod`. O `up -d` sobe só `nextjs-dev`. Produção é `docker compose --profile prod up nextjs-prod-standalone`. Não separamos o arquivo como o Laravel: o guia usa um `compose.yaml`, e o profile resolve a porta sem um segundo compose.

Nomes dos serviços continuam os do guia: `nextjs-prod-standalone`, `nextjs-dev`, `nextjs-test`, `nextjs-lint`. Assim os comandos do guia valem:

```console
docker compose watch nextjs-dev
docker compose --profile prod up nextjs-prod-standalone
docker compose --profile tools run --rm nextjs-test
docker compose --profile tools run --rm nextjs-lint
```

Imagem e `container_name` usam `boilerplate-next` (`boilerplate-next:prod`, `boilerplate-next:dev`, `boilerplate-next-prod`, …). O guia chama a imagem de `nextjs-sample`, que é o sample, não este repo. O critério do nome é o mesmo do Laravel (`container_name: boilerplate-laravel-web`).

Porta 3000 nos dois serviços longos, como o guia. Não mapeamos para 80: essa porta é a do Nginx do Laravel nesta VM, e o default do Next no guia é 3000. Os dois não sobem juntos por causa do profile `prod`.

Dev usa Compose Watch (`develop.watch`), não bind mount. O Laravel monta `./:/var/www`. O guia copia o código para a imagem e sincroniza mudanças, ignorando `node_modules/` e `.next/`, para o `node_modules` do container não misturar com o do host. Referência: https://docs.docker.com/compose/how-tos/file-watch/

O processo é o usuário `node` (uid 1000) que a imagem oficial cria. O Laravel passa `UID`/`GID` como build-arg porque o bind mount grava arquivo com o uid do host. Aqui não há esse arg. Se o dev passar a bind mount, o arg de UID entra nessa hora, no modelo do `docker/common/php-fpm/Dockerfile` do Laravel.

`WATCHPACK_POLLING=true` está no `Dockerfile.dev` e no serviço `nextjs-dev`. O guia coloca os dois: dentro do Docker o watcher do Next não vê evento de arquivo sem polling.

Teste e lint ficam no profile `tools` e reutilizam `Dockerfile.dev`, então não sobem num `docker compose up`. Os comandos esperam scripts `test:run` (ou `test`) e `lint` no `package.json`. Esses scripts, o Vitest e o ESLint não foram criados: o guia só manda instalá-los na seção de testes de um projeto que já existe.

## Telemetria desligada

Escolha: `ENV NEXT_TELEMETRY_DISABLED=1` no build, no runner e no dev.

O guia deixa a linha comentada e diz para descomentar quem quiser desligar. Build da imagem e o `next dev` da VM não enviam uso.

Referência: https://nextjs.org/telemetry

## Lockfile npm, yarn ou pnpm

Escolha: o `if` do guia, que termina com erro se não houver lockfile.

O package manager ainda não foi escolhido (não há `package.json`). O Dockerfile não inventa um. Quando o app existir, o lockfile presente define o install (`npm ci`, `yarn install --frozen-lockfile` ou `pnpm install --frozen-lockfile`). Sem lockfile o build para, como o guia.

## `.dockerignore` copiado do guia

A lista é a do guia, sem edição. Efeitos aceitos:

- `.env*` não entra no contexto. Segredo fica fora da imagem. Variável `NEXT_PUBLIC_*` lida no build, se passar a existir num `.env`, não entra por esse arquivo; o caminho é build-arg.
- `*.md` deixa este arquivo fora da imagem.
- `Dockerfile*` e `compose*.yaml` ficam fora do contexto, como o guia pede.

Referência: https://docs.docker.com/reference/dockerfile/#dockerignore-file

## Cache de build e fetch cache

O `Dockerfile` standalone do guia não usa `--mount=type=cache,target=/app/.next/cache` no `npm run build`. O comentário do próprio guia diz que esse mount acelera o rebuild e impede `.next/cache/fetch-cache` de ir para a imagem final. O `COPY` de `.next/cache` para o runner também fica comentado, como no guia. O Dockerfile de export do guia usa o mount; não seguimos esse arquivo porque a escolha foi standalone.

## Definição no meta-repo

O `project-setup.sh` não tem lista de projetos. `workvm_list_project_ids` acha cada `project.conf` na raiz (`lib/git.sh`). A definição ficou em `boilerplate-next/` no meta-repo, no mesmo desenho do Laravel e do use-url-query: `project.conf` + `workspace.code-workspace`. O clone continua em `boilerplate-next/boilerplate-next/` e fica de fora do git pelo `.gitignore` (`boilerplate-next/*`, com exceção dos arquivos da definição).

Não há `post-clone.sh`. O Laravel precisa dele para `.env`, UID do volume e `compose.dev.yaml` (`lib/laravel-post-clone.sh`). Este boilerplate não tem esse passo, e o guia Docker também não pede. `POST_CLONE=()` deixa o setup seguir sem pós-clone.

`WAIT_URL=http://localhost:3000` está no conf. O `project-start` só espera essa URL se o `docker compose up -d` passar. Sem lockfile o build falha, o login avisa e continua. `CHROMIUM_URLS` abre essa mesma URL na instalação (`WORKVM_OPEN_APPS=1`). Sem MCP: o `project.conf` não declara `MCP=`.

## O que não entrou

- App Next, `package.json`, lockfile. Sem isso o `docker build` falha no estágio de dependências, de propósito.
- `nginx.conf`, porta 8080, `output: "export"`.
- Vitest, ESLint, `vitest.config.ts`, `vitest.setup.ts`.
- `post-clone.sh` e `config-vm.xml`.
- Sample do guia e login no registry `dhi.io`.
