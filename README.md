# Simulador de Colisões

Um simulador de colisões simples feito com React, Matter.js e p5.js. Projeto experimental com foco em física 2D no browser.

## Tecnologias

- **Vite + React + TypeScript**
- **Matter.js** — engine de física (colisões, corpo rígido, restitução)
- **react-p5** — renderização via p5.js

## Funcionalidades

- Arena poligonal com N lados configurável (mínimo 3)
- Slingshot — clique e arraste qualquer bola para lançá-la
- Colisões elásticas entre bolas e bordas
- Fricção configurável via slider
- Modo de colisão pelo centro — reduz o raio físico das bolas para colisões mais precisas com as bordas
- Adição de novas bolas em tempo real — bolas novas ficam paradas no centro até serem lançadas ou receberem colisão

## Instalação

```bash
npm create vite@latest collision-simulator -- --template react-ts
cd collision-simulator
npm install matter-js react-p5
npm install -D @types/matter-js @types/react-p5 @types/p5
```

## Estrutura

```
src/
  components/
    SimulatorCanvas.tsx   # canvas p5 + lógica de render
    Controls.tsx          # painel de controles
  hooks/
    usePolygonArena.ts    # gera e gerencia as paredes do polígono
    useSlingshot.ts       # drag, mira e lançamento
  App.tsx
  App.css
```

## Decisões técnicas

**Por que não Next.js?**
O Matter.js e p5.js são 100% client-side. O SSR do Next não agrega nada aqui — Vite é mais simples e direto.

**Por que separar `usePolygonArena` e `useSlingshot`?**
Mantém a física separada da interação. Facilita reusar ou substituir cada parte de forma independente quando o projeto crescer.

**`isWaiting` em vez de `isStatic`**
Bolas novas não são criadas como estáticas — isso fazia o Matter.js expulsá-las ao detectar sobreposição com as paredes. Em vez disso, a posição e velocidade são congeladas manualmente no loop de draw enquanto `isWaiting === true`.

**`forwardRef` + `useImperativeHandle`**
O método `addBall` vive dentro do `SimulatorCanvas` (onde estão `engineRef` e `bodiesRef`), mas precisa ser acionado pelo `Controls`. O `useImperativeHandle` expõe apenas esse método pro pai, sem vazar estado interno.

## Observações

- Projeto em desenvolvimento — estilização ainda não finalizada
- Parâmetros físicos como `_restingThresh` e `_slop` são propriedades internas do Matter.js e podem mudar em versões futuras