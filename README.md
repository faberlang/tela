# Tela — the Faber UI and View Library

**Tela** (Latin: "web, fabric") is Faber's UI/view library. It provides typed
HTML and SVG view values, fail-closed validation, deterministic HTML and CSS
serialization, and the browser seam that mounts a view into a page.

> **Experimental.** Like Faber itself, this library is experimental until
> Faber 2; APIs change without notice.

## Modules

| Import | Role |
| --- | --- |
| `tela:tela` | Kernel: `View`, elements, text, themes, tokens, style bundles, `assemble`, `html_view`, `css` |
| `tela:validate` | Lexical and namespace checks run at the serializer boundary; invalid markup is rejected, never emitted |
| `tela:reference` | Reference component catalog (layout, typography, panel, badge, metric, table, button, field) |
| `tela:browser` | Mount, update and dispose lifecycle over the `tela:dom` seam |
| `tela:dom` | Browser DOM contracts and runtime binding surface |
| `tela:canvas2d` | Canvas2D drawing-surface contract |
| `tela:web` | `WebController` annotation for browser-app entry points |

Views are plain typed values with explicit identity; there is no raw-markup
escape in the ordinary path. Design records are in [`docs/design/`](docs/design/):
[browser lifecycle](docs/design/browser-lifecycle.md),
[identity and hydration](docs/design/identity-hydration.md),
[theme protocol](docs/design/theme-protocol.md).

## Example

```fab
import from "tela:tela" tela

main {
    let _ page ← tela.element_view(tela.html_space(), "p", [tela.text_view("hello")])
    print tela.html_view(page)
}
```

This prints `<p>hello</p>`. More programs are in [`exempla/`](exempla/).

## Using it

Package installation is not yet available in the public toolchain: `faber`
never installs packages. Install `faber` from the
[release page](https://github.com/faberlang/releases/releases/latest) (docs at
[faberlang.dev](https://faberlang.dev)), clone this repository, and pass the
directory that holds it as the library home (`--library-home <DIR>`, or
`[paths] library_home` in your `faber.toml`). `faber` then resolves `tela:*`
from `<DIR>/tela/src/`:

```bash
mkdir libs && git clone https://github.com/faberlang/tela libs/tela
faber doctor --library-home "$PWD/libs"      # library.tela.availability should be faber-package
faber run --library-home "$PWD/libs" main.fab
```

Use an absolute library-home path. The browser modules (`tela:dom`,
`tela:canvas2d`) also need the TypeScript host runtime in [`runtime/`](runtime/),
bound through [`bindings/ts.toml`](bindings/ts.toml).

## Layout

```text
faber.toml     library provider metadata (provider `tela`)
src/           public `tela:*` Faber modules
exempla/       worked examples
runtime/       TypeScript host runtime for tela:dom and tela:canvas2d
bindings/      host-binding manifest
locale/        library-owned locale member fragments
tests/         runtime contract tests
scripta/       source-library checks
docs/          design records and planning history
```

## Licence

Licensed under either of [Apache License, Version 2.0](LICENSE-APACHE) or
[MIT license](LICENSE-MIT) at your option.
