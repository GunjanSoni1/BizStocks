import express from 'express';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all sales
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sales = await Sale.find({ recordedBy: req.userId })
      .sort({ timestamp: -1 });
    
    const formattedSales = sales.map(s => ({
      id: s._id.toString(),
      productId: s.productId,
      productName: s.productName,
      quantity: s.quantity,
      pricePerUnit: s.pricePerUnit,
      total: s.total,
      timestamp: s.timestamp.toISOString(),
      recordedBy: s.recordedBy
    }));

    res.json(formattedSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create sale
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Find product
    const product = await Product.findOne({
      _id: productId,
      createdBy: req.userId
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const saleQuantity = parseInt(quantity) || 1;

    // Check stock
    if (product.stock < saleQuantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Calculate total
    const total = parseFloat(saleQuantity * product.price);

    // Create sale
    const sale = new Sale({
      productId: product._id.toString(),
      productName: product.name,
      quantity: saleQuantity,
      pricePerUnit: product.price,
      total: total,
      recordedBy: req.userId
    });

    await sale.save();

    // Update product stock
    product.stock -= saleQuantity;
    product.updatedAt = Date.now();
    await product.save();

    res.status(201).json({
      id: sale._id.toString(),
      productId: sale.productId,
      productName: sale.productName,
      quantity: sale.quantity,
      pricePerUnit: sale.pricePerUnit,
      total: sale.total,
      timestamp: sale.timestamp.toISOString(),
      recordedBy: sale.recordedBy
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete sale (optional)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const sale = await Sale.findOneAndDelete({
      _id: req.params.id,
      recordedBy: req.userId
    });

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    // Restore product stock (optional)
    const product = await Product.findById(sale.productId);
    if (product) {
      product.stock += sale.quantity;
      product.updatedAt = Date.now();
      await product.save();
    }

    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;








