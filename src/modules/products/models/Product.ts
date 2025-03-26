import { Request, Response } from 'express';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/database';
import { ULID } from '../../../utils/ulid';
import { KafkaService, eventTopics } from '../../../utils/kafka';

interface CreateProductRequest extends Partial<Product> {
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images?: string[];
  metadata?: Record<string, any>;
}

interface UpdateStockRequest {
  productId: string;
  quantity: number;
}

class Product extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: string;
  public stockQuantity!: number;
  public rating!: number;
  public isAvailable!: boolean;
  public images!: string[];
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init({
  id: ULID,
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  sequelize,
  tableName: 'products'
});

export default Product;

export class ProductController {
  private kafkaService: KafkaService;

  constructor() {
    this.kafkaService = new KafkaService();
    this.kafkaService.connect();
  }

  async createProduct(req: Request, res: Response) {
    try {
      const productData: any = req.body as CreateProductRequest;
      const product = await Product.create(productData);

      await this.kafkaService.emit(eventTopics.PRODUCT_CREATED, {
        productId: product.id,
        name: product.name,
        timestamp: new Date()
      });

      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create product'
      });
    }
  }

  async updateStock(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body as UpdateStockRequest;

      if (quantity < 0) {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be a positive number'
        });
      }

      const product = await Product.findByPk(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      await product.update({ stockQuantity: quantity });

      await this.kafkaService.emit(eventTopics.STOCK_UPDATED, {
        productId: product.id,
        newQuantity: quantity,
        timestamp: new Date()
      });

      res.json({
        success: true,
        data: {
          productId: product.id,
          stockQuantity: quantity
        }
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update stock'
      });
    }
  }
}