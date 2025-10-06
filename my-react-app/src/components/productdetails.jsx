import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common/apiConfig';
import BestOfHridhayamSection from '../components/BestOfHridhayamSection';
import { FaShoppingCart } from 'react-icons/fa';

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [selectedImage, setSelectedImage] = useState('');
  const [size, setSize] = useState('');
  const [backchain, setBackchain] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await fetch(`${SummaryApi.productDetails.url}${productId}`);
        const data = await response.json();
        if (data && data.data) {
          setProduct(data.data);
          setSelectedImage(data.data.image || '');
        }
        console.log('Fetched product details:', data.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }
    if (productId) fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    async function fetchCartQuantity() {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      try {
        const response = await fetch(SummaryApi.getCartQuantity.url, {
          method: SummaryApi.getCartQuantity.method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId, productId })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.success) setCartQuantity(result.quantity);
      } catch (error) {
        console.error('Error fetching cart quantity:', error);
      }
    }
    fetchCartQuantity();
  }, [product, productId]);

  if (!product) return <div>Loading...</div>;

  const { image, image2, image3, image4, name, price, description, inStock, discountPercentage = 0 } = product;

  // Calculate original price from discounted price
  let adjustedPrice = Number(price);
  if ((name === 'Necklace' || name === 'Haaram') && backchain) {
    adjustedPrice += 1000;
  }
  const discountedPrice = Math.round(adjustedPrice);
  const originalPrice = discountPercentage > 0
    ? Math.round(Number(adjustedPrice / (1 - discountPercentage / 100)))
    : discountedPrice;

  // Calculate partial payment for pre-order (rounded to whole number)
  const partialPayment = Math.round(discountedPrice / 2);

  const handleAddToCart = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    if (!userId) {
      toast.warning('Please login first');
      setIsLoading(false);
      navigate('/login'); // Navigate to login page
      return;
    }

    try {
      const response = await fetch(SummaryApi.addToCart.url, {
        method: SummaryApi.addToCart.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          quantity: quantity, // Now using the quantity state
          userId: userId,
          productId: productId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success('Product added to cart successfully!');
        setQuantity(1); // Reset quantity back to 1 after successful addition
        // fetchCartQuantity(); // Refresh cart quantity after adding item
      } else {
        toast.error(result.message || 'Failed to add product to cart');
      }
    } catch (error) {
      toast.error(error.message || 'Error adding to cart');
      console.error('Add to cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');

    if (!userId) {
      toast.warning('Please login first');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(SummaryApi.addToCart.url, {
        method: SummaryApi.addToCart.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          quantity: quantity,
          userId: userId,
          productId: productId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        navigate('/cart'); // Navigate to cart page after successful addition
      } else {
        toast.error(result.message || 'Failed to add product to cart');
      }
    } catch (error) {
      toast.error(error.message || 'Error adding to cart');
      console.error('Buy now error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreOrder = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');

    if (!userId) {
      toast.warning('Please login first');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    // Calculate the partial payment amount based on current quantity
    const currentPartialPayment = Math.round((discountedPrice * quantity) / 2);

    try {
      const response = await fetch(SummaryApi.addToCart.url, {
        method: SummaryApi.addToCart.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          quantity: quantity,
          userId: userId,
          productId: productId,
          isPreOrder: true,
          partialPayment: currentPartialPayment
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        navigate('/cart');
      } else {
        toast.error(result.message || 'Failed to pre-order product');
      }
    } catch (error) {
      toast.error(error.message || 'Error processing pre-order');
      console.error('Pre-order error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
    // Recalculate partial payment based on new quantity
    const newPartialPayment = Math.round((discountedPrice * newQuantity) / 2);
    setPartialPayment(newPartialPayment);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 py-8">
        {/* Product Images Gallery */}
        <div className="relative">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 mb-2">
              {/* Thumbnails for up to 4 images */}
              
            </div>
            <img
              className="w-full h-[600px] object-cover rounded-lg shadow-lg"
              src={selectedImage || image}
              alt={name}
            />
            <div className="flex self-start gap-5 mb-2">
              {[image, image2, image3, image4].filter(Boolean).map((imgSrc, idx) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt={name + ' thumbnail ' + (idx + 1)}
                  className={`w-20 h-20 object-cover rounded border cursor-pointer ${selectedImage === imgSrc ? 'ring-2 ring-black' : ''}`}
                  onClick={() => setSelectedImage(imgSrc)}
                />
              ))}
            </div>
            
          </div>
        </div>
        {/* Product Info */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{name}</h1>
          <div className="flex items-center space-x-2">
            {discountPercentage > 0 ? (
              <>
                <span className="text-2xl font-semibold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through">₹{originalPrice.toFixed(2)}</span>
                <span className="text-green-600 font-medium">{discountPercentage}% OFF</span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="space-y-4 w-full">
            <p className="text-gray-600 text-lg">{description}</p>

            {/* Quantity and Size Selector */}
            <div className="flex items-center space-x-4">
              <h3 className="font-medium text-gray-900 text-lg">Quantity:</h3>
              <div className="flex items-center border-2 border-gray-300 rounded-lg bg-white">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 hover:bg-gray-100 text-gray-700 font-semibold"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300 text-black font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 hover:bg-gray-100 text-gray-700 font-semibold"
                >
                  +
                </button>
              </div>
              {/* Size Selector for Rings */}
              {name === 'Rings' && (
                <select
                  className="ml-4 border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none"
                  value={size || ''}
                  onChange={e => setSize(e.target.value)}
                >
                  <option value="" disabled>Select Size</option>
                  {[...Array(21)].map((_, i) => {
                    const val = 3 + i * 0.5;
                    return <option key={val} value={val}>{val % 1 === 0 ? val : val.toFixed(1)}</option>;
                  })}
                </select>
              )}
              {/* Size Selector for Bangles */}
              {name === 'Bangles' && (
                <select
                  className="ml-4 border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none"
                  value={size || ''}
                  onChange={e => setSize(e.target.value)}
                >
                  <option value="" disabled>Select Size</option>
                  {[...Array(13)].map((_, i) => {
                    const val = 2 + i;
                    return <option key={val} value={val}>{val % 1 === 0 ? val : val.toFixed(1)}</option>;
                  })}
                </select>
              )}
              {/* Size Selector for Necklace/Haaram */}
            
              {/* Backchain Checkbox for Necklace/Haaram */}
              {(name === 'Necklace' || name === 'Haaram') && (
                <label className="ml-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={backchain}
                    onChange={e => setBackchain(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-900">Backchain (+₹1000)</span>
                </label>
              )}
            </div>

            {/* Stock Status */}
            <div className={`text-lg font-medium ${inStock ? 'text-green-600' : 'text-amber-600'}`}>
              {inStock ? 'In Stock' : 'Available for Pre-Order'}
            </div>

            {inStock ? (
              <>
                {/* Regular Add to Cart and Buy Now buttons */}
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg bg-black cursor-pointer text-white font-medium 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'} 
                    transition duration-300`}
                >
                  {isLoading ? 'Adding to Cart...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg bg-blue-600 cursor-pointer text-white font-medium 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} 
                    transition duration-300`}
                >
                  {isLoading ? 'Processing...' : 'Buy Now'}
                </button>
              </>
            ) : (
              <>
                {/* Pre-order section */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-amber-800 mb-2">Pre-order with 50% advance payment</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Total Price:</span>
                      <span>₹{Math.round(discountedPrice * quantity)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Partial Payment (50%):</span>
                      <span>₹{Math.round((discountedPrice * quantity) / 2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-amber-800">
                      <span>Balance Due:</span>
                      <span>₹{Math.round((discountedPrice * quantity) / 2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handlePreOrder}
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-lg bg-amber-600 text-white font-medium 
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-700'} 
                      transition duration-300`}
                  >
                    {isLoading ? 'Processing...' : 'Pre-order Now'}
                  </button>
                </div>
              </>
            )}

            {/* Cart Quantity Display */}
            {cartQuantity > 0 && (
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <FaShoppingCart className="text-xl" />
                <span className="font-medium">
                  {cartQuantity} {cartQuantity === 1 ? 'item' : 'items'} in your cart
                </span>
              </div>
            )}

            {/* Simple Dropdowns Below Add to Cart */}
            <div className="mt-6 space-y-2">
              <DropdownPara num={1} title="Shipping & Delivery" content="We offer fast and reliable shipping. Orders are processed within 1-2 business days and delivered within 5-7 business days depending on your location." />
              <DropdownPara num={2} title="Returns & Exchanges" content="If you are not satisfied with your purchase, you can return or exchange the product within 14 days of delivery. Please ensure the product is unused and in original packaging." />
              <DropdownPara num={3} title="Care Instructions" content="To keep your jewelry looking its best, avoid contact with water, perfumes, and chemicals. Store in a dry place and clean gently with a soft cloth." />
            </div>
          </div>
        </div>
      </div>

      <BestOfHridhayamSection
        className="section5 mt-16"
        title="YOU MAY ALSO LIKE"
        images={[
          '/src/assets/best-1.jpg',
          '/src/assets/best-2.jpg',
          '/src/assets/best-3.jpg',
          '/src/assets/best-4.jpg'
        ]}
        link="https://www.google.com"
      />
    </div>
  );
};

// DropdownPara component
const DropdownPara = ({ num, title, content }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-md overflow-hidden transition-all duration-300 shadow-sm">
      <button
        className="w-full text-left text-black px-4 py-2 hover:bg-gray-200 font-medium focus:outline-none flex justify-between items-center shadow"
        onClick={() => setOpen((prev) => !prev)}
      >
        {title}
        <span className={`transform transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div
        style={{
          maxHeight: open ? 200 : 0,
          opacity: open ? 1 : 0,
          transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
        }}
        className="bg-white px-4"
      >
        {open && (
          <p className="py-3 z-11 text-gray-700">
            {content}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
