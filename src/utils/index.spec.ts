import { expect } from 'expect'
import { test } from 'mocha'

import { pascalToSnake } from '.'

test('pascalToSnake', () => {
  expect(pascalToSnake('HelloWorld')).toBe('hello_world')
  expect(pascalToSnake('helloWorld')).toBe('hello_world')
  expect(pascalToSnake('hello_world')).toBe('hello_world')
  expect(pascalToSnake('hello_world_')).toBe('hello_world_')
})
