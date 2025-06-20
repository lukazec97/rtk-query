import React from 'react'

export const Greeting = ({name = 'World'}) => {
  return (
    <h1>Hello, {name}!</h1>
  )
}
