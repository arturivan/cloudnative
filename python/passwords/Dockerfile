FROM python:3.9

# Install dependencies
RUN pip install pandas boto3

# Copy script to container
COPY passwords.py /app/passwords.py

# Set working directory
WORKDIR /app

# Run script on container start
CMD ["python", "passwords.py"]
