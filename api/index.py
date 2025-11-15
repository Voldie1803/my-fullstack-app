from fastapi import FastAPI
    from pydantic import BaseModel
    from pymongo import MongoClient, DESCENDING
    import os
    from fastapi.middleware.cors import CORSMiddleware
    
    # Get the MongoDB connection string from Vercel's environment variables
    MONGODB_URI = os.environ.get("MONGODB_URI")
    
    # Global variables for client and database
    client = None
    db = None
    
    # --- Database Connection Function ---
    def get_database():
        """Connects to MongoDB and returns the 'test_db' database."""
        global client, db
        
        # Check if MONGODB_URI is set
        if not MONGODB_URI:
            print("ERROR: MONGODB_URI environment variable not set.")
            return None
    
        # Try to connect if not already connected
        if client is None:
            try:
                client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
                # Test connection
                client.server_info() 
                db = client["test_db"]
                print("Connected to MongoDB.")
            except Exception as e:
                print(f"Error connecting to MongoDB: {e}")
                client = None # Reset client on connection error
                db = None
        
        return db
    
    # --- Pydantic Model ---
    # This defines the structure of the data we expect in POST requests
    class Item(BaseModel):
        name: str
    
    # --- FastAPI App Initialization ---
    app = FastAPI()
    
    # Add CORS middleware to allow your React frontend
    # to talk to this API
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allows all origins (for simplicity)
        allow_credentials=True,
        allow_methods=["*"],  # Allows all methods
        allow_headers=["*"],  # Allows all headers
    )
    
    # --- API Endpoints ---
    
    @app.get("/api/ping")
    def ping_server():
        """A simple endpoint to check if the server is running."""
        return {"message": "Pong! Hello from your FastAPI backend!"}
    
    
    @app.post("/api/add-item")
    def add_item(item: Item):
        """Adds a new item to the 'items' collection in MongoDB."""
        db_conn = get_database()
        if not db_conn:
            return {"error": "Database not connected"}, 500
            
        try:
            # Insert the new item (as a dictionary)
            result = db_conn.items.insert_one(item.dict())
            return {
                "message": "Item added successfully!",
                "inserted_id": str(result.inserted_id)
            }
        except Exception as e:
            return {"error": f"Failed to add item: {e}"}, 500
    
    
    @app.get("/api/get-latest-item")
    def get_latest_item():
        """Gets the most recently added item from the 'items' collection."""
        db_conn = get_database()
        if not db_conn:
            return {"error": "Database not connected"}, 500
    
        try:
            # Find the latest item by sorting by the automatic _id in descending order
            latest_item = db_conn.items.find_one(sort=[("_id", DESCENDING)])
            
            if latest_item:
                # Convert the MongoDB ObjectId to a string
                latest_item["_id"] = str(latest_item["_id"])
                return latest_item
            else:
                return {"message": "No items found in the database."}
        except Exception as e:
            return {"error": f"Failed to retrieve item: {e}"}, 500