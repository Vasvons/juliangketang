const generateCode = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateBatchCodes = (count = 10, length = 16) => {
  return Array.from({ length: count }, () => generateCode(length));
};

module.exports = {
  generateCode,
  generateBatchCodes,
};
