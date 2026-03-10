import { beforeEach, describe, expect, test } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useContentStore } from '@/stores/content'
import { useUserStore } from '@/stores/user'

describe('stores', () => {
  beforeEach(() => {
    const storage = new Map<string, string>()
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
        clear: () => storage.clear(),
      },
      configurable: true,
    })
    setActivePinia(createPinia())
  })

  test('persists auth, menu and home data on login', () => {
    const userStore = useUserStore()
    const payload = {
      token: 'token-123',
      user: {
        usuario: 'demo',
      },
      menu: [
        {
          name: 'Modulo',
          sub: [
            { id: 1, url: 'seccion/intro', internal_name: 'intro', active: 'yes' },
          ],
        },
      ],
      home: {
        url: 'seccion/intro',
        internal_name: 'intro',
      },
    }

    userStore.$setLogin(payload)

    expect(userStore.token).toBe('token-123')
    expect(window.localStorage.getItem('token')).toBe('token-123')
    expect(window.localStorage.getItem('home')).toContain('seccion/intro')
    expect(window.localStorage.getItem('menu')).toContain('intro')
  })

  test('clears persisted session data on logout', () => {
    const contentStore = useContentStore()
    const userStore = useUserStore()

    contentStore.$setMenu([{ name: 'Modulo', sub: [] }])
    contentStore.$setHome({ url: 'seccion/intro', internal_name: 'intro' })
    userStore.$setLogin(null)

    expect(userStore.token).toBeNull()
    expect(userStore.userData).toBeNull()
    expect(contentStore.menu).toEqual([])
    expect(contentStore.home.url).toBeNull()
    expect(window.localStorage.getItem('token')).toBeNull()
    expect(window.localStorage.getItem('menu')).toBeNull()
    expect(window.localStorage.getItem('home')).toBeNull()
  })
})
