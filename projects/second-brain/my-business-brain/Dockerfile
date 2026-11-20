# Dockerfile for My Business Brain Dashboard
# Serves the static dashboard.html via a lightweight Python HTTP server

FROM python:3.11-slim

WORKDIR /app

# Copy only the dashboard HTML (and any assets you may add later)
COPY dashboard.html ./

# Expose the port the server will listen on
EXPOSE 8000

# Run the built‑in http.server module, serving the current directory
CMD ["python", "-m", "http.server", "8000", "--directory", "/app"]
