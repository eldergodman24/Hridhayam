import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/productCard';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import NoProductsFound from '../components/NoProductsFound';
import SummaryApi from "../common/apiConfig";
import LoadingModal from '../components/LoadingModal';

const Collection = () => {
  const { state: { collectionName } } = useLocation();
  const [state, setState] = useState({
    products: [],
    allProducts: [],
    currentPage: 1,
    selectedCategories: [collectionName], // Changed from selectedCategory to selectedCategories array
    maxPrice: 1000,
    priceRange: '0-1000',
    statusFilters: ['instock'] // Add default status filter
  });
  const [shouldResetFilters, setShouldResetFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gridCols, setGridCols] = useState(3); // Add grid column state

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch products for all selected categories
        const productPromises = state.selectedCategories.map(category =>
          fetch(`${SummaryApi.categoryProduct.url}${category}`)
            .then(res => res.json())
            .then(({ data }) => data)
        );

        const productsArrays = await Promise.all(productPromises);
        // Flatten and remove duplicates based on product ID or some unique identifier
        const allProducts = [...new Set(productsArrays.flat())];

        const maxPrice = Math.max(...allProducts.map(p => p.price)) || 1000;
        setState(prev => ({
          ...prev,
          allProducts,
          products: filterProductsByPriceRange(allProducts, `0-${maxPrice}`, prev.statusFilters),
          maxPrice,
          priceRange: `0-${maxPrice}`
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [state.selectedCategories]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      products: filterProductsByPriceRange(prev.allProducts, prev.priceRange, prev.statusFilters)
    }));
  }, [state.priceRange, state.statusFilters]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      selectedCategories: [collectionName],
      currentPage: 1,
      priceRange: '0-1000' // Reset price range
    }));
    setShouldResetFilters(true); // Trigger sidebar reset
    setTimeout(() => setShouldResetFilters(false), 100);
  }, [collectionName]);

  const handlePageChange = (page) => {
    setState(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginatedProducts = () => {
    const start = (state.currentPage - 1) * 24;
    return state.products.slice(start, start + 24);
  };

  const filterProductsByPriceRange = (products, priceRange, statusFilters) => {
    const [min, max] = priceRange.split('-').map(Number);
    return products.filter(product => {
      const priceInRange = product.price >= min && product.price <= max;

      // Status filtering logic
      const statusMatch = statusFilters.length === 2 || // Both filters selected
        (statusFilters.includes('instock') && product.inStock) ||
        (statusFilters.includes('preorder') && !product.inStock);

      return priceInRange && statusMatch;
    });
  };

  const resetFilters = () => {
    const defaultPriceRange = `0-${state.maxPrice}`;
    setState(prev => ({
      ...prev,
      priceRange: defaultPriceRange,
      products: filterProductsByPriceRange(prev.allProducts, defaultPriceRange, prev.statusFilters),
      selectedCategories: [collectionName],
      currentPage: 1
    }));
    setShouldResetFilters(true);
    // Reset the trigger after a short delay
    setTimeout(() => setShouldResetFilters(false), 100);
  };

  const renderProducts = () => {
    const paginatedProducts = getPaginatedProducts();

    if (state.products.length === 0) {
      return <NoProductsFound onResetFilters={resetFilters} />;
    }

    // Grid col classes
    const gridClass = {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
    }[gridCols];

    return (
      <>
        <div className="flex flex-row-reverse pr-20 gap-2 mt-6 mb-6">
          {/* 2 Cols SVG */}
          <button
            className={`px-2 py-2 rounded border flex items-center justify-center ${gridCols === 2 ? "bg-black" : "bg-white"}`}
            onClick={() => setGridCols(2)}
            aria-label="2 columns"
          >
            <svg width="28" height="35" viewBox="0 0 28 20" fill="none">
              <rect x="2" y="2" width="10" height="10" rx="2" fill={gridCols === 2 ? "#fff" : "#222"} />
              <rect x="16" y="2" width="10" height="10" rx="2" fill={gridCols === 2 ? "#fff" : "#222"}/>
              <rect x="2" y="16" width="10" height="10" rx="2" fill={gridCols === 2 ? "#fff" : "#222"} />
              <rect x="16" y="16" width="10" height="10" rx="2" fill={gridCols === 2 ? "#fff" : "#222"}/>
            </svg>
          </button>
          {/* 3 Cols SVG */}
          <button
            className={`px-2 py-2 rounded border flex items-center justify-center ${gridCols === 3 ? "bg-black" : "bg-white"}`}
            onClick={() => setGridCols(3)}
            aria-label="3 columns"
          >
            <svg width="36" height="35" viewBox="0 0 36 20" fill="none">
              <rect x="2" y="2" width="8" height="8" rx="2" fill={gridCols === 3 ? "#fff" : "#222"} />
              <rect x="14" y="2" width="8" height="8" rx="2" fill={gridCols === 3 ? "#fff" : "#222"} />
              <rect x="26" y="2" width="8" height="8" rx="2" fill={gridCols === 3 ? "#fff" : "#222"} />
              <rect x="2" y="14" width="8" height="8" rx="2" fill={gridCols === 3 ? "#fff" : "#222"} />
              <rect x="14" y="14" width="8" height="8" rx="2" fill={gridCols === 3 ? "#fff" : "#222"} />
              <rect x="26" y="14" width="8" height="8" rx="2" fill={gridCols === 3 ? "#fff" : "#222"} />
            </svg>
          </button>
          {/* 4 Cols SVG */}
          <button
            className={`px-2 py-2 rounded border flex items-center justify-center ${gridCols === 4 ? "bg-black" : "bg-white"}`}
            onClick={() => setGridCols(4)}
            aria-label="4 columns"
          >
            <svg width="44" height="35" viewBox="0 0 44 20" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="2" fill={gridCols === 4 ? "#fff" : "#222"} />
              <rect x="13" y="2" width="7" height="7" rx="2" fill={gridCols === 4 ? "#fff" : "#222"} />
              <rect x="24" y="2" width="7" height="7" rx="2" fill={gridCols === 4 ? "#fff" : "#222"} />
              <rect x="35" y="2" width="7" height="7" rx="2" fill={gridCols === 4 ? "#fff" : "#222"} />
              <rect x="2" y="13" width="7" height="7" rx="2" fill={gridCols === 4 ? "#fff" : "#222"} />
              <rect x="13" y="13" width="7" height="7" rx="2" fill={gridCols === 4 ? "#fff" : "#222"} />
              <rect x="24" y="13" width="7" height="7" rx="2" fill={gridCols === 4 ? "#fff" : "#222"} />
              <rect x="35" y="13" width="7" height="7" rx="2" fill={gridCols === 4 ? "#fff" : "#222"} />
            </svg>
          </button>
        </div>
        <div className={`py-12 max-w-6xl mx-auto grid gap-x-4 gap-y-8 ${gridClass}`}>
          {paginatedProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <Pagination
          currentPage={state.currentPage}
          totalPages={Math.ceil(state.products.length / 24)}
          onPrevPage={() => handlePageChange(state.currentPage - 1)}
          onNextPage={() => handlePageChange(state.currentPage + 1)}
          onPageSelect={handlePageChange}
        />
      </>
    );
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      <div className="contain flex">
        <Sidebar
          onPriceRangeChange={range => setState(prev => ({
            ...prev,
            priceRange: range,
            currentPage: 1
          }))}
          onCategoryChange={categories => {
            const updatedCategories = categories.includes(collectionName)
              ? categories
              : [collectionName, ...categories];
            setState(prev => ({
              ...prev,
              selectedCategories: updatedCategories,
              currentPage: 1
            }));
          }}
          onStatusChange={statusFilters => setState(prev => ({
            ...prev,
            statusFilters,
            currentPage: 1
          }))}
          selectedCategory={collectionName}
          maxPrice={state.maxPrice}
          shouldReset={shouldResetFilters}
          statusFilters={state.statusFilters}
        />
        <div className="flex-1 px-4">
          {renderProducts()}
        </div>
      </div>
    </>
  );
};

export default Collection;
