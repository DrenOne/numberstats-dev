// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home',
    },
    {
      sectionTitle: '3CX & Phone',
    },
    {
      title: '3CX',
      icon: 'tabler:phone-incoming',

      // badgeContent: 'new',
      // badgeColor: 'error',
      children: [
        // {
        //   title: 'Dashboard',
        //   path: '/pbx/dashboard',
        //   action: 'read',
        //   subject: 'pbx-dashboard'
        // },
        // {
        //   title: 'Call Progress',
        //   path: '/pbx/progress',
        //   action: 'read',
        //   subject: 'pbx-progress'
        // },
        // {
        //   title: 'Users',
        //   path: '/pbx/users',
        //   action: 'read',
        //   subject: 'pbx-users'
        // },
        // {
        //   title: 'Call Queues',
        //   path: '/pbx/queues',
        //   action: 'read',
        //   subject: 'pbx-queues'
        // },
        {
          title: 'Call Recordings',
          path: '/pbx/recordings',
          action: 'read',
          subject: 'pbx-recordings',
        },
      ],
    },
    {
      sectionTitle: 'SMS Action',
    },
    {
      title: 'SMS',
      icon: 'tabler:message-chatbot',

      // badgeContent: 'new',
      // badgeColor: 'error',
      children: [
        {
          title: 'Campaigns',
          path: '/sms/campaign/list',
          action: 'read',
          subject: 'sms-campaign',
        },
        {
          title: 'SMS Templates',
          path: '/sms/templates/list',
          action: 'read',
          subject: 'sms-templates',
        },
        {
          title: 'Chat',
          path: '/sms/chat',
          action: 'read',
          subject: 'sms-agents',
        },
        {
          title: 'DID Numbers',
          path: '/sms/numbers',
          action: 'read',
          subject: 'sms-numbers',
        },
        {
          title: 'Providers',
          // path: '/sms/providers',
          // action: 'read',
          subject: 'sms-providers',
          children: [
            // {
            //   title: 'Brands',
            //   path: '/sms/providers/brands',
            //   action: 'read',
            // },
            // {
            //   title: 'Campaings',
            //   path: '/sms/providers/campaigns',
            //   action: 'read',
            // },
            {
              title: 'Numbers',
              path: '/sms/providers/numbers',
              action: 'read',
            },
          ],
        },
        {
          title: 'Reports',
          path: '/sms/reports',
          action: 'read',
          subject: 'sms-reports',
        },
      ],
    },
  ]
}

export default navigation
