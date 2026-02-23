# Vuetify 4 Breaking Changes — Potential ESLint Rules

Breaking changes and deprecations from Vuetify 3 → 4 that could be detected and/or auto-fixed by ESLint plugin rules.

> Source: Vuetify MCP `get_v4_breaking_changes` and `get_upgrade_guide` (v3 → v4)

---

## 1. `no-deprecated-props` additions

These are new prop deprecations/renames in v4 that should be added to the existing rule.

| Component    | Deprecated Prop                  | Replacement                     | Auto-fixable        |
|--------------|----------------------------------|---------------------------------|---------------------|
| `v-row`      | `dense`                          | `density="compact"`             | Yes                 |
| `v-row`      | `align`                          | utility class `align-*`         | Yes (move to class) |
| `v-row`      | `justify`                        | utility class `justify-*`       | Yes (move to class) |
| `v-row`      | `align-content`                  | utility class `align-content-*` | Yes (move to class) |
| `v-row`      | `align-sm`, `align-md`, etc.     | responsive utility classes      | Yes (move to class) |
| `v-row`      | `justify-sm`, `justify-md`, etc. | responsive utility classes      | Yes (move to class) |
| `v-col`      | `order`                          | utility class `order-*`         | Yes (move to class) |
| `v-col`      | `order-sm`, `order-md`, etc.     | responsive utility classes      | Yes (move to class) |
| `v-col`      | `align-self`                     | utility class `align-self-*`    | Yes (move to class) |
| `v-snackbar` | `multi-line`                     | `min-height="68"`               | Yes                 |

## 2. `no-deprecated-slots` additions

New slot renames in v4 to add to the existing rule.

| Component                                    | Deprecated Slot                                       | Replacement                                                 | Auto-fixable                 |
|----------------------------------------------|-------------------------------------------------------|-------------------------------------------------------------|------------------------------|
| `v-select` / `v-autocomplete` / `v-combobox` | `#item="{ item }"` accessing `.title`, `.value`, etc. | `#item="{ internalItem }"` (item is now `internalItem.raw`) | Partially (rename slot prop) |
| `v-snackbar-queue`                           | `#default`                                            | `#item`                                                     | Yes                          |

## 3. `no-deprecated-classes` additions

New class deprecations/renames in v4.

### Typography classes (MD2 → MD3)

| Deprecated Class  | Replacement            | Auto-fixable |
|-------------------|------------------------|--------------|
| `text-h1`         | `text-display-large`   | Yes          |
| `text-h2`         | `text-display-medium`  | Yes          |
| `text-h3`         | `text-display-small`   | Yes          |
| `text-h4`         | `text-headline-large`  | Yes          |
| `text-h5`         | `text-headline-medium` | Yes          |
| `text-h6`         | `text-headline-small`  | Yes          |
| `text-subtitle-1` | `text-body-large`      | Yes          |
| `text-body-1`     | `text-body-large`      | Yes          |
| `text-body-2`     | `text-body-medium`     | Yes          |
| `text-caption`    | `text-body-small`      | Yes          |
| `text-button`     | `text-label-large`     | Yes          |
| `text-subtitle-2` | `text-label-large`     | Yes          |
| `text-overline`   | `text-label-small`     | Yes          |

### Elevation classes (MD2 → MD3)

| Deprecated Class                     | Notes                        | Auto-fixable              |
|--------------------------------------|------------------------------|---------------------------|
| `elevation-6` through `elevation-24` | MD3 only supports levels 0–5 | No (needs manual mapping) |

### Grid offset classes

| Deprecated Class | Replacement      | Auto-fixable |
|------------------|------------------|--------------|
| `offset-*`       | `v-col-offset-*` | Yes          |

## 4. `no-deprecated-classes` — typography additions

Covered by section 3 above (MD2 → MD3 typography class renames). No separate rule needed — extend `no-deprecated-classes`.

## 5. NEW RULE: `v-form-slot-refs`

Detect usage of `.value` on `v-form` slot props that are no longer refs in v4.

