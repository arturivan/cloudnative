# Use the Bitnami Spark image as the base image
FROM bitnami/spark:latest

USER root

# Set the working directory inside the container
WORKDIR /opt/spark-data

# Copy the Python script into the container
COPY spark_job.py /opt/spark-data/spark_job.py

# Install any Python dependencies (e.g., requests)
RUN pip install --no-cache-dir requests azure-storage-blob
# I tried switching back here to the non-root user 1001, but the Spark job failed, so I kept it as root for testing.
# Set the entry point to submit the Spark job
ENTRYPOINT ["spark-submit", "/opt/spark-data/spark_job.py"]




