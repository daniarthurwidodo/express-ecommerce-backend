import dotenv from 'dotenv';
import sequelize from '../config/database';
import { seedUsers } from './seeders/userSeeder';
import { seedProducts } from './seeders/productSeeder';

dotenv.config();

async function runSeeders() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('📦 Database connection established');

    // Sync models
    await sequelize.sync({ force: true }); // Warning: This will drop all tables
    console.log('🔄 Database tables recreated');
    console.log('🌱 Seeding database...please wait!');
    // Run seeders
    await seedUsers(1000);
    await seedProducts(2000);
    
    console.log('🌱 Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeeders();