# 1. Use Python as the base image
FROM python:3.12-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy the dependency file into the container
COPY requirements.txt .

# 4. Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy application code into the container
COPY app.py .

# 6. Document the application's container port
EXPOSE 5000

# 7. Start the Python application
CMD ["python", "app.py"]