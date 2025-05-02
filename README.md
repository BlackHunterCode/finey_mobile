
# 💸 Finey - Mobile App

![Finey Logo](https://via.placeholder.com/150x50?text=Finey)  
*Aplicativo de gestão financeira pessoal com foco em educação e comunidade*

## 🚀 Visão Geral

O Finey é um aplicativo mobile que ajuda usuários a organizarem suas finanças pessoais, oferecendo:

- 📊 Controle completo de gastos e ganhos *[**MVP-0.1.0**]*
- 💰 Gestão inteligente de investimentos *[**MVP-0.1.0**]*
- 🎯 Acompanhamento de metas financeiras *[**MVP-0.1.0**]*
- 📚 Conteúdos educativos personalizados *[**V1.0.0**]*
- 🤝 Comunidade de apoio *[**V1.0.0**]*

## 📱 Tecnologias Principais

| Área          | Tecnologias                                                                 |
|---------------|-----------------------------------------------------------------------------|
| Frontend      | React Native, Expo                                                          |
| Navegação     | Expo Router                                                                 |
| Estado        | React Standard (UseState, UseContext, etc)                                  |
| API           | Axios                                                                       |
| CI/CD         | GitHub Actions, Expo Application Services                                   |

## 🛠️ Pré-requisitos

- Node.js 18+
- npm 8+
- Expo CLI (`npm install -g eas-cli`)
- Xcode (iOS) ou Android Studio (Android)

## 🔧 Configuração do Ambiente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/BlackHunterCode/hw_mobile
   cd hw_mobile
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` com suas chaves de API.

4. **Inicie o projeto**
   ```bash
   expo start
   ```

## 📂 Estrutura do Projeto

```
panther-wallet/
├── assets/              # Recursos estáticos (imagens, fonts)
├── src/
│   ├── api/             # Configurações de API e serviços
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos globais
│   ├── features/        # Funcionalidades (por tela)
│   ├── hooks/           # Custom hooks
│   ├── navigation/      # Configuração de rotas
│   ├── store/           # Configuração do Redux
│   ├── theme/           # Design system e estilos
│   └── utils/           # Utilitários e helpers
├── App.tsx              # Ponto de entrada
└── app.json             # Configuração do Expo
```

## 🧪 Testes

Rodar testes unitários:
```bash
npm test
```

## 🏗️ Build e Deploy

Build para Android:
```bash
expo build:android
```

Build para iOS:
```bash
expo build:ios
```

Publicar atualização OTA:
```bash
expo publish
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie sua branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 📬 Contato

Equipe Finey - finey.contato@gmail.com  
Discord

### 📌 Destaques Especiais

- **Padrões de Código**: Siga nosso [Styleguide](docs/STYLEGUIDE.md)
- **Roadmap**: Veja os próximos recursos planejados no [Project Board](https://github.com/seu-usuario/panther-wallet-mobile/projects/1)
- **Design System**: Baseado no [Figma da Equipe](https://www.figma.com/design/6OguljIwmMLMgqAxqtNvf5/Panther-Wallet?node-id=3693-60&p=f&t=r7RSwng1KcwyTJcP-0)

👉 *Documentação detalhada disponível em [docs/](docs/)*
