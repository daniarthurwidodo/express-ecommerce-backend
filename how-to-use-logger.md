# How to use logger

```text
// Example usage in any file
import logger from '../config/logging.config';

logger.info('User logged in', {
  userId: user.id,
  email: user.email
});

logger.error('Failed to process payment', {
  orderId: order.id,
  error: error.message
});
```
