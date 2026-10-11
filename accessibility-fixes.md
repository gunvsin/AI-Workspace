# Accessibility fixes (peer-review high #7)

## Contrast (design.css)
- `--subtle: #5C5C5C` → `#7A7A7A` (4.5:1 on #0F0F0F)
- `--muted: #8A8A8A` → `#9A9A9A` (4.8:1 on #161616)
- Add `--focus: #7A8BFF55` to `:root`

## ARIA (home-page/index.html)
- `<a href="#" class="nav-item" aria-label="Dashboard">Dashboard</a>`
- `<label for="capture-input">Capture note</label>`
- `<textarea id="capture-input" aria-label="Capture note input">`
- `<canvas id="entity-canvas" role="img" aria-label="Entity relationship graph">`
- `role="region" aria-label="Left panel"` on `.pane-left`
- `role="region" aria-label="Dashboard"` on `.pane-right`

## Mobile breakpoint (design.css)
```css
@media (max-width: 480px) {
  .layout { grid-template-columns: 1fr; padding: 0; }
  .pane-left { max-height: none; border-right: none; }
  .metrics { grid-template-columns: 1fr; }
  .pricing-grid { grid-template-columns: 1fr; }
}
```

## Focus ring
```css
:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
```
