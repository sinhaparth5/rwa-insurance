"use client"

import { Alert as ChakraAlert } from "@chakra-ui/react"
import { forwardRef } from "react"

export interface AlertRootProps extends ChakraAlert.RootProps {}

export const Alert = {
  Root: forwardRef<HTMLDivElement, AlertRootProps>(function AlertRoot(props, ref) {
    return <ChakraAlert.Root ref={ref} {...props} />
  }),
  
  Indicator: forwardRef<SVGSVGElement, ChakraAlert.IndicatorProps>(function AlertIndicator(props, ref) {
    return <ChakraAlert.Indicator ref={ref} {...props} />
  }),
  
  Title: forwardRef<HTMLHeadingElement, ChakraAlert.TitleProps>(function AlertTitle(props, ref) {
    return <ChakraAlert.Title ref={ref} {...props} />
  }),
  
  Description: forwardRef<HTMLParagraphElement, ChakraAlert.DescriptionProps>(function AlertDescription(props, ref) {
    return <ChakraAlert.Description ref={ref} {...props} />
  })
}