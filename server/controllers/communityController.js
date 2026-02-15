import prisma from '../config/db.js';

// ==================== CREATE COMMUNITY POST ====================
export const createPost = async (req, res) => {
  try {
    const { title, description, images, category } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description',
      });
    }

    // Create post
    const post = await prisma.communityPost.create({
      data: {
        userId: req.user.id,
        title,
        description,
        images: images || [],
        category: category || 'general',
        status: 'published',
      },
      include: {
        author: {
          select: { firstName: true, lastName: true, avatar: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET ALL COMMUNITY POSTS ====================
export const getAllPosts = async (req, res) => {
  try {
    const { category, limit = 10, skip = 0, sort = 'recent' } = req.query;

    // Build filter
    let where = { status: 'published' };
    if (category) where.category = category;

    // Get total count
    const total = await prisma.communityPost.count({ where });

    // Determine sort order
    let orderBy = { createdAt: 'desc' };
    if (sort === 'trending') {
      orderBy = { likesCount: 'desc' };
    } else if (sort === 'comments') {
      orderBy = { commentsCount: 'desc' };
    }

    // Get posts
    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        author: {
          select: { firstName: true, lastName: true, avatar: true, role: true }
        },
        likes: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy,
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit),
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET POST BY ID ====================
export const getPostById = async (req, res) => {
  try {
    // Update views count and get post
    const post = await prisma.communityPost.update({
      where: { id: req.params.id },
      data: {
        viewsCount: {
          increment: 1
        }
      },
      include: {
        author: {
          select: { firstName: true, lastName: true, avatar: true, role: true }
        },
        likes: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== LIKE POST ====================
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: { likes: true }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if already liked
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    let message = '';
    if (existingLike) {
      // Unlike
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });
      await prisma.communityPost.update({
        where: { id: postId },
        data: {
          likesCount: {
            decrement: 1
          }
        }
      });
      message = 'Post unliked';
    } else {
      // Like
      await prisma.postLike.create({
        data: {
          userId,
          postId
        }
      });
      await prisma.communityPost.update({
        where: { id: postId },
        data: {
          likesCount: {
            increment: 1
          }
        }
      });
      message = 'Post liked';
    }

    // Return updated post
    const updatedPost = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        likes: true
      }
    });

    res.status(200).json({
      success: true,
      message,
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== ADD COMMENT ====================
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment content',
      });
    }

    const postExists = await prisma.communityPost.findUnique({
      where: { id: postId }
    });

    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Add comment
    await prisma.comment.create({
      data: {
        userId: req.user.id,
        postId: postId,
        content,
        createdAt: new Date(),
      }
    });

    // Update comment count
    await prisma.communityPost.update({
      where: { id: postId },
      data: {
        commentsCount: {
          increment: 1
        }
      }
    });

    // Refresh post with updated details
    const updatedPost = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        comments: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== DELETE COMMENT ====================
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check authorization
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id: commentId }
    });

    // Update comment count
    await prisma.communityPost.update({
      where: { id: postId },
      data: {
        commentsCount: {
          decrement: 1
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== UPDATE POST ====================
export const updatePost = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    const post = await prisma.communityPost.findUnique({
      where: { id: req.params.id }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check authorization
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    // Update fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (status) updateData.status = status;

    const updatedPost = await prisma.communityPost.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== DELETE POST ====================
export const deletePost = async (req, res) => {
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id: req.params.id }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check authorization
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await prisma.communityPost.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET USER POSTS ====================
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    // Get total count
    const total = await prisma.communityPost.count({
      where: { userId, status: 'published' }
    });

    const posts = await prisma.communityPost.findMany({
      where: { userId, status: 'published' },
      include: {
        author: {
          select: { firstName: true, lastName: true, avatar: true }
        }
      },
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
