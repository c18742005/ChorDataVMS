// File that holds the items to be displayed in the sidebar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCross, 
  faHeartPulse, 
  faHome, 
  faPills, 
  faRadiation, 
  faTooth, 
  faUsers } from '@fortawesome/free-solid-svg-icons';

export const Items = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    title: 'Clients',
    path: '/clients',
    icon: <FontAwesomeIcon icon={faUsers} />,
  },
  {
    title: 'Drug Record',
    path: '/drugs',
    icon: <FontAwesomeIcon icon={faPills} />,
  },
  {
    title: 'X-Ray Record',
    path: '/xrays',
    icon: <FontAwesomeIcon icon={faRadiation} />,
  },
  {
    title: 'Dental Record',
    path: '/dental',
    icon: <FontAwesomeIcon icon={faTooth} />,
  },
  {
    title: 'Cremations',
    path: '/cremations',
    icon: <FontAwesomeIcon icon={faCross} />,
  },
  {
    title: 'Anaesthetic Monitoring',
    path: '/anaesthetic',
    icon: <FontAwesomeIcon icon={faHeartPulse} />,
  },
];