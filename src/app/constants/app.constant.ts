export const BE_URL = 'http://13.233.186.53:3000';
export const SIDE_NAVIGATION = [
  {
    name: 'All Items',
    component: 'dashboard',
    link: '/dashboard',
  },
  {
    name: 'Key Holders',
    component: 'key-holders',
    link: '/key-holders',
  },

  {
    name: 'Memories',
    component: 'memories',
    link: '/memories',
  },
  {
    name: 'Notes',
    component: 'notes',
    link: '/notes',
  },
  // {
  //   name: 'Assets',
  //   component: 'assets',
  //   link: '/assets',
  // },
  // {
  //   name: 'Passwords',
  //   component: 'passwords',
  //   link: '/passwords',
  // },
  {
    name: 'Obituary Info',
    component: 'obituary-info',
    link: '/obituary-info',
  },

  // {
  //   name: 'Subscription Plans',
  //   component: 'subscription-plans',
  //   link: '/subscription-plans',
  // },
];

export const ADMIN_SIDE_NAVIGATION = [
  {
    name: 'user-management',
    component: 'users',
    link: '/admin/users',
  },
  {
    name: 'Subscription Plans',
    component: 'subscription-plans',
    link: '/subscription-plans',
  },
];

export const ADD_ITEMS_LIST = {
  MEMORIES: {
    text: 'Add Memories',
    label: 'memories',
  },
  NOTES: {
    text: 'Add Note',
    label: 'notes',
  },
  OBITUARY: {
    text: 'Add Obituary',
    label: 'obituary-info',
  },
  PASSWORDS: {
    text: 'Add Password',
    label: 'passwords',
  },
  ASSETS: {
    text: 'Add Asset',
    label: 'assets',
  },
  KEY_HOLDERS: {
    text: 'Add Key Holder',
    label: 'key-holders',
  },
  LEGACY: {
    text: 'Refer a Friend',
    label: 'key-holders',
  },
};

export const RELATION_LIST = [
  'Father',
  'Mother',
  'Son',
  'Daughter',
  'Husband',
  'Wife',
  'Brother',
  'Sister',
  'Friend',
  'Cousin',
];

export const dateToIsoString = (dateObject: any) => {
  const date = new Date(
    `${dateObject?.year}-${dateObject?.month}-${dateObject?.day}`
  );
  return date.toISOString() || null;
};

export const isoStringToDateObj = (isoString: string) => {
  const dateObject = new Date(isoString);
  return {
    year: dateObject.getFullYear(),
    month: dateObject.getMonth() + 1,
    day: dateObject?.getDate(),
  };
};

export const objectToQueryParams = (obj: any) => {
  let queryArray = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      queryArray.push(`${key}=${obj[key]}`);
    }
  }
  return queryArray.join('&');
};
