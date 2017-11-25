import React from 'react'
import connect from 'refunk'

import {
  ThemeProvider
} from 'glamorous'

import EditorCss from './ComponentEditorCss'

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live'

import {
  Div
} from '@compositor/mono'

import Box from './Box'
import Flex from './Flex'

const transform = (theme, code) => `
  <ThemeProvider theme={${JSON.stringify(theme)}}>
    <div>
      ${code}
    </div>
  </ThemeProvider>
`

const ComponentEditor = ({
  theme,
  library,
  component,
  editor,
  update
}) => {
  const scope = Object.assign({}, { Flex, Box }, library, {
    ThemeProvider,
    theme
  })

  const code = editor.currentExample === 'all'
    ? editor.examples.join("\n\n")
    : editor.examples[editor.currentExample]

  return (
    <Div my={4}>
      <LiveProvider
        key={component.name}
        scope={scope}
        code={code}
        transformCode={newCode => transform(theme, newCode)}
      >
        <Flex
          wrap
          flexDirection={['column', 'row', 'row']}
        >
          <Box
            py={[3, 4, 4]}
            w={[1, 1/2, 1/2]}
          >
            <LivePreview />
          </Box>
          <Box
            w={[1, 1/2, 1/2]}
          >
            <LiveEditor />
          </Box>
          <Box w={1}>
            <LiveError
              style={{
                backgroundColor: theme.colors.red,
                color: 'white',
                padding: '.5rem',
                height: 'auto'
              }}
            />
          </Box>
        </Flex>

				<style dangerouslySetInnerHTML={{ __html: EditorCss }} />
      </LiveProvider>

      Examples:

      {editor.examples.length > 1 && (
        <Div>
          <a
            href='#!'
            children='All'
            onClick={() => update(state => {
              const newState = Object.assign({}, state)

              newState.editors[component.name].currentExample = 'all'

              return newState
            })}
          />

          {editor.examples.map((ex, i) =>
            <a
              key={i}
              href='#!'
              children={i}
              onClick={() => update(state => {
                const newState = Object.assign({}, state)

                newState.editors[component.name].currentExample = i

                return newState
              })}
            />
          )}
        </Div>
      )}
    </Div>
  )
}

export default connect(ComponentEditor)
