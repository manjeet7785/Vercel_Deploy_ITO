import { maskPhone, maskEmail } from '../utils/mask.js';

export const enforceDataMasking = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }

  const originalJson = res.json;
  res.json = function (body) {
    if (body && body.success && body.data) {
      if (Array.isArray(body.data)) {
        body.data = body.data.map((item) => maskLeadObject(item));
      } else {
        body.data = maskLeadObject(body.data);
      }
    }
    return originalJson.call(this, body);
  };

  next();
};

function maskLeadObject(item) {
  if (item?.toObject) item = item.toObject();
  if (item?.phoneRaw) {
    item.phoneRaw = maskPhone(item.phoneRaw);
  }
  if (item?.emailRaw) {
    item.emailRaw = maskEmail(item.emailRaw);
  }
  return item;
}
