import React, { useState, useRef, useEffect } from 'react';
import SummaryApi from '../../common/apiConfig';
import { toast } from 'react-toastify';

const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  product,
  categories = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    image2: '',
    image3: '',
    image4: '',
    imageFile: null,
    imageFile2: null,
    imageFile3: null,
    imageFile4: null,
    discountPercentage: 0,
    quantity: 0,
    inStock: true,
    hasDiscount: false  // Add this new field
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const categoryInputRef = useRef(null);

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.price !== '' &&
      Number(formData.price) > 0 &&
      formData.category.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.image.valueOf() !== '' &&
      Number(formData.quantity) > 0 &&
      (!formData.hasDiscount || (formData.hasDiscount && Number(formData.discountPercentage) > 0))
    );
  };

  useEffect(() => {
    if (product) {
      console.log('Editing product:', product); // Add this debug line
      setFormData({
        id: product._id || product.id, // Handle both _id and id cases
        name: product.name || '',
        price: product.price || '',
        category: product.category || '',
        description: product.description || '',
        image: product.image || '',
        image2: product.image2 || '',
        image3: product.image3 || '',
        image4: product.image4 || '',
        imageFile: null,
        imageFile2: null,
        imageFile3: null,
        imageFile4: null,
        discountPercentage: product.discountPercentage || 0,
        quantity: product.quantity || 0,
        inStock: product.inStock !== undefined ? product.inStock : true,
        hasDiscount: product.discountPercentage > 0,
      });
      setPreviewImage(product.image || null);
      setNewCategory(product.category || '');
    } else {
      setFormData({
        id: null,
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        image2: '',
        image3: '',
        image4: '',
        imageFile: null,
        imageFile2: null,
        imageFile3: null,
        imageFile4: null,
        discountPercentage: 0,
        quantity: 0,
        inStock: true,
        hasDiscount: false,
      });
      setPreviewImage(null);
      setNewCategory('');
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleImageChange = (e, slot = 1) => {
    const file = e.target.files[0];
    if (file) {
      const image = URL.createObjectURL(file);
      if (slot === 1) {
        setPreviewImage(image);
        setFormData({ ...formData, imageFile: file, image: image });
      } else if (slot === 2) {
        setFormData({ ...formData, imageFile2: file, image2: image });
      } else if (slot === 3) {
        setFormData({ ...formData, imageFile3: file, image3: image });
      } else if (slot === 4) {
        setFormData({ ...formData, imageFile4: file, image4: image });
      }
    }
  };

  const handleCategoryInput = (value) => {
    setNewCategory(value);
    console.log('Category input:', categories); // Debug line
    const filtered = categories.filter(cat =>
      cat.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
    setShowSuggestions(true);
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category: category });  // Fix: Update formData.category
    setNewCategory(category);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Saving product...');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      // Ensure discount is sent as a number, defaulting to 0 if invalid
      formDataToSend.append('discountPercentage', Number(formData.discountPercentage) || 0);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('inStock', formData.inStock);

      // Add the product ID only if editing an existing product
      if (product && (product._id || product.id)) {
        formDataToSend.append('id', product._id || product.id);
      }

      // Handle image upload
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
        if (formData.imageFile2) formDataToSend.append('image2', formData.imageFile2);
        if (formData.imageFile3) formDataToSend.append('image3', formData.imageFile3);
        if (formData.imageFile4) formDataToSend.append('image4', formData.imageFile4);
      } else if (formData.image && typeof formData.image === 'string' && !formData.image.startsWith('blob:')) {
        formDataToSend.append('existingImage', formData.image);
      }
      if (formData.image2 && typeof formData.image2 === 'string' && !formData.image2.startsWith('blob:')) {
        formDataToSend.append('existingImage2', formData.image2);
      }
      if (formData.image3 && typeof formData.image3 === 'string' && !formData.image3.startsWith('blob:')) {
        formDataToSend.append('existingImage3', formData.image3);
      }
      if (formData.image4 && typeof formData.image4 === 'string' && !formData.image4.startsWith('blob:')) {
        formDataToSend.append('existingImage4', formData.image4);
      }

      const url = product ? SummaryApi.updateProduct.url : SummaryApi.addProduct.url;
      const method = product ? SummaryApi.updateProduct.method : SummaryApi.addProduct.method;

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${product ? 'update' : 'add'} product`);
      }

      const savedProduct = await response.json();
      toast.dismiss();

      // Call onSave with the response data
      if (typeof onSave === 'function') {
        onSave(savedProduct.data || savedProduct);
      }

      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.dismiss();
      toast.error(`Failed to ${product ? 'update' : 'add'} product. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (!isOpen) return null;

  const modalTitle = product ? 'Edit Product' : 'Add New Product';

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className={`relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white/80 backdrop-blur-md ${isLoading ? 'pointer-events-none opacity-60' : ''}`}>
        <div className="mt-3">
          <h3 className="text-xl font-medium text-gray-900 mb-4">{modalTitle}</h3>
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
                <div className="mb-4" ref={categoryInputRef}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => handleCategoryInput(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Type to search or add new category"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                    list="categories"
                  />
                  {showSuggestions && (
                    <div className="absolute z-10 w-64 mt-1 bg-black border border-gray-700 rounded-md shadow-lg">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <div
                            key={category}
                            onMouseOut={() => setShowSuggestions(false)}
                            onClick={() => handleCategorySelect(category)}
                            className="px-4 py-2 text-white hover:bg-gray-800 cursor-pointer"
                          >
                            {category}
                          </div>
                        ))
                      ) : (
                        <div
                          onClick={() => handleCategorySelect(newCategory)}
                          className="px-4 py-2 text-green-400 hover:bg-gray-800 cursor-pointer"
                        >
                          + Add "{newCategory}" as new category
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={formData.hasDiscount}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          hasDiscount: e.target.checked,
                          discountPercentage: e.target.checked ? formData.discountPercentage || 0 : 0
                        });
                      }}
                      className="mr-2"
                    />
                    <label className="text-gray-700 text-sm font-bold">
                      Apply Discount
                    </label>
                  </div>
                  {formData.hasDiscount && (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={formData.discountPercentage}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            discountPercentage: e.target.value
                          });
                        }}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
                        placeholder="Discount percentage"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({
                      ...formData,
                      quantity: e.target.value
                    })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({
                        ...formData,
                        inStock: e.target.checked
                      })}
                      disabled={!product}
                      className="mr-2"
                    />
                    <label className={`text-gray-700 text-sm font-bold ${!product ? 'opacity-50' : ''}`}>
                      In Stock
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Product Images (up to 4)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[1,2,3,4].map((slot) => (
                      <div key={slot} className="border rounded-md p-2 bg-gray-50 flex flex-col items-center">
                        <img
                          src={
                            slot === 1 ? (previewImage || formData.image || 'placeholder-image-url') :
                            slot === 2 ? (formData.image2 || 'placeholder-image-url') :
                            slot === 3 ? (formData.image3 || 'placeholder-image-url') :
                            slot === 4 ? (formData.image4 || 'placeholder-image-url') :
                            'placeholder-image-url'
                          }
                          alt={`Product ${slot}`}
                          className="w-full h-24 object-contain rounded-md mb-2"
                        />
                        <label className="inline-block px-2 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors text-xs">
                          {((slot === 1 && (previewImage || formData.image)) || (slot === 2 && formData.image2) || (slot === 3 && formData.image3) || (slot === 4 && formData.image4)) ? 'Change' : 'Choose'} Image {slot}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleImageChange(e, slot)}
                            className="hidden"
                          />
                        </label>
                        {((slot === 1 && (previewImage || formData.image)) || (slot === 2 && formData.image2) || (slot === 3 && formData.image3) || (slot === 4 && formData.image4)) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (slot === 1) {
                                setPreviewImage(null);
                                setFormData({ ...formData, imageFile: null, image: '' });
                              } else if (slot === 2) {
                                setFormData({ ...formData, imageFile2: null, image2: '' });
                              } else if (slot === 3) {
                                setFormData({ ...formData, imageFile3: null, image3: '' });
                              } else if (slot === 4) {
                                setFormData({ ...formData, imageFile4: null, image4: '' });
                              }
                            }}
                            className="mt-1 text-xs text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
                    rows="4"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className={`px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className={`px-4 py-2 rounded transition-colors ${isFormValid() && !isLoading ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                {isLoading ? 'Saving...' : (product ? 'Save Changes' : 'Add Product')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ProductModal.defaultProps = {
  categories: []
};

export default ProductModal;
