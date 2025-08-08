// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_polite_doctor_strange.sql';
import m0001 from './0001_perpetual_cassandra_nova.sql';
import m0002 from './0002_romantic_talisman.sql';
import m0003 from './0003_greedy_sally_floyd.sql';
import m0004 from './0004_chief_vision.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004
    }
  }
  