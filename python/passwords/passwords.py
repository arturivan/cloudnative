import random
import string
import boto3
import pandas as pd
import os

# AWS S3 Configuration (Use environment variables for security)
S3_BUCKET = os.getenv("S3_BUCKET", "your-s3-bucket")
S3_OBJECT_NAME = os.getenv("S3_OBJECT_NAME", "password_data.csv")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")

# Function to generate a random password (15-20 characters)
def generate_password():
    lenght = random.randint(15,20)
    characters = string.ascii_letters + string.digits + string.punctuation
    return "".join(random.choices(characters, k=lenght))

# Generate 1 million records (~100MB)
num_records = 1_000_000
data = [(f"user{i}", generate_password()) for i in range(num_records)]

# Save locally
local_file = "/tmp/password_data.csv"
df.to_csv(local_file, index=False)

# Upload to S3
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
)
s3_client.upload_file(local_file, S3_BUCKET, S3_OBJECT_NAME)

print(f"Uploaded {local_file} to s3://{S3_BUCKET}/{S3_OBJECT_NAME}")