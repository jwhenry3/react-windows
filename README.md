# react-windows

> movable and focusable windows

[![NPM](https://img.shields.io/npm/v/react-windows.svg)](https://www.npmjs.com/package/react-windows) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-windows
```

## Usage

```tsx
import React, { Component } from 'react'

import {Panel, Panels, setComponent} from '@jwhenry/react-windows';

export default MyComponent extends React.Component {

    componentDidMount() {
        setComponent('test', <Panel>{(focused) => <div>Content</div>}</Panel>);
    }

    render() {
        return <Panels/>;
    }
}
```

## License

MIT © [jwhenry3](https://github.com/jwhenry3)
