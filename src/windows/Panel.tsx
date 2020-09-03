import React, { Component, ReactNode, useEffect, useState }      from 'react'
import styles                                                    from './Panel.scss'
import { IconButton }                                            from '@material-ui/core'
import { Close, OpenWith }                                       from '@material-ui/icons'
import { focusComponent, getFocusedComponent, updateComponents } from './components'


export declare type ChildFunction = (focused: boolean) => ReactNode;

export interface PanelProps {
  uiName?: string
  title?: string
  x?: number
  y?: number
  hasInitialPosition?: boolean
  children: ReactNode | ChildFunction
  canDrag?: boolean
  close?: () => void
  panelName?: string
  focused?: boolean
}

export interface PanelState {
  hasDragged: boolean
  mouseIsDown: boolean
  dragging: boolean
  originX: number
  originY: number
  x: number
  y: number
}

class Panel extends Component<PanelProps, PanelState> {
  ref!: HTMLDivElement
  focused = false

  constructor(props: PanelProps) {
    super(props)

    this.state = {
      hasDragged : false,
      mouseIsDown: false,
      dragging   : false,
      originX    : 0,
      originY    : 0,
      x          : this.props.x || 0,
      y          : this.props.y || 0
    }
  }

  componentDidMount(): void {
    this.setState({
      hasDragged : !!this.props.hasInitialPosition,
      mouseIsDown: false,
      dragging   : false,
      originX    : 0,
      originY    : 0,
      x          : this.props.x || 0,
      y          : this.props.y || 0
    })
    if (!!this.props.hasInitialPosition || this.props.canDrag) {
      window.addEventListener('resize', this.snapPosition)
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('resize', this.snapPosition)
  }

  onMouseDown = (e: any) => {
    this.setState({
      ...this.state,
      mouseIsDown: true
    })
    window.addEventListener('mouseup', this.onMouseUp)
    if (this.props.canDrag && !this.state.dragging) {
      let x      = e.clientX
      let y      = e.clientY
      let bounds = this.ref.getBoundingClientRect()
      this.setState({
        hasDragged : true,
        mouseIsDown: true,
        dragging   : true,
        originX    : x - bounds.x,
        originY    : y - bounds.y,
        x          : bounds.x,
        y          : bounds.y
      })
      window.addEventListener('mousemove', this.onMouseMove)
    }
  }
  onMouseMove = (e: any) => {
    if (this.props.canDrag) {
      if (this.state.dragging) {
        this.setState({
          hasDragged : true,
          mouseIsDown: true,
          dragging   : true,
          originX    : this.state.originX,
          originY    : this.state.originY,
          x          : e.clientX - this.state.originX,
          y          : e.clientY - this.state.originY
        })
      }
    }
  }
  onMouseUp   = () => {
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('mousemove', this.onMouseMove)
    if (this.props.canDrag) {
      if (this.state.dragging) {
        this.snapPosition()
        return
      }
    }
    this.setState({
      ...this.state,
      mouseIsDown: false
    })
  }

  snapPosition = () => {
    if (!!this.props.hasInitialPosition || (this.props.canDrag && this.state.hasDragged)) {
      let snap = this.getSnappedPosition()
      this.setState({
        hasDragged : true,
        mouseIsDown: false,
        dragging   : false,
        originX    : 0,
        originY    : 0,
        x          : snap.x,
        y          : snap.y
      })
    }
  }

  private getSnappedPosition() {
    let bounds = this.ref.getBoundingClientRect()
    let snap   = {
      x: Math.round(bounds.x / 8) * 8,
      y: Math.round(bounds.y / 8) * 8
    }
    if (snap.x < 16) {
      snap.x = 16
    }
    if (snap.y < 16) {
      snap.y = 16
    }
    if (snap.x + this.ref.offsetWidth > window.innerWidth - 16) {
      snap.x = window.innerWidth - 16 - this.ref.offsetWidth
    }
    if (snap.y + this.ref.offsetHeight > window.innerHeight - 16) {
      snap.y = window.innerHeight - 16 - this.ref.offsetHeight
    }
    return snap
  }

  onRef = (node: HTMLDivElement) => {
    if (node) {
      this.ref = node
      this.snapPosition()
    }
  }

  getStyle(): any {
    return this.state.hasDragged
           ? { position: 'fixed', left: this.state.x, top: this.state.y, transform: 'inherit' } : {}
  }

  renderClose() {
    if (this.props.close) {
      return <IconButton onClick={this.props.close}><Close/></IconButton>
    }
    return ''
  }

  focus = () => {
    if (this.props.uiName) {
      focusComponent(this.props.uiName)
    }
  }

  render() {
    if (!this.props.canDrag) {
      return <div ref={this.onRef}
                  className={styles.panel + ' panel' + (this.props.panelName || '') + (this.props.focused ? ' focused' : '')}
                  style={this.getStyle()}>
        <div className={styles.panelContainer + ' panel-container'} onMouseDown={this.focus}>
          <div className={styles.panelTop + ' panel-top ' + (this.props.title ? 'title' : '')}>
            <div className={styles.left + ' left'}>
            </div>
            <div className={styles.title + ' title'}>{this.props.title}</div>
            <div className={styles.right + ' right'}>
              {this.renderClose()}
            </div>
          </div>
          {typeof this.props.children === 'function' ? (this.props.children as ChildFunction)(!!this.props.focused) : this.props.children}
        </div>
      </div>
    }
    return <div ref={this.onRef}
                className={styles.panel + ' panel' + (this.props.panelName || '') + (this.props.focused ? ' focused' : '')}
                style={this.getStyle()}>
      <div className={styles.panelContainer + ' panel-container'} onMouseDown={this.focus}>
        <div className={styles.panelTop + ' panel-top ' + (this.props.title ? 'title' : '')}
             onMouseDown={this.onMouseDown}>
          <div className={styles.left + ' left'}>
            <IconButton><OpenWith/></IconButton>
          </div>
          <div className={styles.title + ' title'}>{this.props.title}</div>
          <div className={styles.right + ' right'}>
            {this.renderClose()}
          </div>
        </div>
        {typeof this.props.children === 'function' ? (this.props.children as ChildFunction)(!!this.props.focused) : this.props.children}
      </div>
    </div>
  }
}

const PanelWrapper = (props: PanelProps) => {
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    let sub = updateComponents.subscribe(() => {
      let nextFocused = (getFocusedComponent() === props.uiName)
      if (focused !== nextFocused) {
        setFocused(nextFocused)
      }
    })
    return () => sub.unsubscribe()
  }, [focused, setFocused, props.uiName])

  return <Panel {...props} focused={focused}>{props.children}</Panel>
}

export default PanelWrapper
