import { Icon, type IconProps } from "@iconify/vue"
import type { IconifyIcon } from "@iconify/types"
import { defineComponent, h, type PropType } from "vue"

export type LogoProps = Omit<IconProps, "icon"> & { title?: string }

export const LogoIcon = defineComponent({
  name: "LogoIcon",
  inheritAttrs: false,
  props: {
    icon: { type: Object as PropType<IconifyIcon>, required: true },
    title: String,
  },
  setup(props, { attrs }) {
    return () =>
      h(Icon, {
        ...attrs,
        icon: props.icon,
        role: props.title ? "img" : undefined,
        "aria-label": props.title,
        "aria-hidden": props.title ? undefined : true,
      })
  },
})

export * from "./generated/vue-icons.js"
