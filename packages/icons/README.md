# @persian-labs/icons

A growing collection of Iranian brand logos as native React and Vue components.

```tsx
import { BankMelliColor } from "@persian-labs/icons/react"

<BankMelliColor width={48} title="Bank Melli" />
```

```vue
<script setup lang="ts">
import { BankMelliColor } from "@persian-labs/icons/vue"
</script>

<template><BankMelliColor width="48" aria-label="Bank Melli" /></template>
```

Versioned source SVGs are available in `assets/`, organized as `banks` and `payment-gateways`, each with matching `color` and `mono` variants.

Monochrome icons use `currentColor`, allowing them to follow the consumer's theme foreground color.

Huge credit to [zegond/logos-per-banks](https://github.com/zegond/logos-per-banks) for designing the original SVGs that made this collection possible.
