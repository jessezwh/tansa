import * as migration_20250401_125407_Events from './20250401_125407_Events';
import * as migration_20250401_125547_events from './20250401_125547_events';
import * as migration_20260105_023042 from './20260105_023042';

export const migrations = [
  {
    up: migration_20250401_125407_Events.up,
    down: migration_20250401_125407_Events.down,
    name: '20250401_125407_Events',
  },
  {
    up: migration_20250401_125547_events.up,
    down: migration_20250401_125547_events.down,
    name: '20250401_125547_events',
  },
  {
    up: migration_20260105_023042.up,
    down: migration_20260105_023042.down,
    name: '20260105_023042'
  },
];
