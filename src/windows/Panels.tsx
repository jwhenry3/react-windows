import React, { useLayoutEffect, useState }              from 'react'
import { displayOrder, getComponents, updateComponents } from './components'

const Panels: React.FC<any> = () => {
  const [componentList, setComponentList] = useState<string[]>([])
  useLayoutEffect(() => {
    let sub = updateComponents.subscribe(() => {
      if (JSON.stringify(displayOrder) !== JSON.stringify(componentList)) {
        setComponentList([...displayOrder])
      }
    })
    if (JSON.stringify(displayOrder) !== JSON.stringify(componentList)) {
      setComponentList([...displayOrder])
    }
    return () => sub.unsubscribe()
  }, [componentList, setComponentList])

  let components = getComponents()
  return componentList.map((key: string) => <React.Fragment key={key}>{components[key]}</React.Fragment>) as any
}

export default Panels
