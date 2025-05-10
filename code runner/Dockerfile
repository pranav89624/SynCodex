# Use the official Python image as the base image
FROM python:3.10-slim

# Install system dependencies for C, C++, Java, and JavaScript execution
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    ca-certificates \
    openjdk-17-jdk \
    nodejs \
    npm \
    && apt-get clean

# Install Flask and Gunicorn
RUN pip install Flask gunicorn

# Copy the Flask app code from the ./app directory to the /app directory in the container
COPY ./app /app

# Set working directory
WORKDIR /app

# Expose the port the app will run on
EXPOSE 5000

# Command to run the app using Gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
