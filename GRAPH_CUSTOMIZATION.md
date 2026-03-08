# Guia de Customização do Grafo de Conhecimento (D3.js)

Este documento explica detalhadamente como personalizar a física, as cores, os ícones e as linhas do componente `<GraphIsland />` e do seu gerador de dados `/graph.json.ts` no projeto Verdant Visual.

---

## 1. Física e Movimento (Forças de Atração e Repulsão)

Toda a física do grafo é controlada pela biblioteca **D3.js** dentro do arquivo `src/components/GraphIsland.astro` (nas linhas onde a `simulation` é declarada).

Para achar esses valores, procure por `const repelForce` e `const linkDistance` na função `initGraph()`.

### Aumentando a Repulsão (Bolinhas mais afastadas)
Para fazer as bolinhas isoladas ou os grupos se empurrarem para mais longe, aumente o peso negativo da força de carga (`charge`):
```typescript
// Padrão atual: repelForce = 0.5; (Força final = -100)
const repelForce = 1.5; // (Força final = -300) -> As bolhas se afastarão com muita agressividade.

const simulation = d3.forceSimulation(data.nodes)
  // Altere o multiplicador (-200) para aumentar ou reduzir a energia invisível que empurra as bolhas
  .force("charge", d3.forceManyBody().strength(-200 * repelForce)) 
```
*Dica:* Valores mais perto de zero (ex: `0.1`) farão as bolinhas ficarem amontoadas. Valores mais altos (ex: `2.0`) espalham a rede por toda a tela.

### Alterando o Tamanho da Linha (Atração entre nós conectados)
Para encurtar ou esticar as "pernas" que ligam um nó ao outro, mude o `linkDistance`:
```typescript
const linkDistance = 60; // Tente 120 para teias muito longas, ou 30 para teias ultra curtas.
```

### Tamanho das Bolinhas (Node Radius)
O tamanho das bolinhas não é fixo; ele cresce de acordo com o `weight` (quantas conexões aquela tecnologia/projeto tem).
```typescript
const nodeRadius = (d: any) => {
    const weight = d.weight || 0;
    // O raio base é 8. Multiplicamos a raiz quadrada do peso por 4 para criar o tamanho dinâmico.
    return 8 + Math.sqrt(weight) * 4; 
};
```
* Se quiser bolinhas gigantes: `return 15 + weight * 5;`
* Se quiser que todas fiquem do mesmo tamanho não importando a relevância: `return 10;`

---

## 2. Linhas (Edges)

As linhas cinzas que conectam projeto ↔ tecnologia são criadas através dos elementos `<line>` gerados pelo subgrupo de links no SVG.

Para mudar as rotas, acesse a sessão `// Draw Links` no mesmo arquivo `GraphIsland.astro`:
```typescript
const link = svgGroup
    .append("g")
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("stroke", "#475569") // COR DA LINHA (Padrão: Slate-600 do Tailwind)
    .attr("stroke-width", 2)   // GROSSURA DA LINHA (Padrão: 2px)
    .attr("stroke-opacity", 0.6); // TRANSPARÊNCIA DA LINHA
```
Experimente trocar `"#475569"` para `var(--fallback-p,oklch(var(--p)))` para tentar amarrar com a cor Primária do Tema, ou use um HEX brilhante como `"#10b981"` para neon verde.

---

## 3. Cores das Bolhas (Theme / Categories)

O mapa de cores das bolinhas é definido pelo objeto `colorMap` no início de `initGraph()` no `GraphIsland.astro`:
```typescript
const colorMap: Record<string, { fill: string; stroke: string }> = {
    projects: { fill: "#38bdf8", stroke: "#0284c7" }, // Azul Claro (Sky)
    blog: { fill: "#a78bfa", stroke: "#7c3aed" },     // Roxo (Violet)
    services: { fill: "#facc15", stroke: "#ca8a04" }, // Amarelo (Yellow)
    topics: { fill: "#34d399", stroke: "#059669" },   // Verde (Emerald)
    tags: { fill: "#94a3b8", stroke: "#475569" },     // Cinza (Slate)
    unknown: { fill: "#64748b", stroke: "#334155" },  // Fallback (Slate Escuro)
};
```
> Nota: O fundo do `<div id="graph-wrapper">` é fixamente `<div class="bg-[#0f172a]">` (um azul escuro) porque se o fundo do grafo fosse branco em Light Mode, esses links brancos e tons neons ficariam ilegíveis. Se for usar Light Mode no grafo, mude o fundo para transparente `bg-transparent` e reajuste os HEX codes no colorMap acima para cores mais escuras/vivas.

---

## 4. Ícones (Buscando e Atualizando)

Os ícones que flutuam dentro das bolinhas maiores são injetados pela **CDN do SimpleIcons** (`https://cdn.simpleicons.org/`). Eles não estão baixados fisicamente no seu projeto para poupar peso.

### A. Como declarar ícones em novas Tags/Tópicos:
1. Acesse o site oficial: **[simpleicons.org](https://simpleicons.org/)**
2. Pesquise pela linguagem (Ex: "Docker", "Tailwind CSS", "Astro").
3. Veja o nome de slug exato na URL ou ao clicar no ícone na página.
4. Vá no seu arquivo do banco de dados (ex: `src/content/tags/docker.md`) e coloque no Frontmatter:
   ```yaml
   ---
   title: "Docker"
   icon: "docker" # Nome exato idêntico ao site do SimpleIcons
   category: "tool"
   ---
   ```

### B. Como a engine converte esse nome na bolinha e pinta da cor certa?
Se você observar o arquivo `src/pages/graph.json.ts`, nós interceptamos o nome do ícone:
```typescript
const getIconInfo = (icon?: string) => icon ? `https://cdn.simpleicons.org/${icon}/ffffff` : undefined;
```
Por causa do `/ffffff` no fim da URL, o site da CDN instantaneamente renderiza o original (por exemplo, laranja pro Git) para uma tinta Branca (FFFFFF). 

Se você der uma olhada no seu Taxonomy Page `tags/[slug].astro`, há também uma regra avançada que pinta os ícones da nuvem de amarelo:
```typescript
<img src={`https://cdn.simpleicons.org/${tag.data.icon}/${tag.data.category === "cloud" ? "f59e0b" : "ffffff"}`} />
```

Se desejar alterar a cor dos ícones renderizados **DENTRO** das esferas do Node, abra o `GraphIsland.astro` e procure pela propriedade `href` da `<image>` gerada dinamicamente:
```typescript
d.icon ? d.icon.replace('ffffff', '000000') : null
```
(No código atual ele simplesmente insere o que veio da graph API, que é 100% branco).

---

### Resumo Curto para Mudanças Rápidas
- **Quero que o Grafo ocupe a tela inteira**: 
  Acesse `GraphIsland.astro`, mude `h-[500px]` para `h-screen`.
- **Quero desligar o zoom / panning**:
  No SVG builder `.call(d3.zoom()...)` apague a instrução inteira.
- **Minha Tag não tem bolinha**:
  Confira se criou o arquivo respectivo (`src/content/tags/minha-tag.md`) e se ela está indexada nos arrays do `src/content/projects/meu-projeto.mdx`.
