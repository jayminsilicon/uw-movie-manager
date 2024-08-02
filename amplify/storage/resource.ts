import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'movieDBDrive',
  access: (allow) => ({
    'public/uploads/*': [
      allow.authenticated.to(['read','write']),
      allow.guest.to(['read', 'write'])
    ],
  })
});