# Calculadora de IMC

Aplicação React que calcula o **Índice de Massa Corporal (IMC)** a partir da altura e do peso do usuário, exibindo o resultado, a classificação e uma régua visual.

## Funcionalidades

- Formulário com campos de **altura** (metros) e **peso** (kg)
- Cálculo automático: `IMC = peso ÷ altura²`
- Régua visual colorida indicando a posição do IMC
- Tabela completa de classificação da OMS com destaque na linha correspondente
- Validação de entradas e mensagens de erro
- Botão para recalcular

## Classificações (OMS)

| Classificação       | IMC (kg/m²) |
|---------------------|-------------|
| Abaixo do peso      | < 18.5      |
| Peso normal         | 18.5 – 25   |
| Sobrepeso           | 25 – 30     |
| Obesidade grau I    | 30 – 35     |
| Obesidade grau II   | 35 – 40     |
| Obesidade grau III  | ≥ 40        |

## Estrutura do projeto

```
calculadora-imc/
├── index.html                          # Ponto de entrada HTML
├── vite.config.js                      # Configuração do Vite
├── package.json
└── src/
    ├── main.jsx                        # Monta o React no DOM
    ├── App.jsx                         # Componente raiz
    ├── index.css                       # Estilo global
    └── components/
        ├── IMCCalculadora.jsx          # Componente principal
        └── IMCCalculadora.module.css   # Estilos do componente
```

## Como executar

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: http://localhost:5173

## Como fazer o build para produção

```bash
npm run build
```

## Tecnologias

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- CSS Modules
