// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_daffy_microbe.sql';
import m0001 from './0001_common_shape.sql';
import m0002 from './0002_lucky_yellowjacket.sql';
import m0003 from './0003_right_butterfly.sql';
import m0004 from './0004_black_robin_chapel.sql';
import m0005 from './0005_shallow_mystique.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005
    }
  }
  