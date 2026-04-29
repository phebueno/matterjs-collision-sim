# Simulador de Colisões

Um simulador de colisões simples feito com React, Matter.js e p5.js. Projeto experimental com foco em física 2D no browser.

## Tecnologias

- **Vite + React + TypeScript**
- **Matter.js** — engine de física (colisões, corpo rígido, restitução)
- **react-p5** — renderização via p5.js

## Funcionalidades

- Arena poligonal com N lados configurável (mínimo 3)
- Edição dos vértices do polígono diretamente no canvas
- Slingshot — clique e arraste qualquer bola para lançá-la
- Colisões elásticas entre bolas e bordas
- Fricção configurável via slider
- Modo de colisão pelo centro — reduz o raio físico das bolas para colisões mais precisas com as bordas
- Adição de novas bolas em tempo real — bolas novas ficam paradas no centro até serem lançadas ou receberem colisão
- Reset de bolas e lançamento aleatório com velocidade fixa

## Instalação

### Clonando o repositório

```bash
git clone <url-do-repo>
cd collision-simulator
npm install
npm run dev
```

### Criando do zero

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

## Modelo de movimento

O simulador não usa o `frictionAir` nativo do Matter.js. Em vez disso, implementa um modelo de arrasto customizado aplicado a cada frame via `Events.on(engine, 'beforeUpdate')`.

### Arrasto inversamente proporcional à velocidade

A fórmula aplicada é:

```
drag = friction / speed
factor = 1 - drag
v_nova = v_atual * factor
```

Ao contrário do arrasto linear (`v * b`) ou quadrático (`v² * b`), esse modelo produz um comportamento onde o arrasto é **fraco em altas velocidades** e **forte em baixas velocidades**. O resultado prático é que a bola desliza com pouca perda de velocidade enquanto está rápida, e desacelera bruscamente quando já está lenta.

Esse comportamento não corresponde diretamente a um fenômeno físico clássico, mas é intuitivamente próximo de uma superfície com **atrito estático dominante** — onde a resistência ao movimento aumenta conforme o objeto perde momentum.

### Threshold de parada

Para evitar que a bola fique se movendo indefinidamente em velocidades residuais muito baixas (comportamento comum em decaimentos exponenciais), há um threshold explícito:

```ts
if (speed < 0.2) {
  Matter.Body.setVelocity(ball, { x: 0, y: 0 })
  return
}
```

Abaixo de `0.2` de velocidade, a bola para imediatamente. Isso evita o problema do decaimento exponencial, onde matematicamente a velocidade nunca chega a zero.

### Por que não usar `frictionAir` nativo?

O `frictionAir` do Matter.js implementa decaimento exponencial linear (`v * (1 - frictionAir)` por frame). O problema desse modelo é que a bola passa muito tempo em velocidades baixas antes de parar — o que dá um feeling de "rastejando" no final do movimento. O modelo customizado resolve isso invertendo a curva de desaceleração.

## Decisões técnicas

**Por que não Next.js?**
O Matter.js e p5.js são 100% client-side. O SSR do Next não agrega nada aqui — Vite é mais simples e direto.

**Por que separar `usePolygonArena` e `useSlingshot`?**
Mantém a física separada da interação. Facilita reusar ou substituir cada parte de forma independente quando o projeto crescer.

**`isWaiting` em vez de `isStatic`**
Bolas novas não são criadas como estáticas — isso fazia o Matter.js expulsá-las ao detectar sobreposição com as paredes. Em vez disso, a posição e velocidade são congeladas manualmente no loop de draw enquanto `isWaiting === true`.

**`forwardRef` + `useImperativeHandle`**
O método `addBall` vive dentro do `SimulatorCanvas` (onde estão `engineRef` e `bodiesRef`), mas precisa ser acionado pelo `Controls`. O `useImperativeHandle` expõe apenas esse método pro pai, sem vazar estado interno.

**`frictionRef` para sincronizar o slider**
O `beforeUpdate` é registrado dentro de um `useEffect` com dependências vazias — o closure congelaria o valor inicial de `friction` para sempre. A solução é manter uma `frictionRef` atualizada via `useEffect([friction])`, e ler `frictionRef.current` dentro do evento.

## Observações

- Projeto em desenvolvimento — estilização ainda não finalizada
- Parâmetros físicos como `_restingThresh` e `_slop` são propriedades internas do Matter.js e podem mudar em versões futuras