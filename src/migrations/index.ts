import * as migration_20260215_referral_system from './20260215_referral_system';
import * as migration_20260408_045642 from './20260408_045642';
import * as migration_20260417_sponsors_category from './20260417_sponsors_category';

export const migrations = [
  {
    up: migration_20260215_referral_system.up,
    down: migration_20260215_referral_system.down,
    name: '20260215_referral_system',
  },
  {
    up: migration_20260408_045642.up,
    down: migration_20260408_045642.down,
    name: '20260408_045642',
  },
  {
    up: migration_20260417_sponsors_category.up,
    down: migration_20260417_sponsors_category.down,
    name: '20260417_sponsors_category',
  },
];
