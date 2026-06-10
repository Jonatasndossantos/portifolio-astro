# i18n — Internacionalização e Estrutura de Conteúdo

Este diretório é a **fonte da verdade** de todo o conteúdo traduzível do portfólio.
O conteúdo vive aqui como JSON puro — desacoplado de TypeScript, frameworks e CMSs.

---

## Filosofia

| Princípio | Decisão |
|---|---|
| Fonte da verdade | JSON por locale em `src/dictionaries/` (ex: `ui/pt.json`) |
| Roteamento i18n | Astro nativo (`/[locale]/...`) |
| Componentes | Usam a função Laravel-style `__()` |
| Textos Grandes | Usam Coleções de Conteúdo (Pastas `pt`, `en` no `.md`) |
| Build | 100% estático — sem requisições em runtime |

---

## Estrutura de pastas

Textos curtos de UI (Botões, Menus) vivem em pastas genéricas:

```
src/dictionaries/
  ui/
    en.json
    pt.json
    fr.json
```

---

## Formato do JSON

Cada arquivo é **um único locale**, com chaves flat:

```json
// src/dictionaries/nav/pt.json
{
  "title": "Portfólio Multiverso",
  "audio": "Alternar Áudio",
  "fullstack": "Fullstack",
  "frontend": "Frontend"
}
```

---

## Como usar nos componentes

### Astro (build-time, zero JS)

Usamos o clássico formato Laravel `__()`:

```astro
---
import { useTranslator } from '../i18n/index';
// Retorna a função tradutora que já pega o JSON certo ou faz fallback pra String
const __ = await useTranslator(lang, 'ui');
---

<span>{__('Home')}</span>
<a href="...">{__('Welcome, :name', { name: 'Jhon' })}</a>
```

### React (recebe como prop do Astro pai)

```astro
<!-- No .astro pai -->
const hero = await getTranslations(lang, 'fullstack-hero');
<HeroComponent bio={hero.bio} role={hero.role} />
```

```tsx
// No componente React — só strings, sem hook de runtime
const HeroComponent = ({ bio, role }: { bio: string; role: string }) => (
  <section>
    <h1>{role}</h1>
    <p>{bio}</p>
  </section>
);
```

---

## Workflow de traduções

```bash
# 1. Adicionar as traduções no arquivo em português (seu main)
#    src/dictionaries/ui/pt.json
# 2. Replicar a chave no `en.json`.
```

> [!NOTE]
> Para posts de Blog ou Textos Grandes, NÃO USE os arquivos JSON. Use o sistema de Content Collections do Astro (`src/content/blog/pt/...`). O Astro já está programado para fazer Fallback automático de rotas caso falte tradução.

---

## Locales suportados

| Código | Idioma |
|---|---|
| `en` | English (base, obrigatório) |
| `pt` | Português |
| `fr` | Français |
| `es` | Español |
| `zh` | 中文 |
| `ja` | 日本語 |
| `en-GB` | English (UK) |

---

## Padronização de Títulos (SectionHeader)

Para manter a consistência visual em todas as seções, os dicionários em `portfolio/*.json` seguem o padrão do componente `SectionHeader.astro`:

- **`label`**: (String) O rótulo em caixa alta prefixado por `//`. Use para contexto (ex: "Portfólio", "Arsenal", "Serviços").
- **`title`**: (String) O texto principal do título em Syncopate.
- **`highlightedTitle`**: (String) A parte do título que recebe cor primária automática.

> [!IMPORTANT]
> **NUNCA injete HTML ou classes CSS** (ex: `<span class="text-primary">`) diretamente nos valores do JSON. O componente `SectionHeader` já cuida de todo o estilo e destaque. Isso evita erros de renderização e quebras de acessibilidade em diferentes idiomas.
