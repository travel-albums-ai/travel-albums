import compression from 'compression';

export const createCompressionMiddleware = () => {
  const shouldCompress = (req, res) => {
    if (req.path.startsWith('/images/') || req.path.startsWith('/thumbnails/')) {
      return false;
    }

    return compression.filter(req, res);
  };

  return compression({ filter: shouldCompress });
};
