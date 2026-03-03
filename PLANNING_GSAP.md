# Planejamento Futuro: Performance Extrema e GSAP

Este documento registra a estratégia arquitetural adotada no portfólio **Verdant Visual** para atingir níveis de performance e fluidez comparáveis aos maiores desenvolvedores independentes e estúdios Awwwards (inspirado na arquitetura de Dennis Snellenberg).

Como o projeto utiliza **Astro**, já possuímos a fundação perfeita (Zero-JS e SSG). O objetivo deste plano é guiar a integração futura de animações complexas (GSAP) sem sacrificar o `PageSpeed` ou o `Lighthouse`.

---

## 1. A Filosofia de Alta Performance

A regra de ouro para manter a velocidade enquanto se constrói um site visualmente rico é a **separação estrita entre conteúdo e animação**:

- **O HTML e CSS Nativos vêm primeiro:** O conteúdo principal (textos, botões, imagens essenciais do topo) deve renderizar instantaneamente (`< 100ms`).
- **Nenhum bloqueio de Renderização:** Ferramentas pesadas (GSAP, Spline 3D) nunca devem bloquear a primeira pintura da tela (FCP/LCP). Elas entram de forma assíncrona.
- **SSR / SSG:** Tudo o que puder ser pré-renderizado no *build*, deve ser. Nenhuma computação pesada no servidor durante o clique do usuário.
- **Distribuição na Borda (Edge CDN):** Hospedagem em plataformas como Cloudflare Pages, Vercel ou GitHub Pages, servindo o site estático do nó geográfico mais próximo do usuário.

## 2. O Papel do Astro (Por que somos rápidos?)

Diferente de frameworks como Next.js ou Nuxt, que enviam um mega-bundle de JavaScript para "reidratar" a página no navegador (o que consome muito tempo de CPU em dispositivos móveis), o Astro envia **HTML puro**.

O único JS que enviamos ao cliente é extremamente seletivo, injetado de forma assíncrona. 

## 3. O Ecossistema de Animação

A "trindade" do movimento no Verdant Visual será composta por:

1. **Lenis (Studio Freight):** Já implementado no `Layout.astro`. Substitui a rolagem nativa e "dura" do navegador por uma rolagem contínua baseada em interpolação linear (LERP) a 60fps, sem "sequestrar" o nativo do mouse.
2. **GSAP (GreenSock):** O motor matemático ultra-otimizado para animações complexas baseadas em tempo. Ele usará transformações CSS 3D (`transform: translate3d`) injetadas via hardware (GPU) para não causar *reflow* de layout.
3. **ScrollTrigger (Plugin GSAP):** Escuta o evento de rolagem (oferecido pelo Lenis) e dispara as funções do GSAP nos elementos exatos quando entram na tela.

---

## 4. O Padrão de Estrutura do HTML (O "Pulo do Gato")

Ao invés de tentar misturar estado e lógica visual dentro da marcação (como classes Tailwind complexas ou estados React), a marcação HTML fica deliberadamente crua, funcionando como "âncoras" estruturais.

### Exemplo atual no `Hero.astro`
Nós já preparamos o campo. Retiramos animações Tailwind/CSS e estruturamos assim:

```html
<div class="overflow-hidden">
    <h1 data-gsap="hero-title">
        Engaging Text
    </h1>
</div>
```

**Por que fazemos isso?**
- O `overflow-hidden` atua como uma máscara impenetrável.
- O Javascript central (GSAP) vai procurar pela marcação `[data-gsap="hero-title"]` quando o arquivo carregar assincronamente.
- O GSAP vai empurrar o `<h1>` 100% para baixo (escondendo-o atrás da máscara). Quando a tela carregar, ele desliza o elemento para cima de maneira impecavelmente fluida.
- O resultado é a animação limpa típica de *agências*, revelando palavras debaixo de linhas invisíveis.

---

## 5. Como Implementar o GSAP no Futuro

Quando for a hora de implementar, siga este roteiro exato para não "quebrar" a performance do Astro:

1. **Instale as dependências:**
   ```bash
   npm install gsap @gsap/react
   ```

2. **Crie um arquivo central de Animações:**
   Não espalhe scripts do GSAP por cada componente. Crie um arquivo central (ex: `src/utils/animations.ts` ou um script no final do `Layout.astro`).

3. **Integração Lenis + ScrollTrigger (Crucial):**
   O GSAP e o Lenis precisam sincronizar seus relógios internos. Você precisará conectar o Ticker do GSAP ao loop do Lenis:

   ```javascript
   import { gsap } from "gsap";
   import { ScrollTrigger } from "gsap/ScrollTrigger";
   import Lenis from "lenis";

   gsap.registerPlugin(ScrollTrigger);

   const lenis = new Lenis();

   // Sincroniza o Lenis com o ScrollTrigger
   lenis.on('scroll', ScrollTrigger.update);
   gsap.ticker.add((time) => {
       lenis.raf(time * 1000);
   });
   gsap.ticker.lagSmoothing(0);
   ```

4. **Animação em Lote (Batching):**
   Ao invés de escutar milhares de elementos individuais, crie utilitários que peguem todos os atributos `data-gsap="fade-up"` do site e apliquem a animação de uma vez.

   ```javascript
   const elements = document.querySelectorAll('[data-gsap="hero-title"]');
   
   elements.forEach(el => {
       gsap.fromTo(el, 
           { y: "100%", opacity: 0 }, 
           { 
               y: "0%", 
               opacity: 1, 
               duration: 1.2, 
               ease: "power4.out",
               scrollTrigger: {
                   trigger: el.parentElement, // Use o div.overflow-hidden como trigger
                   start: "top 80%", // Começa quando o topo do pai atinge 80% da tela
               }
           }
       );
   });
   ```

## 6. Considerações Arquiteturais
- **Componentes React (Ex: Spline):** Como vimos, carregá-los bloqueia o pipeline. O Spline já está nativo (`<script>` web component) e configurado com um `setTimeout(..., 500)` para diferir seu carregamento até que o Paint crítico acabe. Essa lógica deve ser mantida.
- **Acessibilidade Absoluta:** Usuários que têm opção "Reduzir Movimento" (`prefers-reduced-motion`) ativada no SO devem ter o GSAP instantaneamente desativado para evitar labirintite visual (`gsap.matchMedia()`).
