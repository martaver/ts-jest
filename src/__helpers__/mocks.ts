import { testing } from 'bs-logger'

import { rootLogger } from '../util/logger'

export const logTargetMock = (): testing.LogTargetMock => (rootLogger as testing.LoggerMock).target

export const mockObject = <T, M>(obj: T, newProps: M): T & M & { mockRestore: () => T } => {
  const backup: any = Object.create(null)

  Object.keys(newProps).forEach((key) => {
    const desc = (backup[key] = Object.getOwnPropertyDescriptor(obj, key))
    const newDesc: any = { ...desc }
    if (newDesc.get) {
      newDesc.get = () => (newProps as any)[key]
    } else {
      newDesc.value = (newProps as any)[key]
    }
    Object.defineProperty(obj, key, newDesc)
  })
  if ((obj as any).mockRestore) backup.mockRestore = Object.getOwnPropertyDescriptor(obj, 'mockRestore')

  return Object.defineProperty(obj, 'mockRestore', {
    value() {
      Object.keys(backup).forEach((key) => {
        Object.defineProperty(obj, key, backup[key])
      })

      return obj
    },
    configurable: true,
  })
}

interface MockWriteStream {
  written: string[]
  write(text: string): void
  clear(): void
}

export const mockWriteStream = (): MockWriteStream => ({
  written: [] as string[],
  write(text: string): void {
    this.written.push(text)
  },
  clear(): void {
    this.written = []
  },
})
