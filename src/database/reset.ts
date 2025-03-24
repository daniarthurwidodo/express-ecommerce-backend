import dotenv from 'dotenv';
import sequelize from '../config/database';
import readline from 'readline';

dotenv.config();

function confirmReset(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    if (process.env.NODE_ENV === 'test') {
      resolve(true);
      return;
    }

    rl.question('⚠️  WARNING: This will delete all data. Are you sure? (y/N): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function resetDatabase() {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Cannot reset database in production');
      process.exit(1);
    }

    const confirmed = await confirmReset();
    if (!confirmed) {
      console.log('❌ Database reset cancelled');
      process.exit(0);
    }

    // Connect to database
    await sequelize.authenticate();
    console.log('📦 Database connection established');

    // Drop all tables
    await sequelize.drop();
    console.log('🗑️  All tables dropped');

    // Recreate tables
    await sequelize.sync({ force: true });
    console.log('🔄 Database tables recreated');

    console.log('✅ Database reset completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  resetDatabase();
}

export { resetDatabase };