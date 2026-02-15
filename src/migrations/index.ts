import * as migration_20260215_referral_system from './20260215_referral_system';

export const migrations = [
  {
    up: migration_20260215_referral_system.up,
    down: migration_20260215_referral_system.down,
    name: '20260215_referral_system'
  },
];
