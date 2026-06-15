import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: './server/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizstock-inventory';

async function resetUser() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin user
    const deleted = await User.deleteOne({ email: 'admin@bizstock.com' });
    if (deleted.deletedCount > 0) {
      console.log('🗑️  Deleted existing admin user');
    } else {
      console.log('ℹ️  No existing admin user to delete');
    }

    // Create new admin user
    console.log('👤 Creating new admin user...');
    const adminUser = new User({
      email: 'admin@bizstock.com',
      password: 'password123',
      displayName: 'Admin',
      businessName: 'My Business'
    });
    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    
    console.log('\n🎉 User reset completed!');
    console.log('\n📋 Login credentials:');
    console.log('   Email: admin@bizstock.com');
    console.log('   Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting user:', error);
    process.exit(1);
  }
}

resetUser();








