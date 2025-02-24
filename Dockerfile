# Used the Bitnami Spark image as the base image
FROM bitnami/spark:latest

# Switch to a non-root user (Bitnami images typically have a `1001` user)
USER 1001

# Set the working directory inside the container
WORKDIR /opt/spark-data

# Copy the Python script into the container and set appropriate permissions
COPY --chown=1001:1001 spark_job.py /opt/spark-data/spark_job.py

# Install any Python dependencies (e.g., requests) as the non-root user
RUN pip install --no-cache-dir --user requests azure-storage-blob

# Ensure the installed dependencies are in the PATH
ENV PATH=/home/1001/.local/bin:$PATH

# Set the entry point to submit the Spark job
ENTRYPOINT ["spark-submit", "/opt/spark-data/spark_job.py"]