| Pattern                                       | Fix            | Auto-fixable |
|-----------------------------------------------|----------------|--------------|
| `isValid.value` in `v-form` default slot      | `isValid`      | Yes          |
| `isDisabled.value` in `v-form` default slot   | `isDisabled`   | Yes          |
| `isReadonly.value` in `v-form` default slot   | `isReadonly`   | Yes          |
| `isValidating.value` in `v-form` default slot | `isValidating` | Yes          |
| `errors.value` in `v-form` default slot       | `errors`       | Yes          |
| `items.value` in `v-form` default slot        | `items`        | Yes          |

This would require inspecting the template AST inside `<v-form>`'s default slot to find member expressions like `isValid.value` and remove the `.value` suffix.

## 6. NEW RULE: `no-legacy-grid-props`

A dedicated rule (or extension of `grid-unknown-attributes`) to flag removed grid props and suggest replacements.

Covers the prop changes listed in section 1 above but as a standalone rule focused on the grid overhaul:

- `v-row` props `dense`, `align`, `justify`, `align-content` and their responsive variants
- `v-col` props `order`, `align-self` and their responsive variants
- Could also flag direct usage of removed CSS classes like `.offset-*` → `.v-col-offset-*`

## 7. NEW RULE: `no-elevation-overflow`

Flag elevation classes `elevation-6` through `elevation-24` since MD3 only supports levels 0–5. Suggest the closest MD3 equivalent.

| Range                            | Suggested MD3 Level |
|----------------------------------|---------------------|
| `elevation-6` to `elevation-8`   | `elevation-4`       |
| `elevation-9` to `elevation-12`  | `elevation-5`       |
| `elevation-13` to `elevation-24` | `elevation-5`       |

Auto-fixable: Yes (map to nearest MD3 level).

## 8. NEW RULE: `no-v-select-item-slot-rename`

Specifically detect slot usage patterns in `v-select`, `v-autocomplete`, and `v-combobox` where `item.title`, `item.value`, or similar properties are accessed (which were previously `internalItem` properties) and suggest updating to `internalItem`.

This is subtle because `item` still exists in v4 but now means `internalItem.raw` — so usages like `item.raw.name` should become `item.name`, and `item.title` should become `internalItem.title`.

Auto-fixable: Partially (can rename the destructured variable, but deeper access patterns need manual review).

## 9. NEW RULE: `theme-color-transparency`

Flag the deprecated `rgba(var(--v-theme-*), opacity)` pattern in `<style>` blocks and suggest the v4 `color-mix()` or `rgb(from ...)` syntax.

| Deprecated Pattern                  | Replacement                                                        |
|-------------------------------------|--------------------------------------------------------------------|
| `rgba(var(--v-theme-primary), 0.8)` | `color-mix(in srgb, rgb(var(--v-theme-primary)) 80%, transparent)` |

Auto-fixable: Yes (regex replacement in `<style>` blocks).

## 10. `no-deprecated-components` additions

No new component removals were listed in the v4 breaking changes, but worth checking:

| Component          | Change                                                                            |
|--------------------|-----------------------------------------------------------------------------------|
| `v-snackbar-queue` | Internal rewrite — `default` slot renamed to `item` (covered by slots rule above) |

---

## Summary: Priority ranking

| Priority   | Rule / Change                                           | Impact                    | Effort                     |
|------------|---------------------------------------------------------|---------------------------|----------------------------|
| **High**   | Add grid prop deprecations to `no-deprecated-props`     | Very common in codebases  | Low (extend existing data) |
| **High**   | Add MD2 → MD3 typography to `no-deprecated-classes`     | Common                    | Low (extend existing data) |
| **High**   | Add `v-snackbar` `multi-line` to `no-deprecated-props`  | Common                    | Low                        |
| **High**   | `v-form-slot-refs` (new rule)                           | Subtle runtime bug        | Medium                     |
| **Medium** | `v-select` item → internalItem slot rename              | Common in complex selects | Medium                     |
| **Medium** | `v-snackbar-queue` slot rename in `no-deprecated-slots` | Less common component     | Low                        |
| **Medium** | Elevation overflow rule                                 | Common in themed apps     | Low                        |
| **Medium** | Grid offset class rename in `no-deprecated-classes`     | Common                    | Low                        |
| **Low**    | `theme-color-transparency`                              | Niche (style blocks)      | High (style AST parsing)   |
