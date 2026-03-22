import { clsxm } from '@zolplay/utils'
import React from 'react'

type ContainerProps = React.ComponentPropsWithoutRef<'div'>

const OuterContainer = React.forwardRef<HTMLDivElement, ContainerProps>(
  function OuterContainer({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsxm('sm:px-8', className)} {...props}>
        <div className="mx-auto max-w-7xl 2xl:max-w-[1400px] lg:px-8">{children}</div>
      </div>
    )
  }
)

const InnerContainer = React.forwardRef<HTMLDivElement, ContainerProps>(
  function InnerContainer(
    { className, children, ...props }: ContainerProps,
    ref
  ) {
    return (
      <div
        ref={ref}
        className={clsxm('relative px-4 sm:px-8 lg:px-12', className)}
        {...props}
      >
        <div className="mx-auto max-w-2xl lg:max-w-5xl 2xl:max-w-6xl">{children}</div>
      </div>
    )
  }
)

const ContainerComponent = React.forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ children, ...props }: ContainerProps, ref) {
    return (
      <OuterContainer ref={ref} {...props}>
        <InnerContainer>{children}</InnerContainer>
      </OuterContainer>
    )
  }
)

export const Container = Object.assign(ContainerComponent, {
  Outer: OuterContainer,
  Inner: InnerContainer,
})
