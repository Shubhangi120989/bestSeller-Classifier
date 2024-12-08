# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import uvicorn
from embedding_utils import get_embedding_statistics  # Import the helper function
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Load pre-trained Keras model
model_path = 'mlp_model.keras'  # Path to the saved Keras model
model = tf.keras.models.load_model(model_path)

origins=[
    "http://localhost",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for input validation
class ModelInput(BaseModel):
    title: str
    category: str
    stars: float
    reviews: int
    price: float
    listPrice: float
    boughtInLastMonth: int

# Endpoint to make predictions
@app.get("/ping")
async def ping():
    return "Hello, I am alive"

@app.post("/predict")
async def predict(input_data: ModelInput):
    title_stats, category_stats = get_embedding_statistics(input_data.title, input_data.category)

    # Prepare input array for the model
    model_input = np.array([
        input_data.stars,
        input_data.reviews,
        input_data.price,
        input_data.listPrice,
        input_data.boughtInLastMonth,
        title_stats['mean'],
        title_stats['std'],
        category_stats['mean'],
        category_stats['std'],
        
    ]).reshape(1, -1)

    # Make a prediction
    prediction = model.predict(model_input)
    is_best_seller = bool(prediction[0][0] > 0.4)  # Threshold of 0.5 for binary classification

    return {"isBestSeller": is_best_seller}

if __name__=="__main__":
    uvicorn.run(app,host='localhost',port=8000)