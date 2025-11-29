
const calculateFinalPrice = ({ products = 0, shipment = 0, discounts = 0 }) => {
  return products + shipment - discounts
}

module.exports = { calculateFinalPrice }