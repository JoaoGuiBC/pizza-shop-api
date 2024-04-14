
# Pizza Shop API

Pizza Shop é uma aplicação de **gerenciamento de pedidos para restaurantes**

Este projeto foi criado utilizando `bun init` com bun na versão v1.0.29.
[Bun](https://bun.sh) é um runtime JavaScript.

Você encontra o front-end deste projeto [aqui](https://github.com/JoaoGuiBC/pizza-shop-web)

### Etapas para executar a aplicação

No arquivo `src/http/server.ts` na função `app.listen()` é possível alterar a porta onde a aplicação é executada. Por padrão está a porta 3333

Copie o conteúdo de `.env.local.example` para dentro de `.env.local` e preencha os valores das chaves:

>API_BASE_URL: URL onde a aplicação está rodando, usada para redirecionamentos. Por padrão está o localhost na porta 3333

>AUTH_REDIRECT_URL: URL onde a aplicação web está rodando, usada para redirecionamentos. Por padrão está o localhost na porta 5173 (porta padrão para projetos [Vite](https://vitejs.dev/))

>JWT_SECRET_KEY: Chave para gerar JWT's. Por padrão está em branco

>DATABASE_URL: URL do banco de dados. Por padrão está o URL do banco fornecido pelo arquivo `docker-compose.yml`

Suba o banco de dados:
```bash
docker compose up -d
```

Instale as dependências:
```bash
bun install
```

Execute as migrations:
```bash
bun migrate
```

Caso queira pré-popular o banco com informações, rode o seguinte comando (por padrão cria uma conta de gerente com o e-mail admin@admin.com - isso pode ser editado no arquivo `src/db/seed.ts`):
```bash
bun seed
```

Execute a aplicação:
```bash
bun dev
```

### Rotas

Com a aplicação rodando, ao acessar o endereço [API_BASE_URL]/swagger é possivel conferir e testar todas as rotas disponiveis.