import { Icon, type IconProps } from "@iconify/react"
import type { IconifyIcon } from "@iconify/types"
import type { ComponentProps } from "react"

export type LogoProps = Omit<IconProps, "icon"> & { title?: string }

export function LogoIcon({ title, ...props }: LogoProps & { icon: IconifyIcon }) {
  return <Icon aria-hidden={title ? undefined : true} aria-label={title} role={title ? "img" : undefined} {...props} />
}

export type LogoComponent = (props: LogoProps) => React.ReactNode
export type LogoIconProps = ComponentProps<typeof LogoIcon>

export * from "./generated/react-icons.js"
