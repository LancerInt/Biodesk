export const generateId = (prefix = 'id') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${formatDate(date)}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePhone = (phone) => /^[\+]?[\d\s\-\(\)]{7,15}$/.test(phone);

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
};

export const getCategoryColor = (category) => {
  const colors = {
    // New mobile categories
    'Biocontrol': '#2E7D32',
    'Biostimulants & Biofertilizers': '#F57C00',
    'Home & Garden': '#7B1FA2',
    // Original subcategories
    'Botanical Pesticide': '#4CAF50',
    'Microbial Pesticide': '#2196F3',
    'Biostimulant': '#FF9800',
    'Biofertilizer': '#9C27B0',
    // Legacy names (backward compat)
    'Botanical Pesticides': '#4CAF50',
    'Microbial Pesticides': '#2196F3',
    'Bio Stimulants': '#FF9800',
    'Biofertilizers': '#9C27B0',
    'Substrates': '#795548',
  };
  return colors[category] || '#757575';
};

export const getFormulationColor = (formulation) => {
  const colors = { EC: '#E91E63', WP: '#3F51B5', SC: '#009688' };
  return colors[formulation] || '#757575';
};
