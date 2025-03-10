from pyspark.sql import SparkSession
import requests
from azure.storage.blob import BlobServiceClient
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def transform_to_uppercase(url, secret_mount_path, container_name, output_blob_name):
    try:
        # Read the Azure Storage connection string from the mounted secret
        secret_file_path = os.path.join(secret_mount_path, "connection-string")
        with open(secret_file_path, "r") as secret_file:
            connection_string = secret_file.read().strip()

        # Initialize the BlobServiceClient
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)

        # Fetch the text from the URL
        logger.info(f"Fetching text from URL: {url}")
        response = requests.get(url)
        text = response.text

        # Initialize SparkSession (includes SparkContext)
        logger.info("Initializing SparkSession")
        spark = SparkSession.builder.appName("UpperCaseTransformation").getOrCreate()

        # Parallelize the text into an RDD
        rdd = spark.sparkContext.parallelize(text.split('\n'))

        # Transform each line to uppercase
        upper_rdd = rdd.map(lambda line: line.upper())

        # Collect the results back to the driver
        upper_text = "\n".join(upper_rdd.collect())

        # Upload the transformed text to Azure Blob Storage
        logger.info(f"Uploading transformed text to Azure Blob Storage: {container_name}/{output_blob_name}")
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=output_blob_name)
        blob_client.upload_blob(upper_text, overwrite=True)

        # Stop the SparkSession
        logger.info("Stopping SparkSession")
        spark.stop()
        logger.info("Spark job completed successfully.")

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise

if __name__ == "__main__":
    # Kubernetes secret mount path (as defined in the SparkApplication YAML)
    secret_mount_path = os.getenv("SECRET_MOUNT_PATH", "/mnt/secrets")

    # Azure Blob Storage container and output blob details
    container_name = "spark-output"
    output_blob_name = "output.txt"

    # URL of the input text file
    url = "https://www.gutenberg.org/files/1342/1342-0.txt"

    # Call the transformation function
    transform_to_uppercase(url, secret_mount_path, container_name, output_blob_name)
