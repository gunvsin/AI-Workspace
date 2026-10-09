FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir google-antigravity
COPY agy_sample.py .
CMD ["python", "agy_sample.py"]
