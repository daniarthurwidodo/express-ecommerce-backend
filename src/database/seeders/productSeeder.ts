import { faker } from '@faker-js/faker';
import Product from '../../modules/products/models/Product';

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Beauty',
  'Health',
  'Automotive',
  'Food & Beverage'
];

const generateMetadata = (category: string) => {
  const metadata: Record<string, any> = {
    brand: faker.company.name(),
    manufacturer: faker.company.name(),
    weight: Number(faker.number.float({ min: 0.1, max: 20 }).toFixed(2)),
    dimensions: {
      length: faker.number.int({ min: 5, max: 100 }),
      width: faker.number.int({ min: 5, max: 100 }),
      height: faker.number.int({ min: 5, max: 100 })
    }
  };

  switch (category) {
    case 'Electronics':
      metadata.warranty = `${faker.number.int({ min: 1, max: 5 })} years`;
      metadata.powerConsumption = `${faker.number.int({ min: 5, max: 1000 })}W`;
      break;
    case 'Clothing':
      metadata.material = faker.commerce.productMaterial();
      metadata.sizes = ['S', 'M', 'L', 'XL'];
      metadata.colors = Array.from({ length: 3 }, () => faker.color.human());
      break;
  }

  return metadata;
};

async function seedProducts(count: number = 2000) {
  try {
    const products = [];

    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const name = faker.commerce.productName();
      
      products.push({
        name,
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price({ min: 1, max: 1000, dec: 2 })),
        category,
        stockQuantity: faker.number.int({ min: 0, max: 1000 }),
        rating: Number(faker.number.float({ min: 0, max: 5, }).toFixed(2)),
        isAvailable: faker.datatype.boolean(0.8),
        images: Array.from(
          { length: faker.number.int({ min: 1, max: 5 }) },
          () => faker.image.url()
        ),
        metadata: generateMetadata(category)
      });

      if ((i + 1) % 100 === 0) {
        console.log(`Generated ${i + 1} products...`);
      }
    }

    // Bulk insert in chunks of 100 for better performance
    const chunkSize = 100;
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      await Product.bulkCreate(chunk);
      console.log(`Inserted products ${i + 1} to ${Math.min(i + chunkSize, products.length)}`);
    }

    console.log(`✅ Successfully seeded ${count} products`);

  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

export { seedProducts };