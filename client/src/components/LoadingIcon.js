import { CircularProgress } from '@material-ui/core'
import React from 'react'

export default function LoadingIcon(props) {
  const sizes = {'sm': 20, 'md': 40, }
  const color = props.color || '#ffffff'
  return (
    <CircularProgress size={sizes[props.size]} style={{ color: color }} />
  )
}
