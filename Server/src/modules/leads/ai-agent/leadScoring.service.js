function scoreAndClassifyLead({ quantity, hasLOI, paymentTerms = '', contactPerson, mobile, email, chatSummary = '' }) {
  
  const hasContact = !!contactPerson;
  const hasPhone = !!mobile && String(mobile).replace(/\s/g, '').length >= 8;
  const hasEmail = !!email && String(email).includes('@');
  
  if (!hasPhone && !hasEmail) {
    return { score: 0, priority: 'INCOMPLETE' };
  }

  
  const isFakeNumber = mobile && /^(.)\1{7,}$/.test(String(mobile).replace(/\D/g, '')); 
  if (isFakeNumber) {
    return { score: 0, priority: 'FAKE' };
  }

  let score = 0;

  
  const qtyNumber = parseFloat(String(quantity).replace(/[^0-9.]/g, '')) || 0;
  if (qtyNumber >= 1000) {
    score += 40;
  } else if (qtyNumber >= 100) {
    score += 20;
  }

  
  const containsLOI = Boolean(hasLOI) || 
    chatSummary.toLowerCase().includes('loi') || 
    chatSummary.toLowerCase().includes('po ') ||
    chatSummary.toLowerCase().includes('letter of intent');
  
  if (containsLOI) {
    score += 40;
  }

  
  const isAdvance = paymentTerms.toLowerCase().includes('advance') || 
    paymentTerms.includes('+') || 
    paymentTerms.toLowerCase().includes('upfront');

  if (isAdvance) {
    score += 20;
  }

  
  let priority = 'COLD';
  if (score >= 80) {
    priority = 'HOT';
  } else if (score >= 40) {
    priority = 'WARM';
  }

  return { score, priority };
}

module.exports = { scoreAndClassifyLead };
