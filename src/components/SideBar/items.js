// File that holds the items to be displayed in the sidebar
import { Aid, Alert, Close, Favorite, Group, HomeRounded } from 'grommet-icons';

export const Items = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <HomeRounded color="white" size="medium" />,
  },
  {
    title: 'Clients',
    path: '/clients',
    icon: <Group color="white" size="medium" />,
  },
  {
    title: 'Drug Record',
    path: '/drugs',
    icon: <Aid color="white" size="medium" />,
  },
  {
    title: 'X-Ray Record',
    path: '/xrays',
    icon: <Alert color="white" size="medium" />,
  },
  {
    title: 'Cremations',
    path: '/cremations',
    icon: <Close color="white" size="medium" />,
  },
  {
    title: 'Anaesthetic Monitoring',
    path: '/anaesthetic',
    icon: <Favorite color="white" size="medium" />,
  },
];