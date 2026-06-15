import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config({ path: './server/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizstock-inventory';

const SAMPLE_PRODUCTS = [
  { name: 'Wireless Mouse', category: 'Electronics', stock: 45, price: 19.99, unit: 'pcs' },
  { name: 'Office Chair', category: 'Furniture', stock: 8, price: 129.50, unit: 'pcs' },
  { name: 'Notebook (A5)', category: 'Stationery', stock: 150, price: 3.49, unit: 'units' },
  { name: 'PlayStation 5', category: 'Electronics', stock: 15, price: 49999, unit: 'pcs' },
  { name: 'Gaming Keyboard', category: 'Electronics', stock: 32, price: 2999, unit: 'pcs' },
  { name: 'Wireless Headphones', category: 'Electronics', stock: 28, price: 3499, unit: 'pcs' },
];

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create a default admin user if it doesn't exist
    const existingUser = await User.findOne({ email: 'admin@bizstock.com' });
    if (!existingUser) {
      console.log('👤 Creating default admin user...');
      const adminUser = new User({
        email: 'admin@bizstock.com',
        password: 'password123',
        displayName: 'Admin',
        businessName: 'My Business'
      });
      await adminUser.save();
      console.log('✅ Admin user created: admin@bizstock.com / password123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Check if products already exist
    const existingProducts = await Product.find({});
    if (existingProducts.length > 0) {
      console.log(`ℹ️  Found ${existingProducts.length} existing products. Skipping seed.`);
      console.log('   To re-seed, delete all products first.');
    } else {
      console.log('📦 Seeding products...');
      const userId = existingUser ? existingUser._id.toString() : (await User.findOne())._id.toString();
      
      for (const productData of SAMPLE_PRODUCTS) {
        const product = new Product({
          ...productData,
          createdBy: userId
        });
        await product.save();
      }
      console.log(`✅ Seeded ${SAMPLE_PRODUCTS.length} products`);
    }

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Login credentials:');
    console.log('   Email: admin@bizstock.com');
    console.log('   Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();








