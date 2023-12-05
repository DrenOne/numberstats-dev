// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/sms/chat'
import user from 'src/store/sms/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import recordings from './pbx/recordings'
import campaigns from 'src/store/sms/campaigns'
import templates from 'src/store/sms/templates'
import orders from 'src/store/sms/orders'
import domains from 'src/store/sms/domains'
import middleware from 'src/store/middleware'
import resetPassword from 'src/store/apps/reset-password'
import providers from 'src/store/sms/providers'
import reports from 'src/store/sms/reports'

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    resetPassword,
    recordings,
    campaigns,
    templates,
    orders,
    domains,
    providers,
    reports,
  },
  // middleware: getDefaultMiddleware =>
  //   getDefaultMiddleware({
  //     serializableCheck: false
  //   })
  middleware: [middleware]
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
