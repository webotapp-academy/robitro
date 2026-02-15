import prisma from '../config/db.js';
import cache from '../utils/cache.js';

// ==================== GET ALL PRODUCTS ====================
export const getAllProducts = async (req, res) => {
  try {
    const { category, ageGroup, search, minPrice, maxPrice, page = 1, limit = 12, skip = 0, status, includeRelations } = req.query;

    // Generate cache key from query params
    const cacheKey = `products:${JSON.stringify(req.query)}`;

    // Check cache first (skip cache for admin panel)
    if (!req.path.includes('/admin/')) {
      const cached = cache.get(cacheKey);
      if (cached) {
        return res.status(200).json(cached);
      }
    }

    // Build filter object - don't filter by status if admin is requesting
    let where = {};

    // Only filter active products if not from admin panel
    if (status) {
      where.status = status;
    } else if (!req.path.includes('/admin/')) {
      where.status = 'active';
      where.stock = { gt: 0 };
    }

    if (category) where.categoryId = category;
    if (ageGroup) where.ageGroup = ageGroup;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = skip ? parseInt(skip) : (pageNum - 1) * limitNum;

    // Get total count (fast, no joins)
    const total = await prisma.product.count({ where });

    // Build query options
    const queryOptions = {
      where,
      take: limitNum,
      skip: skipNum,
      orderBy: { createdAt: 'desc' },
    };

    // Only include relations if explicitly requested (for admin panel)
    if (includeRelations === 'true') {
      queryOptions.include = {
        partner: {
          select: { name: true, partnerType: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      };
    }

    // Get products with pagination
    const products = await prisma.product.findMany(queryOptions);

    const response = {
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      // Keep legacy fields for backward compatibility
      count: products.length,
      products,
    };

    // Cache the response for 30 seconds (skip cache for admin panel)
    if (!req.path.includes('/admin/')) {
      cache.set(cacheKey, response, 30);
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET SINGLE PRODUCT ====================
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        partner: {
          select: { name: true, partnerType: true, email: true, phone: true, website: true }
        }
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== CREATE PRODUCT (ADMIN/PARTNER) ====================
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      categoryName, // Optional display name
      ageGroup,
      images,
      stock,
      specifications,
      warranty,
      status,
    } = req.body;

    // Validation
    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, and categoryId',
      });
    }

    // Process images - handle comma-separated string from admin panel
    let imageArray = [];
    if (images) {
      if (typeof images === 'string') {
        imageArray = images.split(',').map(img => img.trim()).filter(img => img);
      } else if (Array.isArray(images)) {
        imageArray = images;
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        categoryName,
        ageGroup,
        images: imageArray,
        stock: stock ? parseInt(stock) : 0,
        specifications: specifications || {},
        warranty: warranty || {},
        status: status || 'active',
        partnerId: req.user.role === 'partner' ? req.user.partnerId : null,
      },
      include: { category: true }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== UPDATE PRODUCT ====================
export const updateProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check authorization
    if (product.partnerId && product.partnerId !== req.user.partnerId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    // Update fields
    const { name, description, price, stock, categoryId, categoryName, ageGroup, status, specifications, warranty, images } =
      req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (categoryId) updateData.categoryId = categoryId;
    if (categoryName) updateData.categoryName = categoryName;
    if (ageGroup) updateData.ageGroup = ageGroup;
    if (status) updateData.status = status;
    if (specifications) updateData.specifications = specifications;
    if (warranty) updateData.warranty = warranty;

    // Process images - handle comma-separated string from admin panel
    if (images) {
      if (typeof images === 'string') {
        updateData.images = images.split(',').map(img => img.trim()).filter(img => img);
      } else if (Array.isArray(images)) {
        updateData.images = images;
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== DELETE PRODUCT ====================
export const deleteProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check authorization
    if (product.partnerId && product.partnerId !== req.user.partnerId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET ALL CATEGORIES ====================
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: { name: 'asc' }
    });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
