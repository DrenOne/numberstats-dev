// ** React Imports
import { ReactNode, ReactElement, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Store & Actions Imports
import { useDispatch } from 'react-redux'

// ** Types
import { AppDispatch } from 'src/store'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import authConfig, { getDomain, getHost } from 'src/configs/auth'
import { clearChats, onSuccessRecieveMessage } from 'src/store/sms/chat'
import { ToastOptions, toast } from 'react-toastify'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)
  const [websocketN, setWebsocketN] = useState<WebSocket | null>(null)

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      if (auth.user === null && !window.localStorage.getItem('userData')) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath },
          })
        } else {
          router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  useEffect(() => {
    dispatch(clearChats())
  }, [router.pathname])

  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    const websocketUrl =
      `wss://${getDomain()}/ws/users/chat/?tenant_schema=${getHost()}&token=` + storedToken
    const newWebsocket = new WebSocket(websocketUrl)
    // ws://{domain}/ws/notifications/?tenant_schema={tenant_schema}&token={token}
    const websocketUrlN =
      `wss://${getDomain()}/ws/notifications/?tenant_schema=${getHost()}&token=` + storedToken
    const newWebsocketN = new WebSocket(websocketUrlN)
    setWebsocket(newWebsocket)
    setWebsocketN(newWebsocketN)

    return () => {
      // Close the WebSocket connection when the component unmounts
      if (newWebsocket) {
        newWebsocket.close()
      }
      if (newWebsocketN) {
        newWebsocketN.close()
      }
    }
  }, [])

  useEffect(() => {
    if (websocket) {
      websocket.addEventListener('open', () => {
        console.log('connect')
      })
      websocket.addEventListener('message', message => {
        // console.log(message)
      })
    }
    if (websocketN) {
      websocketN.addEventListener('open', () => {
        console.log('connectN')
      })
      websocketN.addEventListener('message', message => {
        // console.log(message)
      })
    }
  })

  useEffect(() => {
    if (websocket) {
      // Handle messages received from the WebSocket server
      websocket.addEventListener('message', event => {
        const message = event.data
        dispatch(onSuccessRecieveMessage(message))

        // Process the WebSocket message as needed
        // For example, you might want to dispatch actions based on the received message
      })
    }
  }, [websocket])

  useEffect(() => {
    if (websocketN) {
      // Handle messages received from the WebSocket server
      websocketN.addEventListener('message', event => {
        interface Data {
          id: number | string
          source_value: number
          description: string
          priority: string
        }
        const items = {
          position: 'top-right',
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        }
        const message = event.data
        if (message.data.length) {
          message.data.forEach((item: Data) => {
            if (item.priority === 'high') toast.error(item.description, items as ToastOptions)
            else toast.warn(item.description, items as ToastOptions)
          })
        }
      })
    }
  }, [websocketN])

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
