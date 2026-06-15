import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all products
router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.userId })
      .sort({ createdAt: -1 });
    
    const formattedProducts = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      stock: p.stock,
      price: p.price,
      unit: p.unit,
      createdBy: p.createdBy,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      createdBy: req.userId
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      id: product._id.toString(),
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      unit: product.unit,
      createdBy: product.createdBy,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, category, stock, price, unit } = req.body;

    const product = new Product({
      name,
      category,
      stock: parseInt(stock) || 0,
      price: parseFloat(price) || 0,
      unit: unit || 'pcs',
      createdBy: req.userId
    });

    await product.save();

    res.status(201).json({
      id: product._id.toString(),
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      unit: product.unit,
      createdBy: product.createdBy,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, category, stock, price, unit } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      {
        name,
        category,
        stock: parseInt(stock) || 0,
        price: parseFloat(price) || 0,
        unit: unit || 'pcs',
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      id: product._id.toString(),
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      unit: product.unit,
      createdBy: product.createdBy,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;








