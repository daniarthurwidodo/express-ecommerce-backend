import { faker } from '@faker-js/faker';
import  User  from '../../modules/users/models/User';
import bcrypt from 'bcryptjs';

async function seedUsers(count: number = 1000) {
  try {
    const users = [];
    
    // Create admin user
    users.push({
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    // Generate random users
    for (let i = 0; i < count - 1; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      
      users.push({
        email: faker.internet.email({ firstName, lastName }),
        firstName,
        lastName,
        password: await bcrypt.hash('password123', 10),
        role: 'customer',
        isEmailVerified: faker.datatype.boolean(),
        isActive: faker.datatype.boolean(0.9) // 90% chance of being active
      });
    }

    // Bulk insert users
    await User.bulkCreate(users);
    console.log(`✅ Successfully seeded ${count} users`);

  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export { seedUsers };