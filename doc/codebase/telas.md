As telas do aplicativo estão organizadas na pasta `app` em pastas.
dentro de `app/unauthenticated` temos telas que não exigem autenticação para serem acessadas, como a tela de login e registro.

dentro de `app/authenticated` temos telas que exigem autenticação para serem acessadas, como a tela principal do aplicativo.

TODAS as telas devem utilizar os componentes UI e Wrappers, principalmente para container principal utilizar o `WRScreenContainer.tsx`. 
Os componentes de tela devem ter o mínimo de processamento e validação concentradas, devem ter apenas referencias de subcomponentes visuais da tela, e não devem conter lógica de negócio. Elas devem respeitar a estrutura de roteamentos presentes nos arquivos `_layout.tsx`;

A estrutura de rotas é explícito por pastas como `(stack)` ou `(tabs)`, e dentro de cada pasta temos os arquivos de tela. é utilizado esse padrão para a organização para saber qual estrutura de rotas do expo estamos utilizando no `_layout.tsx`, se for criar uma nova estrutura de roteamentos de telas, utilizar esse padrão.


