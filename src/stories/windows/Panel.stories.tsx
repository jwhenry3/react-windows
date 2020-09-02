import React                             from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta }                   from '@storybook/react/types-6-0'
import Panel, { PanelProps }             from '../../windows/Panel'
import './Panels.css'
import { removeComponent, setComponent } from '../../windows/components'
import Panels                            from '../../windows/Panels'


export default {
  title    : 'Windows/Panel',
  component: Panel
} as Meta

const Template: Story<PanelProps> = () => <Panel uiName="Single" title="Title">{() => <div>Panel!</div>}</Panel>
export const Orchestrated         = () => {
  [1, 2, 3].forEach((num) => setComponent('panel-' + num, (
    <Panel canDrag={true}
           uiName={'panel-' + num}
           title={'Panel ' + num}
           close={() => removeComponent('panel-' + num)}>
      {() => (
        <div>
          Panel {num}
        </div>
      )}
    </Panel>)))
  return <Panels/>
}
export const SinglePanel          = Template.bind({})
