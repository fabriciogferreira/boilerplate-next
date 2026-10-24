# boilerplate-next

Container no padrão do guia da Docker para Next.js, com `output: "standalone"`. O app está na raiz (`src/app`). Cada escolha está em [DECISIONS.md](DECISIONS.md).

| Arquivo | Função |
| --- | --- |
| `Dockerfile` | Produção, multi-stage, `node server.js` na porta 3000 |
| `Dockerfile.dev` | Dev, teste e lint |
| `compose.yaml` | Serviços prod, dev, test e lint |
| `.dockerignore` | O que fica fora do contexto de build |
| `next.config.ts` | `output: "standalone"`, exigido pela imagem de produção |

Fonte: https://docs.docker.com/guides/nextjs/
