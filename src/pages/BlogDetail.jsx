import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Heart,
  MessageCircle,
  Eye,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  ThumbsUp,
  ThumbsDown,
  Star,
  ChevronRight
} from 'lucide-react';
import { getBlogPost, getRelatedPosts } from '../data/blogs';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: "John Mutua",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50",
        verified: true
      },
      content: "This is incredibly helpful! I was just about to make some of these mistakes. Thank you for sharing this valuable information.",
      date: "2025-09-06",
      likes: 12,
      replies: [
        {
          id: 11,
          author: {
            name: "Sarah Mwangi",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50",
            verified: true,
            isAuthor: true
          },
          content: "I'm so glad this helped you, John! Feel free to reach out if you have any specific questions about your property search.",
          date: "2025-09-06",
          likes: 5
        }
      ]
    },
    {
      id: 2,
      author: {
        name: "Mary Njeri",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50",
        verified: false
      },
      content: "I learned this the hard way. Wish I had read this article before buying my first property. Great insights!",
      date: "2025-09-05",
      likes: 8,
      replies: []
    }
  ]);

  useEffect(() => {
    const fetchPost = () => {
      const blogPost = getBlogPost(parseInt(id));
      if (blogPost) {
        setPost(blogPost);
        setRelatedPosts(getRelatedPosts(blogPost.id));
      } else {
        navigate('/blogs');
      }
      setLoading(false);
    };

    fetchPost();
  }, [id, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('.article-content');
      if (article) {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        
        const progress = Math.min(
          Math.max((scrollTop - articleTop + windowHeight * 0.5) / articleHeight, 0),
          1
        );
        setReadingProgress(progress * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: {
          name: "You",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
          verified: false
        },
        content: comment,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        replies: []
      };
      setComments([newComment, ...comments]);
      setComment('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-accent/20 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 bg-primary/20 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
          <Link 
            to="/blogs" 
            className="text-secondary hover:text-secondary/80 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {post && (
        <SEO
          title={`${post.title} | KejaMatch Blog`}
          description={post.excerpt}
          keywords={post.tags.join(', ')}
          canonicalUrl={`/blog/${post.id}`}
          ogImage={post.image}
          ogType="article"
          articleData={{
            publishedTime: post.date,
            modifiedTime: post.date,
            author: post.author.name,
            section: post.category,
            tags: post.tags,
          }}
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blogs' },
            { name: post.title, url: `/blog/${post.id}` }
          ]}
        />
      )}
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-secondary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/blogs')}
              className="flex items-center text-gray-600 hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Blog
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2.5 rounded-lg transition-all ${
                  isBookmarked 
                    ? 'bg-secondary/10 text-secondary' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark size={20} className={isBookmarked ? 'fill-current' : ''} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={20} />
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 top-14 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 min-w-[220px] z-50">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                    >
                      <Twitter size={18} className="mr-3 text-blue-400" />
                      <span className="font-medium">Share on Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                    >
                      <Facebook size={18} className="mr-3 text-blue-600" />
                      <span className="font-medium">Share on Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                    >
                      <Linkedin size={18} className="mr-3 text-blue-700" />
                      <span className="font-medium">Share on LinkedIn</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                    >
                      <LinkIcon size={18} className="mr-3 text-gray-600" />
                      <span className="font-medium">Copy Link</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold">
              {post.category}
            </span>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getDifficultyColor(post.difficulty)}`}>
              {post.difficulty}
            </span>
            <div className="flex items-center text-gray-500 text-sm gap-4 ml-auto">
              <span className="flex items-center gap-1.5">
                <Eye size={16} />
                {post.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} />
                {post.readTime} min read
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-light">
            {post.excerpt}
          </p>
          
          {/* Author and Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-y border-gray-200 py-6">
            <div className="flex items-center">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-14 h-14 rounded-full mr-4 border-2 border-gray-100 shadow-sm"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{post.author.name}</h3>
                <p className="text-secondary text-sm font-medium">{post.author.role}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-left">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <Calendar size={16} className="mr-2 text-primary" />
                  {formatDate(post.date)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Heart size={14} className="text-secondary" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={14} />
                    {post.comments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-primary/5"></div>
          </div>
        </motion.div>

        {/* Article Content with Enhanced Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="article-content mb-16"
        >
          <style>{`
            .article-content {
              font-size: 1.125rem;
              line-height: 1.8;
              color: #374151;
            }
            
            .article-content h2 {
              font-size: 2rem;
              font-weight: 700;
              color: #1e3a5f;
              margin-top: 3rem;
              margin-bottom: 1.5rem;
              padding-bottom: 0.75rem;
              border-bottom: 3px solid #ff6b35;
              line-height: 1.3;
            }
            
            .article-content h2:first-child {
              margin-top: 0;
            }
            
            .article-content h3 {
              font-size: 1.5rem;
              font-weight: 600;
              color: #1e3a5f;
              margin-top: 2.5rem;
              margin-bottom: 1rem;
              line-height: 1.4;
            }
            
            .article-content h4 {
              font-size: 1.25rem;
              font-weight: 600;
              color: #374151;
              margin-top: 2rem;
              margin-bottom: 0.75rem;
            }
            
            .article-content p {
              margin-bottom: 1.5rem;
              line-height: 1.8;
            }
            
            .article-content ul {
              margin: 1.5rem 0;
              padding-left: 0;
              list-style: none;
            }
            
            .article-content ul li {
              position: relative;
              padding-left: 2rem;
              margin-bottom: 0.75rem;
              line-height: 1.7;
            }
            
            .article-content ul li:before {
              content: "→";
              position: absolute;
              left: 0;
              color: #ff6b35;
              font-weight: bold;
              font-size: 1.25rem;
            }
            
            .article-content strong {
              color: #1e3a5f;
              font-weight: 600;
            }
            
            .article-content a {
              color: #ff6b35;
              text-decoration: underline;
              transition: color 0.2s;
            }
            
            .article-content a:hover {
              color: #e55a28;
            }
            
            .article-content blockquote {
              border-left: 4px solid #ff6b35;
              padding-left: 1.5rem;
              margin: 2rem 0;
              font-style: italic;
              color: #4b5563;
              background: #fef3f0;
              padding: 1.5rem;
              border-radius: 0.5rem;
            }
          `}</style>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </motion.div>

        {/* Article Footer - Tags and Engagement */}
        <div className="border-t-2 border-gray-200 pt-8 mb-12">
          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
              <span className="w-1 h-6 bg-secondary mr-3"></span>
              Related Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 hover:bg-secondary/10 hover:text-secondary text-gray-700 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Like/Dislike and Rating */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isLiked 
                    ? 'bg-secondary text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                <span>{isLiked ? 'Liked!' : 'Like this article'}</span>
              </button>
            </div>
              
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Rate:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="text-accent hover:scale-110 transition-transform"
                >
                  <Star
                    size={24}
                    className={
                      star <= (hoverRating || rating) ? 'fill-current' : ''
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-primary/5 border-l-4 border-secondary rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6">About the Author</h3>
          <div className="flex items-start gap-6">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg flex-shrink-0"
            />
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-xl mb-1">{post.author.name}</h4>
              <p className="text-secondary font-semibold mb-3">{post.author.role}</p>
              <p className="text-gray-700 leading-relaxed">{post.author.bio}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-primary mb-8 flex items-center">
            <span className="w-1.5 h-8 bg-secondary mr-4"></span>
            Comments ({comments.length})
          </h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-10 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Join the discussion</h4>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this article..."
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none resize-none transition-all"
              rows={4}
            />
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                Be respectful and constructive.
              </p>
              <button
                type="submit"
                disabled={!comment.trim()}
                className="bg-secondary hover:bg-secondary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Post Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h5 className="font-bold text-gray-900">{comment.author.name}</h5>
                      {comment.author.verified && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Verified
                        </span>
                      )}
                      {comment.author.isAuthor && (
                        <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                          Author
                        </span>
                      )}
                      <span className="text-gray-500 text-sm">
                        {formatDate(comment.date)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-gray-600 hover:text-secondary transition-colors text-sm font-medium">
                        <ThumbsUp size={16} />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-gray-600 hover:text-secondary transition-colors text-sm font-medium">
                        Reply
                      </button>
                    </div>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-5 ml-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border-l-2 border-secondary">
                            <img
                              src={reply.author.avatar}
                              alt={reply.author.name}
                              className="w-10 h-10 rounded-full border-2 border-white flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h6 className="font-semibold text-gray-900 text-sm">{reply.author.name}</h6>
                                {reply.author.verified && (
                                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                                    Verified
                                  </span>
                                )}
                                {reply.author.isAuthor && (
                                  <span className="bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-full text-xs">
                                    Author
                                  </span>
                                )}
                                <span className="text-gray-500 text-xs">
                                  {formatDate(reply.date)}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed mb-2">{reply.content}</p>
                              <button className="flex items-center gap-1 text-gray-600 hover:text-secondary transition-colors text-xs font-medium">
                                <ThumbsUp size={12} />
                                <span>{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50 py-16 border-t-2 border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary mb-8 flex items-center">
              <span className="w-1.5 h-8 bg-secondary mr-4"></span>
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <motion.article
                  key={relatedPost.id}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/blog/${relatedPost.id}`}>
                    <div className="relative h-48">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(relatedPost.date)}</span>
                        <span className="mx-2">•</span>
                        <Clock size={14} className="mr-1" />
                        <span>{relatedPost.readTime} min</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-primary mb-3 line-clamp-2 hover:text-secondary transition-colors">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={relatedPost.author.avatar}
                            alt={relatedPost.author.name}
                            className="w-8 h-8 rounded-full mr-2 border-2 border-gray-100"
                          />
                          <span className="text-sm text-gray-700 font-medium">{relatedPost.author.name}</span>
                        </div>
                        
                        <span className="text-secondary hover:text-secondary/80 font-semibold text-sm flex items-center gap-1 transition-colors">
                          Read More
                          <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default BlogDetail;