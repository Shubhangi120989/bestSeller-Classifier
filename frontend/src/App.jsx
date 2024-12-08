import { useState } from 'react'
// import './App.css'

function App() {
  const [inputData, setInputData] = useState({
    title: '',
    category: '',
    stars: '',
    reviews: '',
    price: '',
    listPrice: '',
    boughtInLastMonth: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) throw new Error('Prediction failed!');

      const data = await response.json();
      setPrediction(data.isBestSeller);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-400 to-blue-900 flex justify-center items-center">
      <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Product Bestseller Prediction</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="grid grid-cols-1 gap-4">
            <label htmlFor="title" className="text-lg font-semibold text-gray-700">Product Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={inputData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product title"
              required
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 gap-4">
            <label htmlFor="category" className="text-lg font-semibold text-gray-700">Product Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={inputData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product category"
              required
            />
          </div>

          {/* Rating and Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="stars" className="text-lg font-semibold text-gray-700">Rating (Stars)</label>
              <input
                type="number"
                id="stars"
                name="stars"
                value={inputData.stars}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="0"
                max="5"
                step="0.01" // Allowing decimal numbers
                required
              />
            </div>

            <div>
              <label htmlFor="reviews" className="text-lg font-semibold text-gray-700">Reviews</label>
              <input
                type="number"
                id="reviews"
                name="reviews"
                value={inputData.reviews}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="0"
                step="1" // Restricting to integer values
                required
              />
            </div>
          </div>

          {/* Price and List Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="text-lg font-semibold text-gray-700">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={inputData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="0"
                step="0.01" // Allowing float numbers
                required
              />
            </div>

            <div>
              <label htmlFor="listPrice" className="text-lg font-semibold text-gray-700">List Price</label>
              <input
                type="number"
                id="listPrice"
                name="listPrice"
                value={inputData.listPrice}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="0"
                step="0.01" // Allowing float numbers
                required
              />
            </div>
          </div>

          {/* Bought in Last Month */}
          <div className="grid grid-cols-1 gap-4">
            <label htmlFor="boughtInLastMonth" className="text-lg font-semibold text-gray-700">Bought in Last Month</label>
            <input
              type="number"
              id="boughtInLastMonth"
              name="boughtInLastMonth"
              value={inputData.boughtInLastMonth}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              min="0"
              step="1" // Restricting to integer values
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-br from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? 'Predicting...' : 'Predict'}
          </button>
        </form>

        {/* Error message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Prediction result */}
        {prediction !== null && (
          <div className="mt-4">
            <p
              className={`font-semibold text-3xl ${
                prediction ? 'text-green-500' : 'text-red-500'
              }`}
            >
              The product will be {prediction ? 'a Bestseller' : 'not a Bestseller'}!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
