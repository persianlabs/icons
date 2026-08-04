import { defineComponent, h, type PropType } from "vue"
import type { LogoIconData } from "./types.js"

export type LogoProps = Record<string, unknown> & { title?: string }

export const LogoIcon = defineComponent({
  name: "LogoIcon",
  inheritAttrs: false,
  props: {
    icon: { type: Object as PropType<LogoIconData>, required: true },
    title: String,
  },
  setup(props, { attrs }) {
    return () =>
      h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: `${props.icon.left ?? 0} ${props.icon.top ?? 0} ${props.icon.width ?? 16} ${props.icon.height ?? 16}`,
          "aria-hidden": props.title ? undefined : true,
          "aria-label": props.title,
          role: props.title ? "img" : undefined,
          ...attrs,
        },
        [
          props.title ? h("title", props.title) : null,
          h("g", { innerHTML: props.icon.body }),
        ]
      )
  },
})

export * from "./generated/vue-icons.js"
