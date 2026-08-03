import type { IconifyIcon } from "@iconify/types"
import type { ComponentProps, SVGProps } from "react"

export type LogoProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  title?: string
}

export function LogoIcon({ icon, title, ...props }: LogoProps & { icon: IconifyIcon }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${icon.left ?? 0} ${icon.top ?? 0} ${icon.width ?? 16} ${icon.height ?? 16}`}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <g dangerouslySetInnerHTML={{ __html: icon.body }} />
    </svg>
  )
}

export type LogoComponent = (props: LogoProps) => React.ReactNode
export type LogoIconProps = ComponentProps<typeof LogoIcon>

export * from "./generated/react-icons.js"
